import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, ChevronLeft, ChevronRight, 
  CalendarDays, Loader2 
} from "lucide-react";
import { toast } from "sonner";

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

// Import Council Service
import { councilService } from "@/services/faculty";

export default function ManageCouncils() {
  const navigate = useNavigate();

  // --- States điều khiển Dialog Xếp lịch ---
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  
  // --- States dữ liệu và loading ---
  const [councils, setCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });

  // Lấy danh sách hội đồn khi component mount hoặc page thay đổi
  useEffect(() => {
    fetchCouncils();
  }, [currentPage]);

  const fetchCouncils = async () => {
    setLoading(true);
    try {
      const response = await councilService.getCouncils({
        page: currentPage,
        per_page: 15
      });
      
      if (response.success) {
        setCouncils(response.data || []);
        setPagination(response.pagination || {});
      } else {
        toast.error(response.message || "Lỗi khi tải danh sách hội đồng");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách hội đồng");
      console.error("Error fetching councils:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở dialog xếp lịch và lưu thông tin hội đồng được chọn
  const handleOpenSchedule = (council) => {
    setSelectedCouncil(council);
    setIsScheduleOpen(true);
  };

  const handleScheduleSuccess = () => {
    setIsScheduleOpen(false);
    fetchCouncils(); // Refresh danh sách
  };

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

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
              <TableHead className="text-center font-bold text-slate-700">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {councils && councils.length > 0 ? (
              councils.map((item, index) => (
                <TableRow key={item.council_id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                  <TableCell className="text-center font-medium">
                    {(pagination.current_page - 1) * pagination.per_page + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-700">{item.student_count || 0}</TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex flex-wrap justify-center gap-2 max-w-[300px] mx-auto">
                      {/* Nút xem chi tiết */}
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/faculty_staff/councils/detail/${item.council_id}`)}
                        className="bg-[#6D83CD] hover:bg-[#5C72BC] text-white rounded-full px-4 h-8 text-xs font-bold"
                      >
                        Xem chi tiết
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/faculty_staff/councils/grade/${item.council_id}`)}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-8 text-slate-500">
                  Không có dữ liệu hội đồng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Phân trang (Pagination) */}
        {pagination.last_page > 1 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-center relative">
            <div className="absolute left-8 flex gap-4">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-50 transition-colors border border-slate-200 px-4 py-2 rounded-xl"
              >
                <ChevronLeft className="size-4" /> Previous
              </button>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`size-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      page === pagination.current_page 
                        ? "bg-slate-50 text-indigo-600" 
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <div className="absolute right-8 flex gap-4">
              <button 
                onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                disabled={currentPage === pagination.last_page}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-50 transition-colors border border-slate-200 px-4 py-2 rounded-xl"
              >
                Next <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gọi Dialog xếp lịch bảo vệ */}
      <ScheduleDefenseDialog 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        council={selectedCouncil}
        onSuccess={handleScheduleSuccess}
      />
    </div>
  );
}