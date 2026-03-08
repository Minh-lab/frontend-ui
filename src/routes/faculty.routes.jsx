import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const FacultyDashboard = lazy(() => import("@/pages/faculty/Dashboard"));
// const ManageIntern = lazy(() => import("@/pages/faculty/ManageIntern"));
// const ManageProjects = lazy(() => import("@/pages/faculty/ManageProjects"));
// const ManageLecturers = lazy(() => import("@/pages/faculty/ManageLecturers"));

export const facultyRoutes = [
  // Tự động vào dashboard khi truy cập /faculty
  { index: true, element: <Navigate to="dashboard" replace /> }, 
  { path: "dashboard", element: <FacultyDashboard /> },
//   { path: "intern", element: <ManageIntern /> },
//   { path: "projects", element: <ManageProjects /> },
//   { path: "lecturers", element: <ManageLecturers /> },
  // Các path này phải khớp chính xác với path trong menu.config.js
];