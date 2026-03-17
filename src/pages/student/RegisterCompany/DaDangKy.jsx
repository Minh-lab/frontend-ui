import React from "react";
import StatusBadge from "../../../components/StatusBadge";

export default function DaDangKy({ registration, onDeXuatMoi, onNganHang }) {
  // If no registration data passed, use some placeholder or handle empty state
  const data = registration || {
    tenCongTy: "Chưa cập nhật",
    maSoThue: "Chưa cập nhật",
    email: "Chưa cập nhật",
    diaChi: "Chưa cập nhật",
    type: "PROPOSAL"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center justify-between">
        <span className="font-semibold">Đăng ký doanh nghiệp thực tập</span>
        <StatusBadge status="Chờ duyệt" />
      </div>

      <div className="p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-green-700 font-bold text-sm">Bạn đã thực hiện đăng ký doanh nghiệp!</p>
              <p className="text-green-600 text-xs mt-0.5">Yêu cầu của bạn đang được Văn phòng khoa xử lý. Vui lòng theo dõi thông báo.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Thông tin đã đăng ký</h3>

          <div className="grid grid-cols-1 gap-3">
            {[
              ["Tên doanh nghiệp", data.tenCongTy],
              ["Mã số thuế", data.maSoThue],
              ["Email liên hệ", data.email],
              ["Địa chỉ", data.diaChi],
              ["Loại hình", data.type === "PROPOSAL" ? "Sinh viên đề xuất" : "Doanh nghiệp liên kết"]
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <label className="sm:w-32 text-xs font-bold text-[#5c60c0] shrink-0 uppercase">{label}</label>
                <div className="text-sm text-gray-700 font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
          <p className="text-[11px] text-gray-400 italic text-center">Bạn muốn thay đổi doanh nghiệp? Vui lòng hủy yêu cầu hiện tại hoặc liên hệ VPK.</p>
          <div className="flex gap-3">
            <button
              onClick={onDeXuatMoi}
              className="px-4 py-2 text-xs font-semibold text-[#5c60c0] hover:bg-[#5c60c0]/5 rounded-lg transition"
            >
              Gửi đề xuất khác
            </button>
            <div className="w-px h-4 bg-gray-200 self-center"></div>
            <button
              onClick={onNganHang}
              className="px-4 py-2 text-xs font-semibold text-[#5c60c0] hover:bg-[#5c60c0]/5 rounded-lg transition"
            >
              Chọn từ danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
