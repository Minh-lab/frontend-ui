import React from "react";
import StatusBadge from "@/components/StatusBadge";

export default function ChuaDangKy({ onDeXuatMoi, onNganHang }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center justify-between">
        <span className="font-semibold">Đăng ký đề tài</span>
        <StatusBadge status="Chưa đăng ký" />
      </div>
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm font-semibold px-4 py-3 rounded-lg mb-5">
          Bạn chưa đăng ký đề tài đồ án nào cả!
        </div>
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">Thông tin đề tài:</p>
          {["Tên đề tài:", "Lĩnh vực:", "Giảng viên hướng dẫn:", "Công nghệ sử dụng:", "Mô tả:", "File đề cương (PDF):"].map((l) => (
            <div key={l} className="flex items-start gap-4 mb-2">
              <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0 mt-0.5">{l}</span>
              <span className="text-sm text-gray-300">—</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={onDeXuatMoi} className="flex-1 bg-[#d0d5f0] hover:bg-[#c0c7e8] text-[#3b3f8c] font-semibold text-sm py-3 rounded-lg transition">
            Đăng ký đề tài mới
          </button>
          <button onClick={onNganHang} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold text-sm py-3 rounded-lg transition border border-red-200">
            Đăng ký đề tài từ ngân hàng đề tài
          </button>
        </div>
      </div>
    </div>
  );
}
