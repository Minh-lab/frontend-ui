import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { capstoneService } from "@/services/faculty";

export default function AssignAdvisorDialog({ isOpen, onClose, selectedCount, selectedIds, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1,
  });

  // Fetch danh sách giảng viên khi mở dialog hoặc khi thay đổi trang
  const fetchLecturers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await capstoneService.getAdvisorsForAssignment({
        page,
        itemsPerPage,
        search: searchTerm,
        major: selectedMajor !== "all" ? selectedMajor : ""
      });
      
      if (response.success) {
        // Transform API response to match table expectations
        const transformedLecturers = response.data.lecturers.map(lecturer => ({
          id: lecturer.lecturer_id,
          usercode: lecturer.usercode,
          name: lecturer.full_name,
          major: lecturer.expertise,
          current: lecturer.current_slots,
          max: lecturer.max_slots,
          available: lecturer.available_slots,
          isOnLeave: lecturer.is_on_leave,
        }));
        
        setFilteredLecturers(transformedLecturers);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, searchTerm, selectedMajor]);

  useEffect(() => {
    if (isOpen) {
      fetchLecturers(currentPage);
    }
  }, [isOpen, currentPage, fetchLecturers]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  const handleAssign = async (lecturerId, lecturerName) => {
    try {
      setProcessingId(lecturerId);
      
      // Gọi API phân công hàng loạt giảng viên hướng dẫn
      const response = await capstoneService.assignSupervisor(lecturerId, selectedIds);
      
      if (response.success) {
        toast.success(`Đã phân công ${lecturerName} hướng dẫn ${selectedCount} sinh viên`);
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Lỗi khi phân công giảng viên");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi phân công giảng viên");
    } finally {
      setProcessingId(null);
    }
  };

  const isLecturerFull = (lecturer) => {
    return lecturer.current + selectedCount > lecturer.max;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.last_page) {
      setCurrentPage(currentPage + 1);
    }
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
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" 
              />
            </div>
            
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedMajor("all");
                setCurrentPage(1);
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
                    const startIdx = (currentPage - 1) * itemsPerPage + 1;
                    
                    return (
                      <TableRow key={gv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <TableCell className="text-center font-bold text-slate-500">{startIdx + idx}</TableCell>
                        <TableCell className="font-medium text-slate-600">{gv.usercode}</TableCell>
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

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Trang <span className="font-bold text-slate-800">{pagination.current_page}</span> / <span className="font-bold text-slate-800">{pagination.last_page}</span> (Tổng: <span className="font-bold text-slate-800">{pagination.total}</span> giảng viên)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= pagination.last_page}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}