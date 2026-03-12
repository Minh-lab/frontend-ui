import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"; 
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; 

// Dữ liệu mẫu dựa trên image_b62efc.png
const MOCK_LECTURERS = [
  { id: "gv001", name: "Nguyễn an", specialization: "Toán tin", status: "Yêu cầu nghỉ phép" },
  { id: "gv002", name: "nguyễn minh", specialization: "Cơ sở dữ liệu", status: "Hoạt động" },
  { id: "gv077", name: "hoàng lân", specialization: "AI", status: "Ngưng công tác" },
  { id: "gv088", name: "Phạm Hùng", specialization: "An toàn thông tin", status: "Hoạt động" },
];

const SPECIALIZATIONS = ["Tất cả", "Toán tin", "Cơ sở dữ liệu", "AI", "An toàn thông tin"];
const STATUS_OPTIONS = ["Tất cả", "Hoạt động", "Yêu cầu nghỉ phép", "Ngưng công tác"];

export default function ManageLecturers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Logic phân trang
  const totalPages = Math.ceil(MOCK_LECTURERS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = MOCK_LECTURERS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Tiêu đề trang căn giữa theo mẫu */}
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Danh sách giảng viên
      </h1>

      {/* Thanh tìm kiếm và bộ lọc bo tròn như image_b62efc.png */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên giảng viên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
          />
        </div>

        <div className="w-full md:w-44">
          <Select defaultValue="Tất cả">
            <SelectTrigger className="rounded-lg bg-slate-50 border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {STATUS_OPTIONS.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-44">
          <Select defaultValue="Tất cả">
            <SelectTrigger className="rounded-lg bg-slate-50 border-slate-200">
              <SelectValue placeholder="Chuyên môn" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {SPECIALIZATIONS.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-8 rounded-full font-bold shadow-md transition-all active:scale-95"
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Bảng danh sách giảng viên */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider">Mã gv</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider">Tên giảng viên</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider">Chuyên môn</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((lecturer) => (
              <TableRow key={lecturer.id} className="border-b border-slate-50 transition-colors">
                <TableCell className="text-slate-600 font-medium">{lecturer.id}</TableCell>
                <TableCell className="font-bold text-slate-700">{lecturer.name}</TableCell>
                <TableCell className="text-slate-600">{lecturer.specialization}</TableCell>
                <TableCell className="text-center font-medium text-slate-700">
                  {lecturer.status}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate(`/faculty/lecturers/view/${lecturer.id}`)}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase transition-all shadow-sm active:scale-95"
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

      {/* Điều hướng phân trang đồng bộ mẫu thiết kế */}
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