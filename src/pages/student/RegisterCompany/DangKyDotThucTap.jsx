import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import internshipService from "@/services/internship";

export default function DangKyDotThucTap({ milestone, onSubscribed }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const resp = await internshipService.registerInternship(milestone.milestone_id);
      toast.success(resp.message || "Đăng ký đợt thực tập thành công!");
      if (onSubscribed) onSubscribed(resp.data);
    } catch (error) {
      console.error("Lỗi đăng ký đợt thực tập:", error);
      toast.error(error.message || "Không thể đăng ký đợt thực tập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center justify-between">
        <span className="font-semibold">Đăng ký đợt thực tập mới</span>
        <span className="px-2 py-0.5 bg-blue-400/30 rounded text-[10px] font-bold uppercase tracking-wider">Bước 1</span>
      </div>

      <div className="p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-[#5c60c0] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Chào mừng bạn đến với đợt thực tập!</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Để bắt đầu quá trình đăng ký doanh nghiệp, trước tiên bạn cần xác nhận tham gia đợt thực tập hiện tại.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Đợt thực tập:</span>
            <span className="font-bold text-gray-800">{milestone.semester?.semester_name || "Học kỳ hiện tại"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Thời hạn đăng ký:</span>
            <span className="font-bold text-red-500">{new Date(milestone.end_date).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full h-12 bg-[#5c60c0] hover:bg-[#4a4ea8] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Xác nhận tham gia ngay
            </>
          )}
        </Button>

        <p className="text-[11px] text-center text-gray-400 italic">
          Sau khi xác nhận, bạn sẽ có thể tiếp tục bước đăng ký thông tin doanh nghiệp.
        </p>
      </div>
    </div>
  );
}
