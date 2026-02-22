import axios from "axios";

const API_BASE_URL = "https://affectionate-wearying-zayn.ngrok-free.dev/api";
// const API_BASE_URL = "https://your-backend-url.com/api";
// const API_BASE_URL = "https://job-api-wheat.vercel.app/api";
// const API_BASE_URL = "https://affectionate-wearying-zayn.ngrok-free.dev/api";

// const API_BASE_URL = "http://localhost:4000/api";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["ngrok-skip-browser-warning"] = "true";

  return config;
});

export default axiosInstance;