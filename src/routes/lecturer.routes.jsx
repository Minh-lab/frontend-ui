import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const LecturerTopics = lazy(() => import("@/pages/lecturer/topics"));
const LecturerInternReport = lazy(() => import("@/pages/lecturer/InternReports"));
const LecturerInternGrade = lazy(() => import("@/pages/lecturer/InterGrade"));
const LecturerProjectReport = lazy(() => import("@/pages/lecturer/ProjectReports"));
const LecturerProjectGrade = lazy(() => import("@/pages/lecturer/ProjectGrade"));
// const CompanyManagerIntern = lazy(() => import("@/pages/businesses/QuanLyThucTap"));
// const CompanyProfile = lazy(() => import("@/pages/businesses/ProfilePageBusiness"))


export const lecturerRoutes = [
  // Tự động vào dashboard khi truy cập /faculty
  { index: true, element: <Navigate to="topics" replace /> }, 
  // { path: "dashboard", element: <CompanyDashboard /> },
  { path: "topics", element: <LecturerTopics /> },
  { path: "intern-reports", element: <LecturerInternReport /> },
  { path: "intern-grade", element: <LecturerInternGrade /> },
  { path: "project-reports", element: <LecturerProjectReport /> },
  { path: "project-grade", element: <LecturerProjectGrade /> },
  // { path: "profile", element: <CompanyProfile /> },
//   { path: "lecturers", element: <ManageLecturers /> },
  // Các path này phải khớp chính xác với path trong menu.config.js
];
