import React, { useState, useEffect } from "react";
import axiosInstance from "../../Api/config";
import PageLoader from "../../Pageloader";

const PremiumManage = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    location: "",
    experienceRequired: "",
    description: "",
  });

  useEffect(() => { fetchJobs(); }, []);

const fetchJobs = async () => {
  try {
    setPageLoading(true);
    const res = await axiosInstance.get("/jobs/premium");
    setJobs(res.data.jobs || []);
  } catch {
    showToast("Failed to load jobs", "error");
  } finally {
    setPageLoading(false);
  }
};

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/jobs", { ...form, isPremium: true });
      setForm({ title: "", location: "", experienceRequired: "", description: "" });
      setOpen(false);
      fetchJobs();
      showToast("Premium job created!");
    } catch {
      showToast("Failed to create job", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      setDeleteConfirm(null);
      fetchJobs();
      showToast("Job removed");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );
if (pageLoading) {
  return <PageLoader />;
}
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 px-8 py-10 relative overflow-x-hidden">

      {/* Background glows */}
      <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">

        {/* ── Header ── */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-blue-500" />
              <span className="text-xs font-medium tracking-[3px] uppercase text-blue-500">
                Admin Panel
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-none tracking-tight">
              Premium <span className="text-blue-400">Jobs</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm text-slate-500">{jobs.length} active listings</span>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center font-bold text-base leading-none">+</span>
            New Premium Job
          </button>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5 w-72">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-lg select-none">⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>

        {/* ── Table ── */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">

          {/* Table Head */}
          <div className="grid grid-cols-[2fr_1.4fr_1.4fr_1fr_72px] px-6 py-4 bg-[#0f0f18] border-b border-[#1e1e2e]">
            {["Job Title", "Location", "Experience", "Status", ""].map((h) => (
              <span key={h} className="text-[11px] font-medium tracking-[2px] uppercase text-slate-600">
                {h}
              </span>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-4xl mb-3 opacity-20 select-none">◈</div>
              <p className="font-semibold text-slate-600">
                {search ? "No results found" : "No premium jobs yet"}
              </p>
              <p className="text-sm mt-1 text-slate-700">
                {search ? "Try a different keyword" : "Click 'New Premium Job' to get started"}
              </p>
            </div>
          ) : (
            filtered.map((job, i) => (
              <div
                key={job._id}
                className="grid grid-cols-[2fr_1.4fr_1.4fr_1fr_72px] px-6 py-4 border-b border-[#1a1a28] last:border-0 hover:bg-blue-500/[0.03] transition-colors duration-150 items-center"
              >
                {/* Title with initial avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                    {job.title?.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{job.title}</p>
                    {job.description && (
                      <p className="text-xs text-slate-600 truncate mt-0.5">{job.description}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <span className="text-[11px]">📍</span>
                  <span className="truncate">{job.location}</span>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <span className="text-[11px]">💼</span>
                  <span>{job.experienceRequired}</span>
                </div>

                {/* Status */}
                <div>
                  <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase text-blue-400 whitespace-nowrap">
                    ★ Premium
                  </span>
                </div>

                {/* Delete */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteConfirm(job)}
                    className="w-8 h-8 rounded-lg border border-[#1e1e2e] text-slate-600 flex items-center justify-center text-xs hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-slate-700 mt-3 px-1">
            Showing {filtered.length} of {jobs.length} jobs
          </p>
        )}
      </div>

      {/* ── Side Drawer ── */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />

          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f0f1a] border-l border-[#1a1a2e] z-50 flex flex-col shadow-2xl">

            <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-[#1a1a2e]">
              <div>
                <p className="text-[10px] font-medium tracking-[2px] uppercase text-blue-500 mb-1">New Listing</p>
                <h3 className="text-xl font-bold text-white">Create Premium Job</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl border border-[#1a1a2e] text-slate-500 hover:text-slate-300 hover:border-slate-600 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
              {[
                { label: "Job Title", key: "title", placeholder: "e.g. Senior React Developer" },
                { label: "Location", key: "location", placeholder: "e.g. Remote / Bangalore" },
                { label: "Experience Required", key: "experienceRequired", placeholder: "e.g. 3–5 years" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-medium tracking-[1.5px] uppercase text-slate-500 mb-2">{label}</label>
                  <input
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required
                    className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-medium tracking-[1.5px] uppercase text-slate-500 mb-2">Description</label>
                <textarea
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5 bg-blue-400/5 border border-blue-400/15 rounded-xl px-4 py-3">
                <span className="text-blue-400 text-sm mt-0.5">★</span>
                <span className="text-xs text-blue-400/80 leading-relaxed">
                  This job will be marked as <strong className="text-blue-400">Premium</strong> and visible to all enrolled students.
                </span>
              </div>
            </form>

            <div className="px-7 pb-7 pt-4 border-t border-[#1a1a2e] flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-[#1a1a2e] text-slate-500 text-sm hover:bg-[#1a1a2e] hover:text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Creating…</>
                  : "→ Publish Job"
                }
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-7 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl mx-auto mb-4">⚠</div>
            <h4 className="text-lg font-bold text-white mb-2">Remove Job?</h4>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              <span className="text-slate-300 font-medium">"{deleteConfirm.title}"</span> will be permanently deleted and cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-[#1a1a2e] text-slate-500 text-sm hover:bg-[#1a1a2e] transition">Keep</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 py-2.5 rounded-xl bg-red-500/90 text-white text-sm font-medium hover:bg-red-600 transition">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium
          ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/20 text-emerald-400" : "bg-red-950 border-red-500/20 text-red-400"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </div>
  );
};

export default PremiumManage;