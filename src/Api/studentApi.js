import axiosInstance from "./config";

/**
 * Create Student (Admin Only)
 */
export const createStudent = async (data) => {
  try {
    const response = await axiosInstance.post("/student/create", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

/**
 * Get All Students (Admin Only)
 */
export const getStudents = async () => {
  try {
    const response = await axiosInstance.get("/student");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch students" };
  }
};
export const updateStudent = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/student/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Update failed" };
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axiosInstance.delete(`/student/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete student" };
  }
};
