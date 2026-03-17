import React from "react";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();


  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto p-6">
      {/* Tiêu đề trang */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
          Bảng điều khiển quản trị viên
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý toàn bộ hệ thống tài khoản và phân quyền người dùng.
        </p>
      </div>

      {/* Grid: Layout giống trong ảnh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center md:justify-items-start">
        
        {/* Card Thêm Tài Khoản */}
        <div 
          onClick={() => navigate("/admin/add-account")}
          className="w-72 h-44 bg-[#6272d6] rounded-[30px] shadow-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300 group"
        >
          {/* Icon Trắng */}
          <div className="text-white">
            <UserPlus className="size-14 stroke-[1.5]" />
          </div>
          
          {/* Nút giả bên trong card */}
          <div className="w-56 py-2 bg-[#e8eaf6] rounded-full text-center font-bold text-slate-600 shadow-inner group-hover:bg-white transition-colors">
            Thêm tài khoản
          </div>
        </div>

        {/* Card Danh sách Tài Khoản */}
        <div 
          onClick={() => navigate("/admin/accounts")}
          className="w-72 h-44 bg-[#6272d6] rounded-[30px] shadow-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300 group"
        >
          {/* Icon Trắng */}
          <div className="text-white">
            <Users className="size-14 stroke-[1.5]" />
          </div>
          
          {/* Nút giả bên trong card */}
          <div className="w-56 py-2 bg-[#e8eaf6] rounded-full text-center font-bold text-slate-600 shadow-inner group-hover:bg-white transition-colors">
            Danh sách tài khoản
          </div>
        </div>

      </div>
    </div>
  );
}