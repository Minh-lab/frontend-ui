import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const StudentDashboard = lazy(() => import("@/pages/student/HomePageStudent"));
const RegisterTopic = lazy(() => import("@/pages/student/RegisterTopic/index"));
const RegisterLecturer = lazy(() => import("@/pages/student/RegisterLecturer"));
const ProjectReports = lazy(() => import("@/pages/student/ProjectReports"));
const RegisterCompany = lazy(() => import("@/pages/student/RegisterCompany"));
const InternReports = lazy(() => import("@/pages/student/InternReports"));
const ProfileStudent = lazy(() => import("@/pages/student/ProfileStudent"));
export const studentRoutes = [
  // Tự động vào dashboard khi truy cập /faculty
  { index: true, element: <Navigate to="dashboard" replace /> }, 
  { path: "dashboard", element: <StudentDashboard /> },
  { path: "register-topic", element: <RegisterTopic /> },
  { path: "register-lecturer", element: <RegisterLecturer /> },
  { path: "project-reports", element: <ProjectReports /> },
  { path: "register-company", element: <RegisterCompany /> },
  { path: "intern-reports", element: <InternReports /> },
  { path: "profile", element: <ProfileStudent /> },
  // Các path này phải khớp chính xác với path trong menu.config.js
];