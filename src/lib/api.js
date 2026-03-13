import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = "3|K6URNsK5s7vvy1pWKhMWktQUTxXPtXSmYAxuBLDb94fe7492";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;