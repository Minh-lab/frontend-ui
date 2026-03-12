// import React, { lazy, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Layouts & Guards
import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import useAuthStore from "@/store/useAuthStore";
// import { lazy } from "react";
// Module Routes
import { studentRoutes } from "./student.routes";
// import { lecturerRoutes } from "./lecturer.routes";
import { adminRoutes } from "./admin.routes";
import { facultyRoutes } from "./faculty.routes";
import { companyRoutes } from "./company.routes";

// Pages (Sử dụng lazy để tối ưu dung lượng tải ban đầu)
// const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
// const UnauthorizedPage = lazy(() => import("@/pages/errors/UnauthorizedPage"));
// const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage"));


/**
 * Component điều hướng thông minh dựa trên Role
 * Giúp người dùng luôn vào đúng Dashboard của họ khi truy cập "/"
 */
const RoleRedirect = () => {
  const role = useAuthStore((state) => state.role);
  if (!role) return <Navigate to="/login" replace />;
  // Đẩy về đường dẫn dashboard đã định nghĩa trong Sidebar
  return <Navigate to={`/${role}/dashboard`} replace />;
};

export default function AppRouter() {
  const routes = useRoutes([
    // {
    //   path: "/login",
    //   element: <LoginPage />,
    // },
    {
      path: "/",
      // Lớp bảo vệ 1: Phải đăng nhập mới được vào AppLayout
      element: <ProtectedRoute />, 
      children: [
        {
          element: <AppLayout />, // Bộ khung Header/Footer/Sidebar
          children: [
            // Tự động điều hướng khi vào trang chủ "/"
            { index: true, element: <RoleRedirect /> },
            

            // // --- MODULE SINH VIÊN ---
            {
              path: "student",
              element: <ProtectedRoute allowedRoles={["student"]} />,
              children: studentRoutes,
            },

            // // --- MODULE GIẢNG VIÊN ---
            // {
            //   path: "lecturer",
            //   element: <ProtectedRoute allowedRoles={["lecturer"]} />,
            //   children: lecturerRoutes,
            // },

            // --- MODULE VĂN PHÒNG KHOA ---
            {
              path: "faculty",
              element: <ProtectedRoute allowedRoles={["faculty"]} />,
              children: facultyRoutes,
            },

            // --- MODULE DOANH NGHIỆP ---
            {
              path: "company",
              element: <ProtectedRoute allowedRoles={["company"]} />,
              children: companyRoutes,
            },

            // --- MODULE ADMIN ---
            {
              path: "admin",
              element: <ProtectedRoute allowedRoles={["admin"]} />,
              children: adminRoutes,
            },
          ],
        },
      ],
    },
    // // Trang thông báo khi truy cập trái phép
    // { path: "/unauthorized", element: <UnauthorizedPage /> },
    // // Trang 404
    // { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;

  // bỏ comment return dưới đây sau khi đã có các lazy login, unauthorized, notfound 
  // return (
  //   // Suspense hiển thị loading trong lúc các trang lazy đang được tải
  //   <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold text-primary">Đang tải hệ thống quản lý đồ án và thực tập khoa Công Nghệ Thông Tin trường đại học Thủy Lợi...</div>}>
  //     {routes}
  //   </Suspense>
  // );
}