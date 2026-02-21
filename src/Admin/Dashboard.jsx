import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Api/config";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [greeting, setGreeting] = useState("");

  const token = localStorage.getItem("token");
  let role = null;
  let username = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      username = decoded.username || decoded.name || "User";
    } catch {}
  }

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (role === "admin") {
        const [studentsRes, jobsRes, applicationsRes] = await Promise.all([
          axiosInstance.get("/student"),
          axiosInstance.get("/jobs"),
          axiosInstance.get("/application/admin/applications"),
        ]);
        setStats({
          students: studentsRes.data.students?.length || 0,
          jobs: jobsRes.data.jobs?.length || 0,
          applications: applicationsRes.data.applications?.length || 0,
        });
      } else {
        const [jobsRes, appliedRes] = await Promise.all([
          axiosInstance.get("/jobs/premium"),
          axiosInstance.get("/application/my"),
        ]);
        setStats({
          available: jobsRes.data.jobs?.length || 0,
          applied: appliedRes.data.applications?.length || 0,
        });
      }
    } catch {
      setStats({});
    }
  };

  const adminCards = [
    {
      label: "Total Students",
      value: stats?.students ?? "—",
      icon: "👥",
      color: "from-blue-600/20 to-blue-800/10",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      href: "/student",
    },
    {
      label: "Premium Jobs",
      value: stats?.jobs ?? "—",
      icon: "💼",
      color: "from-violet-600/20 to-violet-800/10",
      border: "border-violet-500/20",
      accent: "text-violet-400",
      href: "/premium-manage",
    },
    {
      label: "Applications",
      value: stats?.applications ?? "—",
      icon: "📋",
      color: "from-emerald-600/20 to-emerald-800/10",
      border: "border-emerald-500/20",
      accent: "text-emerald-400",
      href: "/applies",
    },
  ];

  const studentCards = [
    {
      label: "Jobs Available",
      value: stats?.available ?? "—",
      icon: "🌟",
      color: "from-blue-600/20 to-blue-800/10",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      href: "/premium",
    },
    {
      label: "Applied",
      value: stats?.applied ?? "—",
      icon: "✅",
      color: "from-emerald-600/20 to-emerald-800/10",
      border: "border-emerald-500/20",
      accent: "text-emerald-400",
      href: "/premium",
    },
  ];

  const cards = role === "admin" ? adminCards : studentCards;

  const adminQuickLinks = [
    { label: "Add Student", icon: "➕", href: "/student", desc: "Create a new student account" },
    { label: "Post Job", icon: "📝", href: "/premium-manage", desc: "Create a new premium job" },
    { label: "HR Settings", icon: "⚙️", href: "/hr-settings", desc: "Manage HR email contacts" },
    { label: "View Applications", icon: "📂", href: "/applies", desc: "Review all submissions" },
  ];

  const studentQuickLinks = [
    { label: "Browse Jobs", icon: "🔍", href: "/premium", desc: "View all premium listings" },
  ];

  const quickLinks = role === "admin" ? adminQuickLinks : studentQuickLinks;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 px-8 py-10 relative overflow-x-hidden">

      {/* Glows */}
      <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Welcome Header ── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-blue-500" />
            <span className="text-xs font-medium tracking-[3px] uppercase text-blue-500">
              {role === "admin" ? "Admin Panel" : "Student Portal"}
            </span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-none tracking-tight">
            {greeting},<br />
            {/* <span className="text-blue-400">{username}</span>
            <span className="text-white">.</span> */}
          </h1>

          <p className="text-slate-500 mt-4 text-sm max-w-md leading-relaxed">
            {role === "admin"
              ? "Here's an overview of your job portal. Manage students, jobs, and applications from one place."
              : "Track your applications and discover new premium opportunities."}
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className={`grid gap-5 mb-10 ${role === "admin" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 max-w-xl"}`}>
          {cards.map((card, i) => (
            <button
              key={card.label}
              onClick={() => navigate(card.href)}
              className={`group relative bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-6 text-left hover:-translate-y-1 hover:border-opacity-50 transition-all duration-200 overflow-hidden`}
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-6">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-[10px] font-medium tracking-[2px] uppercase text-slate-600 group-hover:text-slate-500 transition">
                  View →
                </span>
              </div>

              <div className={`text-4xl font-extrabold ${card.accent} mb-1`}>
                {stats === null ? (
                  <span className="inline-block w-12 h-8 bg-white/5 rounded animate-pulse" />
                ) : card.value}
              </div>
              <div className="text-sm text-slate-500 font-medium">{card.label}</div>
            </button>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-3 h-px bg-slate-700" />
            <span className="text-[11px] font-medium tracking-[2px] uppercase text-slate-600">
              Quick Actions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.href)}
                className="group flex items-start gap-4 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-5 hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-all duration-150 text-left"
              >
                <span className="w-10 h-10 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-center text-lg flex-shrink-0 group-hover:border-blue-500/30 transition">
                  {link.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                    {link.label}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Admin recent info strip ── */}
        {role === "admin" && stats && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Conversion Rate", value: stats.students > 0 ? `${Math.round((stats.applications / stats.students) * 100)}%` : "—", sub: "applications per student" },
              { label: "Jobs Available", value: stats.jobs, sub: "active premium listings" },
              { label: "Avg per Job", value: stats.jobs > 0 ? (stats.applications / stats.jobs).toFixed(1) : "—", sub: "applications per job" },
            ].map(item => (
              <div key={item.label} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl px-5 py-4">
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-slate-600 mb-1">{item.label}</p>
                <p className="text-2xl font-extrabold text-slate-200">{item.value}</p>
                <p className="text-xs text-slate-700 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Student status strip ── */}
        {role === "student" && stats && (
          <div className="mt-8 bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-2xl flex-shrink-0">
              🎯
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {stats.applied === 0
                  ? "You haven't applied to any jobs yet"
                  : `You've applied to ${stats.applied} job${stats.applied > 1 ? "s" : ""} so far`}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {stats.available} premium positions are currently open. Keep applying!
              </p>
            </div>
            <button
              onClick={() => navigate("/premium")}
              className="ml-auto flex-shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
            >
              Browse Jobs →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;