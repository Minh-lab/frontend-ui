import React from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

const MOCK_ENTERPRISES = [
  { id: 1, name: "CTY TNHH CJJ", tax_code: "902482", current_slots: 5, max_slots: 20 },
  { id: 2, name: "WWC", tax_code: "034yr232", current_slots: 3, max_slots: 15 },
  { id: 3, name: "WORKS JJ", tax_code: "3274983", current_slots: 12, max_slots: 12 },
];

export default function AssignEnterpriseDialog({ isOpen, onClose, selectedCount, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        {/* Header tím - Nút X đỏ rực bên phải */}
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase tracking-wide">Phân công doanh nghiệp thực tập</h2>
          <button onClick={onClose} className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center transition-colors font-bold"><X className="size-8" /></button>
        </div>

        <div className="p-10 space-y-8">
          <div className="flex justify-center items-center gap-4">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input placeholder="Tìm kiếm tên doanh nghiệp" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none" />
            </div>
            <Button className="bg-[#9b59b6] text-white px-10 rounded-full font-bold">Tìm kiếm</Button>
          </div>

          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h3 className="text-lg font-bold text-slate-700 uppercase">Danh sách doanh nghiệp thực tập</h3>
            <p className="text-slate-800 font-bold text-lg italic text-right">Đã chọn {selectedCount} sinh viên</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-[#e3f2fd]">
                <TableRow>
                  <TableHead className="w-20 text-center uppercase text-xs">STT</TableHead>
                  <TableHead className="uppercase text-xs font-bold">Tên doanh nghiệp</TableHead>
                  <TableHead className="text-center uppercase text-xs font-bold">Mã số thuế</TableHead>
                  <TableHead className="text-center uppercase text-xs font-bold">Slot đang hướng dẫn</TableHead>
                  <TableHead className="text-center uppercase text-xs font-bold">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ENTERPRISES.map((ent, idx) => {
                  const isFull = ent.current_slots + selectedCount > ent.max_slots;
                  return (
                    <TableRow key={ent.id}>
                      <TableCell className="text-center font-bold text-slate-600">{idx + 1}</TableCell>
                      <TableCell className="font-bold text-slate-700">{ent.name}</TableCell>
                      <TableCell className="text-center">{ent.tax_code}</TableCell>
                      <TableCell className="text-center font-bold">{ent.current_slots}/{ent.max_slots}</TableCell>
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