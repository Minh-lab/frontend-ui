import { NavLink } from "react-router-dom";
import { 
  Home, FileText, UserPlus, Users, Briefcase, 
  CheckSquare, ClipboardList, GraduationCap, Settings, 
  UserCheck, Layers, Calendar
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const menuConfig = {
  student: [
    { title: "Trang chủ", path: "/", icon: Home },
    { label: "ĐỒ ÁN TỐT NGHIỆP" },
    { title: "Đăng ký đề tài", path: "/register-topic", icon: GraduationCap },
    { title: "Đăng ký GVHD đồ án", path: "/register-lecturer", icon: UserCheck },
    { title: "Báo cáo đồ án", path: "/project-reports", icon: ClipboardList },
    { label: "THỰC TẬP DOANH NGHIỆP" },
    { title: "Đăng ký doanh nghiệp", path: "/register-company", icon: Briefcase },
    { title: "Báo cáo thực tập", path: "/intern-reports", icon: FileText },
  ],
  company: [
    { title: "Trang chủ", path: "/", icon: Home },
    { title: "Xác nhận thực tập", path: "/confirm-intern", icon: UserCheck },
    { title: "Quản lý thực tập", path: "/manage-interns", icon: Briefcase },
  ],
  admin: [
    { title: "Trang chủ", path: "/", icon: Home },
    { label: "QUẢN LÝ TÀI KHOẢN" },
    { title: "Thêm tài khoản", path: "/add-account", icon: UserPlus },
    { title: "Danh sách tài khoản", path: "/accounts", icon: Users },
  ],
  faculty: [
    { title: "Trang chủ", path: "/", icon: Home },
    { title: "Quản lý thực tập", path: "/faculty/intern", icon: Briefcase },
    { title: "Quản lý đồ án", path: "/faculty/projects", icon: GraduationCap },
    { title: "Quản lý giảng viên", path: "/faculty/lecturers", icon: UserCheck },
    { title: "Quản lý hội đồng", path: "/faculty/council", icon: Users },
    { title: "Quản lý kế hoạch", path: "/faculty/plans", icon: Calendar },
    { title: "Quản lý đề tài", path: "/faculty/topics", icon: Layers },
  ],
  lecturer: [
    { title: "Trang chủ", path: "/", icon: Home },
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
  const { role } = useAuthStore();
  const currentMenu = menuConfig[role] || [];

  return (
    <nav className="flex flex-col h-full bg-white py-4 overflow-y-auto custom-scrollbar">
      <div className="px-4 space-y-1">
        {currentMenu.map((item, index) => {
          // Nếu là nhãn tiêu đề nhóm (Label)
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
                  ? "bg-blue-50 text-primary shadow-sm" 
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