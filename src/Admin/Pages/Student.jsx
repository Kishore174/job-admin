import React, { useEffect, useState } from "react";
import {
  createStudent,
  getStudents,
  deleteStudent,
} from "../../Api/studentApi";

const Student = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.students || []);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createStudent(form);
      alert(res.message);
      setForm({ username: "", email: "" });
      setIsOpen(false);
      fetchStudents();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Student Management
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Create Student
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Created</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-400">
                    No students available
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {student.username}
                    </td>

                    <td className="p-3 text-gray-600">
                      {student.email}
                    </td>

                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

            <h3 className="text-lg font-semibold mb-4">
              Create New Student
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {loading ? "Creating..." : "Create"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
