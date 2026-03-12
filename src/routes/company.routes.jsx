import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const CompanyDashboard = lazy(() => import("@/pages/businesses/HomePageBusiness"));
const CompanyProfile = lazy(() => import("@/pages/businesses/ProfilePageBusiness"));
const CompanyConfirmIntern = lazy(() => import("@/pages/businesses/ConfirmIntern"));
const CompanyManageInterns = lazy(() => import("@/pages/businesses/ManageInterns"));

export const companyRoutes = [
  // Tự động vào dashboard khi truy cập /company
  { index: true, element: <Navigate to="dashboard" replace /> },
  
  // Dashboard / Trang chủ
  { path: "dashboard", element: <CompanyDashboard /> },
  
  // Thông tin doanh nghiệp
  { path: "profile", element: <CompanyProfile /> },
  
  // Xác nhận thực tập
  { path: "confirm-intern", element: <CompanyConfirmIntern /> },
  
  // Quản lý thực tập
  { path: "manage-interns", element: <CompanyManageInterns /> },
];