import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ChevronLeft, ChevronRight, 
  FileCheck, UserPlus, BarChart3, Users, FileText 
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components
import { Button } from "@/components/ui/button";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

// Import các Dialog con
import CapstoneDetailDialog from "./CapstoneDetailDialog";
import AssignAdvisorDialog from "./AssignAdvisorDialog";
import AssignReviewerDialog from "./AssignReviewerDialog";
import ApproveProjectDialog from "./ApproveProjectDialog";

const MOCK_CAPSTONES = [
  { 
    id: "sv001", name: "Nguyễn A", class: "65KTPM1", 
    topic: "Dự đoán giá vàng WEB tài xỉu", status: "Chờ phản biện", 
    gvhd: "Hoàng Anh", gvpb: "", council: "", score: "",
    description: "Sử dụng các thuật toán học máy để dự báo biến động giá vàng trên thị trường."
  },
  { 
    id: "sv002", name: "nguyễn minh", class: "63KH1", 
    topic: "Xây dựng website bán hàng", status: "Đã phản biện", 
    gvhd: "Hoàng Ánh", gvpb: "Trần Nam", council: "Hội đồng 1", score: "8.5" 
  },
  { 
    id: "sv077", name: "hoàng lân", class: "55HT1", 
    topic: "App dự báo thời tiết", status: "Yêu cầu hủy đồ án", 
    gvhd: "", gvpb: "", council: "", score: "" 
  },
];

