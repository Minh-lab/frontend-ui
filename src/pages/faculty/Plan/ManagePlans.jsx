import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Calendar 
} from "lucide-react";

// Import các UI components từ thư viện của bạn
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

// Dữ liệu mẫu học kỳ dựa trên ảnh thiết kế
const MOCK_SEMESTERS = [
  { id: 1, year: "2023-2024", semester: "1", start_date: "10/5/2024", end_date: "10/6/2024" },
  { id: 2, year: "2024-2025", semester: "1", start_date: "10/5/2025", end_date: "10/6/2025" },
  { id: 3, year: "2024-2025", semester: "2", start_date: "10/6/2025", end_date: "10/7/2025" },
  { id: 4, year: "2025-2026", semester: "1", start_date: "10/5/2026", end_date: "10/6/2026" },
];

export default function ManagePlans() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Logic phân trang đơn giản
  const totalPages = Math.ceil(MOCK_SEMESTERS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = MOCK_SEMESTERS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header: Tiêu đề và Nút thêm mới */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
          Danh sách học kỳ
        </h1>
        <Button 
            variant="outline"
            onClick={() => navigate("/faculty/plans/add")}
            className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] hover:text-[#4f46e5] font-bold border-none px-5 rounded-lg shadow-sm transition-colors"
            >
            <Plus className="mr-2 size-4" /> Thêm học kỳ
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-20 text-center font-bold text-slate-800 h-12 uppercase tracking-wider">STT</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Năm học</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Học kỳ</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Ngày bắt đầu</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Ngày kết thúc</TableHead>
              <TableHead className="w-37.5 text-center font-bold text-slate-800 h-12 uppercase tracking-wider">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item, index) => (
              <TableRow key={item.id} className="border-b border-slate-50 transition-colors">
                <TableCell className="text-center text-slate-600">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="font-bold text-slate-700">
                  {item.year}
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  {item.semester}
                </TableCell>
                <TableCell className="text-slate-600">
                  {item.start_date}
                </TableCell>
                <TableCell className="text-slate-600">
                  {item.end_date}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate(`/faculty/plans/view/${item.id}`)}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-xs font-bold rounded-full transition-all shadow-sm active:scale-95"
                    >
                      xem chi tiết
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang (Pagination) */}
      <div className="flex items-center justify-center gap-6 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ChevronLeft className="mr-2 size-4" /> Previous
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                currentPage === page 
                ? "bg-slate-50 text-slate-800 border border-slate-200 shadow-sm" 
                : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Next <ChevronRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}