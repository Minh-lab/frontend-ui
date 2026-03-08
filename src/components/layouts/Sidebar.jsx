import { NavLink } from "react-router-dom";
import { 
  Home, FileText, UserPlus, Users, Briefcase, 
  CheckSquare, ClipboardList, GraduationCap, Settings, 
  UserCheck, Layers, Calendar
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const menuConfig = {
  // Đồng bộ tiền tố /student
  student: [
    { title: "Trang chủ", path: "/student/dashboard", icon: Home },
    { label: "ĐỒ ÁN TỐT NGHIỆP" },
    { title: "Đăng ký đề tài", path: "/student/register-topic", icon: GraduationCap },
    { title: "Đăng ký GVHD đồ án", path: "/student/register-lecturer", icon: UserCheck },
    { title: "Báo cáo đồ án", path: "/student/project-reports", icon: ClipboardList },
    { label: "THỰC TẬP DOANH NGHIỆP" },
    { title: "Đăng ký doanh nghiệp", path: "/student/register-company", icon: Briefcase },
    { title: "Báo cáo thực tập", path: "/student/intern-reports", icon: FileText },
  ],
  // Đồng bộ tiền tố /company
  company: [
    { title: "Trang chủ", path: "/company/dashboard", icon: Home },
    { title: "Xác nhận thực tập", path: "/company/confirm-intern", icon: UserCheck },
    { title: "Quản lý thực tập", path: "/company/manage-interns", icon: Briefcase },
  ],
  // Đồng bộ tiền tố /admin
  admin: [
    { title: "Trang chủ", path: "/admin/dashboard", icon: Home },
    { label: "QUẢN LÝ TÀI KHOẢN" },
    { title: "Thêm tài khoản", path: "/admin/add-account", icon: UserPlus },
    { title: "Danh sách tài khoản", path: "/admin/accounts", icon: Users },
  ],
  // Giữ nguyên tiền tố /faculty (đã chuẩn)
  faculty: [
    { title: "Trang chủ", path: "/faculty/dashboard", icon: Home },
    { title: "Quản lý thực tập", path: "/faculty/intern", icon: Briefcase },
    { title: "Quản lý đồ án", path: "/faculty/projects", icon: GraduationCap },
    { title: "Quản lý giảng viên", path: "/faculty/lecturers", icon: UserCheck },
    { title: "Quản lý hội đồng", path: "/faculty/council", icon: Users },
    { title: "Quản lý kế hoạch", path: "/faculty/plans", icon: Calendar },
    { title: "Quản lý đề tài", path: "/faculty/topics", icon: Layers },
  ],
  // Giữ nguyên tiền tố /lecturer (đã chuẩn)
  lecturer: [
    { title: "Trang chủ", path: "/lecturer/dashboard", icon: Home },
    { title: "Quản lý đề tài", path: "/lecturer/topics", icon: Layers },
    { label: "HƯỚNG DẪN THỰC TẬP" },
    { title: "Quản lý báo cáo thực tập", path: "/lecturer/intern-reports", icon: FileText },
    { title: "Chấm điểm thực tập", path: "/lecturer/intern-grade", icon: CheckSquare },
    { label: "HƯỚNG DẪN ĐỒ ÁN" },
    { title: "Xác nhận HDĐA", path: "/lecturer/confirm-project", icon: UserCheck },
    { title: "Phê duyệt đề tài", path: "/lecturer/approve-topic", icon: GraduationCap },
    { title: "Quản lý báo cáo đồ án", path: "/lecturer/project-reports", icon: ClipboardList },
    { title: "Chấm điểm đồ án", path: "/lecturer/project-grade", icon: CheckSquare },
    { label: "PHẢN BIỆN ĐỒ ÁN" },
    { title: "Chấm điểm phản biện", path: "/lecturer/review-grade", icon: CheckSquare },
  ]
};

export function Sidebar() {
  // Sửa lỗi "đỏ role" bằng cách dùng Selector của Zustand
  const role = useAuthStore((state) => state.role);
  const currentMenu = menuConfig[role] || [];

  return (
    <nav className="flex flex-col h-full bg-white py-4 overflow-y-auto custom-scrollbar border-r">
      <div className="px-4 space-y-1">
        {currentMenu.map((item, index) => {
          if (item.label) {
            return (
              <p key={index} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2 px-2">
                {item.label}
              </p>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-primary shadow-sm font-bold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              )}
            >
              <Icon className={cn(
                "size-5 shrink-0",
                "group-hover:text-primary transition-colors"
              )} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}