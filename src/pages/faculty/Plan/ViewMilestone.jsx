import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  FileText, 
  Clock, 
  Edit3 
} from "lucide-react";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ViewMilestone() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State lưu trữ dữ liệu mốc thời gian
  const [milestone, setMilestone] = useState(null);

  // Giả lập fetch dữ liệu từ API dựa trên ID
  useEffect(() => {
    const fetchMilestone = () => {
      // Trong thực tế sẽ gọi: const response = await axios.get(`/milestones/${id}`);
      const mockData = {
        phase_name: "Nộp đề cương chi tiết",
        description: "Sinh viên hoàn thiện đề cương nghiên cứu có xác nhận của Giảng viên hướng dẫn và nộp bản cứng tại Văn phòng khoa.",
        type: "CAPSTONE", // Hoặc INTERNSHIP
        start_date: "2024-05-10",
        end_date: "2024-05-20",
      };
      setMilestone(mockData);
    };

    if (id) fetchMilestone();
  }, [id]);

  if (!milestone) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

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

      {/* Card hiển thị thông tin - Sử dụng style bg-[#f0f4ff] đồng bộ */}
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
              <Input value={milestone.start_date} readOnly className="bg-white border-slate-200 rounded-xl text-center font-semibold" />
            </div>
            <div className="hidden sm:block text-slate-300 font-bold">→</div>
            <div className="flex-1 w-full space-y-1">
              <span className="text-[10px] font-bold text-slate-400 ml-2">KẾT THÚC</span>
              <Input value={milestone.end_date} readOnly className="bg-white border-slate-200 rounded-xl text-center font-semibold" />
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}