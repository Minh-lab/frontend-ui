import React from "react";
import StatusBadge from "../../../components/StatusBadge";

export default function ChuaDangKy({ onDeXuatMoi, onNganHang }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center justify-between">
        <span className="font-semibold">Đăng ký doanh nghiệp thực tập</span>
        <StatusBadge status="Chưa đăng ký" />
      </div>
      
      <div className="p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Bắt đầu đăng ký thực tập</h2>
          <p className="text-gray-500 text-sm">Vui lòng chọn một trong hai phương thức đăng ký dưới đây</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Proposal */}
          <button 
            onClick={onDeXuatMoi}
            className="group p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#5c60c0] hover:bg-[#5c60c0]/5 transition-all duration-300 text-left space-y-4"
          >
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 group-hover:text-[#5c60c0]">Đề xuất doanh nghiệp mới</h3>
              <p className="text-xs text-gray-500 mt-1">Dành cho sinh viên tự liên hệ nơi thực tập bên ngoài hệ thống.</p>
            </div>
          </button>

          {/* Option 2: Bank */}
          <button 
            onClick={onNganHang}
            className="group p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#5c60c0] hover:bg-[#5c60c0]/5 transition-all duration-300 text-left space-y-4"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 group-hover:text-[#5c60c0]">Danh sách đã liên kết</h3>
              <p className="text-xs text-gray-500 mt-1">Chọn từ các doanh nghiệp đã ký kết hợp tác với nhà trường.</p>
            </div>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-700">
          <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Lưu ý: Sinh viên chỉ được chọn một doanh nghiệp duy nhất trong một đợt thực tập.</p>
        </div>
      </div>
    </div>
  );
}
