import React from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  ClipboardList, 
  Users,
  Users2,
  Clock,
  BookOpen
} from "lucide-react";

/**
 * Danh sách các chức năng chính của Văn phòng Khoa
 * Dựa trên cấu trúc ảnh mẫu và menu config
 */
const FACULTY_MODULES = [
  { 
    title: "Quản lý thực tập", 
    path: "/faculty/intern", 
    icon: <Briefcase className="size-20 text-white" />
  },
  { 
    title: "Quản lý đồ án", 
    path: "/faculty/projects", 
    icon: <ClipboardList className="size-20 text-white" />
  },
  { 
    title: "Quản lý giảng viên", 
    path: "/faculty/lecturers", 
    icon: <Users className="size-20 text-white" />
  },
  { 
    title: "Quản lý hội đồng", 
    path: "/faculty/council", 
    icon: <Users2 className="size-20 text-white" />
  },
  { 
    title: "Quản lý kế hoạch", 
    path: "/faculty/plans", 
    icon: <Clock className="size-20 text-white" />
  },
  { 
    title: "Quản lý đề tài", 
    path: "/faculty/topics", 
    icon: <BookOpen className="size-20 text-white" />
  },
];

export default function FacultyDashboard() {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tiêu đề trang */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">
          Bảng điều khiển Văn phòng Khoa
        </h1>
        <p className="text-slate-500 text-sm italic">
          Chào mừng bạn quay lại hệ thống quản lý Đồ án & Thực tập khoa CNTT.
        </p>
      </div>

      {/* Grid danh sách chức năng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {FACULTY_MODULES.map((module, index) => (
          <Link 
            key={index}
            to={module.path}
            className="group flex flex-col items-center justify-between p-8 h-60 rounded-3xl bg-indigo-700 shadow-lg shadow-slate-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:bg-indigo-600 relative overflow-hidden"
          >
            {/* Vùng Icon (Trung tâm phía trên) */}
            <div className="mt-3 transition-transform duration-300 group-hover:scale-125">
              {module.icon}
            </div>

            {/* Vùng Label (Dạng Pill trắng ở dưới cùng) */}
            <div className="w-full bg-white/95 backdrop-blur-sm rounded-full py-3 px-6 shadow-md transition-all group-hover:bg-white group-hover:shadow-lg">
              <span className="block text-center text-slate-700 font-bold text-sm uppercase tracking-widest">
                {module.title}
              </span>
            </div>

            {/* Hiệu ứng trang trí nhẹ */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-white/20" />
          </Link>
        ))}
      </div>

    </div>
  );
}