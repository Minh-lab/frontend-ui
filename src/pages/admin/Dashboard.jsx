import React, { useEffect, useState } from "react";
import { 
  Users, UserPlus, GraduationCap, 
  Briefcase, ShieldCheck, Landmark, ArrowRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Giả lập hàm call API sử dụng Axios
// import axios from 'axios';

const fetchAdminStats = async () => {

  // Dữ liệu mô phỏng (Mock Data)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers: 1323,
        roles: {
          student: 1200,
          lecturer: 85,
          faculty: 10,
          company: 25,
          admin: 3
        }
      });
    }, 500);
  });
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center font-medium">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-2xl font-bold text-primary uppercase tracking-tight">
          Bảng điều khiển quản trị viên
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý toàn bộ hệ thống tài khoản và phân quyền người dùng.
        </p>
      </div>

    
      {/* Grid: Phím tắt chức năng chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Thêm Tài Khoản */}
        <div className="group p-6 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <UserPlus className="size-6" />
            </div>
            <Button 
              variant="submit" // Sử dụng variant đã cấu hình [cite: 160]
              onClick={() => navigate("/admin/add-account")}
            >
              Thêm mới <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <h3 className="text-lg font-bold mt-4">Thêm tài khoản mới</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Cấp quyền truy cập cho Sinh viên, Giảng viên hoặc các đối tác doanh nghiệp vào hệ thống.
          </p>
        </div>

        {/* Card Danh sách Tài Khoản */}
        <div className="group p-6 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
              <Users className="size-6" />
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/accounts")}
            >
              Xem danh sách <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <h3 className="text-lg font-bold mt-4">Quản lý danh sách</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Xem, sửa đổi thông tin hoặc khóa tài khoản của {stats.totalUsers} người dùng hiện có.
          </p>
        </div>
      </div>
    </div>
  );
}

/** * Helper Component: Thẻ thống kê
 */
function StatCard({ title, count, icon, color, bgColor }) {
  // Gán 'icon' vào một biến viết hoa 'Icon' để dùng làm Component
  const Icon = icon; 

  return (
    <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
      {/* Bây giờ Linter sẽ thấy biến 'icon' được dùng ở dòng gán trên,
         và React sẽ thấy 'Icon' là một Component hợp lệ.
      */}
      <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
        {Icon && <Icon className="size-5" />} 
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-800">{count.toLocaleString()}</p>
      </div>
    </div>
  );
}