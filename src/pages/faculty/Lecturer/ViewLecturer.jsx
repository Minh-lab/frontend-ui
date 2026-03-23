import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, User, FileText, CheckCircle, 
  XCircle, Download, MessageSquare, Info, Loader2
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { lecturerService } from "@/services/faculty";

export default function ViewLecturer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [lecturer, setLecturer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Fetch dữ liệu giảng viên
  useEffect(() => {
    if (id) {
      fetchLecturerData();
    }
  }, [id]);

  const fetchLecturerData = async () => {
    try {
      setLoading(true);
      const response = await lecturerService.getLecturerById(id);
      
      if (response.success) {
        setLecturer(response.data);
      } else {
        setNotFound(true);
        toast.error(response.message || "Không tìm thấy thông tin giảng viên");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải thông tin giảng viên");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (isApproved) => {
    try {
      setProcessing(true);
      
      const action = isApproved ? "approve" : "reject";
      const response = await lecturerService.processLeaveRequest(id, action, feedback);
      
      if (response.success) {
        if (isApproved) {
          toast.success(response.message || "Đã phê duyệt yêu cầu nghỉ phép của giảng viên.");
        } else {
          toast.success(response.message || "Đã từ chối yêu cầu nghỉ phép.");
        }
        
        // Cập nhật lại dữ liệu
        await fetchLecturerData();
        
        // Có thể tự động quay lại sau 2 giây
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        toast.error(response.message || "Xử lý thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xử lý yêu cầu");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadFile = () => {
    if (!lecturer?.leave_request?.file_path) {
      toast.error("Không có file đính kèm");
      return;
    }

    try {
      // Tải trực tiếp qua URL storage (đã có symlink)
      const downloadUrl = `/storage/${lecturer.leave_request.file_path}`;
      const fileName = lecturer.leave_request.file_path.split('/').pop() || 'leave-request.pdf';

      // Tạo link tạm để download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Tải file thành công");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Lỗi khi tải file");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải hồ sơ giảng viên...</p>
        </div>
      </div>
    );
  }

  if (notFound || !lecturer) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy giảng viên</h2>
          <p className="text-slate-500 mb-8">Giảng viên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate("/faculty_staff/lecturers")}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
          disabled={processing}
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
            { label: "Họ và tên", value: lecturer.name },
            { label: "Giới tính", value: lecturer.gender },
            { label: "Ngày sinh", value: formatDate(lecturer.dob) },
            { label: "Số điện thoại", value: lecturer.phone_number },
            { label: "Email", value: lecturer.email || "Chưa cập nhật" },
            { label: "Học vị", value: lecturer.degree },
            { label: "Khoa/Bộ môn", value: lecturer.department },
            { label: "Chuyên môn", value: lecturer.specialization },
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-[140px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-slate-500 text-right uppercase tracking-tighter">
                {item.label}
              </label>
              <Input 
                value={item.value || "---"} 
                readOnly 
                className="bg-white border-slate-200 rounded-xl font-semibold text-slate-700" 
              />
            </div>
          ))}

          {/* Trạng thái hiển thị riêng biệt */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4 md:col-span-2 pt-2">
            <label className="text-sm font-bold text-slate-500 text-right uppercase tracking-tighter">
              Trạng thái
            </label>
            <div className="flex">
              <span className={`px-6 py-2 rounded-full text-xs font-bold shadow-sm ${
                lecturer.status === "Hoạt động" ? "bg-green-500 text-white" : 
                lecturer.status === "Yêu cầu nghỉ phép" ? "bg-amber-500 text-white" :
                "bg-red-500 text-white"
              }`}>
                {lecturer.status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN 2: XỬ LÝ NGHỈ PHÉP (Hiển thị có điều kiện) */}
      {lecturer.status === "Yêu cầu nghỉ phép" && lecturer.leave_request && (
        <div className="bg-white rounded-[32px] p-10 shadow-xl border-2 border-amber-100 space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <Info className="text-amber-500 size-6" />
            <h2 className="text-lg font-bold text-slate-700 uppercase">Chi tiết yêu cầu nghỉ phép</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
            {/* Tiêu đề yêu cầu */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">Tiêu đề</label>
            <Input 
              value={lecturer.leave_request.title} 
              readOnly 
              className="bg-slate-50 border-none rounded-xl font-semibold text-slate-700" 
            />

            {/* Lý do nghỉ */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">Mô tả lý do</label>
            <Textarea 
              value={lecturer.leave_request.description} 
              readOnly 
              className="bg-slate-50 border-none rounded-xl min-h-[80px] italic shadow-inner" 
            />

            {/* File đính kèm */}
            {lecturer.leave_request.file_path && (
              <>
                <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">File đính kèm</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-sm text-blue-600 flex items-center gap-2">
                    <FileText className="size-4" /> {lecturer.leave_request.file_path}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={handleDownloadFile}
                    disabled={processing}
                  >
                    <Download className="size-4" />
                  </Button>
                </div>
              </>
            )}

            {/* Thời gian nghỉ */}
            <label className="text-sm font-bold text-slate-500 md:text-right mt-2 uppercase">Thời gian nghỉ</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 ml-2">TỪ NGÀY</p>
                <Input 
                  value={formatDate(lecturer.leave_request.start_date)} 
                  readOnly 
                  className="bg-slate-50 border-none rounded-xl text-center font-bold" 
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 ml-2">ĐẾN NGÀY</p>
                <Input 
                  value={formatDate(lecturer.leave_request.end_date)} 
                  readOnly 
                  className="bg-slate-50 border-none rounded-xl text-center font-bold text-red-500" 
                />
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
                disabled={processing}
              />
            </div>
          </div>

          {/* Cụm nút duyệt/không duyệt */}
          <div className="flex justify-end gap-6 pt-6 border-t border-slate-100">
            <Button
              onClick={() => handleApprove(false)}
              disabled={processing}
              className="bg-[#ff4d4d] hover:bg-[#e60000] text-white font-bold px-8 py-6 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processing ? <Loader2 className="size-5 animate-spin" /> : <XCircle className="size-5" />}
              {processing ? "Đang xử lý..." : "Không duyệt"}
            </Button>
            <Button
              onClick={() => handleApprove(true)}
              disabled={processing}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold px-12 py-6 rounded-2xl shadow-lg transition transform hover:-translate-y-1 active:scale-95 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processing ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle className="size-5" />}
              {processing ? "Đang xử lý..." : "Duyệt đơn"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}