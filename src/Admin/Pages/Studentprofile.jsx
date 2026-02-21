import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../Api/config";
import PageLoader from "../../Pageloader";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm text-slate-200
      placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm text-slate-200
      placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition resize-none ${className}`}
    {...props}
  />
);

const StudentProfile = () => {
  const [profile, setProfile]       = useState(null);
  const [username, setUsername]     = useState("");
  const [email, setEmail]           = useState("");
  const [loading, setLoading]       = useState(true);
  const [errorMsg, setErrorMsg]     = useState("");
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab]   = useState("personal");
  const avatarRef = useRef();
  const resumeRef = useRef();

  const [form, setForm] = useState({
    fullName: "", phone: "", location: "", bio: "",
    skills: [], experience: "", education: "",
    linkedin: "", github: "", portfolio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [resumeFile, setResumeFile]       = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load profile ─────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");
          console.log("PROFILE RESPONSE:", res.data);
        const { profile: p, username: u, email: e } = res.data;

        setUsername(u || "");
        setEmail(e || "");

        const safe = p || {};
        setProfile(safe);
        setAvatarPreview(safe.avatar || "");
        setForm({
          fullName:   safe.fullName   || "",
          phone:      safe.phone      || "",
          location:   safe.location   || "",
          bio:        safe.bio        || "",
          skills:     Array.isArray(safe.skills) ? safe.skills : [],
          experience: safe.experience || "",
          education:  safe.education  || "",
          linkedin:   safe.linkedin   || "",
          github:     safe.github     || "",
          portfolio:  safe.portfolio  || "",
        });
      } catch (err) {
        // Capture REAL error — no more silent failures
         console.log("PROFILE ERROR:", err);
        const status = err?.response?.status;
        const msg    = err?.response?.data?.message || err?.message || "Unknown error";
        console.error("Profile load failed:", status, msg, err);
        setErrorMsg(`${status ? `[${status}] ` : ""}${msg}`);
        setProfile({}); // unblock rendering
      } finally {
        setLoading(false); // ALWAYS stop spinner
      }
    };
    load();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s))
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  };
  const removeSkill = (skill) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        await axiosInstance.post("/profile/upload-avatar", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (resumeFile) {
        const fd = new FormData();
        fd.append("resume", resumeFile);
        await axiosInstance.post("/profile/upload-resume", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      await axiosInstance.put("/profile/update", {
        ...form,
        skills: JSON.stringify(form.skills),
      });
      showToast("Profile saved successfully!");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  // ── Error screen — shows WHAT went wrong ─────────────────
  if (errorMsg) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="bg-[#13131a] border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-bold text-white mb-3">Profile failed to load</h2>
        <p className="text-sm text-red-400 font-mono bg-red-500/10 rounded-lg px-4 py-3 mb-4 text-left break-all">
          {errorMsg}
        </p>
        <p className="text-xs text-slate-600 mb-5">
          Check your browser Console and backend terminal for full details.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const fields = [
    form.fullName, form.phone, form.location, form.bio,
    form.skills.length, form.experience, form.education,
    form.linkedin || form.github || form.portfolio,
    profile?.resumeUrl || resumeFile,
    avatarPreview,
  ];
  const complete = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const tabs = [
    { id: "personal",     label: "Personal",       icon: "👤" },
    { id: "professional", label: "Professional",   icon: "💼" },
    { id: "links",        label: "Links & Resume", icon: "🔗" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 px-6 py-10 relative overflow-x-hidden">
      <div className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-400/4 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-blue-500" />
            <span className="text-xs font-medium tracking-[3px] uppercase text-blue-500">Student Portal</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-none tracking-tight">
            My <span className="text-blue-400">Profile</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* LEFT sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="relative bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 overflow-hidden text-center">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/30 to-blue-900/20 border border-blue-500/20 flex items-center justify-center mx-auto">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-3xl font-black text-blue-400">{(form.fullName || username).slice(0, 1).toUpperCase() || "?"}</span>
                  }
                </div>
                <button onClick={() => avatarRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 border border-[#13131a] flex items-center justify-center text-xs transition">
                  ✎
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <p className="font-bold text-white">{form.fullName || username || "—"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{email}</p>
              {form.location && <p className="text-xs text-slate-600 mt-1">📍 {form.location}</p>}
              <div className="mt-5">
                <div className="flex justify-between text-[10px] text-slate-600 mb-1.5">
                  <span>Profile completion</span>
                  <span className={complete === 100 ? "text-emerald-400" : "text-blue-400"}>{complete}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0f0f18] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${complete === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                    style={{ width: `${complete}%` }} />
                </div>
              </div>
            </div>

            {form.skills.length > 0 && (
              <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-5">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-slate-500 mb-3">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map((s) => (
                    <span key={s} className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1 text-[11px] text-blue-300 font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-5">
              <p className="text-[10px] font-semibold tracking-[2px] uppercase text-slate-500 mb-3">Resume</p>
              {resumeFile ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>✓</span><span className="truncate text-xs">{resumeFile.name}</span>
                </div>
              ) : profile?.resumeUrl ? (
                <a href={`http://localhost:4000${profile.resumeUrl}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition">
                  <span>📄</span> {profile.resumeName || "View Resume"}
                </a>
              ) : (
                <p className="text-xs text-slate-600">No resume uploaded yet</p>
              )}
            </div>
          </div>

          {/* RIGHT form */}
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <div className="flex border-b border-[#1e1e2e]">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold tracking-wide transition-all
                    ${activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5"
                      : "text-slate-600 hover:text-slate-400 border-b-2 border-transparent"}`}>
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-7 space-y-6">
              {activeTab === "personal" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name"><Input placeholder="John Doe" value={form.fullName} onChange={set("fullName")} /></Field>
                    <Field label="Phone"><Input placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} /></Field>
                  </div>
                  <Field label="Location"><Input placeholder="City, State, Country" value={form.location} onChange={set("location")} /></Field>
                  <Field label="Bio">
                    <div className="relative">
                      <Textarea rows={4} maxLength={400} placeholder="A short intro about yourself…" value={form.bio} onChange={set("bio")} />
                      <span className="absolute bottom-3 right-4 text-[10px] text-slate-700">{form.bio.length}/400</span>
                    </div>
                  </Field>
                </>
              )}

              {activeTab === "professional" && (
                <>
                  <Field label="Skills">
                    <div className="flex gap-2 mb-3">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                        placeholder="e.g. React, Node.js, Python…"
                        className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
                      />
                      <button onClick={addSkill} className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition">+ Add</button>
                    </div>
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.skills.map((s) => (
                          <span key={s} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5 text-xs text-blue-300">
                            {s}<button onClick={() => removeSkill(s)} className="text-blue-500 hover:text-red-400 transition text-[10px]">✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </Field>
                  <Field label="Experience Summary">
                    <Textarea rows={4} placeholder="e.g. 3 years of full-stack development with React and Node.js…" value={form.experience} onChange={set("experience")} />
                  </Field>
                  <Field label="Education">
                    <Textarea rows={3} placeholder="e.g. B.Tech Computer Science, VIT Vellore, 2024" value={form.education} onChange={set("education")} />
                  </Field>
                </>
              )}

              {activeTab === "links" && (
                <>
                  <Field label="LinkedIn"><Input placeholder="https://linkedin.com/in/yourname" value={form.linkedin} onChange={set("linkedin")} /></Field>
                  <Field label="GitHub"><Input placeholder="https://github.com/yourname" value={form.github} onChange={set("github")} /></Field>
                  <Field label="Portfolio / Website"><Input placeholder="https://yourportfolio.com" value={form.portfolio} onChange={set("portfolio")} /></Field>
                  <Field label="Resume">
                    <label className={`flex items-center gap-4 w-full border-2 border-dashed rounded-xl px-5 py-5 cursor-pointer transition-all group
                      ${resumeFile ? "bg-blue-500/5 border-blue-500/30" : "bg-[#0a0a0f] border-[#2a2a3e] hover:border-blue-500/30"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition
                        ${resumeFile ? "bg-blue-600/20 border border-blue-500/30" : "bg-[#13131a] border border-[#1e1e2e] group-hover:border-blue-500/30"}`}>
                        {resumeFile ? "✓" : "📎"}
                      </div>
                      <div className="min-w-0 flex-1">
                        {resumeFile ? (
                          <><p className="text-sm font-medium text-blue-300 truncate">{resumeFile.name}</p><p className="text-xs text-slate-600 mt-0.5">Click to change</p></>
                        ) : profile?.resumeUrl ? (
                          <><p className="text-sm text-slate-400 truncate">📄 {profile.resumeName || "Resume uploaded"}</p><p className="text-xs text-slate-700 mt-0.5">Upload new to replace</p></>
                        ) : (
                          <><p className="text-sm text-slate-400">Drop your resume or <span className="text-blue-400 underline underline-offset-2">browse</span></p><p className="text-xs text-slate-700 mt-0.5">PDF, DOC, DOCX — max 5 MB</p></>
                        )}
                      </div>
                      <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
                    </label>
                  </Field>
                </>
              )}
            </div>

            <div className="px-7 pb-7 pt-2 flex justify-end">
              <button onClick={handleSave} disabled={saving}
                className="px-8 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Saving…</>
                  : "Save Profile →"
                }
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

export default StudentProfile;