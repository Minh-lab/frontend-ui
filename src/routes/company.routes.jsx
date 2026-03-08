import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const CompanyDashboard = lazy(() => import("@/pages/businesses/HomePageBusiness"));
const CompanyConfirmIntern = lazy(() => import("@/pages/businesses/XacNhanThucTap"));
const CompanyManagerIntern = lazy(() => import("@/pages/businesses/QuanLyThucTap"));
const CompanyProfile = lazy(() => import("@/pages/businesses/ProfilePageBusiness"))


export const companyRoutes = [
  // Tự động vào dashboard khi truy cập /faculty
  { index: true, element: <Navigate to="dashboard" replace /> }, 
  { path: "dashboard", element: <CompanyDashboard /> },
  { path: "confirm-intern", element: <CompanyConfirmIntern /> },
  { path: "manage-interns", element: <CompanyManagerIntern /> },
  { path: "profile", element: <CompanyProfile /> },
//   { path: "lecturers", element: <ManageLecturers /> },
  // Các path này phải khớp chính xác với path trong menu.config.js
];