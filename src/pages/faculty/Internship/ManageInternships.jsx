import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, FileCheck, UserPlus, BarChart3, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import các Dialog đã tách file
import AssignEnterpriseDialog from "./AssignEnterpriseDialog";
import AssignLecturerDialog from "./AssignLecturerDialog";

const STATUS_MAP = {
  "Yêu cầu đăng ký công ty": "bg-amber-100 text-amber-700 border-amber-200",
  "Yêu cầu hủy": "bg-orange-100 text-orange-700 border-orange-200",
  "Chưa có dữ liệu": "bg-slate-100 text-slate-500 border-slate-200",
  "Đã có GVHD": "bg-blue-100 text-blue-700 border-blue-200",
  "Đã có DN": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Đang thực tập": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Bị hủy": "bg-red-100 text-red-600 border-red-200",
  "Hoàn thành": "bg-green-100 text-green-700 border-green-200",
};

const MOCK_INTERNSHIPS = [
  { id: "sv001", name: "Nguyễn An", class: "65KTPM1", enterprise: "FPT Software", status: "Đang thực tập", lecturer: "Nguyễn Minh", score: 8.5 },
  { id: "sv002", name: "Nguyễn Minh", class: "63KH1", enterprise: "Viettel", status: "Yêu cầu hủy", lecturer: "Trần Hùng", score: null },
  { id: "sv077", name: "Hoàng Lân", class: "55HT1", enterprise: "---", status: "Chưa có dữ liệu", lecturer: "", score: null },
  { id: "sv088", name: "Lê Thu", class: "64CNTT2", enterprise: "---", status: "Chưa có dữ liệu", lecturer: "", score: null },
];

export default function ManageInternships() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAssignDNOpen, setIsAssignDNOpen] = useState(false);
  const [isAssignGVOpen, setIsAssignGVOpen] = useState(false);
  const [targetIntern, setTargetIntern] = useState(null);

  // Logic kiểm tra sinh viên đã có DN/GV chưa trước khi mở Dialog
  const handlePreCheckAssign = (type) => {
    if (selectedRows.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sinh viên");
      return;
    }

    const alreadyAssigned = MOCK_INTERNSHIPS.filter(s => {
      const isSelected = selectedRows.includes(s.id);
      if (type === "DN") return isSelected && s.enterprise !== "---";
      if (type === "GV") return isSelected && s.lecturer !== "" && s.lecturer !== "---";
      return false;
    });

    if (alreadyAssigned.length > 0) {
      const names = alreadyAssigned.map(s => s.name).join(", ");
      const label = type === "DN" ? "doanh nghiệp" : "giảng viên hướng dẫn";
      toast.info(`Sinh viên: ${names} đã có ${label} nên đã được loại khỏi danh sách.`);

      const validIds = selectedRows.filter(id => !alreadyAssigned.find(s => s.id === id));
      setSelectedRows(validIds);
      if (validIds.length === 0) return;
    }

    if (type === "DN") setIsAssignDNOpen(true);
    else setIsAssignGVOpen(true);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(MOCK_INTERNSHIPS.map(i => i.id));
    else setSelectedRows([]);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">Danh sách thực tập</h1>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input type="text" placeholder="Tìm kiếm tên sinh viên" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none" />
        </div>
        <Button className="bg-[#9b59b6] text-white px-10 rounded-full font-bold shadow-md">Tìm kiếm</Button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
        <Button 
          onClick={() => navigate("approve-company")} 
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          <FileCheck className="mr-2 size-4" /> Duyệt doanh nghiệp thực tập
        </Button>
        
        <Button onClick={() => handlePreCheckAssign("DN")} className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105">
          <Building2 className="mr-2 size-4" /> Phân công doanh nghiệp
        </Button>
        <Button onClick={() => handlePreCheckAssign("GV")} className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105">
          <UserPlus className="mr-2 size-4" /> Phân công giảng viên
        </Button>

        <Button 
          onClick={() => navigate("statistics")} 
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          <BarChart3 className="mr-2 size-4" /> Thống kê thực tập
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow>
              <TableHead className="w-[50px] text-center"><input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === MOCK_INTERNSHIPS.length} className="accent-purple-600 rounded" /></TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">DN</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">GVTT</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_INTERNSHIPS.map((intern) => (
              <TableRow key={intern.id} className={`border-b border-slate-50 ${selectedRows.includes(intern.id) ? "bg-purple-50/50" : ""}`}>
                <TableCell className="text-center"><input type="checkbox" checked={selectedRows.includes(intern.id)} onChange={() => setSelectedRows(prev => prev.includes(intern.id) ? prev.filter(i => i !== intern.id) : [...prev, intern.id])} className="accent-purple-600 rounded" /></TableCell>
                <TableCell className="text-slate-600 font-medium">{intern.id}</TableCell>
                <TableCell className="font-bold text-slate-700">{intern.name}</TableCell>
                <TableCell className="text-center italic">{intern.enterprise}</TableCell>
                <TableCell className="text-center"><span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${STATUS_MAP[intern.status]}`}>{intern.status}</span></TableCell>
                <TableCell className="text-center">{intern.lecturer || "---"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {intern.status === "Yêu cầu hủy" && (
                      <button onClick={() => { setTargetIntern(intern); setIsCancelOpen(true); }} className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-200">Duyệt yêu cầu hủy</button>
                    )}
                    <button onClick={() => navigate(`/faculty/intern/view/${intern.id}`)} className="px-4 py-1.5 bg-[#7786d1] text-white text-[10px] font-bold rounded-full uppercase">xem chi tiết</button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* POPUPS */}
      <AssignEnterpriseDialog 
        isOpen={isAssignDNOpen} 
        onClose={() => setIsAssignDNOpen(false)} 
        selectedCount={selectedRows.length} 
        onSuccess={() => { setSelectedRows([]); setIsAssignDNOpen(false); }} 
      />

      <AssignLecturerDialog 
        isOpen={isAssignGVOpen} 
        onClose={() => setIsAssignGVOpen(false)} 
        selectedCount={selectedRows.length} 
        onSuccess={() => { setSelectedRows([]); setIsAssignGVOpen(false); }} 
      />

      {/* CONFIRM DIALOG DUYỆT HỦY (Tối giản) */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 text-center">Duyệt yêu cầu hủy</h3>
            <p className="text-sm text-slate-500 text-center">Xử lý yêu cầu của sinh viên <span className="font-bold">{targetIntern?.name}</span>?</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => { toast.success("Đã duyệt hủy"); setIsCancelOpen(false); }} className="bg-red-600 text-white font-bold rounded-xl h-11">Duyệt hủy</Button>
              <Button onClick={() => { toast.error("Đã từ chối hủy"); setIsCancelOpen(false); }} variant="outline" className="border-slate-200 font-bold rounded-xl h-11">Không duyệt</Button>
              <button onClick={() => setIsCancelOpen(false)} className="w-full py-2 text-sm font-semibold text-slate-400">Quay lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}