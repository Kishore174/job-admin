import axiosInstance from "../Api/config";

// 🔹 Admin Login
export const adminLogin = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};


// 🔹 Create Landing Job
export const createLandingJob = async (jobData) => {
  try {
    const response = await axiosInstance.post("/landing-jobs", jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create job" };
  }
};


// 🔹 Get All Landing Jobs
export const getLandingJobs = async () => {
  try {
    const response = await axiosInstance.get("/landing-jobs");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch jobs" };
  }
};
 // UPDATE
export const updateLandingJob = async (id, data) => {
  const res = await axiosInstance.put(`/landing-jobs/${id}`, data);
  return res.data;
};

// DELETE
export const deleteLandingJob = async (id) => {
  const res = await axiosInstance.delete(`/landing-jobs/${id}`);
  return res.data;
};
