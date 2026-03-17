import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const LecturerTopics = lazy(() => import("@/pages/lecturer/Topics/index"));
const LecturerInternReport = lazy(() => import("@/pages/lecturer/InternReports"));
const LecturerInternGrade = lazy(() => import("@/pages/lecturer/InterGrade"));
const LecturerProjectReport = lazy(() => import("@/pages/lecturer/ProjectReports"));
const LecturerProjectGrade = lazy(() => import("@/pages/lecturer/ProjectGrade"));
const LecturerProfile = lazy(() => import("@/pages/lecturer/Profile/index"));
const LecturerHomePage = lazy(() => import("@/pages/lecturer/homePage"));
const ConfirmProject = lazy(() => import("@/pages/lecturer/ConfirmProject"));
const ApproveTopic = lazy(() => import("@/pages/lecturer/ApproveTopic"));
const ReviewGrade = lazy(() => import("@/pages/lecturer/ReviewGrade"));


export const lecturerRoutes = [
  // Tự động vào dashboard khi truy cập /lecturer
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: "dashboard", element: <LecturerHomePage /> },
  { path: "topics", element: <LecturerTopics /> },
  { path: "intern-reports", element: <LecturerInternReport /> },
  { path: "intern-grade", element: <LecturerInternGrade /> },
  { path: "project-reports", element: <LecturerProjectReport /> },
  { path: "project-grade", element: <LecturerProjectGrade /> },
  { path: "confirm-project", element: <ConfirmProject /> },
  { path: "approve-topic", element: <ApproveTopic /> },
  { path: "review-grade", element: <ReviewGrade /> },
  { path: "profile", element: <LecturerProfile /> },
  //   { path: "lecturers", element: <ManageLecturers /> },
  // Các path này phải khớp chính xác với path trong menu.config.js
];
