// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import AppRouter from "@/routes"; // Đường dẫn đến file routes/index.jsx tổng

import { Toaster } from "@/components/ui/sonner";
// eslint-disable-next-line no-unused-vars
import { business } from "./data/businessData";
// eslint-disable-next-line no-unused-vars
import { student } from "./data/studentData";
/**
 * File App.jsx hoàn chỉnh
 * 1. Bọc ứng dụng trong BrowserRouter để quản lý điều hướng.
 * 2. Cung cấp Toaster toàn cục cho các thông báo (sonner).
 * 3. Sử dụng useEffect để giả lập dữ liệu đăng nhập cho mục đích kiểm thử.
 */
function App() {
  // eslint-disable-next-line no-unused-vars
  const setAuth = useAuthStore((state) => state.setAuth);

  // ==========================================================
  // GIẢ LẬP ĐĂNG NHẬP (MOCK AUTH)
  // Bạn hãy thay đổi giá trị 'role' để kiểm tra các giao diện khác nhau:
  // 'student', 'lecturer', 'faculty', 'admin', 'company'
  // ==========================================================
  useEffect(() => {
    setAuth(
      {
        name: student.hoTen,
      },
      "dummy-access-token",
      "lecturer" // Đang để vai trò VPK theo yêu cầu của bạn
    );
  }, [setAuth]);

  return (
    <BrowserRouter>
      {/* Thành phần thông báo Sonner: 
        - richColors: Hiển thị màu sắc theo loại (Success, Error,...)
        - position: Vị trí xuất hiện trên màn hình
      */}
      <Toaster position="bottom-right" richColors closeButton />

      {/* AppRouter: Chứa toàn bộ logic định tuyến lồng nhau (Nested Routes), 
        phân quyền (ProtectedRoute) và bộ khung giao diện (AppLayout).
      */}
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
