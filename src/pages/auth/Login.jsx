import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import authService from "@/services/authService";
import useAuthStore from "@/stores/useAuthStore";

// Chỉ giữ lại logo
import logoTlu from "@/assets/logo-tlu.png";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password
      });

      if (response.success) {
        const { token, user, role } = response.data;
        setAuth(user, token, role);
        toast.success(response.message || "Đăng nhập thành công!");
        
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Tài khoản hoặc mật khẩu không chính xác");
    } finally {
      setIsSubmitting(false);
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
        <div className="w-full max-w-[440px] bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight text-center">Chào mừng trở lại!</h3>
            <p className="text-slate-500 text-sm font-medium text-center">Vui lòng nhập Email và mật khẩu để đăng nhập!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold text-sm ml-1">Email</Label>
              <Input 
                {...register("email", { required: "Email là bắt buộc" })}
                type="email" 
                placeholder="Nhập email"
                className="rounded-xl h-12 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 transition-all"
              />
              {errors.email && <p className="text-red-500 text-[11px] ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <Label className="text-slate-700 font-bold text-sm">Mật khẩu</Label>
                <Link to="/forgot-password" size="sm" className="text-[11px] text-blue-600 font-bold hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input 
                {...register("password", { required: "Mật khẩu là bắt buộc" })}
                type="password" 
                placeholder="••••••••"
                className="rounded-xl h-12 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 transition-all"
              />
              {errors.password && <p className="text-red-500 text-[11px] ml-1">{errors.password.message}</p>}
            </div>

        

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 bg-[#6155F5] hover:bg-[#5247E0] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}