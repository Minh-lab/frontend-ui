import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, User, FileText, CheckCircle, 
  XCircle, Download, MessageSquare, Info 
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ViewLecturer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Giả lập lấy dữ liệu giảng viên
  useEffect(() => {
    const fetchLecturerData = () => {
      // Mock data dựa trên image_b62efc.png
      const mockData = {
        id: id || "gv001",
        full_name: "Nguyễn An",
        gender: "Nam",
        dob: "1985-05-20",
        phone_number: "0912345678",
        degree: "Tiến sĩ",
        department: "Toán tin",
        specialization: "Khoa học dữ liệu",
        status: "Yêu cầu nghỉ phép", // Trạng thái để kiểm tra điều kiện hiển thị
        leave_request: {
          description: "Nghỉ phép đi điều trị bệnh tại bệnh viện trung ương.",
          file_path: "don_xin_nghi_phep.pdf",
          start_date: "2024-03-15",
          end_date: "2024-03-20"
        }
      };
      setLecturer(mockData);
    };
    fetchLecturerData();
  }, [id]);

  const handleApprove = (isApproved) => {
    if (isApproved) {
      toast.success("Đã phê duyệt yêu cầu nghỉ phép của giảng viên.");
    } else {
      toast.error("Đã từ chối yêu cầu nghỉ phép.");
    }
    navigate(-1);
  };

  if (!lecturer) return <div className="p-10 text-center">Đang tải hồ sơ...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Hồ sơ chi tiết giảng viên
        </h1>
        <div className="w-20"></div>
      </div>

      {/* PHẦN 1: THÔNG TIN TỔNG QUÁT */}
      <div className="bg-[#f0f4ff] rounded-[32px] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8 border-b border-blue-200 pb-4">
          <User className="text-blue-600 size-6" />
          <h2 className="text-lg font-bold text-slate-700 uppercase">Thông tin cá nhân</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[
            { label: "Mã giảng viên", value: lecturer.id },
            { label: "Họ và tên", value: lecturer.full_name },
            { label: "Giới tính", value: lecturer.gender },
            { label: "Ngày sinh", value: lecturer.dob },
            { label: "Số điện thoại", value: lecturer.phone_number },
            { label: "Học vị", value: lecturer.degree },
            { label: "Khoa/Bộ môn", value: lecturer.department },
            { label: "Chuyên môn", value: lecturer.specialization },
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-[140px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-slate-500 text-right uppercase tracking-tighter">
                {item.label}
              </label>
              <Input value={item.value} readOnly className="bg-white border-slate-200 rounded-xl font-semibold text-slate-700" />
            </div>
          ))}

          {/* Trạng thái hiển thị riêng biệt */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4 md:col-span-2 pt-2">
            <label className="text-sm font-bold text-slate-500 text-right uppercase tracking-tighter">
              Trạng thái
            </label>
            <div className="flex">
              <span className={`px-6 py-2 rounded-full text-xs font-bold shadow-sm ${
                lecturer.status === "Hoạt động" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
              }`}>
                {lecturer.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN 2: XỬ LÝ NGHỈ PHÉP (Hiển thị có điều kiện) */}
      {lecturer.status === "Yêu cầu nghỉ phép" && (
        <div className="bg-white rounded-[32px] p-10 shadow-xl border-2 border-amber-100 space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <Info className="text-amber-500 size-6" />
            <h2 className="text-lg font-bold text-slate-700 uppercase">Chi tiết yêu cầu nghỉ phép</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
            {/* Lý do nghỉ */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">Mô tả lý do</label>
            <Textarea value={lecturer.leave_request.description} readOnly className="bg-slate-50 border-none rounded-xl min-h-[80px] italic shadow-inner" />

            {/* File đính kèm */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">File đính kèm</label>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-sm text-blue-600 flex items-center gap-2">
                <FileText className="size-4" /> {lecturer.leave_request.file_path}
              </div>
              <Button variant="outline" size="icon" className="rounded-full border-blue-200 text-blue-600">
                <Download className="size-4" />
              </Button>
            </div>

            {/* Thời gian nghỉ */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">Thời gian nghỉ</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 ml-2">TỪ NGÀY</p>
                <Input value={lecturer.leave_request.start_date} readOnly className="bg-slate-50 border-none rounded-xl text-center font-bold" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 ml-2">ĐẾN NGÀY</p>
                <Input value={lecturer.leave_request.end_date} readOnly className="bg-slate-50 border-none rounded-xl text-center font-bold text-red-500" />
              </div>
            </div>

            {/* Phản hồi của VPK */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-4 uppercase flex items-center justify-end gap-2">
              <MessageSquare className="size-4" /> Phản hồi VPK
            </label>
            <div className="space-y-2">
              <Textarea 
                placeholder="Nhập ý kiến phản hồi hoặc lý do từ chối..." 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-white border-blue-200 rounded-xl min-h-[100px] focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Cụm nút duyệt/không duyệt */}
          <div className="flex justify-end gap-6 pt-6 border-t border-slate-100">
            <Button
              onClick={() => handleApprove(false)}
              className="bg-[#ff4d4d] hover:bg-[#e60000] text-white font-bold px-8 py-6 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              <XCircle className="mr-2 size-5" /> Không duyệt
            </Button>
            <Button
              onClick={() => handleApprove(true)}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold px-12 py-6 rounded-2xl shadow-lg transition transform hover:-translate-y-1 active:scale-95 uppercase tracking-wider"
            >
              <CheckCircle className="mr-2 size-5" /> Duyệt đơn
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}