import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Plus, Trash2, Edit, 
  Clock 
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { ConfirmAction } from "@/components/ui/ConfirmAction"; // Đảm bảo đúng đường dẫn file ConfirmAction

const MOCK_MILESTONES = [
  { id: 1, name: "Nộp đề cương chi tiết", type: "Đồ án", start_date: "10/05/2024", end_date: "20/05/2024" },
  { id: 2, name: "Đăng ký doanh nghiệp", type: "Thực tập", start_date: "15/05/2024", end_date: "25/05/2024" },
  { id: 3, name: "Báo cáo tiến độ lần 1", type: "Đồ án", start_date: "01/06/2024", end_date: "05/06/2024" },
];

export default function ViewPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State quản lý Dialog xác nhận xóa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

  const planInfo = {
    year: "2023-2024",
    semester: "1",
    start_date: "10/05/2024",
    end_date: "10/06/2024"
  };

  // Mở dialog và lưu lại ID cần xóa
  const handleOpenDeleteDialog = (mId) => {
    setSelectedMilestoneId(mId);
    setIsDeleteDialogOpen(true);
  };

  // Thực hiện xóa sau khi xác nhận
  const handleConfirmDelete = () => {
    console.log("Đang xóa mốc thời gian");
    toast.success(`Đã xóa thành công mốc thời gian #${selectedMilestoneId}`);
    setIsDeleteDialogOpen(false);
    setSelectedMilestoneId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/faculty/plans")}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Chi tiết kế hoạch học kỳ
        </h1>
        <div className="w-32"></div>
      </div>

      {/* PHẦN 1: THÔNG TIN TỔNG QUÁT */}
      <div className="bg-[#f0f4ff] rounded-[32px] p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Năm học", value: planInfo.year },
            { label: "Học kỳ", value: planInfo.semester },
            { label: "Ngày bắt đầu", value: planInfo.start_date },
            { label: "Ngày kết thúc", value: planInfo.end_date },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">
                {item.label}
              </label>
              <Input 
                value={item.value} 
                readOnly 
                className="bg-white border-slate-200 text-center font-bold text-slate-700 rounded-xl py-5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PHẦN 2: QUẢN LÝ CÁC MỐC THỜI GIAN */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="text-purple-600 size-5" />
            <h2 className="text-lg font-bold text-slate-700 uppercase">Danh sách mốc thời gian chi tiết</h2>
          </div>
          <Button 
            onClick={() => navigate(`/faculty/plans/${id}/milestone/add`)}
            className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] hover:text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all"
          >
            <Plus className="mr-2 size-4" /> Thêm mốc thời gian
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#e3f2fd]">
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider">Tên giai đoạn</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Loại mốc</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Ngày bắt đầu</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Ngày kết thúc</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MILESTONES.map((m) => (
                <TableRow key={m.id} className="group transition-colors border-b border-slate-50">
                  <TableCell className="font-bold text-slate-700">{m.name}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      m.type === "Đồ án" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {m.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-slate-600 font-medium">{m.start_date}</TableCell>
                  <TableCell className="text-center text-slate-600 font-medium">{m.end_date}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/faculty/milestone/view/${m.id}`)}
                        className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase transition-all active:scale-95"
                      >
                        xem chi tiết
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteDialog(m.id)}
                        className="px-4 py-1.5 bg-[#ff4d4d] hover:bg-[#e60000] text-white text-[10px] font-bold rounded-full uppercase transition-all active:scale-95"
                      >
                        xóa
                      </button>
                      <button 
                        onClick={() => navigate(`/faculty/milestone/edit/${m.id}`)}
                        className="px-4 py-1.5 bg-[#4fd1c5] hover:bg-[#38b2ac] text-white text-[10px] font-bold rounded-full uppercase transition-all active:scale-95"
                      >
                        sửa
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* COMPONENT XÁC NHẬN XÓA */}
      <ConfirmAction 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa mốc thời gian"
        description="Bạn có chắc chắn muốn xóa giai đoạn này? Toàn bộ dữ liệu liên quan sẽ bị loại bỏ và không thể hoàn tác."
        confirmText="Xác nhận xóa"
        variant="cancel" // Sử dụng màu đỏ (destructive) cho nút xác nhận
      />
    </div>
  );
}