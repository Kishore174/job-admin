import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../Api/config";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const HrSettings = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [hrList, setHrList] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/jobs/premium");
      setJobs(res.data.jobs || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  const fetchHrList = async (jobId) => {
    try {
      const res = await axiosInstance.get(`/hr/${jobId}`);
      setHrList(res.data.emails || []);
    } catch {
      setHrList([]);
    }
  };

  // ================= ADD EMAIL =================
  const handleAddEmail = async () => {
    if (!newEmail.trim()) return toast.error("Enter email");
    if (!selectedJob) return toast.error("Select job first");

    try {
      await axiosInstance.post("/hr/upload", {
        jobId: selectedJob,
        emails: [newEmail],
      });

      toast.success("Email Added");
      setNewEmail("");
      setOpen(false);
      fetchHrList(selectedJob);
    } catch {
      toast.error("Upload failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (email) => {
    try {
      await axiosInstance.delete("/hr/delete", {
        data: { jobId: selectedJob, email },
      });

      toast.success("Email Removed");
      fetchHrList(selectedJob);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          HR Email Settings
        </h2>

        {selectedJob && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#2BB5CE] text-white px-5 py-2 rounded-xl shadow hover:bg-[#229fb5] transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add HR Email
          </button>
        )}
      </div>

      {/* ================= JOB SELECT ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Premium Job
        </label>

        <select
          value={selectedJob}
          onChange={(e) => {
            setSelectedJob(e.target.value);
            fetchHrList(e.target.value);
          }}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#2BB5CE]"
        >
          <option value="">Choose Job</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* ================= EMAIL TABLE ================= */}
      {selectedJob && (
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
          
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">
              HR Emails ({hrList.length})
            </h3>
          </div>

          {hrList.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No HR emails added yet
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Created</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {hrList.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.email)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl p-6 z-50">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Add HR Email</h3>
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <input
              type="email"
              placeholder="Enter HR email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#2BB5CE]"
            />

            <button
              onClick={handleAddEmail}
              className="mt-6 w-full bg-[#2BB5CE] text-white py-3 rounded-xl font-semibold hover:bg-[#229fb5]"
            >
              Save Email
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default HrSettings;
