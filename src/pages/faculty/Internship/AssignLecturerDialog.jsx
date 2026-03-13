import React from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

const MOCK_LECTURERS = [
  { id: "gv991", name: "Hoàng Lan", major: "AI", current_slots: 5, max_slots: 20 },
  { id: "gv0082", name: "Nguyễn Linh", major: "AI", current_slots: 3, max_slots: 15 },
  { id: "gv003", name: "Anh Thảo", major: "KHMT", current_slots: 12, max_slots: 12 },
];

export default function AssignLecturerDialog({ isOpen, onClose, selectedCount, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase tracking-wide">Phân công GVHDTT</h2>
          <button onClick={onClose} className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold"><X className="size-8" /></button>
        </div>

        <div className="p-10 space-y-8">
          <div className="flex justify-center items-center gap-4">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input placeholder="Tìm kiếm tên giảng viên" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none" />
            </div>
            <Button className="bg-[#9b59b6] text-white px-10 rounded-full font-bold">Tìm kiếm</Button>
          </div>

          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h3 className="text-lg font-bold text-slate-700 uppercase">Danh sách giảng viên</h3>
            <p className="text-slate-800 font-bold text-lg italic text-right">Đã chọn {selectedCount} sinh viên</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-[#e3f2fd]">
                <TableRow>
                  <TableHead className="font-bold text-slate-800 uppercase text-xs">Mã giảng viên</TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Chuyên môn</TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-xs">Tên giảng viên</TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Slot đang hướng dẫn</TableHead>
                  <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LECTURERS.map((gv) => {
                  const isFull = gv.current_slots + selectedCount > gv.max_slots;
                  return (
                    <TableRow key={gv.id}>
                      <TableCell className="text-slate-600 font-bold uppercase">{gv.id}</TableCell>
                      <TableCell className="text-center font-bold text-slate-700">{gv.major}</TableCell>
                      <TableCell className="font-bold text-slate-700">{gv.name}</TableCell>
                      <TableCell className="text-center font-bold text-slate-700">
                        <span className={isFull ? "text-red-500" : ""}>{gv.current_slots}/{gv.max_slots}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button 
                          disabled={isFull}
                          onClick={() => { toast.success(`Đã phân công thành công`); onSuccess(); }}
                          className={`px-6 py-2 text-white text-[11px] font-bold rounded-lg uppercase shadow-md ${isFull ? "bg-slate-300 cursor-not-allowed" : "bg-[#7786d1] hover:bg-[#5c6bb2]"}`}
                        >
                          {isFull ? "Hết chỗ" : "Phân công"}
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