import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/config";
import PageLoader from "../../Pageloader";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
const [pageLoading, setPageLoading] = useState(true); 
  useEffect(() => { fetchApplications(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

const fetchApplications = async () => {
  try {
    setPageLoading(true);
    const res = await axiosInstance.get("/application/admin/applications");
    setApplications(res.data.applications || []);
  } catch {
    showToast("Failed to load applications", "error");
  } finally {
    setPageLoading(false);
  }
};

  const filtered = applications.filter(app =>
    app.studentId?.username?.toLowerCase().includes(search.toLowerCase()) ||
    app.studentId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    app.jobId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) => name?.slice(0, 2).toUpperCase() || "??";
  const avatarColors = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2"];
  const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
if (pageLoading) {
  return <PageLoader />;
}
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 px-8 py-10 relative overflow-x-hidden">

      {/* Glows */}
      <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">

        {/* ── Header ── */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-blue-500" />
              <span className="text-xs font-medium tracking-[3px] uppercase text-blue-500">Admin Panel</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-none tracking-tight">
              Applications<span className="text-blue-400">.</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm text-slate-500">{applications.length} total submissions</span>
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5 w-72">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-lg select-none">⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or job..."
            className="w-full bg-[#13131a] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>

        {/* ── Table ── */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">

          {/* Head */}
          <div className="grid grid-cols-[2fr_2fr_2fr_1.2fr_100px_90px_110px] px-6 py-4 bg-[#0f0f18] border-b border-[#1e1e2e]">
            {["Student", "Email", "Job Applied", "Experience", "Resume", "Status", "Date"].map(h => (
              <span key={h} className="text-[11px] font-medium tracking-[2px] uppercase text-slate-600">{h}</span>
            ))}
          </div>

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-4xl mb-3 opacity-20 select-none">◎</div>
              <p className="font-semibold text-slate-600">{search ? "No results found" : "No applications yet"}</p>
              <p className="text-sm mt-1 text-slate-700">{search ? "Try a different search term" : "Applications will appear here once students apply"}</p>
            </div>
          ) : filtered.map((app, i) => (
            <div
              key={app._id}
              className="grid grid-cols-[2fr_2fr_2fr_1.2fr_100px_90px_110px] px-6 py-4 border-b border-[#1a1a28] last:border-0 hover:bg-blue-500/[0.03] transition-colors items-center cursor-pointer"
              onClick={() => setSelected(app)}
            >
              {/* Student */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: getColor(app.studentId?.username) }}
                >
                  {getInitials(app.studentId?.username)}
                </div>
                <span className="text-sm font-medium text-slate-100 truncate">{app.studentId?.username}</span>
              </div>

              {/* Email */}
              <span className="text-sm text-slate-500 truncate">{app.studentId?.email}</span>

              {/* Job */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-bold flex-shrink-0">
                  {app.jobId?.title?.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm text-slate-400 truncate">{app.jobId?.title}</span>
              </div>

              {/* Experience */}
              <span className="text-sm text-slate-500">{app.experience || "—"}</span>

              {/* Resume */}
              <div>
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-600/25 transition"
                >
                  📎 View
                </a>
              </div>

              {/* Status */}
              <div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase text-emerald-400">
                  ✓ Applied
                </span>
              </div>

              {/* Date */}
              <span className="text-xs text-slate-600">
                {new Date(app.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </span>
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-slate-700 mt-3 px-1">
            Showing {filtered.length} of {applications.length} applications
          </p>
        )}
      </div>

      {/* ── Detail Drawer ── */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f0f1a] border-l border-[#1a1a2e] z-50 flex flex-col shadow-2xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-[#1a1a2e]">
              <div>
                <p className="text-[10px] font-medium tracking-[2px] uppercase text-blue-500 mb-1">Application Detail</p>
                <h3 className="text-xl font-bold text-white">{selected.studentId?.username}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-xl border border-[#1a1a2e] text-slate-500 hover:text-slate-300 hover:border-slate-600 flex items-center justify-center transition"
              >✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

              {/* Student card */}
              <div className="flex items-center gap-4 bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl p-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: getColor(selected.studentId?.username) }}
                >
                  {getInitials(selected.studentId?.username)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{selected.studentId?.username}</p>
                  <p className="text-xs text-slate-500">{selected.studentId?.email}</p>
                </div>
              </div>

              {/* Job info */}
              <div>
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-slate-600 mb-2">Job Applied</p>
                <div className="flex items-center gap-3 bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                    {selected.jobId?.title?.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{selected.jobId?.title}</p>
                    {selected.jobId?.location && <p className="text-xs text-slate-600">📍 {selected.jobId.location}</p>}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-slate-600 mb-2">Experience</p>
                <p className="text-sm text-slate-300 bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl px-4 py-3">{selected.experience || "—"}</p>
              </div>

              {/* Cover Letter */}
              {selected.coverLetter && (
                <div>
                  <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-slate-600 mb-2">Cover Letter</p>
                  <p className="text-sm text-slate-400 bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl px-4 py-4 leading-relaxed whitespace-pre-wrap">{selected.coverLetter}</p>
                </div>
              )}

              {/* Resume */}
              <div>
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-slate-600 mb-2">Resume</p>
                <a
                  href={selected.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl px-4 py-3 hover:border-blue-500/30 transition group"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">📎</span>
                  <span className="text-sm text-blue-400 group-hover:text-blue-300 transition">View Resume →</span>
                </a>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#1a1a2e] rounded-xl px-4 py-3">
                <span className="text-xs text-slate-600 uppercase tracking-wider">Submitted</span>
                <span className="text-xs text-slate-400">
                  {new Date(selected.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
                <span className="text-xs text-slate-600 uppercase tracking-wider">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Applied
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium
          ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/20 text-emerald-400" : "bg-red-950 border-red-500/20 text-red-400"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;