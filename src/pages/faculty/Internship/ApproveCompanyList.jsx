import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const MOCK_PENDING_COMPANIES = [
  { id: "cp001", name: "Công ty Cổ phần TechVina", tax_code: "0102030405", address: "Số 1 Duy Tân, Cầu Giấy, Hà Nội", email: "contact@techvina.vn", student_count: 5 },
  { id: "cp002", name: "TNHH Giải pháp Phần mềm ABC", tax_code: "0987654321", address: "Khu CNC Hòa Lạc, Thạch Thất", email: "hr@abc-soft.com", student_count: 2 },
];

export default function ApproveCompanyList() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header điều hướng */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="p-0 hover:bg-transparent text-slate-500 font-bold hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="size-5 mr-1" /> QUAY LẠI
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">Duyệt doanh nghiệp thực tập</h1>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            placeholder="Tìm kiếm tên hoặc mã số thuế doanh nghiệp..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white shadow-inner" 
          />
        </div>
        <Button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-full font-bold shadow-md">
          Tìm kiếm
        </Button>
      </div>

      {/* Bảng danh sách doanh nghiệp */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow>
              {/* Cột STT mới */}
              <TableHead className="w-16 font-bold text-slate-800 uppercase text-[11px] text-center tracking-wider">Stt</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Tên doanh nghiệp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center tracking-wider">Mã số thuế</TableHead>
              {/* Cột Email mới */}
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Email liên hệ</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Địa chỉ</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center tracking-wider">Số SV đky</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center tracking-wider">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {MOCK_PENDING_COMPANIES.map((company, index) => (
              <TableRow key={company.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                {/* Dữ liệu STT */}
                <TableCell className="text-center font-bold text-slate-400 text-xs">{index + 1}</TableCell>
                <TableCell className="font-bold text-slate-700">{company.name}</TableCell>
                <TableCell className="text-center text-slate-600 font-medium">{company.tax_code}</TableCell>
                {/* Dữ liệu Email */}
                <TableCell className="text-blue-600 font-medium text-xs">{company.email}</TableCell>
                <TableCell className="max-w-[200px] truncate text-slate-600 text-xs italic">{company.address}</TableCell>
                <TableCell className="text-center font-bold text-indigo-600 bg-indigo-50/30">{company.student_count}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate(`detail/${company.id}`)}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase transition-all shadow-sm flex items-center gap-2 active:scale-95"
                    >
                      <Eye className="size-3" /> xem chi tiết
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Phân trang giả lập */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0"><ChevronLeft className="size-4" /></Button>
        <span className="text-xs font-bold bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">1</span>
        <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0 font-bold text-slate-400">2</Button>
        <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4"><path d="M6.1584 3.1356L10.0228 7.00001L6.1584 10.8644" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </Button>
      </div>
    </div>
  );
}