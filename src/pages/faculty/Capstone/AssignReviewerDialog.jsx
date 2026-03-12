import React, { useState } from "react";
import { X, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MOCK_COUNCILS = [
  { id: "hd1", name: "Hội đồng 1", count: 25, color: "bg-[#8ac9db]", dates: ["2024-09-02", "2024-09-03"] },
  { id: "hd2", name: "Hội đồng 2", count: 34, color: "bg-[#65d68d]", dates: ["2024-09-05"] },
  { id: "hd3", name: "Hội đồng 3", count: 30, color: "bg-[#65d68d]", dates: ["2024-09-10"] },
  { id: "hd4", name: "Hội đồng 4", count: 24, color: "bg-[#65d68d]", dates: ["2024-09-12"] },
];

const COUNCIL_MEMBERS = [
  { id: "gv1", name: "Giảng viên 1", count: 8, color: "bg-[#8ac9db]" },
  { id: "gv2", name: "Giảng viên 2", count: 8, color: "bg-[#dbb08a]" },
  { id: "gv3", name: "Giảng viên 3", count: 8, color: "bg-[#8a9adb]" },
  { id: "gv4", name: "Giảng viên 4", count: 8, color: "bg-[#9a8adb]" },
  { id: "gv5", name: "Giảng viên 5", count: 8, color: "bg-[#a6db8a]" },
];

export default function AssignReviewerDialog({ isOpen, onClose, selectedCount, onSuccess }) {
  const [selectedCouncil, setSelectedCouncil] = useState(MOCK_COUNCILS[0]);
  const [selectedGVPB, setSelectedGVPB] = useState([]);
  const [protectionDate, setProtectionDate] = useState("2024-09-02");

  if (!isOpen) return null;

  const isValidSelection = selectedGVPB.length === 2;

  const handleToggleLecturer = (id) => {
    setSelectedGVPB((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      {/* Thu nhỏ max-w từ 6xl xuống 4xl */}
      <div className="bg-[#f0f4ff] w-full max-w-4xl rounded-[24px] shadow-2xl overflow-hidden border border-white">
        
        {/* Header - Thu nhỏ padding và text */}
        <div className="bg-[#5c56be] p-4 flex justify-between items-center relative text-white">
          <h2 className="text-lg font-bold px-2 uppercase tracking-wide">Phân công phản biện</h2>
          <button onClick={onClose} className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-12 flex items-center justify-center font-bold transition-colors">
            <X className="size-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-slate-800">Đã chọn {selectedCount} sinh viên</h3>
            
            {!isValidSelection && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 animate-pulse">
                <AlertCircle className="size-3.5" />
                <span className="text-[11px] font-bold uppercase">
                  Chọn đủ 2 giảng viên
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            
            {/* CỘT TRÁI - Thu nhỏ padding */}
            <div className="p-5 border-r border-slate-100 space-y-4 bg-slate-50/30">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Chọn hội đồng</h4>
              <div className="space-y-2.5">
                {MOCK_COUNCILS.map(hd => (
                  <button 
                    key={hd.id} 
                    onClick={() => setSelectedCouncil(hd)}
                    className={`w-full flex justify-between items-center p-4 rounded-xl transition-all ${hd.color} ${selectedCouncil.id === hd.id ? "ring-2 ring-indigo-400 scale-[1.02] shadow-md" : "opacity-60 hover:opacity-100"}`}
                  >
                    <span className="font-bold text-slate-800 text-sm">{hd.name}</span>
                    <span className="text-[11px] font-medium text-slate-600">SV chấm: {hd.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI - Thu nhỏ spacing */}
            <div className="p-5 space-y-4 flex flex-col">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Giảng viên phản biện</h4>
                <div className="relative w-36">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                  <input placeholder="Tìm..." className="w-full pl-7 pr-3 py-1 border border-slate-200 rounded-full text-[11px] bg-slate-50 focus:outline-none" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                {COUNCIL_MEMBERS.map(gv => (
                  <label 
                    key={gv.id} 
                    className={`flex justify-between items-center p-3 rounded-xl transition-all cursor-pointer border ${gv.color} ${selectedGVPB.includes(gv.id) ? "border-indigo-500 shadow-sm" : "border-transparent opacity-80"}`}
                  >
                    <span className="font-bold text-slate-800 text-xs">{gv.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-600">PB: {gv.count}</span>
                      <input 
                        type="checkbox" 
                        checked={selectedGVPB.includes(gv.id)}
                        onChange={() => handleToggleLecturer(gv.id)}
                        className="size-4 accent-indigo-600 rounded cursor-pointer" 
                      />
                    </div>
                  </label>
                ))}
              </div>

              {/* CHỌN NGÀY - Thu gọn */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                 <span className="text-[11px] font-bold text-slate-500 uppercase">Ngày bảo vệ</span>
                 <input 
                    type="date" 
                    value={protectionDate}
                    onChange={(e) => setProtectionDate(e.target.value)}
                    className="px-3 py-1.5 bg-slate-100 border-none rounded-lg text-xs font-bold text-slate-700 outline-none"
                 />
              </div>
            </div>
          </div>

          {/* NÚT HÀNH ĐỘNG - Kích thước nhỏ hơn */}
          <div className="flex justify-center gap-4 pt-2">
            <Button 
              disabled={!isValidSelection}
              onClick={() => { toast.success("Phân công thành công!"); onSuccess(); }}
              className={`px-10 h-10 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${isValidSelection ? "bg-[#c24238] hover:bg-red-800 text-white" : "bg-slate-200 text-slate-400"}`}
            >
              {isValidSelection ? "Phân công" : `Chọn đủ 2 (${selectedGVPB.length}/2)`}
            </Button>
            <Button 
              onClick={onClose}
              className="bg-slate-400 hover:bg-slate-500 text-white px-10 h-10 rounded-xl text-sm font-bold"
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}