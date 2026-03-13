import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, ChevronLeft, ChevronRight, 
  CalendarDays 
} from "lucide-react";

// Import các UI components từ dự án [cite: 773, 1141, 1392]
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import Dialog xếp lịch nằm cùng folder
import ScheduleDefenseDialog from "./ScheduleDefenseDialog";

export default function ManageCouncils() {
  const navigate = useNavigate();

  // --- States điều khiển Dialog Xếp lịch ---
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedCouncil, setSelectedCouncil] = useState(null);

  // Dữ liệu mẫu dựa trên hình ảnh
  const MOCK_COUNCILS = [
    {
      id: 1,
      name: "Hội đồng 1",
      startDate: "12/5/2025",
      endDate: "14/5/2025",
      studentCount: 35,
      session: "",
    },
    {
      id: 2,
      name: "Hội đồng 2",
      startDate: "12/5/2025",
      endDate: "14/5/2025",
      studentCount: 45,
      session: "",
    },
  ];

  // Hàm mở dialog xếp lịch và lưu thông tin hội đồng được chọn
  const handleOpenSchedule = (council) => {
    setSelectedCouncil(council);
    setIsScheduleOpen(true);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* Tiêu đề trang chính giữa */}
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-wide">
        Danh sách hội đồng
      </h1>

      {/* Nút Lập hội đồng trỏ về trang create */}
      <div className="flex justify-end">
        <Button 
          onClick={() => navigate("/faculty_staff/councils/create")}
          className="bg-[#E2EDFF] hover:bg-[#D4E4FF] text-[#1E3A8A] font-bold px-6 py-6 rounded-xl shadow-sm border-none transition-all active:scale-95"
        >
          <Plus className="mr-2 size-5" /> Lập hội đồng
        </Button>
      </div>

      {/* Bảng danh sách hội đồng */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#E2F2FF]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-20 text-center font-bold text-slate-700">STT</TableHead>
              <TableHead className="font-bold text-slate-700">Tên hội đồng</TableHead>
              <TableHead className="font-bold text-slate-700">Ngày bắt đầu</TableHead>
              <TableHead className="font-bold text-slate-700">Ngày kết thúc</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Số sinh viên chấm</TableHead>
              <TableHead className="font-bold text-slate-700">Đợt thi</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_COUNCILS.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                <TableCell className="text-slate-600 font-medium">{item.startDate}</TableCell>
                <TableCell className="text-slate-600 font-medium">{item.endDate}</TableCell>
                <TableCell className="text-center font-bold text-slate-700">{item.studentCount}</TableCell>
                <TableCell>{item.session}</TableCell>
                
                <TableCell className="text-center">
                  <div className="flex flex-wrap justify-center gap-2 max-w-[300px] mx-auto">
                    {/* Nút xem chi tiết trỏ về path detail */}
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/faculty_staff/councils/detail/${item.id}`)}
                      className="bg-[#6D83CD] hover:bg-[#5C72BC] text-white rounded-full px-4 h-8 text-xs font-bold"
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/faculty_staff/councils/grade/${item.id}`)}
                      className="bg-[#8A528D] hover:bg-[#78467B] text-white rounded-full px-4 h-8 text-xs font-bold"
                    >
                      Chấm điểm
                    </Button>
                    {/* Nút Xếp lịch bảo vệ mở Dialog thay vì navigate */}
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenSchedule(item)}
                      className="bg-[#E2EDFF] hover:bg-[#D4E4FF] text-[#1E3A8A] rounded-full px-4 h-8 text-xs font-bold flex gap-1 items-center"
                    >
                      <CalendarDays className="size-3" />
                      Xếp lịch bảo vệ
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Phân trang (Pagination) */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-center relative">
          <div className="absolute left-8 flex gap-4">
             <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200 px-4 py-2 rounded-xl">
                <ChevronLeft className="size-4" /> Previous
             </button>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 8, 9, 10].map((page, i) => (
              <button
                key={i}
                className={`size-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  page === 1 
                    ? "bg-slate-50 text-indigo-600" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="absolute right-8 flex gap-4">
             <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200 px-4 py-2 rounded-xl">
                Next <ChevronRight className="size-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Gọi Dialog xếp lịch bảo vệ */}
      <ScheduleDefenseDialog 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        council={selectedCouncil}
      />
    </div>
  );
}