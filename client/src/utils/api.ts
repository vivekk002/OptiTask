import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust if backend port is different
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
