import React from "react";
import StatusBadge from "../../../components/StatusBadge";
import { toast } from "sonner";

export default function DaDangKy({ registration, onDeXuatMoi, onNganHang }) {
  const isRegistrationLocked = ["PENDING_FACULTY", "APPROVED", "COMPANY_APPROVED"].includes(registration?.status || registration?.latest_request?.status);

  const handleAction = (callback) => {
    if (isRegistrationLocked) {
      toast.error("Bạn đã thực hiện đăng ký và yêu cầu đang được xử lý. Không thể đăng ký thêm.", {
        description: "Vui lòng hủy yêu cầu hiện tại nếu bạn muốn thay đổi doanh nghiệp."
      });
      return;
    }
    callback();
  };

  const data = {
    tenCongTy: registration?.company?.name || registration?.latest_request?.company_name || "Chưa cập nhật",
    maSoThue: registration?.company?.tax_code || registration?.latest_request?.tax_code || "Chưa cập nhật",
    email: registration?.company?.email || registration?.latest_request?.email || "Chưa cập nhật",
    diaChi: registration?.company?.address || registration?.latest_request?.address || "Chưa cập nhật",
    position: registration?.latest_request?.student_message || "Chưa cập nhật",
    status: registration?.latest_request?.status || registration?.status || "PENDING_FACULTY",
    type: registration?.company ? "OFFICIAL" : "PROPOSAL"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center justify-between">
        <span className="font-semibold">Đăng ký doanh nghiệp thực tập</span>
        <StatusBadge status={data.status} />
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
          <p className="text-sm font-bold text-gray-700 mb-1">Thông tin đã đăng ký:</p>
          <div className="space-y-3">
            {[
              ["Tên doanh nghiệp:", data.tenCongTy],
              ["Mã số thuế:", data.maSoThue],
              ["Email liên hệ:", data.email],
              ["Vị trí thực tập:", data.position],
              ["Loại hình:", data.type === "PROPOSAL" ? "Sinh viên tự đề xuất" : "Doanh nghiệp đối tác"],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex items-start gap-4">
                <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0 mt-0.5">{lbl}</span>
                <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
                  {val}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0 mt-0.5">Địa chỉ:</span>
              <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 leading-relaxed">
                {data.diaChi}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
          <p className="text-[11px] text-gray-400 italic text-center">Bạn muốn thay đổi doanh nghiệp? Vui lòng hủy yêu cầu hiện tại hoặc liên hệ VPK.</p>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => handleAction(onDeXuatMoi)}
              disabled={isRegistrationLocked}
              className={`flex-1 font-semibold text-sm py-3 rounded-lg transition border ${isRegistrationLocked ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-[#d0d5f0] hover:bg-[#c0c7e8] text-[#3b3f8c]"}`}
            >
              Đề xuất doanh nghiệp mới
            </button>
            <button
              onClick={() => handleAction(onNganHang)}
              disabled={isRegistrationLocked}
              className={`flex-1 font-semibold text-sm py-3 rounded-lg transition border ${isRegistrationLocked ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-red-100 hover:bg-red-200 text-red-600 border-red-200"}`}
            >
              Ngân hàng doanh nghiệp đối tác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
