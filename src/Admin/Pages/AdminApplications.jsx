import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/config";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await axiosInstance.get("/application/admin/applications");
    setApplications(res.data.applications || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow border overflow-hidden">

        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Student Applications
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            All job applications submitted by students
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">

       <thead className="bg-gray-50 border-b">
  <tr className="text-gray-600 uppercase text-xs tracking-wider">
    <th className="px-6 py-4 text-left">Student</th>
    <th className="px-6 py-4 text-left">Email</th>
    <th className="px-6 py-4 text-left">Job</th>
    <th className="px-6 py-4 text-left">Experience</th>
    <th className="px-6 py-4 text-center">Resume</th>
    <th className="px-6 py-4 text-center">Status</th>
    <th className="px-6 py-4 text-left">Date</th>
  </tr>
</thead>


            <tbody className="divide-y">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {app.studentId?.username}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {app.studentId?.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {app.jobId?.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {app.experience}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#2BB5CE] text-white rounded-lg text-xs hover:bg-[#239db4]"
                    >
                      View
                    </a>
                  </td>
<td className="px-6 py-4 text-center">
  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
    Applied
  </span>
</td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminApplications;
