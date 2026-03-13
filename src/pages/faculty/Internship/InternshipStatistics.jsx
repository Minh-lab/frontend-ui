import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Search, 
  FileDown, BarChart3, Eye 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

const MOCK_STATS = [
  { id: "sv001", name: "Nguyễn A", class: "65KTPM1", status: "", lecturer: "Hoàng Anh", enterprise: "sfdfd", process_score: 7, exam_score: 8 },
  { id: "sv002", name: "nguyễn minh", class: "63KH1", status: "", lecturer: "Hoàng Ánh", enterprise: "dgsgds", process_score: 7, exam_score: 8.7 },
  { id: "sv077", name: "hoàng lân", class: "55HT1", status: "Đang chờ", lecturer: "Nguyễn Hoàng", enterprise: "aaaaa", process_score: 8, exam_score: null },
];

export default function InternshipStatistics() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Nút quay lại */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="p-0 hover:bg-transparent text-slate-500 font-bold hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="size-5 mr-1" /> QUAY LẠI
      </Button>

      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-[0.2em] mb-10">
        Thống kê quản lý thực tập
      </h1>

      {/* 1. BỘ LỌC THỐNG KÊ (Hàng trên cùng) */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <Select><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Học kỳ" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="hk1">Học kỳ 1</SelectItem><SelectItem value="hk2">Học kỳ 2</SelectItem></SelectContent></Select>
          
          <Select><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="done">Hoàn thành</SelectItem><SelectItem value="pending">Đang chờ</SelectItem></SelectContent></Select>
          
          <Select><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="GVHD" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="all">Tất cả giảng viên</SelectItem></SelectContent></Select>
          
          <Select><SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Doanh nghiệp" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="all">Tất cả doanh nghiệp</SelectItem></SelectContent></Select>
        </div>
        
        <Button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-2xl font-bold shadow-md h-11 transition-all active:scale-95">
          Thống kê
        </Button>
      </div>

      {/* 2. CHỈ SỐ VÀ NÚT XUẤT BÁO CÁO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
        <div className="space-y-2">
          <p className="font-bold text-slate-700">Tổng sinh viên hoàn thành thực tập: <span className="text-indigo-600">100</span></p>
          <p className="font-bold text-slate-700">Số sinh viên chưa hoàn thực tập: <span className="text-orange-600">45</span></p>
        </div>
        
        <Button className="bg-[#7786d1] hover:bg-[#5c6bb2] text-white px-8 rounded-2xl font-bold shadow-md h-11 flex items-center gap-2">
          <FileDown className="size-4" /> Xuất báo cáo
        </Button>
      </div>

      {/* 3. BẢNG DỮ LIỆU THỐNG KÊ */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-16 font-bold text-slate-800 uppercase text-[11px] text-center">STT</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Lớp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">GVHD</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Tên doanh nghiệp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Điểm quá trình</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Điểm thi</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_STATS.map((item, index) => (
              <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-center font-bold text-slate-400">{index + 1}</TableCell>
                <TableCell className="font-bold text-slate-700">{item.id}</TableCell>
                <TableCell className="font-bold text-slate-700 capitalize">{item.name}</TableCell>
                <TableCell className="text-slate-600 font-medium">{item.class}</TableCell>
                <TableCell>
                  {item.status && (
                    <span className="text-red-500 font-bold text-xs">{item.status}</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-700 font-medium">{item.lecturer}</TableCell>
                <TableCell className="text-slate-600 italic">{item.enterprise}</TableCell>
                <TableCell className="text-center font-bold text-slate-700">{item.process_score}</TableCell>
                <TableCell className="text-center font-bold text-slate-700">
                  {item.exam_score || <span className="text-slate-300">---</span>}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate(`/faculty/intern/view/${item.id}`)}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full transition-all shadow-sm flex items-center gap-2 active:scale-95"
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

      {/* 4. PHÂN TRANG */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200">
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <div className="flex gap-1 items-center px-4">
          <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm">1</span>
          {[2, 3, "...", 8, 9, 10].map((p, i) => (
            <span key={i} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 cursor-pointer text-slate-400 font-bold text-sm transition-colors">{p}</span>
          ))}
        </div>
        <Button variant="outline" size="sm" className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200">
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}