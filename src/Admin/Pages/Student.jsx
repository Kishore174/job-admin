import React, { useEffect, useState } from "react";
import {
  createStudent,
  getStudents,
  deleteStudent,
} from "../../Api/studentApi";
import PageLoader from "../../Pageloader"; // adjust path if needed
const Student = () => {
  const [form, setForm] = useState({ username: "", email: "" });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
const [pageLoading, setPageLoading] = useState(true);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

const fetchStudents = async () => {
  try {
    setPageLoading(true);
    const res = await getStudents();
    setStudents(res.students || []);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setPageLoading(false);
  }
};

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createStudent(form);
      showToast(res.message);
      setForm({ username: "", email: "" });
      setIsOpen(false);
      fetchStudents();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      showToast("Student removed successfully");
      setDeleteConfirm(null);
      fetchStudents();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const filtered = students.filter(s =>
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) => name?.slice(0, 2).toUpperCase() || "??";

  const avatarColors = [
    "#2563EB", "#7C3AED", "#DB2777", "#059669", "#D97706", "#DC2626", "#0891B2"
  ];
  const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
 if (pageLoading) {
  return <PageLoader />;
}
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sm-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
          padding: 40px 32px;
          color: #e2e8f0;
          position: relative;
          overflow-x: hidden;
        }

        .sm-root::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .sm-root::after {
          content: '';
          position: fixed;
          bottom: -200px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Header */
        .sm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .sm-title-block {}

        .sm-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 6px;
        }

        .sm-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .sm-title span {
          color: #2563EB;
        }

        .sm-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          background: rgba(37,99,235,0.1);
          border: 1px solid rgba(37,99,235,0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 13px;
          color: #93c5fd;
        }

        .sm-count-dot {
          width: 6px;
          height: 6px;
          background: #2563EB;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Create button */
        .sm-create-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #2563EB;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 13px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .sm-create-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(37,99,235,0.4);
        }

        .sm-create-btn:active { transform: translateY(0); }

        .sm-create-icon {
          width: 20px;
          height: 20px;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
        }

        /* Search */
        .sm-search-wrap {
          position: relative;
          margin-bottom: 24px;
        }

        .sm-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          font-size: 16px;
        }

        .sm-search {
          width: 100%;
          max-width: 360px;
          background: #13131a;
          border: 1px solid #1e1e2e;
          border-radius: 10px;
          padding: 11px 16px 11px 42px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s;
        }

        .sm-search::placeholder { color: #475569; }
        .sm-search:focus { border-color: #2563EB; }

        /* Table Card */
        .sm-card {
          background: #13131a;
          border: 1px solid #1e1e2e;
          border-radius: 16px;
          overflow: hidden;
        }

        .sm-table-header {
          display: grid;
          grid-template-columns: 2fr 2.5fr 1.2fr 80px;
          padding: 14px 24px;
          border-bottom: 1px solid #1e1e2e;
          background: #0f0f18;
        }

        .sm-th {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #475569;
        }

        .sm-row {
          display: grid;
          grid-template-columns: 2fr 2.5fr 1.2fr 80px;
          padding: 16px 24px;
          align-items: center;
          border-bottom: 1px solid #1a1a28;
          transition: background 0.15s;
          animation: fadeRow 0.3s ease forwards;
          opacity: 0;
        }

        @keyframes fadeRow {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sm-row:last-child { border-bottom: none; }
        .sm-row:hover { background: rgba(37,99,235,0.04); }

        .sm-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sm-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .sm-username {
          font-size: 14px;
          font-weight: 500;
          color: #f1f5f9;
        }

        .sm-email {
          font-size: 13px;
          color: #64748b;
        }

        .sm-date {
          font-size: 12px;
          color: #475569;
          font-variant-numeric: tabular-nums;
        }

        .sm-del-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #1e1e2e;
          background: transparent;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-size: 14px;
        }

        .sm-del-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #ef4444;
        }

        .sm-empty {
          padding: 60px 24px;
          text-align: center;
          color: #334155;
        }

        .sm-empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          opacity: 0.4;
        }

        .sm-empty-text {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .sm-empty-sub { font-size: 13px; color: #1e293b; }

        /* Modal */
        .sm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sm-modal {
          background: #13131a;
          border: 1px solid #1e1e2e;
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          padding: 32px;
          animation: slideUp 0.25s ease;
          position: relative;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sm-modal-accent {
          position: absolute;
          top: 0;
          left: 32px;
          right: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2563EB, transparent);
        }

        .sm-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .sm-modal-sub {
          font-size: 13px;
          color: #475569;
          margin-bottom: 28px;
        }

        .sm-field {
          margin-bottom: 16px;
        }

        .sm-field-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 8px;
          display: block;
        }

        .sm-input {
          width: 100%;
          background: #0a0a0f;
          border: 1px solid #1e1e2e;
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sm-input::placeholder { color: #334155; }

        .sm-input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .sm-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .sm-cancel-btn {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #1e1e2e;
          border-radius: 10px;
          color: #64748b;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .sm-cancel-btn:hover { background: #1e1e2e; color: #94a3b8; }

        .sm-submit-btn {
          flex: 2;
          padding: 12px;
          background: #2563EB;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sm-submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
          box-shadow: 0 4px 15px rgba(37,99,235,0.4);
        }

        .sm-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Delete confirm */
        .sm-del-modal {
          background: #13131a;
          border: 1px solid #1e1e2e;
          border-radius: 20px;
          width: 100%;
          max-width: 360px;
          padding: 28px;
          animation: slideUp 0.25s ease;
          text-align: center;
        }

        .sm-del-icon {
          width: 52px;
          height: 52px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin: 0 auto 16px;
        }

        .sm-del-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .sm-del-sub {
          font-size: 13px;
          color: #475569;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .sm-del-actions { display: flex; gap: 10px; }

        .sm-del-confirm {
          flex: 1;
          padding: 11px;
          background: #ef4444;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .sm-del-confirm:hover { background: #dc2626; }

        /* Toast */
        .sm-toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          z-index: 200;
          animation: toastIn 0.3s ease;
          border: 1px solid;
        }

        .sm-toast.success {
          background: #052e16;
          border-color: rgba(34,197,94,0.3);
          color: #4ade80;
        }

        .sm-toast.error {
          background: #1c0505;
          border-color: rgba(239,68,68,0.3);
          color: #f87171;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sm-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="sm-root">

        {/* Header */}
        <div className="sm-header">
          <div className="sm-title-block">
            <div className="sm-label">Admin Panel</div>
            <h1 className="sm-title">Student<span>.</span></h1>
            <div className="sm-count">
              <span className="sm-count-dot" />
              {students.length} enrolled
            </div>
          </div>

          <button className="sm-create-btn" onClick={() => setIsOpen(true)}>
            <span className="sm-create-icon">+</span>
            New Student
          </button>
        </div>

        {/* Search */}
        <div className="sm-search-wrap">
          <span className="sm-search-icon">⌕</span>
          <input
            className="sm-search"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="sm-card">
          <div className="sm-table-header">
            <span className="sm-th">Student</span>
            <span className="sm-th">Email</span>
            <span className="sm-th">Joined</span>
            <span className="sm-th"></span>
          </div>

          {filtered.length === 0 ? (
            <div className="sm-empty">
              <div className="sm-empty-icon">◎</div>
              <div className="sm-empty-text">
                {search ? "No results found" : "No students yet"}
              </div>
              <div className="sm-empty-sub">
                {search ? "Try a different search term" : "Create your first student to get started"}
              </div>
            </div>
          ) : (
            filtered.map((student, i) => (
              <div
                className="sm-row"
                key={student._id}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="sm-user">
                  <div
                    className="sm-avatar"
                    style={{ background: getColor(student.username) }}
                  >
                    {getInitials(student.username)}
                  </div>
                  <span className="sm-username">{student.username}</span>
                </div>

                <span className="sm-email">{student.email}</span>

                <span className="sm-date">
                  {new Date(student.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </span>

                <button
                  className="sm-del-btn"
                  onClick={() => setDeleteConfirm(student)}
                  title="Remove student"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Create Modal */}
        {isOpen && (
          <div className="sm-overlay" onClick={() => setIsOpen(false)}>
            <div className="sm-modal" onClick={e => e.stopPropagation()}>
              <div className="sm-modal-accent" />
              <div className="sm-modal-title">New Student</div>
              <div className="sm-modal-sub">Credentials will be emailed automatically.</div>

              <form onSubmit={handleSubmit}>
                <div className="sm-field">
                  <label className="sm-field-label">Username</label>
                  <input
                    className="sm-input"
                    type="text"
                    name="username"
                    placeholder="e.g. john_doe"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="sm-field">
                  <label className="sm-field-label">Email Address</label>
                  <input
                    className="sm-input"
                    type="email"
                    name="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm-modal-actions">
                  <button
                    type="button"
                    className="sm-cancel-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sm-submit-btn"
                    disabled={loading}
                  >
                    {loading ? <><span className="sm-spinner" /> Creating…</> : "→ Create Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="sm-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="sm-del-modal" onClick={e => e.stopPropagation()}>
              <div className="sm-del-icon">⚠</div>
              <div className="sm-del-title">Remove Student</div>
              <div className="sm-del-sub">
                <strong style={{ color: "#94a3b8" }}>{deleteConfirm.username}</strong> will be
                permanently removed. This action cannot be undone.
              </div>
              <div className="sm-del-actions">
                <button
                  className="sm-cancel-btn"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Keep
                </button>
                <button
                  className="sm-del-confirm"
                  onClick={() => handleDelete(deleteConfirm._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`sm-toast ${toast.type}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.message}
          </div>
        )}
      </div>
    </>
  );
};

export default Student;