export default function ManageCapstones() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  
  // State quản lý Dialogs
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isReviewerOpen, setIsReviewerOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [targetCapstone, setTargetCapstone] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  // --- LOGIC KIỂM TRA TRƯỚC KHI PHÂN CÔNG ---
  const handleOpenAssign = (type) => {
    if (selectedRows.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sinh viên");
      return;
    }

    const alreadyAssigned = MOCK_CAPSTONES.filter(s => {
      const isSelected = selectedRows.includes(s.id);
      if (type === "ADVISOR") return isSelected && s.gvhd !== "";
      if (type === "REVIEWER") return isSelected && s.gvpb !== "" && s.council !== "";
      return false;
    });

    if (alreadyAssigned.length > 0) {
      const names = alreadyAssigned.map(s => s.name).join(", ");
      const label = type === "ADVISOR" ? "GV hướng dẫn" : "GV phản biện và hội đồng bảo vệ";
      toast.info(`Sinh viên: ${names} đã có ${label} và được loại khỏi danh sách.`);

      const validIds = selectedRows.filter(id => !alreadyAssigned.find(s => s.id === id));
      setSelectedRows(validIds);
      if (validIds.length === 0) return;
    }

    if (type === "ADVISOR") setIsAdvisorOpen(true);
    else setIsReviewerOpen(true);
  };

  // --- LOGIC XỬ LÝ HỦY ---
  const handleProcessCancel = (actionType) => {
    if (actionType === "approve") toast.success(`Đã duyệt hủy đồ án cho ${targetCapstone.name}`);
    else toast.error(`Đã từ chối hủy đồ án cho ${targetCapstone.name}`);
    setIsConfirmCancelOpen(false);
    setIsDetailOpen(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Danh sách sinh viên thực hiện đồ án đồ án
      </h1>

      {/* 1. Thanh tìm kiếm & Bộ lọc (Image Style) */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" placeholder="Tìm kiếm tên sinh viên" 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white shadow-sm focus:outline-none" 
          />
        </div>
        <div className="flex gap-2">
          <Select><SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white"><SelectValue placeholder="GVHD" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white"><SelectValue placeholder="Hội đồng" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select>
        </div>
        <Button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-full font-bold shadow-md">Tìm kiếm</Button>
      </div>

      {/* 2. Nút chức năng nhanh (Light Blue Style) */}
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto pt-4">
        <Button 
          onClick={() => setIsApproveOpen(true)}
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          <FileCheck className="mr-2 size-4" /> Phê duyệt đề tài
        </Button>
        <Button onClick={() => handleOpenAssign("ADVISOR")} className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105">Phân công GVHDDA</Button>
        <Button onClick={() => handleOpenAssign("REVIEWER")} className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105">Phân công phản biện</Button>
        <Button onClick={() => navigate("statistics")}  className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105">Thống kê đồ án</Button>
        
      </div>

      {/* 3. Bảng dữ liệu 10 cột */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-center">
                <input 
                  type="checkbox" className="accent-purple-600 size-4" 
                  onChange={(e) => e.target.checked ? setSelectedRows(MOCK_CAPSTONES.map(i => i.id)) : setSelectedRows([])} 
                />
              </TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Lớp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Đề tài</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">GVHD</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">GVPB</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Hội đồng</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-center">Điểm</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CAPSTONES.map((item) => (
              <TableRow key={item.id} className={`border-b border-slate-50 transition-colors ${selectedRows.includes(item.id) ? "bg-purple-50/40" : ""}`}>
                <TableCell className="text-center">
                  <input 
                    type="checkbox" checked={selectedRows.includes(item.id)} 
                    onChange={() => setSelectedRows(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                    className="accent-purple-600 size-4" 
                  />
                </TableCell>
                <TableCell className="text-slate-600 font-medium">{item.id}</TableCell>
                <TableCell className="font-bold text-slate-700 capitalize">{item.name}</TableCell>
                <TableCell className="text-slate-600">{item.class}</TableCell>
                <TableCell className="max-w-[150px] text-xs text-slate-600 italic leading-tight">{item.topic}</TableCell>
                <TableCell>
                  <span className={`font-bold text-[11px] ${item.status === "Chờ phản biện" || item.status === "Yêu cầu hủy đồ án" ? "text-red-500" : "text-slate-700"}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700 font-medium">{item.gvhd || "---"}</TableCell>
                <TableCell className="text-slate-500 italic text-[11px]">{item.gvpb || "---"}</TableCell>
                <TableCell className="text-slate-500 italic text-[11px]">{item.council || "---"}</TableCell>
                <TableCell className="text-center font-bold text-indigo-600">{item.score || "---"}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => { setTargetCapstone(item); setIsDetailOpen(true); }}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase shadow-sm active:scale-95"
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

      {/* 4. Phân trang (Sạch sẽ) */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <Button variant="outline" size="sm" className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200">
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <div className="flex gap-1 items-center px-4">
          <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm">1</span>
          <span className="text-slate-400 font-bold px-2">...</span>
          <span className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 font-bold text-sm">10</span>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200">
          Next <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* DIALOGS */}
      <CapstoneDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} data={targetCapstone} onOpenCancelAction={() => setIsConfirmCancelOpen(true)} />
      
      {/* DIALOG XÁC NHẬN HỦY 3 NÚT */}
      {isConfirmCancelOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Duyệt yêu cầu hủy đồ án</h3>
              <p className="text-sm text-slate-500 italic">Xử lý yêu cầu của sinh viên <span className="font-bold">{targetCapstone?.name}</span>?</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleProcessCancel("approve")} className="w-full bg-red-600 text-white font-bold rounded-xl h-11">Duyệt hủy</Button>
              <Button onClick={() => handleProcessCancel("reject")} variant="outline" className="w-full border-slate-200 text-slate-700 font-bold rounded-xl h-11">Không duyệt</Button>
              <button onClick={() => setIsConfirmCancelOpen(false)} className="w-full py-2 text-sm font-semibold text-slate-400">Quay lại</button>
            </div>
          </div>
        </div>
      )}
        <ApproveProjectDialog isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)} />
      <AssignAdvisorDialog isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} selectedCount={selectedRows.length} onSuccess={() => { setSelectedRows([]); setIsAdvisorOpen(false); }} />
      <AssignReviewerDialog isOpen={isReviewerOpen} onClose={() => setIsReviewerOpen(false)} selectedCount={selectedRows.length} onSuccess={() => { setSelectedRows([]); setIsReviewerOpen(false); }} />
    </div>
  );
}