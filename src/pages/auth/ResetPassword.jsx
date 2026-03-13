import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from "@/services/authService";
import logoTlu from "@/assets/logo-tlu.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Lấy email từ state đã truyền qua ở bước 1
  const email = location.state?.email || "";
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Gọi API đặt lại mật khẩu
      await authService.resetPassword({
        email: email,
        otp: data.otp,
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      
      toast.success("Mật khẩu đã được đặt lại thành công!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 overflow-hidden">
          {/* 1. Header Blue Bar */}
          <header className="bg-[#3b4b8f] text-white py-3 z-30 shadow-md">
            <div className="container mx-auto px-6 flex items-center gap-4">
              <div className="bg-white p-1 rounded-full flex items-center justify-center w-14 h-14 shrink-0 shadow-sm">
                <img src={logoTlu} alt="TLU Logo" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold uppercase leading-tight tracking-tight">Trường Đại học Thủy Lợi</h1>
                <p className="text-[11px] opacity-90 font-medium uppercase tracking-[0.15em]">Thuyloi University</p>
              </div>
            </div>
          </header>
    
          {/* 2. Sub-header Title Bar */}
          <div className="bg-[#4e5ba6] py-2.5 z-20 shadow-sm">
            <div className="container mx-auto px-6 flex justify-start">
              <h2 className="text-white text-base md:text-lg font-semibold uppercase tracking-wider">
                Hệ thống quản lý đồ án & thực tập
              </h2>
            </div>
          </div>
    
          {/* Main Content: Căn giữa Form hoàn toàn */}
          <main className="flex-1 flex items-center justify-center p-6">
        
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8 z-20">
          <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-800 mb-6">Tạo mật khẩu mới</h3>
            <p className="text-xs text-slate-500 mb-6 italic">* Mật khẩu tối thiểu 8 ký tự, 1 chữ hoa và 1 chữ số</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600">Mã xác nhận</Label>
                <Input {...register("otp", { required: "Vui lòng nhập mã OTP" })} placeholder="Nhập mã xác nhận" className="rounded-xl h-10 bg-slate-50" />
                {errors.otp && <p className="text-red-500 text-[10px]">{errors.otp.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600">New Password</Label>
                <Input {...register("password", { required: "Vui lòng nhập mật khẩu mới" })} type="password" placeholder="Nhập mật khẩu mới" className="rounded-xl h-10 bg-slate-50" />
                {errors.password && <p className="text-red-500 text-[10px]">{errors.password.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600">Mã xác nhận</Label>
                <Input {...register("password_confirmation", { 
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: (value) => value === password || "Mật khẩu xác nhận không khớp"
                })} type="password" placeholder="Nhập lại mật khẩu" className="rounded-xl h-10 bg-slate-50" />
                {errors.password_confirmation && <p className="text-red-500 text-[10px]">{errors.password_confirmation.message}</p>}
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button disabled={loading} className="w-full h-11 bg-[#6155F5] hover:bg-[#5247E0] text-white font-bold rounded-xl shadow-lg">
                  {loading ? <Loader2 className="animate-spin" /> : "Xác nhận"}
                </Button>
                <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs text-indigo-600 font-bold hover:underline">Gửi lại mã xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}