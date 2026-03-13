import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Sử dụng lazy loading để tối ưu hiệu năng
const FacultyDashboard = lazy(() => import("@/pages/faculty/Dashboard"));
const ManageTopics = lazy(() => import("@/pages/faculty/Topic/ManageTopics"));
const AddTopic = lazy(() => import("@/pages/faculty/Topic/AddTopic"));
const EditTopic = lazy(() => import("@/pages/faculty/Topic/EditTopic"));
const ViewTopic = lazy(() => import("@/pages/faculty/Topic/ViewTopic"));
const ManagePlans = lazy(() => import("@/pages/faculty/Plan/ManagePlans"));
const AddPlan = lazy(() => import("@/pages/faculty/Plan/AddPlan"));
const ViewPlan = lazy(() => import("@/pages/faculty/Plan/ViewPlan"));
const AddMileStone = lazy(() => import("@/pages/faculty/Plan/AddMilestone"));
const EditMileStone = lazy(() => import("@/pages/faculty/Plan/EditMilestone"));
const ViewMileStone = lazy(() => import("@/pages/faculty/Plan/ViewMilestone"));
const ManageLecturers = lazy(() => import("@/pages/faculty/Lecturer/ManageLecturers"));
const ViewLecturer = lazy(() => import("@/pages/faculty/Lecturer/ViewLecturer"));
const ManageInternships = lazy(() => import("@/pages/faculty/Internship/ManageInternships"));
const ApproveCompanyList = lazy(() => import("@/pages/faculty/Internship/ApproveCompanyList"));
const ApproveCompanyDetail = lazy(() => import("@/pages/faculty/Internship/ApproveCompanyDetail"));
const InternshipStatistics = lazy(() => import("@/pages/faculty/Internship/InternshipStatistics"));
const Profile = lazy(() => import("@/pages/faculty/Profile"));
const ManageCapstones = lazy(() => import("@/pages/faculty/Capstone/ManageCapstones"));
const CapstoneStatistics = lazy(() => import("@/pages/faculty/Capstone/CapstoneStatistics"));
const ManageCouncils = lazy(() => import("@/pages/faculty/council/ManageCouncils"));
const UpdateCouncil = lazy(() => import("@/pages/faculty/council/UpdateCouncil"));
const CouncilDetail = lazy(() => import("@/pages/faculty/council/CouncilDetail"));
const GradeCouncil = lazy(() => import("@/pages/faculty/council/GradeCouncil"));

export const facultyRoutes = [
  // Tự động vào dashboard khi truy cập /faculty_staff
  { index: true, element: <Navigate to="dashboard" replace /> }, 
  { path: "dashboard", element: <FacultyDashboard /> },
  { path: "profile", element: <Profile /> },


  { path: "topics", element: <ManageTopics /> },
  { path: "topics/add", element: <AddTopic /> },
  { path: "topics/edit/:id", element: <EditTopic /> },
  { path: "topics/view/:id", element: <ViewTopic /> },

  { path: "plans", element: <ManagePlans /> },
  { path: "plans/add", element: <AddPlan /> },
  { path: "plans/view/:id", element: <ViewPlan /> },

  { path: "plans/:id/milestone/add", element: <AddMileStone /> },
  { path: "milestone/edit/:id", element: <EditMileStone /> },
  { path: "milestone/view/:id", element: <ViewMileStone /> }, 
  
  { path: "lecturers", element: <ManageLecturers /> },
  { path: "lecturers/view/:id", element: <ViewLecturer /> },

  { path: "internships", element: <ManageInternships /> },
  { path: "internships/approve-company", element: <ApproveCompanyList /> },
  { path: "internships/approve-company/detail/:id", element: <ApproveCompanyDetail /> },
  { path: "internships/statistics", element: <InternshipStatistics /> },

  { path: "capstones", element: <ManageCapstones /> },
  { path: "capstones/statistics", element: <CapstoneStatistics /> },

  { path: "councils", element: <ManageCouncils /> },
  { path: "councils/create", element: <UpdateCouncil /> },
  { path: "councils/edit/:id", element: <UpdateCouncil /> },
  { path: "councils/detail/:id", element: <CouncilDetail /> },
  { path: "councils/grade/:id", element: <GradeCouncil /> },




  
];