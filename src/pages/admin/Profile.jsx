import React from "react";
import { 
  User, Mail, Fingerprint, Calendar, 
  Users, ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Dữ liệu hiển thị (ưu tiên dữ liệu từ store, nếu không có thì dùng mặc định)
  const profileData = {
    usercode: user?.usercode || "N/A",
    full_name: user?.displayName || "Chưa cập nhật",
    email: user?.email || "Chưa cập nhật",
    gender: user?.gender || "Nam",
    dob: user?.dob || "01/01/1990",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header điều hướng */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="rounded-full size-9"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h1>
      </div>

      {/* Card nội dung chính */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <User className="size-5" />
          </div>
          <h3 className="font-bold text-slate-700">Chi tiết tài khoản</h3>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Mã nhân viên */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Fingerprint className="size-3.5" /> Mã số định danh
              </label>
              <p className="text-lg font-bold text-blue-600 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100 border-dashed inline-block min-w-[150px]">
                {profileData.usercode}
              </p>
            </div>

            {/* Họ và tên */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="size-3.5" /> Họ và tên
              </label>
              <p className="text-base font-semibold text-slate-700 pb-2 border-b border-slate-100">
                {profileData.full_name}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="size-3.5" /> Địa chỉ Email
              </label>
              <p className="text-base font-semibold text-slate-700 pb-2 border-b border-slate-100">
                {profileData.email}
              </p>
            </div>

            {/* Giới tính */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="size-3.5" /> Giới tính
              </label>
              <p className="text-base font-semibold text-slate-700 pb-2 border-b border-slate-100">
                {profileData.gender}
              </p>
            </div>

            {/* Ngày sinh */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="size-3.5" /> Ngày sinh
              </label>
              <p className="text-base font-semibold text-slate-700 pb-2 border-b border-slate-100">
                {profileData.dob}
              </p>
            </div>

          </div>
        </div>

        {/* Footer ghi chú
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center italic">
            Thông tin này được quản lý bởi hệ thống đào tạo. Nếu có sai sót, vui lòng liên hệ phòng quản trị.
          </p>
        </div> */}
      </div>
    </div>
  );
}