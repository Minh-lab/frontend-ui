import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ManageAccounts = lazy(() => import("@/pages/admin/ManageAccounts"));
const AddAccount = lazy(() => import("@/pages/admin/AddAccount"));
const DetailAccount = lazy(() => import("@/pages/admin/DetailAccount"));
const AdminProfile = lazy(() => import("@/pages/admin/Profile"));


export const adminRoutes = [
  // Tự động chuyển hướng vào dashboard khi truy cập /admin
  { index: true, element: <Navigate to="dashboard" replace /> },
  
  { path: "dashboard", element: <AdminDashboard /> },
  
  // Quản lý tài khoản
  { path: "accounts", element: <ManageAccounts /> },
  { path: "add-account", element: <AddAccount /> },
  { path: "detail-account/:id", element: <DetailAccount /> },
  
  // Thông tin cá nhân & Bảo mật (Khớp với đường dẫn /admin/profile)
  { path: "profile", element: <AdminProfile /> },
];