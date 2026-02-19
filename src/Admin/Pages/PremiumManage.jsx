import React, { useState, useEffect } from "react";
import axiosInstance from "../../Api/config";
import {
  PlusIcon,
  XMarkIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const PremiumManage = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    experienceRequired: "",
    description: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axiosInstance.get("/jobs/premium");
    setJobs(res.data.jobs || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    await axiosInstance.post("/jobs", {
      ...form,
      isPremium: true,
    });

    setForm({
      title: "",
      location: "",
      experienceRequired: "",
      description: "",
    });

    setOpen(false);
    fetchJobs();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Premium Job Management
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#2BB5CE] text-white px-6 py-2 rounded-lg"
        >
          + Create Premium Job
        </button>
      </div>

      {/* Job Table */}
      <div className="bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Experience</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map(job => (
              <tr key={job._id}>
                <td className="px-6 py-4">{job.title}</td>
                <td className="px-6 py-4">{job.location}</td>
                <td className="px-6 py-4">{job.experienceRequired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-xl p-8">
            <h3 className="text-lg font-semibold mb-6">
              Create Premium Job
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                placeholder="Experience Required"
                value={form.experienceRequired}
                onChange={(e) =>
                  setForm({
                    ...form,
                    experienceRequired: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg"
                required
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-3 rounded-lg h-28"
                required
              />

              <button className="w-full bg-[#2BB5CE] text-white py-3 rounded-lg">
                Create Job
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};


 

export default PremiumManage;
