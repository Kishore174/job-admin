import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/config";
import {
  StarIcon,
  MapPinIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  Box,
  Typography,
  Button,
  TablePagination,
  Paper,
} from "@mui/material";
import { BiSearch } from "react-icons/bi";

const PremiumJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [hrList, setHrList] = useState([]);
  const [selectedHr, setSelectedHr] = useState("");
  const [experience, setExperience] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
const [resume, setResume] = useState(null);
const [loading, setLoading] = useState(false);
const [appliedJobs, setAppliedJobs] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 5;
 
 
const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);
const fetchAppliedJobs = async () => {
  const res = await axiosInstance.get("/application/my");
setAppliedJobs(
  res.data.applications.map(app => app.jobId.toString())
);

};

useEffect(() => {
  fetchJobs(currentPage);
}, [currentPage, selectedDate]);

useEffect(() => {
  fetchJobs();
  fetchAppliedJobs();
}, []);

const fetchJobs = async () => {
  try {
    const res = await axiosInstance.get("/jobs/premium");
    setJobs(res.data.jobs || []);
  } catch (error) {
    console.log("Error fetching jobs", error);
  }
};


  // MUI starts from 0
 

  const openJob = async (job) => {
    setSelectedJob(job);
    const res = await axiosInstance.get(`/application/hr/${job._id}`);
    setHrList(res.data.hrList || []);
  };

const handleApply = async () => {
  if (!selectedHr || !experience || !coverLetter || !resume) {
    alert("Please fill all fields and upload resume");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("jobId", selectedJob._id);
    formData.append("experience", experience);
    formData.append("coverLetter", coverLetter);
    formData.append("selectedHr", selectedHr);
    formData.append("resume", resume);

    await axiosInstance.post("/application/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setAppliedJobs([...appliedJobs, selectedJob._id]);

    alert("Application submitted successfully");

    setSelectedJob(null);
    setExperience("");
    setCoverLetter("");
    setSelectedHr("");
    setResume(null);
  } catch (err) {
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};
const filteredJobs = selectedDate
  ? jobs.filter((job) => {
      const jobDate = new Date(job.createdAt).toISOString().split("T")[0];
      return jobDate === selectedDate;
    })
  : jobs;

const paginatedJobs = filteredJobs.slice(
  currentPage * rowsPerPage,
  currentPage * rowsPerPage + rowsPerPage
);


return (
  <Box p={3}>

    {/* ===== HEADER ===== */}
    {!selectedJob && (
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Premium Job Listings
          </Typography>
        </Box>

    
  <Box display="flex" gap={2} alignItems="center">

  

<input
  type="date"
  value={selectedDate}
  onChange={(e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(0); // reset page
  }}
  className="border rounded px-3 py-2  mb-5"
/>


  </Box>
 


        {/* ===== TABLE ===== */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <div className="overflow-x-auto ">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Job", "Location", "Experience", "Type", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 border-b text-left"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y">
                {jobs.length ? (
               paginatedJobs.map((job) => (

                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {job._id.slice(-6)}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {job.location || "—"}
                      </td>

                      <td className="px-4 py-3">
                        {job.experienceRequired || "Any"}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          Premium
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <Button
                          size="small"
                          variant="contained"
                          disabled={appliedJobs.includes(job._id.toString())}
                          onClick={() => openJob(job)}
                        >
                          {appliedJobs.includes(job._id.toString())
                            ? "Applied"
                            : "Apply"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-gray-500"
                    >
                      No jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

<TablePagination
  component="div"
  count={filteredJobs.length}
  page={currentPage}
  onPageChange={(e, newPage) => setCurrentPage(newPage)}
  rowsPerPage={rowsPerPage}
  rowsPerPageOptions={[5]}
/>


        </Paper>
      </>
    )}

    {/* ===== APPLICATION PANEL ===== */}
    {selectedJob && (
      <Paper sx={{ p: 4, borderRadius: 3 }} elevation={3}>
        <Button onClick={() => setSelectedJob(null)}>
          ← Back
        </Button>

        <Typography variant="h6" fontWeight="bold" mt={2}>
          {selectedJob.title}
        </Typography>

        <Typography variant="body2" mt={1} mb={3}>
          {selectedJob.description}
        </Typography>

        <Box display="grid" gap={2}>

          <select
            value={selectedHr}
            onChange={(e) => setSelectedHr(e.target.value)}
            className="input"
          >
            <option value="">Select HR</option>
            {hrList.map((hr) => (
              <option key={hr._id} value={hr.email}>
                {hr.email}
              </option>
            ))}
          </select>

          <input
            placeholder="Years of Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="input"
          />

          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            className="input"
          />

          <textarea
            rows={4}
            placeholder="Cover Letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="input"
          />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleApply}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>

            <Button onClick={() => setSelectedJob(null)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    )}
  </Box>
);

};

export default PremiumJob;
