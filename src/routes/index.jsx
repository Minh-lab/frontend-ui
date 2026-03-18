import React, { lazy, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Layouts & Guards
import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import useAuthStore from "@/stores/useAuthStore";

// Module Routes
import { studentRoutes } from "./student.routes";
import { lecturerRoutes } from "./lecturer.routes";
import { adminRoutes } from "./admin.routes";
import { facultyRoutes } from "./faculty.routes";
import { companyRoutes } from "./company.routes";

// Pages - Tối ưu bằng Lazy Loading
const LoginPage = lazy(() => import("@/pages/auth/Login"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPassword")); // Bước 1 & 2: Email & OTP
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPassword"));   // Bước 3: Mật khẩu mới
const UnauthorizedPage = lazy(() => import("@/pages/errors/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage"));

/**
 * Điều hướng thông minh dựa trên Role
 * Đẩy người dùng vào đúng Dashboard khi truy cập "/"
 */
const RoleRedirect = () => {
  const role = useAuthStore((state) => state.role);
  if (!role) return <Navigate to="/login" replace />;
  return <Navigate to={`/${role}/dashboard`} replace />;
};

export default function AppRouter() {
  const routes = useRoutes([
    // --- CÁC ROUTE CÔNG KHAI (PUBLIC) ---
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/forgot-password", // Giao diện đặt lại mật khẩu (Bước 1 & 2)
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password", // Giao diện tạo mật khẩu mới (Bước 3)
      element: <ResetPasswordPage />,
    },

    // --- CÁC ROUTE BẢO VỆ (PROTECTED) ---
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />, // Khung giao diện chung Header/Sidebar
          children: [
            { index: true, element: <RoleRedirect /> },

            // MODULE SINH VIÊN
            {
              path: "student",
              element: <ProtectedRoute allowedRoles={["student"]} />,
              children: studentRoutes,
            },

            // MODULE VĂN PHÒNG KHOA
            // // --- MODULE GIẢNG VIÊN ---
            {
              path: "lecturer",
              element: <ProtectedRoute allowedRoles={["lecturer"]} />,
              children: lecturerRoutes,
            },

            // --- MODULE VĂN PHÒNG KHOA ---
            {
              path: "faculty_staff",
              element: <ProtectedRoute allowedRoles={["faculty_staff"]} />,
              children: facultyRoutes,
            },

            // MODULE DOANH NGHIỆP
            {
              path: "company",
              element: <ProtectedRoute allowedRoles={["company"]} />,
              children: companyRoutes,
            },

            // MODULE ADMIN
            {
              path: "admin",
              element: <ProtectedRoute allowedRoles={["admin"]} />,
              children: adminRoutes,
            },
          ],
        },
      ],
    },

    // Trang lỗi
    { path: "/unauthorized", element: <UnauthorizedPage /> },
    { path: "*", element: <NotFoundPage /> },
  ]);

  // Kích hoạt Suspense để hiển thị trạng thái chờ khi tải các trang Lazy
  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 font-sans">
          <div className="size-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <div className="text-center">
            <p className="font-bold text-indigo-900 text-lg uppercase tracking-tight">
              Trường Đại học Thủy Lợi
            </p>
            <p className="text-sm text-slate-500 font-medium italic">
              Đang tải hệ thống quản lý đồ án và thực tập...
            </p>
          </div>
        </div>
      }
    >
      {routes}
    </Suspense>
  );
}