import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, FileDown, 
  BarChart3, Eye 
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

// Dữ liệu giả lập đầy đủ các cột 
const MOCK_STATS = [
  { 
    id: "sv001", 
    name: "Nguyễn Văn An", 
    class: "65KTPM1", 
    status: "Đã hoàn thành", 
    gvhd: "Hoàng Anh", 
    gvpb: "Phạm Minh", 
    council: "Hội đồng 1", 
    score: "8.5" 
  },
  { 
    id: "sv002", 
    name: "Nguyễn Minh", 
    class: "63KH1", 
    status: "yêu cầu hủy", 
    gvhd: "Hoàng Ánh", 
    gvpb: "Lê Thu", 
    council: "Hội đồng 2", 
    score: "---" 
  },
  { 
    id: "sv077", 
    name: "Hoàng Lân", 
    class: "55HT1", 
    status: "Đã hủy", 
    gvhd: "Nguyễn Hoàng", 
    gvpb: "---", 
    council: "---", 
    score: "0" 
  },
  { 
    id: "sv088", 
    name: "Trần Thị Tuyết", 
    class: "64CNTT2", 
    status: "Đang thực hiện", 
    gvhd: "Phạm Nam", 
    gvpb: "Đặng Hùng", 
    council: "Hội đồng 1", 
    score: "---" 
  },
  { 
    id: "sv099", 
    name: "Lê Công Vinh", 
    class: "65KTPM3", 
    status: "Đã hoàn thành", 
    gvhd: "Trần Hùng", 
    gvpb: "Nguyễn Linh", 
    council: "Hội đồng 3", 
    score: "9.2" 
  }
];

export default function CapstoneStatistics() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 pb-20 bg-[#f8fafc]">
      
      {/* NÚT QUAY LẠI - Đã sửa lỗi căn lề */}
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="p-0 hover:bg-transparent text-slate-500 font-bold hover:text-indigo-600 transition-colors flex items-center"
        >
          <ChevronLeft className="size-5 mr-1" /> QUAY LẠI
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-[0.2em] mb-10">
        Thống kê sinh viên thực hiện đồ án đồ án
      </h1>

      {/* 1. BỘ LỌC THỐNG KÊ (Hàng ngang như ảnh) */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <Select>
            <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Học kỳ" /></SelectTrigger>
            <SelectContent className="bg-white"><SelectItem value="hk1">Học kỳ 1 - 2025</SelectItem></SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
            <SelectContent className="bg-white"><SelectItem value="all">Tất cả trạng thái</SelectItem></SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="GVHD" /></SelectTrigger>
            <SelectContent className="bg-white"><SelectItem value="all">Tất cả giảng viên</SelectItem></SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Hội đồng" /></SelectTrigger>
            <SelectContent className="bg-white"><SelectItem value="all">Tất cả hội đồng</SelectItem></SelectContent>
          </Select>
        </div>
        
        <Button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-2xl font-bold shadow-md h-11 transition-all active:scale-95">
          Thống kê
        </Button>
      </div>

      {/* 2. CHỈ SỐ CHI TIẾT (Đã điền đầy đủ thông tin từ image_1ef13d.png) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 max-w-6xl mx-auto px-4">
        <div className="space-y-1.5 text-sm">
          <p className="font-bold text-slate-700">Tổng sinh viên thực hiện đồ án: <span className="text-slate-900 ml-1 font-extrabold">100</span></p>
          <p className="font-bold text-slate-700">Số sinh viên đã hoàn thành: <span className="text-slate-900 ml-1 font-extrabold">30</span></p>
          <p className="font-bold text-slate-700">Số sinh viên chưa có GVHD: <span className="text-slate-900 ml-1 font-extrabold">0</span></p>
          <p className="font-bold text-slate-700">Số sinh viên chưa có GVPB: <span className="text-slate-900 ml-1 font-extrabold">2</span></p>
        </div>
        
        <Button className="bg-[#7786d1] hover:bg-[#5c6bb2] text-white px-10 rounded-2xl font-bold shadow-md h-11 flex items-center gap-2 transition-all">
          <FileDown className="size-4" /> Xuất báo cáo
        </Button>
      </div>

      {/* 3. BẢNG DỮ LIỆU ĐẦY ĐỦ CỘT */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-7xl mx-auto">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-16 font-bold text-slate-800 uppercase text-[11px] text-center">STT</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Lớp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">GVHD</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">GVPB</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Hội đồng</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Điểm</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_STATS.map((item, index) => (
              <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-center font-bold text-slate-400">{index + 1}</TableCell>
                <TableCell className="font-bold text-slate-700">{item.id}</TableCell>
                <TableCell className="font-bold text-slate-700 capitalize">{item.name}</TableCell>
                <TableCell className="text-center text-slate-600 font-medium">{item.class}</TableCell>
                <TableCell className="text-center font-bold">
                  {item.status === "Đã hủy" ? (
                    <span className="text-red-500">{item.status}</span>
                  ) : (
                    <span className="text-slate-800">{item.status}</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-700 font-medium">{item.gvhd}</TableCell>
                <TableCell className="text-slate-400 italic text-xs">{item.gvpb || "---"}</TableCell>
                <TableCell className="text-slate-400 italic text-xs">{item.council || "---"}</TableCell>
                <TableCell className="text-center font-bold text-indigo-600">
                  {item.score || <span className="text-slate-300">---</span>}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate(`/faculty/capstone/detail/${item.id}`)}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full transition-all shadow-sm active:scale-95 whitespace-nowrap"
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
      <div className="flex items-center justify-center gap-2 pt-6">
        <Button variant="outline" size="sm" className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200">
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <div className="flex gap-1 items-center px-4">
          <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm">1</span>
          {[2, 3, "...", 8, 9, 10].map((p, i) => (
            <span key={i} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer text-slate-400 font-bold text-sm transition-colors">{p}</span>
          ))}
        </div>
        <Button variant="outline" size="sm" className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200">
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}