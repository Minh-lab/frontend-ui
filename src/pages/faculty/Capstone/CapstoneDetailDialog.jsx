import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { capstoneService } from "@/services/faculty";

export default function CapstoneDetailDialog({ isOpen, onClose, data, onOpenCancelAction }) {
  const [loading, setLoading] = useState(false);
  const [capstoneDetail, setCapstoneDetail] = useState(null);

  // Fetch chi tiết đồ án khi có data
  useEffect(() => {
    if (isOpen && data?.id) {
      fetchCapstoneDetail(data.id);
    }
  }, [isOpen, data]);

  const fetchCapstoneDetail = async (id) => {
    try {
      setLoading(true);
      const response = await capstoneService.getCapstoneById(id);
      
      if (response.success) {
        setCapstoneDetail(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải thông tin đồ án");
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng data từ props nếu có, nếu không thì dùng capstoneDetail từ API
  const displayData = capstoneDetail || data;

  if (!isOpen || !displayData) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        {/* Header tím - Nút X đỏ */}
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase tracking-wide text-[18px]">Xem chi tiết</h2>
          <button 
            onClick={onClose} 
            className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-12">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Cột trái: Thông tin sinh viên & Điểm */}
              <div className="space-y-4">
                <p className="text-[16px] text-slate-800">
                  <span className="font-bold">Mã Sinh Viên:</span> {displayData.id}
                </p>
                <p className="text-[16px] text-slate-800">
                  <span className="font-bold">Tên Sinh Viên:</span> {displayData.name}
                </p>
                <p className="text-[16px] text-slate-800">
                  <span className="font-bold">Lớp:</span> {displayData.class}
                </p>
                <p className="text-[16px] text-slate-800">
                  <span className="font-bold">Trạng thái:</span> 
                  <span className={displayData.status === "Yêu cầu hủy đồ án" ? "text-red-500 font-bold ml-2" : "ml-2"}>
                    {displayData.status}
                  </span>
                </p>

                <div className="pt-4 space-y-4 border-t border-slate-200">
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">GVHD:</span> {displayData.gvhd || "Không có"}
                  </p>
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Hội đồng:</span> {displayData.council || "Không có"}
                  </p>
                </div>

                <div className="pt-4 space-y-4 border-t border-slate-200">
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Điểm đồ án:</span> {displayData.score || "Chưa có"}
                  </p>
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Điểm bảo vệ:</span> {displayData.defense_score || "Chưa có"}
                  </p>
                </div>

                {/* Thông tin thêm nếu có */}
                {displayData.major && (
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Chuyên ngành:</span> {displayData.major}
                  </p>
                )}
              </div>

              {/* Cột phải: Thông tin đề tài */}
              <div className="space-y-4 relative">
                <p className="text-[16px] text-slate-800">
                  <span className="font-bold">Tên Đề Tài:</span> {displayData.topic}
                </p>
                <p className="text-[16px] text-slate-800 leading-relaxed">
                  <span className="font-bold">Mô tả:</span> {displayData.description || "Không có mô tả"}
                </p>
                
                {displayData.technology && (
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Công nghệ:</span> {displayData.technology}
                  </p>
                )}
                
                {displayData.specialization && (
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Chuyên môn:</span> {displayData.specialization}
                  </p>
                )}
                
                <p className="text-[16px] text-slate-800 mt-8">
                  <span className="font-bold">GVPB:</span> {displayData.gvpb || "Không có"}
                </p>

                {/* Ngày đăng ký nếu có */}
                {displayData.registration_date && (
                  <p className="text-[16px] text-slate-800">
                    <span className="font-bold">Ngày đăng ký:</span> {
                      new Date(displayData.registration_date).toLocaleDateString('vi-VN')
                    }
                  </p>
                )}

                {/* Nút Duyệt Hủy (Chỉ hiện khi trạng thái khớp) */}
                {displayData.status === "Yêu cầu hủy đồ án" && (
                  <div className="absolute bottom-0 right-0 pt-10">
                    <button 
                      onClick={() => onOpenCancelAction(displayData)}
                      className="px-6 py-2.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[11px] font-bold rounded-lg uppercase shadow-md transition-all active:scale-95"
                    >
                      Duyệt yêu cầu hủy đồ án
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}