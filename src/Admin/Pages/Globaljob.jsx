import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getLandingJobs,
  createLandingJob,
  updateLandingJob,
  deleteLandingJob,
} from "../../Api/adminApi";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";


const Globaljob = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    experience: "",
    qualification: "",
    type: "Full Time",
    applyLink: "",
    isActive: true,
  });

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await getLandingJobs();
      setJobs(res.jobs || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateLandingJob(editingId, formData);
        toast.success("Job Updated");
      } else {
        await createLandingJob(formData);
        toast.success("Job Created");
      }

      setOpen(false);
      setEditingId(null);
      resetForm();
      fetchJobs();
    } catch {
      toast.error("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (job) => {
    setFormData({
      company: job.company || "",
      role: job.role || "",
      location: job.location || "",
      experience: job.experience || "",
      qualification: job.qualification || "",
      type: job.type || "Full Time",
      applyLink: job.applyLink || "",
      isActive: job.isActive ?? true,
    });

    setEditingId(job._id);
    setOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await deleteLandingJob(id);
      toast.success("Deleted");
      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      location: "",
      experience: "",
      qualification: "",
      type: "Full Time",
      applyLink: "",
      isActive: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {/* <Briefcase className="text-[#2BB5CE]" size={28} /> */}
            Landing Jobs
          </h2>
          <p className="text-gray-500 text-sm">
            Manage all global landing job postings
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-[#2BB5CE] hover:bg-[#229fb5] text-white px-5 py-2 rounded-xl shadow-md transition"
        >
          {/* <Plus size={18} /> */}
          Create Job
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {job.company}
                </td>
                <td className="px-6 py-4 text-gray-600">{job.role}</td>
                <td className="px-6 py-4 text-gray-600">{job.location}</td>
                <td className="px-6 py-4">{job.type}</td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      job.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

<td className="px-6 py-4 text-center">
  <div className="flex justify-center items-center gap-3">

    {/* Edit Button */}
    <button
      onClick={() => handleEdit(job)}
      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
    >
      <PencilSquareIcon className="w-5 h-5" />
    </button>

    {/* Delete Button */}
    <button 
      onClick={() => handleDelete(job._id)}
      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
    >
      <TrashIcon className="w-5 h-5" />
    </button>

  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>

        {jobs.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No jobs created yet
          </div>
        )}
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= DRAWER ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[650px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {editingId ? "Edit Job" : "Create Job"}
          </h3>

          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <XMarkIcon  size={20} />
          </button>
        </div>

<form
  onSubmit={handleSubmit}
  className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto"
>

  {/* Company */}
  <div className="md:col-span-2">
    <Input
      label="Company"
      name="company"
      value={formData.company}
      onChange={handleChange}
    />
  </div>

  {/* Role */}
  <div className="md:col-span-2">
    <Input
      label="Role"
      name="role"
      value={formData.role}
      onChange={handleChange}
    />
  </div>

  {/* Location */}
  <div className="md:col-span-2">
    <Input
      label="Location"
      name="location"
      value={formData.location}
      onChange={handleChange}
    />
  </div>

  {/* Experience */}
  <div className="md:col-span-2">
    <Input
      label="Experience"
      name="experience"
      value={formData.experience}
      onChange={handleChange}
    />
  </div>

  {/* Qualification */}
  <div className="md:col-span-2">
    <Input
      label="Qualification"
      name="qualification"
      value={formData.qualification}
      onChange={handleChange}
    />
  </div>

  {/* Apply Link */}
  <div className="md:col-span-2">
    <Input
      label="Apply Link"
      name="applyLink"
      value={formData.applyLink}
      onChange={handleChange}
    />
  </div>

  {/* Job Type */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Job Type
    </label>
    <select
      name="type"
      value={formData.type}
      onChange={handleChange}
      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#2BB5CE]"
    >
      <option>Full Time</option>
      <option>Remote</option>
      <option>Internship</option>
    </select>
  </div>

  {/* Status Toggle (Edit only) */}
  {editingId && (
    <div className="md:col-span-2 flex items-center justify-between mt-2">
      <div>
        <p className="text-sm font-medium text-gray-700">
          Job Status
        </p>
        <p className="text-xs text-gray-400">
          Control visibility
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setFormData({
            ...formData,
            isActive: !formData.isActive,
          })
        }
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          formData.isActive ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            formData.isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )}

  {/* Submit Button Full Width */}
  <div className="md:col-span-4 mt-4">
    <button
      type="submit"
      className="w-full bg-[#2BB5CE] hover:bg-[#229fb5] text-white py-3 rounded-xl font-semibold transition"
    >
      {editingId ? "Update Job" : "Create Job"}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

// ================= Reusable Input =================
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#2BB5CE] outline-none"
    />
  </div>
);

export default Globaljob;
