/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  FileText, 
  Clock,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ViewMilestone() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State lưu trữ dữ liệu mốc thời gian
  const [milestone, setMilestone] = useState(location.state?.milestone || null);
  const [loading, setLoading] = useState(!milestone);
  const [notFound, setNotFound] = useState(!milestone);

  // Fetch dữ liệu từ route state (không cần gọi API)
  useEffect(() => {
    if (!location.state?.milestone) {
      setNotFound(true);
      toast.error("Không tìm thấy dữ liệu mốc thời gian. Quay lại trang trước.");
    }
    setLoading(false);
  }, [location.state, navigate]);

  // Format date từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải thông tin mốc thời gian...</p>
        </div>
      </div>
    );
  }

  if (notFound || !milestone) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
        
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy mốc thời gian</h2>
          <p className="text-slate-500 mb-8">Mốc thời gian bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Chi tiết mốc thời gian
        </h1>
      </div>

      {/* Card hiển thị thông tin */}
      <div className="bg-[#f0f4ff] rounded-[32px] shadow-xl overflow-hidden border border-slate-100 px-12 py-12 space-y-8">
        
        {/* Tên giai đoạn */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
          <label className="text-sm font-bold text-slate-500 md:text-right uppercase tracking-wider flex items-center justify-end gap-2">
            <Tag className="size-4" /> Tên giai đoạn
          </label>
          <Input 
            value={milestone.phase_name} 
            readOnly 
            className="bg-white border-slate-200 rounded-xl py-6 font-bold text-slate-700 shadow-sm" 
          />
        </div>

        {/* Loại mốc */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
          <label className="text-sm font-bold text-slate-500 md:text-right uppercase tracking-wider flex items-center justify-end gap-2">
            <Clock className="size-4" /> Loại mốc
          </label>
          <div className="flex">
            <span className={`px-6 py-2 rounded-full text-xs font-bold shadow-sm ${
              milestone.type === "CAPSTONE" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
            }`}>
              {milestone.type === "CAPSTONE" ? "ĐỒ ÁN TỐT NGHIỆP" : "THỰC TẬP TỐT NGHIỆP"}
            </span>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-start gap-4">
          <label className="text-sm font-bold text-slate-500 md:text-right uppercase tracking-wider mt-3 flex items-center justify-end gap-2">
            <FileText className="size-4" /> Mô tả chi tiết
          </label>
          <Textarea 
            value={milestone.description} 
            readOnly 
            className="bg-white border-slate-200 rounded-xl min-h-[120px] focus:ring-0 resize-none shadow-sm text-slate-600 leading-relaxed" 
          />
        </div>

        {/* Thời gian thực hiện */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4 pt-4 border-t border-slate-200/50">
          <label className="text-sm font-bold text-slate-500 md:text-right uppercase tracking-wider flex items-center justify-end gap-2">
            <Calendar className="size-4" /> Thời gian
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-1">
              <span className="text-[10px] font-bold text-slate-400 ml-2">BẮT ĐẦU</span>
              <Input 
                value={formatDate(milestone.start_date)} 
                readOnly 
                className="bg-white border-slate-200 rounded-xl text-center font-semibold" 
              />
            </div>
            <div className="hidden sm:block text-slate-300 font-bold">→</div>
            <div className="flex-1 w-full space-y-1">
              <span className="text-[10px] font-bold text-slate-400 ml-2">KẾT THÚC</span>
              <Input 
                value={formatDate(milestone.end_date)} 
                readOnly 
                className="bg-white border-slate-200 rounded-xl text-center font-semibold" 
              />
            </div>
          </div>
        </div>

        {/* Thông tin thêm (nếu có) */}
        {(milestone.milestone_id || milestone.id) && (
          <div className="text-xs text-slate-400 italic pt-4 border-t border-slate-200/50">
            Mã mốc: #{milestone.milestone_id || milestone.id}
          </div>
        )}
      </div>
    </div>
  );
}