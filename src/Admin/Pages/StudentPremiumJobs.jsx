import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  StarIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const StudentPremiumJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axiosInstance.get("/jobs/premium");
    setJobs(res.data.jobs || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10">

      {/* ===== Header Section ===== */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <StarIcon className="w-8 h-8 text-yellow-500" />
          Premium Opportunities
        </h2>
        <p className="text-gray-500 mt-2">
          Explore exclusive premium job openings curated for top candidates.
        </p>
      </div>

      {/* ===== Job Grid ===== */}
      {jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow text-center text-gray-400">
          No premium jobs available right now.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 group border border-gray-100"
            >
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                Premium
              </div>

              {/* Job Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#2BB5CE] transition">
                {job.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-gray-500 text-sm mb-2 gap-2">
                <MapPinIcon className="w-4 h-4" />
                {job.location}
              </div>

              {/* Experience */}
              <div className="flex items-center text-gray-500 text-sm mb-4 gap-2">
                <BriefcaseIcon className="w-4 h-4" />
                {job.experienceRequired}
              </div>

              {/* Description Preview */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                {job.description}
              </p>

              {/* Apply Button */}
              <button
                onClick={() => navigate(`/apply/${job._id}`)}
                className="w-full bg-gradient-to-r from-[#2BB5CE] to-[#1d9cb3] text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPremiumJobs;
