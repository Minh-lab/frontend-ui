import axios from "axios";

// Khởi tạo instance axios với Base URL từ tài liệu
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động đính kèm Token vào Header cho các yêu cầu sau khi đăng nhập
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc auth-storage của zustand)
    const authData = JSON.parse(localStorage.getItem("auth-storage"));
    const token = authData?.state?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;