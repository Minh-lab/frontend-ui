import React from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MOCK_LECTURERS = [
  { id: "2351170101", name: "Nguyễn Thị Hải Anh", major: "Học máy", current: 20, max: 20 },
  { id: "2351170102", name: "Trần Thị Kiều Anh", major: "Học máy", current: 18, max: 20 },
  { id: "2351170674", name: "Lê Văn Bình", major: "Học máy", current: 5, max: 15 },
];

export default function AssignAdvisorDialog({ isOpen, onClose, selectedCount, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase">Phân công giảng viên hướng dẫn</h2>
          <button onClick={onClose} className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold text-2xl">×</button>
        </div>

        <div className="p-10 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Đã chọn {selectedCount} sinh viên</h3>
          
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input placeholder="Tìm kiếm theo tên giảng viên" className="w-full pl-10 pr-4 py-2 border rounded-full text-sm bg-white focus:outline-none" />
            </div>
            <Select><SelectTrigger className="w-40 rounded-xl bg-white"><SelectValue placeholder="Chuyên môn" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="ai">Học máy</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-40 rounded-xl bg-white"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select>
            <Button className="bg-[#9b59b6] text-white px-8 rounded-full font-bold">Tìm kiếm</Button>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-16 text-center uppercase text-[11px] font-bold">STT</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold">MGV</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold">Họ và tên</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold">Chuyên môn</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold text-center">Số slot/Tổng slot</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LECTURERS.map((gv, idx) => {
                  const isFull = gv.current + selectedCount > gv.max;
                  return (
                    <TableRow key={gv.id} className="border-b border-slate-50">
                      <TableCell className="text-center font-bold text-slate-500">{idx + 1}</TableCell>
                      <TableCell className="font-medium text-slate-600">{gv.id}</TableCell>
                      <TableCell className="font-bold text-slate-800">{gv.name}</TableCell>
                      <TableCell className="text-slate-600 italic text-sm">{gv.major}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${isFull ? "text-red-500 bg-red-50" : "text-blue-600 bg-blue-50"}`}>
                          {gv.current}/{gv.max}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button 
                          disabled={isFull}
                          onClick={() => { toast.success(`Đã phân công GV ${gv.name}`); onSuccess(); }}
                          className={`px-4 py-1.5 text-[11px] font-bold rounded-lg uppercase shadow-sm ${isFull ? "text-slate-400 cursor-not-allowed" : "bg-[#7786d1] hover:bg-[#5c6bb2] text-white"}`}
                        >
                          {isFull ? "Đã full" : "Phân công"}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}