import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CapstoneDetailDialog({ isOpen, onClose, data, onOpenCancelAction }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        {/* Header tím - Nút X đỏ */}
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase tracking-wide text-[18px]">Xem chi tiết</h2>
          <button onClick={onClose} className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold text-2xl">×</button>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Cột trái: Thông tin sinh viên & Điểm */}
            <div className="space-y-4">
              <p className="text-[16px] text-slate-800"><span className="font-bold">Mã Sinh Viên:</span> {data.id}</p>
              <p className="text-[16px] text-slate-800"><span className="font-bold">Tên Sinh Viên:</span> {data.name}</p>
              <p className="text-[16px] text-slate-800"><span className="font-bold">Lớp:</span> {data.class}</p>
              <p className="text-[16px] text-slate-800">
                <span className="font-bold">Trạng thái:</span> 
                <span className={data.status === "Yêu cầu hủy đồ án" ? "text-red-500 font-bold ml-2" : "ml-2"}>
                  {data.status}
                </span>
              </p>

              <div className="pt-4 space-y-4 border-t border-slate-200">
                <p className="text-[16px] text-slate-800"><span className="font-bold">GVHD:</span> {data.gvhd || "Không có"}</p>
                <p className="text-[16px] text-slate-800"><span className="font-bold">Hội đồng:</span> {data.council || "Không có"}</p>
              </div>

              <div className="pt-4 space-y-4 border-t border-slate-200">
                <p className="text-[16px] text-slate-800"><span className="font-bold">Điểm đồ án:</span> {data.score || "Chưa có"}</p>
                <p className="text-[16px] text-slate-800"><span className="font-bold">Điểm bảo vệ:</span> Không có</p>
              </div>
            </div>

            {/* Cột phải: Thông tin đề tài */}
            <div className="space-y-4 relative">
              <p className="text-[16px] text-slate-800"><span className="font-bold">Tên Đề Tài:</span> {data.topic}</p>
              <p className="text-[16px] text-slate-800 leading-relaxed">
                <span className="font-bold">Mô tả:</span> {data.description || "Sử dụng các thuật toán học máy"}
              </p>
              <p className="text-[16px] text-slate-800"><span className="font-bold">Chuyên môn:</span> Học máy</p>
              <p className="text-[16px] text-slate-800 mt-8"><span className="font-bold">GVPB:</span> {data.gvpb || "Không có"}</p>

              {/* Nút Duyệt Hủy (Chỉ hiện khi trạng thái khớp) */}
              {data.status === "Yêu cầu hủy đồ án" && (
                <div className="absolute bottom-0 right-0 pt-10">
                  <button 
                    onClick={() => onOpenCancelAction(data)}
                    className="px-6 py-2.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[11px] font-bold rounded-lg uppercase shadow-md transition-all active:scale-95"
                  >
                    Duyệt yêu cầu hủy đồ án
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}