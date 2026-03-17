import React, { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { capstoneService } from "@/services/faculty";

export default function AssignAdvisorDialog({ isOpen, onClose, selectedCount, selectedIds, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  // Fetch danh sách giảng viên khi mở dialog
  useEffect(() => {
    if (isOpen) {
      fetchLecturers();
    }
  }, [isOpen]);

  // Lọc giảng viên theo search và chuyên môn
  useEffect(() => {
    let filtered = lecturers;
    
    if (searchTerm) {
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.id.includes(searchTerm)
      );
    }
    
    if (selectedMajor && selectedMajor !== "all") {
      filtered = filtered.filter(l => l.major === selectedMajor);
    }
    
    setFilteredLecturers(filtered);
  }, [lecturers, searchTerm, selectedMajor]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await capstoneService.getLecturers();
      
      if (response.success) {
        setLecturers(response.data);
        setFilteredLecturers(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (lecturerId, lecturerName) => {
    try {
      setProcessingId(lecturerId);
      
      // Gọi API phân công cho từng sinh viên đã chọn
      // Trong thực tế, backend có thể có API phân công hàng loạt
      for (const studentId of selectedIds) {
        await capstoneService.updateCapstone(studentId, {
          gvhd: lecturerName
        });
      }
      
      toast.success(`Đã phân công ${lecturerName} hướng dẫn ${selectedCount} sinh viên`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Lỗi khi phân công giảng viên");
    } finally {
      setProcessingId(null);
    }
  };

  const isLecturerFull = (lecturer) => {
    return lecturer.current + selectedCount > lecturer.max;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase">Phân công giảng viên hướng dẫn</h2>
          <button 
            onClick={onClose} 
            className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-10 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">
            Đã chọn <span className="text-purple-600">{selectedCount}</span> sinh viên
          </h3>
          
          {/* Thanh tìm kiếm và filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                placeholder="Tìm kiếm theo tên giảng viên" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" 
              />
            </div>
            
           
            
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedMajor("all");
              }}
              className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-8 rounded-full font-bold"
            >
              Làm mới
            </Button>
          </div>

          {/* Bảng danh sách giảng viên */}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600" />
                    </TableCell>
                  </TableRow>
                ) : filteredLecturers.length > 0 ? (
                  filteredLecturers.map((gv, idx) => {
                    const isFull = isLecturerFull(gv);
                    const isProcessing = processingId === gv.id;
                    
                    return (
                      <TableRow key={gv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <TableCell className="text-center font-bold text-slate-500">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-slate-600">{gv.id}</TableCell>
                        <TableCell className="font-bold text-slate-800">{gv.name}</TableCell>
                        <TableCell className="text-slate-600 italic text-sm">{gv.major}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            isFull 
                              ? "text-red-500 bg-red-50" 
                              : gv.current + selectedCount <= gv.max 
                                ? "text-green-600 bg-green-50" 
                                : "text-blue-600 bg-blue-50"
                          }`}>
                            {gv.current}/{gv.max}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <button 
                            disabled={isFull || isProcessing}
                            onClick={() => handleAssign(gv.id, gv.name)}
                            className={`px-4 py-1.5 text-[11px] font-bold rounded-lg uppercase shadow-sm transition-all ${
                              isFull || isProcessing
                                ? "text-slate-400 cursor-not-allowed bg-slate-100" 
                                : "bg-[#7786d1] hover:bg-[#5c6bb2] text-white hover:scale-105 active:scale-95"
                            }`}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                            ) : isFull ? (
                              "Đã full"
                            ) : (
                              "Phân công"
                            )}
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Không tìm thấy giảng viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          
        </div>
      </div>
    </div>
  );
}