import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="text-center max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-red-100 rounded-full p-8">
              <Lock className="size-24 text-red-600" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Status Code */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 mb-2">
          403
        </h1>

        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Truy cập bị từ chối
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-left">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-center gap-3">
              <div className="size-2 bg-red-500 rounded-full"></div>
              <span>Bạn không có quyền truy cập</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-2 bg-red-500 rounded-full"></div>
              <span>Vui lòng đăng nhập với tài khoản có quyền</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-2 bg-red-500 rounded-full"></div>
              <span>Liên hệ văn phòng khoa để được cấp quyền</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center justify-center gap-2 rounded-xl px-8 h-12 text-base font-bold border-2 border-slate-300 hover:border-slate-400 transition-colors"
          >
            <ArrowLeft className="size-5" />
            Quay lại
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 rounded-xl px-8 h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Về trang chủ
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Cần hỗ trợ?{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
