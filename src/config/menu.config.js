import { 
  Home, FileText, UserPlus, Users, Briefcase, 
  CheckSquare, ClipboardList, GraduationCap, 
  UserCheck, Layers, Calendar
} from "lucide-react";

export const MASTER_MENU = [
  // --- CHUNG ---
  { 
    title: "Trang chủ", 
    path: "/", // Bạn có thể sửa path linh hoạt theo logic router
    icon: Home, 
    roles: ["student", "lecturer", "company", "faculty", "admin"] 
  },

  // --- SINH VIÊN ---
  { label: "ĐỒ ÁN TỐT NGHIỆP", roles: ["student"] },
  { title: "Đăng ký đề tài", path: "/student/register-topic", icon: GraduationCap, roles: ["student"] },
  { title: "Đăng ký GVHD đồ án", path: "/student/register-lecturer", icon: UserCheck, roles: ["student"] },
  { title: "Báo cáo đồ án", path: "/student/project-reports", icon: ClipboardList, roles: ["student"] },
  
  { label: "THỰC TẬP DOANH NGHIỆP", roles: ["student"] },
  { title: "Đăng ký doanh nghiệp", path: "/student/register-company", icon: Briefcase, roles: ["student"] },
  { title: "Báo cáo thực tập", path: "/student/intern-reports", icon: FileText, roles: ["student"] },

  // --- DOANH NGHIỆP ---
  { title: "Xác nhận thực tập", path: "/company/confirm-intern", icon: UserCheck, roles: ["company"] },
  { title: "Quản lý thực tập", path: "/company/manage-interns", icon: Briefcase, roles: ["company"] },

  // --- QUẢN TRỊ VIÊN ---
  { label: "QUẢN LÝ TÀI KHOẢN", roles: ["admin"] },
  { title: "Thêm tài khoản", path: "/admin/add-account", icon: UserPlus, roles: ["admin"] },
  { title: "Danh sách tài khoản", path: "/admin/accounts", icon: Users, roles: ["admin"] },

  // --- VĂN PHÒNG KHOA ---
  { title: "Quản lý thực tập", path: "/faculty/internships", icon: Briefcase, roles: ["faculty"] },
  { title: "Quản lý đồ án", path: "/faculty/capstones", icon: GraduationCap, roles: ["faculty"] },
  { title: "Quản lý giảng viên", path: "/faculty/lecturers", icon: UserCheck, roles: ["faculty"] },
  { title: "Quản lý hội đồng", path: "/faculty/council", icon: Users, roles: ["faculty"] },
  { title: "Quản lý kế hoạch", path: "/faculty/plans", icon: Calendar, roles: ["faculty"] },
  { title: "Quản lý đề tài", path: "/faculty/topics", icon: Layers, roles: ["faculty"] },

  // --- GIẢNG VIÊN ---
  { title: "Quản lý đề tài", path: "/lecturer/topics", icon: Layers, roles: ["lecturer"] },
  
  { label: "HƯỚNG DẪN THỰC TẬP", roles: ["lecturer"] },
  { title: "Quản lý báo cáo thực tập", path: "/lecturer/intern-reports", icon: FileText, roles: ["lecturer"] },
  { title: "Chấm điểm thực tập", path: "/lecturer/intern-grade", icon: CheckSquare, roles: ["lecturer"] },
  
  { label: "HƯỚNG DẪN ĐỒ ÁN", roles: ["lecturer"] },
  { title: "Xác nhận HDĐA", path: "/lecturer/confirm-project", icon: UserCheck, roles: ["lecturer"] },
  { title: "Phê duyệt đề tài", path: "/lecturer/approve-topic", icon: GraduationCap, roles: ["lecturer"] },
  { title: "Quản lý báo cáo đồ án", path: "/lecturer/project-reports", icon: ClipboardList, roles: ["lecturer"] },
  { title: "Chấm điểm đồ án", path: "/lecturer/project-grade", icon: CheckSquare, roles: ["lecturer"] },
  
  { label: "PHẢN BIỆN ĐỒ ÁN", roles: ["lecturer"] },
  { title: "Chấm điểm phản biện", path: "/lecturer/review-grade", icon: CheckSquare, roles: ["lecturer"] },
];