import React, { useState } from "react";
import { X, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

const MOCK_REGISTRATIONS = [
  { id: "sv001", name: "Nguyễn A", class: "65KTPM1", topic: "Dự đoán giá vàng", status: "Chờ duyệt", description: "Sử dụng các thuật toán học máy", major: "Học máy" },
  { id: "sv002", name: "nguyễn minh", class: "63KH1", topic: "WEB tài xỉu", status: "Chờ duyệt", description: "Xây dựng hệ thống web thời gian thực", major: "Web" },
  { id: "sv077", name: "hoàng lân", class: "55HT1", topic: "App dự báo thời tiết", status: "Chờ duyệt", description: "Ứng dụng di động dự báo thời tiết", major: "Mobile" },
];

export default function ApproveProjectDialog({ isOpen, onClose }) {
  const [view, setView] = useState("list"); // "list" hoặc "detail"
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (!isOpen) return null;

  const handleOpenDetail = (item) => {
    setSelectedTopic(item);
    setView("detail");
  };

  const handleAction = (type) => {
    if (type === "approve") toast.success(`Đã phê duyệt đề tài của ${selectedTopic.name}`);
    else toast.error(`Đã từ chối đề tài của ${selectedTopic.name}`);
    setView("list");
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        
        {/* HEADER */}
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase tracking-wide text-[18px]">
            {view === "list" ? "Danh sách đăng ký đề tài" : "Yêu cầu duyệt đồ án"}
          </h2>
          <button 
            onClick={() => { setView("list"); onClose(); }} 
            className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-10">
          {view === "list" ? (
            /* --- GIAO DIỆN DANH SÁCH --- */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Mã sv</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Tên sinh viên</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Lớp</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Đề tài</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Trạng thái</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px] text-center">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_REGISTRATIONS.map((item) => (
                      <TableRow key={item.id} className="border-b border-slate-50">
                        <TableCell className="text-slate-600 text-xs">{item.id}</TableCell>
                        <TableCell className="font-bold text-slate-700 text-xs">{item.name}</TableCell>
                        <TableCell className="text-slate-600 text-xs">{item.class}</TableCell>
                        <TableCell className="text-slate-600 text-xs italic">{item.topic}</TableCell>
                        <TableCell className="text-red-500 font-bold text-xs">{item.status}</TableCell>
                        <TableCell className="text-center">
                          <button 
                            onClick={() => handleOpenDetail(item)}
                            className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase shadow-sm active:scale-95"
                          >
                            xem chi tiết
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Phân trang giả lập như ảnh */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="rounded-xl h-8 w-24 gap-2 text-slate-400 border-slate-200">
                   <ChevronLeft className="size-4" /> Previous
                </Button>
                <div className="flex gap-1 items-center px-4">
                  <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm">1</span>
                  {[2, 3, "...", 8, 9, 10].map((p, i) => (
                    <span key={i} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold text-sm">{p}</span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-xl h-8 w-24 gap-2 text-slate-400 border-slate-200">
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* --- GIAO DIỆN CHI TIẾT PHÊ DUYỆT --- */
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 px-4">
                <div className="space-y-6">
                  <p className="text-[18px] text-slate-800"><span className="font-bold">Mã Sinh Viên:</span> {selectedTopic.id}</p>
                  <p className="text-[18px] text-slate-800"><span className="font-bold">Tên Sinh Viên:</span> {selectedTopic.name}</p>
                  <p className="text-[18px] text-slate-800"><span className="font-bold">Lớp:</span> {selectedTopic.class}</p>
                </div>
                <div className="space-y-6">
                  <p className="text-[18px] text-slate-800"><span className="font-bold">Tên Đề Tài:</span> {selectedTopic.topic}</p>
                  <p className="text-[18px] text-slate-800"><span className="font-bold">Mô tả:</span> {selectedTopic.description}</p>
                  <p className="text-[18px] text-slate-800"><span className="font-bold">Chuyên môn:</span> {selectedTopic.major}</p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-12 pt-8">
                <Button 
                  onClick={() => handleAction("reject")}
                  className="bg-[#c24238] hover:bg-red-800 text-white font-bold px-12 py-6 rounded-xl text-lg shadow-lg active:scale-95"
                >
                  Từ chối
                </Button>
                <Button 
                  onClick={() => handleAction("approve")}
                  className="bg-[#5c6bb2] hover:bg-indigo-800 text-white font-bold px-12 py-6 rounded-xl text-lg shadow-lg active:scale-95"
                >
                  Chấp nhận
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}