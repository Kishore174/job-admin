  import { useEffect, useMemo, useState } from "react";
  import { axiosInstance } from "../../Api/config";
  import Loader from "../Loader";
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";
  import { TablePagination } from "@mui/material";

  const ACTION_COLORS = {
    LOGIN: "bg-blue-100 text-blue-700",
    CREATE: "bg-green-100 text-green-700",
    UPDATE: "bg-yellow-100 text-yellow-700",
    DELETE: "bg-red-100 text-red-700",
    APPROVE: "bg-emerald-100 text-emerald-700",
    REJECT: "bg-rose-100 text-rose-700",
    EXPORT: "bg-purple-100 text-purple-700",
    CHECK_AADHAAR: "bg-indigo-100 text-indigo-700",
    SCAN_AADHAAR: "bg-cyan-100 text-cyan-700",
  };
 const ROLE_LABELS = {
  admin: "Admin",
  branchUser: "Center",
};

  const Log = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [action, setAction] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const stats = useMemo(() => {
    const today = new Date().toDateString();

    const todayLogs = logs.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    );

    const uniqueUsers = new Set(logs.map((l) => l.username));

    const actionCount = {};
    logs.forEach((l) => {
      actionCount[l.action] = (actionCount[l.action] || 0) + 1;
    });

    return {
      total: logs.length,
      today: todayLogs.length,
      users: uniqueUsers.size,
      loginCount: actionCount.LOGIN || 0,
      actionCount,
    };
  }, [logs]);

    useEffect(() => {
      fetchLogs();
    }, []);

    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get("/logs");
        setLogs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
  const handleExport = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export");
      return;
    }

    // Format data
    const exportData = filteredLogs.map((log) => {
      const d = new Date(log.createdAt);

      return {
        Username: log.username,
        Role: log.role,
        Action: log.action,
        Module: log.module,
        Date: d.toLocaleDateString("en-IN"),
        Time: d.toLocaleTimeString("en-IN"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ActivityLogs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `Activity_Logs_${new Date().getTime()}.xlsx`);
  };

 
    // ✅ FILTER LOGIC
    const filteredLogs = useMemo(() => {
      return logs.filter((log) => {
        const text = `${log.username} ${log.action} ${log.module}`.toLowerCase();
        if (search && !text.includes(search.toLowerCase())) return false;
        if (role && log.role !== role) return false;
        if (action && log.action !== action) return false;

        const logDate = new Date(log.createdAt);
        if (fromDate && logDate < new Date(fromDate)) return false;
        if (toDate && logDate > new Date(toDate + "T23:59:59")) return false;

        return true;
      });
    }, [logs, search, role, action, fromDate, toDate]);
  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredLogs.slice(start, end);
  }, [filteredLogs, page, rowsPerPage]);
    if (loading) return <Loader />;

    return (
      <div className="p-5">
      
  {/* ================= LOG DASHBOARD ================= */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

    <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow">
      <p className="text-sm opacity-80">Total Activities</p>
      <p className="text-3xl font-bold">{stats.total}</p>
    </div>

    <div className="p-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow">
      <p className="text-sm opacity-80">Today</p>
      <p className="text-3xl font-bold">{stats.today}</p>
    </div>

    <div className="p-5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow">
      <p className="text-sm opacity-80">Active Users</p>
      <p className="text-3xl font-bold">{stats.users}</p>
    </div>

    <div className="p-5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow">
      <p className="text-sm opacity-80">Logins</p>
      <p className="text-3xl font-bold">{stats.loginCount}</p>
    </div>

  </div>

        {/* ================= FILTER BAR ================= */}
        <div className="  border border-gray-400 p-4 rounded-xl    mb-5 grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            placeholder="Search username / action / module"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
         <option value="branchUser">Center</option>

          </select>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Actions</option>
            {[...new Set(logs.map((l) => l.action))].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
            // placeholder="test"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <div className="flex justify-end mb-4">
    <button
      onClick={handleExport}
      className="px-5 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
    >
      Export Excel
    </button>
  </div>

        </div>

  {/* ================= TABLE ================= */}
  <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow bg-white">

    <table className="min-w-full text-sm">
      
      {/* HEADER */}
      <thead className="bg-gray-100">
        <tr>
          {[
            "S.No",
            "User",
            "Role",
            "Action",
            "Module",
            "Date",
            "Time",
          ].map((h) => (
            <th
              key={h}
              className="px-4 py-3 border-b text-left whitespace-nowrap font-semibold"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="divide-y">
        {paginated.length ? (
          paginated.map((log, index) => {
            const d = new Date(log.createdAt);

            return (
              <tr key={log._id} className="hover:bg-indigo-50 transition">

                {/* S.NO */}
                <td className="px-4 py-3 font-semibold">
                  {page * rowsPerPage + index + 1}
                </td>

                {/* USER */}
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {log.username?.charAt(0)?.toUpperCase()}
                  </div>
                  {log.username}
                </td>

                {/* ROLE */}
                <td className="px-4 py-3">
              <span className="px-2 py-1 rounded-full text-xs bg-gray-200">
  {ROLE_LABELS[log.role] || log.role}
</span>

                </td>

                {/* ACTION (UNCHANGED COLORS) */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ACTION_COLORS[log.action] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>

                {/* MODULE */}
                <td className="px-4 py-3">{log.module}</td>

                {/* DATE */}
                <td className="px-4 py-3">
                  {d.toLocaleDateString("en-IN")}
                </td>

                {/* TIME */}
                <td className="px-4 py-3">
                  {d.toLocaleTimeString("en-IN")}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={7}
              className="py-10 text-center text-gray-500"
            >
              No logs found
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* ================= PAGINATION ================= */}
    <div className="border-t">
      <TablePagination
        component="div"
        count={filteredLogs.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>

  </div>


        {/* FOOTER */}
        <p className="text-sm text-gray-500 mt-3">
          Showing {filteredLogs.length} of {logs.length} logs
        </p>
      </div>
    );
  };

  export default Log;
