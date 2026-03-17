import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="text-center max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-amber-100 rounded-full p-8">
              <Search className="size-24 text-amber-600" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Status Code */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Không tìm thấy trang
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra URL hoặc quay lại trang chủ.
        </p>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-left">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-center gap-3">
              <div className="size-2 bg-amber-500 rounded-full"></div>
              <span>Trang không tồn tại</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-2 bg-amber-500 rounded-full"></div>
              <span>Đã bị xóa hoặc di chuyển</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-2 bg-amber-500 rounded-full"></div>
              <span>Quay lại trang chủ để tiếp tục</span>
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
            className="flex items-center justify-center gap-2 rounded-xl px-8 h-12 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
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
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
