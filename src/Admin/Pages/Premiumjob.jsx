import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/config";
import PageLoader from "../../Pageloader";

const ROWS = 5;

// ── AI Cover Letter via backend ────────────────────────────────
const generateCoverLetter = async (payload) => {
  const res = await axiosInstance.post("/ai/cover-letter", payload);
  return res.data.coverLetter || "";
};

const PremiumJob = () => {
  const [jobs, setJobs]               = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [hrList, setHrList]           = useState([]);
  const [selectedHr, setSelectedHr]   = useState("");
  const [experience, setExperience]   = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume]           = useState(null);       // File object (new upload)
  const [resumeFromProfile, setResumeFromProfile] = useState(null); // { url, name } from profile
  const [profileSkills, setProfileSkills]         = useState([]);
  const [profileFetched, setProfileFetched]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [toast, setToast]             = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiError, setAiError]         = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        await Promise.all([fetchJobs(), fetchAppliedJobs()]);
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/jobs/premium");
      setJobs(res.data.jobs || []);
    } catch {
      showToast("Failed to load jobs", "error");
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await axiosInstance.get("/application/my");
      setAppliedJobs(res.data.applications.map((app) => app.jobId.toString()));
    } catch {}
  };

  // ── Fetch profile & pre-fill when job is opened ───────────────
  const openJob = async (job) => {
    setSelectedJob(job);
    setCoverLetter("");
    setExperience("");
    setSelectedHr("");
    setResume(null);
    setResumeFromProfile(null);
    setProfileSkills([]);
    setProfileFetched(false);
    setAiError("");

    // Fetch HR list and profile in parallel
    const [, profileRes] = await Promise.allSettled([
      axiosInstance.get(`/application/hr/${job._id}`).then(r => setHrList(r.data.hrList || [])).catch(() => setHrList([])),
      axiosInstance.get("/profile/me"),
    ]);

    if (profileRes.status === "fulfilled") {
      const p = profileRes.value.data.profile || {};

      // Pre-fill experience from profile
      if (p.experience) setExperience(p.experience);

      // Pre-fill skills
      if (p.skills?.length) setProfileSkills(p.skills);

      // Pre-fill resume URL from profile (not a File, just URL reference)
      if (p.resumeUrl) {
        setResumeFromProfile({ url: p.resumeUrl, name: p.resumeName || "Profile Resume" });
      }

      setProfileFetched(true);
    }
  };

  // ── AI Cover Letter ───────────────────────────────────────────
  const handleGenerateCoverLetter = async () => {
    if (!experience.trim()) {
      setAiError("Please enter your experience first so AI can personalise your cover letter.");
      return;
    }
    setAiError("");
    setAiLoading(true);
    try {
      const generated = await generateCoverLetter({
        jobTitle:            selectedJob.title,
        location:            selectedJob.location,
        experienceRequired:  selectedJob.experienceRequired,
        description:         selectedJob.description,
        experience,
        skills:              profileSkills.join(", "),
      });
      setCoverLetter(generated);
    } catch {
      setAiError("AI generation failed. Please try again or write manually.");
    } finally {
      setAiLoading(false);
    }
  };

  // ── Submit application ────────────────────────────────────────
  const handleApply = async () => {
    const hasResume = resume || resumeFromProfile;
    if (!selectedHr || !experience || !coverLetter || !hasResume) {
      showToast("Please fill all fields and ensure a resume is available", "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("jobId",       selectedJob._id);
      formData.append("experience",  experience);
      formData.append("coverLetter", coverLetter);
      formData.append("selectedHr",  selectedHr);

      if (resume) {
        // User uploaded a new file
        formData.append("resume", resume);
      } else {
        // Use profile resume URL
        formData.append("resumeUrl",  resumeFromProfile.url);
        formData.append("resumeName", resumeFromProfile.name);
      }

      await axiosInstance.post("/application/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAppliedJobs((prev) => [...prev, selectedJob._id]);
      showToast("Application submitted successfully!");
      setSelectedJob(null);
      setExperience(""); setCoverLetter(""); setSelectedHr(""); setResume(null);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs  = selectedDate
    ? jobs.filter((job) => new Date(job.createdAt).toISOString().split("T")[0] === selectedDate)
    : jobs;
  const totalPages    = Math.ceil(filteredJobs.length / ROWS);
  const paginatedJobs = filteredJobs.slice(currentPage * ROWS, currentPage * ROWS + ROWS);
  const isApplied     = (id) => appliedJobs.includes(id.toString());

  if (pageLoading) return <PageLoader />;

  // ─── JOB LIST VIEW ────────────────────────────────────────────
  if (!selectedJob) return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 px-8 py-10 relative overflow-x-hidden">
      <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-blue-500" />
            <span className="text-xs font-medium tracking-[3px] uppercase text-blue-500">Student Portal</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-none tracking-tight">
            Premium <span className="text-blue-400">Jobs</span>
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-slate-500">{filteredJobs.length} listings available</span>
          </div>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm select-none">📅</span>
            <input type="date" value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(0); }}
              className="bg-[#13131a] border border-[#1e1e2e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
            />
          </div>
          {selectedDate && (
            <button onClick={() => setSelectedDate("")} className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition">
              Clear filter
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1.4fr_1.2fr_1fr_100px] px-6 py-4 bg-[#0f0f18] border-b border-[#1e1e2e]">
            {["Job Title", "Location", "Experience", "Type", ""].map((h) => (
              <span key={h} className="text-[11px] font-medium tracking-[2px] uppercase text-slate-600">{h}</span>
            ))}
          </div>

          {paginatedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-4xl mb-3 opacity-20 select-none">◈</div>
              <p className="font-semibold text-slate-600">No jobs found</p>
              <p className="text-sm mt-1 text-slate-700">Try clearing the date filter</p>
            </div>
          ) : paginatedJobs.map((job) => (
            <div key={job._id} className="grid grid-cols-[2fr_1.4fr_1.2fr_1fr_100px] px-6 py-4 border-b border-[#1a1a28] last:border-0 hover:bg-blue-500/[0.03] transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                  {job.title?.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{job.title}</p>
                  <p className="text-[11px] text-slate-600">ID: {job._id.slice(-6)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <span className="text-[11px]">📍</span>
                <span className="truncate">{job.location || "—"}</span>
              </div>
              <span className="text-sm text-slate-500">{job.experienceRequired || "Any"}</span>
              <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase text-blue-400 w-fit">
                ★ Premium
              </span>
              <div className="flex justify-end">
                {isApplied(job._id) ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">✓ Applied</span>
                ) : (
                  <button onClick={() => openJob(job)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
                    Apply →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-slate-700">Page {currentPage + 1} of {totalPages} — {filteredJobs.length} jobs</p>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}
                className="w-8 h-8 rounded-lg border border-[#1e1e2e] text-slate-500 flex items-center justify-center text-sm hover:border-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition">‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition ${currentPage === i ? "bg-blue-600 border-blue-600 text-white" : "border-[#1e1e2e] text-slate-500 hover:border-slate-600 hover:text-slate-300"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}
                className="w-8 h-8 rounded-lg border border-[#1e1e2e] text-slate-500 flex items-center justify-center text-sm hover:border-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition">›</button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/20 text-emerald-400" : "bg-red-950 border-red-500/20 text-red-400"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </div>
  );

  // ─── APPLICATION VIEW ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 px-6 py-10 relative overflow-x-hidden">
      <div className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/6 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-400/4 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <button onClick={() => setSelectedJob(null)} className="group flex items-center gap-2 text-slate-600 hover:text-slate-300 text-sm mb-10 transition-all">
          <span className="w-7 h-7 rounded-lg border border-[#1e1e2e] flex items-center justify-center group-hover:border-slate-600 transition">‹</span>
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 items-start">

          {/* LEFT — Job Details */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="relative bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-4">
                ★ Premium Role
              </span>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-800/20 border border-blue-500/20 flex items-center justify-center text-blue-300 text-2xl font-black flex-shrink-0">
                  {selectedJob.title?.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white leading-tight">{selectedJob.title}</h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">#{selectedJob._id?.slice(-8)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedJob.location && (
                  <span className="flex items-center gap-1.5 bg-[#0f0f18] border border-[#1e1e2e] rounded-lg px-3 py-1.5 text-xs text-slate-400">
                    <span>📍</span>{selectedJob.location}
                  </span>
                )}
                {selectedJob.experienceRequired && (
                  <span className="flex items-center gap-1.5 bg-[#0f0f18] border border-[#1e1e2e] rounded-lg px-3 py-1.5 text-xs text-slate-400">
                    <span>💼</span>{selectedJob.experienceRequired}
                  </span>
                )}
              </div>
              <div className="w-full h-px bg-[#1e1e2e] mb-4" />
              {selectedJob.description && <p className="text-sm text-slate-500 leading-relaxed">{selectedJob.description}</p>}
            </div>

            {/* Profile skills preview */}
            {profileSkills.length > 0 && (
              <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-5">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-slate-500 mb-3">Your Skills from Profile</p>
                <div className="flex flex-wrap gap-1.5">
                  {profileSkills.map((s) => (
                    <span key={s} className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1 text-[11px] text-blue-300 font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-semibold tracking-[2px] uppercase text-blue-500">What happens next</p>
              {["Your resume is sent directly to the HR", "HR reviews and contacts you via email", "Interview scheduled if shortlisted"].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-slate-500 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Application Form */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <div className="px-7 pt-7 pb-5 border-b border-[#1e1e2e]">
              <p className="text-[10px] font-medium tracking-[2px] uppercase text-blue-500 mb-1">Step 1 of 1</p>
              <h3 className="text-xl font-extrabold text-white">Your Application</h3>
              <p className="text-sm text-slate-600 mt-1">
                {profileFetched
                  ? "✦ Profile data auto-filled — review and edit before submitting"
                  : "Fill in your details — all fields are required"}
              </p>
            </div>

            <div className="px-7 py-6 space-y-6">

              {/* ── 1. HR Select ── */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2.5">
                  <span className="w-4 h-4 rounded bg-blue-600/20 flex items-center justify-center text-[9px] text-blue-400 font-bold">1</span>
                  HR Contact
                </label>
                <div className="relative">
                  <select value={selectedHr} onChange={(e) => setSelectedHr(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition appearance-none cursor-pointer">
                    <option value="">— Select HR to send application —</option>
                    {hrList.map((hr) => (<option key={hr._id} value={hr.email}>{hr.email}</option>))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
                </div>
              </div>

              {/* ── 2. Experience (pre-filled from profile) ── */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2.5">
                  <span className="w-4 h-4 rounded bg-blue-600/20 flex items-center justify-center text-[9px] text-blue-400 font-bold">2</span>
                  Experience
                  {profileFetched && experience && (
                    <span className="ml-auto text-[9px] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">✦ from profile</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 3 years in React, 1 year Node.js…"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition resize-none"
                />
              </div>

              {/* ── 3. Resume (pre-filled from profile or manual upload) ── */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2.5">
                  <span className="w-4 h-4 rounded bg-blue-600/20 flex items-center justify-center text-[9px] text-blue-400 font-bold">3</span>
                  Resume
                  {resumeFromProfile && !resume && (
                    <span className="ml-auto text-[9px] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">✦ from profile</span>
                  )}
                </label>

                {/* Show profile resume if available and no new upload */}
                {resumeFromProfile && !resume && (
                  <div className="flex items-center justify-between bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-400">📄</span>
                      <div>
                        <p className="text-sm text-blue-300 font-medium">{resumeFromProfile.name}</p>
                        <p className="text-xs text-slate-600">Using resume from your profile</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setResumeFromProfile(null)}
                      className="text-xs text-slate-600 hover:text-slate-400 underline underline-offset-2 transition"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Upload area — shown if no profile resume or user clicked "Change" */}
                {(!resumeFromProfile || resume) && (
                  <label className={`flex items-center gap-4 w-full border-2 border-dashed rounded-xl px-5 py-5 cursor-pointer transition-all group
                    ${resume ? "bg-blue-500/5 border-blue-500/30" : "bg-[#0a0a0f] border-[#2a2a3e] hover:border-blue-500/30"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition
                      ${resume ? "bg-blue-600/20 border border-blue-500/30" : "bg-[#13131a] border border-[#1e1e2e] group-hover:border-blue-500/30"}`}>
                      {resume ? "✓" : "📎"}
                    </div>
                    <div className="min-w-0 flex-1">
                      {resume ? (
                        <><p className="text-sm font-medium text-blue-300 truncate">{resume.name}</p><p className="text-xs text-slate-600 mt-0.5">Click to change</p></>
                      ) : (
                        <><p className="text-sm text-slate-400">Drop resume or <span className="text-blue-400 underline underline-offset-2">browse</span></p><p className="text-xs text-slate-700 mt-0.5">PDF, DOC, DOCX — max 5MB</p></>
                      )}
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResume(e.target.files[0])} />
                  </label>
                )}
              </div>

              {/* ── 4. Cover Letter with AI ── */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2.5">
                  <span className="w-4 h-4 rounded bg-blue-600/20 flex items-center justify-center text-[9px] text-blue-400 font-bold">4</span>
                  Cover Letter
                </label>

                <div className="flex items-center gap-3 mb-3">
                  <button type="button" onClick={handleGenerateCoverLetter} disabled={aiLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600/80 to-blue-600/80 hover:from-violet-500 hover:to-blue-500 border border-violet-500/30 text-white text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-900/20 hover:shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0">
                    {aiLoading ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />Generating…</>
                    ) : (
                      <><span className="text-sm">✦</span>Generate with AI</>
                    )}
                  </button>
                  {coverLetter && !aiLoading && (
                    <button type="button" onClick={handleGenerateCoverLetter}
                      className="text-xs text-slate-600 hover:text-slate-400 underline underline-offset-2 transition">
                      Regenerate
                    </button>
                  )}
                  <span className="text-[10px] text-slate-700 ml-auto">Uses job + your profile data</span>
                </div>

                {aiLoading && (
                  <div className="w-full bg-[#0a0a0f] border border-violet-500/20 rounded-xl px-4 py-3 space-y-2.5 animate-pulse">
                    <div className="h-3 bg-violet-500/10 rounded w-full" />
                    <div className="h-3 bg-violet-500/10 rounded w-5/6" />
                    <div className="h-3 bg-violet-500/10 rounded w-4/6" />
                    <div className="h-3 bg-violet-500/10 rounded w-full mt-1" />
                    <div className="h-3 bg-violet-500/10 rounded w-3/4" />
                  </div>
                )}

                {aiError && !aiLoading && (
                  <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <span>⚠</span> {aiError}
                  </div>
                )}

                {!aiLoading && (
                  <div className="relative">
                    <textarea rows={7}
                      placeholder="Click 'Generate with AI' to auto-write a tailored cover letter, or type your own…"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className={`w-full bg-[#0a0a0f] border rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none transition resize-none leading-relaxed
                        ${coverLetter ? "border-blue-500/40 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20" : "border-[#1e1e2e] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20"}`}
                    />
                    {coverLetter && <span className="absolute bottom-3 right-4 text-[10px] text-slate-700">{coverLetter.length} chars</span>}
                  </div>
                )}

                {coverLetter && !aiLoading && (
                  <p className="text-[10px] text-violet-500/60 mt-1.5 flex items-center gap-1">
                    <span>✦</span> AI-generated — review and edit before submitting
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 pb-7 pt-2 flex gap-3">
              <button onClick={() => setSelectedJob(null)}
                className="py-3 px-5 rounded-xl border border-[#1e1e2e] text-slate-500 text-sm hover:bg-[#1e1e2e] hover:text-slate-300 transition">
                Cancel
              </button>
              <button onClick={handleApply} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Submitting…</>
                ) : <>→ Submit Application</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl
          ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/20 text-emerald-400" : "bg-red-950 border-red-500/20 text-red-400"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </div>
  );
};

export default PremiumJob;