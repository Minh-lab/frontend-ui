import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from "@/services/authService";
import logoTlu from "@/assets/logo-tlu.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // step 1: Email, step 2: OTP
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  // XỬ LÝ BƯỚC 1: GỬI YÊU CẦU OTP
  const handleRequestOTP = async (data) => {
    setLoading(true);
    try {
      const res = await authService.requestOTP(data.email);
      setUserEmail(data.email);
      setStep(2); // Chuyển sang giao diện nhập OTP
      toast.success(res.message || "Mã OTP đã được gửi đến Email của bạn!");
    } catch (error) {
      toast.error(error.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // XỬ LÝ BƯỚC 2: XÁC THỰC MÃ OTP
  const handleVerifyOTP = async (data) => {
    setLoading(true);
    try {
      const res = await authService.verifyOTP({ 
        email: userEmail, 
        otp: data.otp 
      });

      if (res.success) {
        toast.success("Xác thực thành công!");
        // Chuyển sang trang đặt lại mật khẩu, truyền kèm email và otp để thực hiện reset ở bước cuối
        navigate("/reset-password", { state: { email: userEmail, otp: data.otp } });
      }
    } catch (error) {
      toast.error(error.message || "Mã OTP không chính xác hoặc đã hết hạn.");
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

      <main className="flex-1 flex items-center justify-center p-6">
    

        {/* Form xử lý chính */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8 z-20">
          <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 transition-all duration-500">
            
            {/* Nút quay lại bước 1 */}
            {step === 2 && (
              <button 
                onClick={() => setStep(1)} 
                className="mb-6 flex items-center text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase transition-colors"
              >
                <ArrowLeft className="size-4 mr-1" /> Quay lại nhập email
              </button>
            )}

            <div className="mb-10 text-left">
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {step === 1 ? "Đặt lại mật khẩu" : "Xác thực mã OTP"}
              </h3>
              <p className="text-slate-500 font-medium mt-2">
                {step === 1 
                  ? "Vui lòng nhập Email để nhận mã xác nhận!" 
                  : `Mã xác nhận đã được gửi đến ${userEmail}`}
              </p>
            </div>

            <form 
              onSubmit={handleSubmit(step === 1 ? handleRequestOTP : handleVerifyOTP)} 
              className="space-y-6"
            >
              {step === 1 ? (
                // FORM NHẬP EMAIL (BƯỚC 1)
                <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="size-4 text-indigo-500" />
                    <Label className="text-slate-600 font-bold uppercase text-[11px] tracking-wider">Email tài khoản:</Label>
                  </div>
                  <Input 
                    {...register("email", { 
                      required: "Vui lòng nhập Email",
                      pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
                    })}
                    type="email" 
                    placeholder="name@sv.tlu.edu.vn"
                    className="rounded-2xl h-14 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20 text-lg"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                </div>
              ) : (
                // FORM NHẬP OTP (BƯỚC 2)
                <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="size-4 text-green-500" />
                    <Label className="text-slate-600 font-bold uppercase text-[11px] tracking-wider">Mã xác nhận (OTP):</Label>
                  </div>
                  <Input 
                    {...register("otp", { 
                      required: "Vui lòng nhập mã OTP",
                      minLength: { value: 6, message: "Mã OTP gồm 6 chữ số" } 
                    })}
                    type="text" 
                    maxLength={6}
                    placeholder="123456"
                    className="rounded-2xl h-14 bg-slate-50/50 border-slate-200 text-center text-3xl font-black tracking-[0.5em] focus:ring-green-500/20"
                  />
                  {errors.otp && <p className="text-red-500 text-xs mt-1 ml-1 font-bold text-center">{errors.otp.message}</p>}
                  <p className="text-center text-xs text-slate-400 mt-4">
                    Chưa nhận được mã? <button type="button" onClick={() => handleRequestOTP({email: userEmail})} className="text-indigo-600 font-bold hover:underline">Gửi lại</button>
                  </p>
                </div>
              )}

              <Button 
                disabled={loading} 
                className={`w-full h-14 font-bold rounded-2xl shadow-xl transition-all active:scale-[0.97] text-lg mt-4 ${step === 2 ? "bg-green-600 hover:bg-green-700 shadow-green-100" : "bg-[#6155F5] hover:bg-[#5247E0] shadow-indigo-100"}`}
              >
                {loading ? <Loader2 className="animate-spin size-6" /> : (step === 1 ? "Gửi mã xác nhận" : "Xác thực ngay")}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}