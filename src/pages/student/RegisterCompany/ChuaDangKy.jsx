import React from "react";
import StatusBadge from "../../../components/StatusBadge";
import { toast } from "sonner";

export default function ChuaDangKy({ registration, onDeXuatMoi, onNganHang, isRegistrationLocked }) {
  const handleAction = (callback) => {
    if (isRegistrationLocked) {
      toast.error("Bạn đã thực hiện đăng ký doanh nghiệp rồi.", {
        description: "Yêu cầu của bạn đang được xử lý. Vui lòng hủy yêu cầu hiện tại nếu bạn muốn thay đổi doanh nghiệp."
      });
      return;
    }
    callback();
  };

  // Extract company information from registration
  const companyData = registration ? {
    tenCongTy: registration?.company?.name || registration?.latest_request?.company_name || "—",
    maSoThue: registration?.company?.tax_code || registration?.latest_request?.tax_code || "—",
    email: registration?.company?.email || registration?.latest_request?.email || "—",
    diaChi: registration?.company?.address || registration?.latest_request?.address || "—",
    position: registration?.latest_request?.student_message || "—",
  } : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center justify-between">
        <span className="font-semibold">Đăng ký doanh nghiệp thực tập</span>
        <StatusBadge status={isRegistrationLocked ? "Đã đăng ký" : "Chưa đăng ký"} />
      </div>
      
      <div className="p-5">
        <div className={`text-sm font-semibold px-4 py-3 rounded-lg mb-5 border ${isRegistrationLocked ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-red-50 border-red-200 text-red-500"}`}>
          {isRegistrationLocked ? "Bạn đã gửi yêu cầu đăng ký doanh nghiệp." : "Bạn chưa thực hiện đăng ký doanh nghiệp thực tập!"}
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">Thông tin doanh nghiệp:</p>
          {isRegistrationLocked && companyData ? (
            <div className="space-y-3">
              {[
                ["Tên doanh nghiệp:", companyData.tenCongTy],
                ["Mã số thuế:", companyData.maSoThue],
                ["Email liên hệ:", companyData.email],
                ["Địa chỉ:", companyData.diaChi],
                ["Vị trí thực tập:", companyData.position],
              ].map(([lbl, val]) => (
                <div key={lbl} className="flex items-start gap-4">
                  <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0 mt-0.5">{lbl}</span>
                  <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            ["Tên doanh nghiệp:", "Mã số thuế:", "Email liên hệ:", "Địa chỉ:", "Vị trí thực tập:"].map((l) => (
              <div key={l} className="flex items-start gap-4 mb-2">
                <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0 mt-0.5">{l}</span>
                <span className="text-sm text-gray-300">—</span>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => handleAction(onDeXuatMoi)}
            className="flex-1 bg-[#d0d5f0] hover:bg-[#c0c7e8] text-[#3b3f8c] font-semibold text-sm py-3 rounded-lg transition"
          >
            Đề xuất doanh nghiệp mới
          </button>
          <button 
            onClick={() => handleAction(onNganHang)}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold text-sm py-3 rounded-lg transition border border-red-200"
          >
            Chọn từ danh sách đã liên kết
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-700">
          <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Lưu ý: Sinh viên chỉ được chọn một doanh nghiệp duy nhất trong một đợt thực tập.</p>
        </div>
      </div>
    </div>
  );
}
