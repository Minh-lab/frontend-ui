import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewInternshipDialog({ isOpen, onClose, internship }) {
  if (!isOpen || !internship) return null;

  const STATUS_COLORS = {
    // Backend status values
    "COMPLETED": "bg-green-100 text-green-700",
    "INTERNING": "bg-cyan-100 text-cyan-700",
    "LECTURER_APPROVED": "bg-blue-100 text-blue-700",
    "COMPANY_APPROVED": "bg-indigo-100 text-indigo-700",
    "PENDING": "bg-amber-100 text-amber-700",
    "IN_PROGRESS": "bg-cyan-100 text-cyan-700",
    "INITIALIZED": "bg-slate-100 text-slate-500",
    "FAILED": "bg-red-100 text-red-600",
    "CANCEL": "bg-red-100 text-red-600",
    
    // Display status values (fallback)
    "Yêu cầu đăng ký công ty": "bg-amber-100 text-amber-700",
    "Yêu cầu hủy": "bg-orange-100 text-orange-700",
    "Chưa có dữ liệu": "bg-slate-100 text-slate-500",
    "Đã có GVHD": "bg-blue-100 text-blue-700",
    "Đã có DN": "bg-indigo-100 text-indigo-700",
    "Đang thực tập": "bg-cyan-100 text-cyan-700",
    "Bị hủy": "bg-red-100 text-red-600",
    "Hoàn thành": "bg-green-100 text-green-700",
  };

  const STATUS_DISPLAY = {
    "COMPLETED": "Hoàn thành",
    "INTERNING": "Đang thực tập",
    "LECTURER_APPROVED": "Đã có GVHD",
    "COMPANY_APPROVED": "Đã có DN",
    "PENDING": "Chờ xử lý",
    "IN_PROGRESS": "Đang thực tập",
    "INITIALIZED": "Chưa có dữ liệu",
    "FAILED": "Không đạt",
    "CANCEL": "Bị hủy"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#5c56be] p-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Xem chi tiết</h2>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 w-12 h-12 flex items-center justify-center rounded transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Mã Sinh Viên</p>
                <p className="font-semibold text-slate-800">{internship.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tên Sinh Viên</p>
                <p className="font-semibold text-slate-800">{internship.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Lớp</p>
                <p className="font-semibold text-slate-800">{internship.class}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Trạng thái</p>
                <p className={`font-semibold px-3 py-1 rounded-full text-sm w-fit mt-1 ${STATUS_COLORS[internship.status]}`}>
                  {STATUS_DISPLAY[internship.status] || internship.status}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Doanh Nghiệp</p>
                <p className="font-semibold text-slate-800">
                  {internship.enterprise !== "---" ? internship.enterprise : "Không có"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">GVHD</p>
                <p className="font-semibold text-slate-800">
                  {internship.lecturer ? internship.lecturer : "Không có"}
                </p>
              </div>
              {internship.score !== null && internship.score !== undefined && (
                <div>
                  <p className="text-sm text-slate-500">Điểm</p>
                  <p className="font-semibold text-slate-800">{internship.score}/10</p>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button
              onClick={onClose}
              className="bg-slate-200 text-slate-800 hover:bg-slate-300 px-6 font-bold rounded-lg"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
