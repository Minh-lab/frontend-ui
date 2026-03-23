import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

// Import fake API service
import internshipService from "@/services/faculty/internshipService";

export default function AssignEnterpriseDialog({ isOpen, onClose, selectedCount, onSuccess, selectedIds = [] }) {
  const navigate = useNavigate();
  const [enterprises, setEnterprises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Load enterprises when dialog opens
  const loadEnterprises = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await internshipService.getEnterprises(searchQuery, page);
      if (response.success && response.data) {
        setEnterprises(response.data);
        setPagination(response.pagination || {});
        setCurrentPage(page);
      } else {
        toast.error(response.message || "Lỗi tải danh sách doanh nghiệp");
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách doanh nghiệp");
      console.error("Error loading enterprises:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      loadEnterprises();
    }
  }, [isOpen, loadEnterprises]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadEnterprises(1);
  };

  const handlePageChange = (page) => {
    loadEnterprises(page);
  };

  const handleAssign = async (enterpriseId) => {
    if (!selectedIds || selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sinh viên");
      return;
    }

    try {
      setIsAssigning(true);
      const response = await internshipService.assignEnterprise(selectedIds, enterpriseId);
      if (response.success) {
        toast.success(response.message || "Phân công doanh nghiệp thành công");
        // Delay navigation to let toast appear first
        setTimeout(() => {
          navigate("/faculty_staff/internships");
        }, 1000);
      } else {
        toast.error(response.message || "Lỗi phân công doanh nghiệp");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Lỗi phân công doanh nghiệp";
      toast.error(errorMsg);
      console.error("Error assigning enterprise:", error);
    } finally {
      setIsAssigning(false);
    }
  };

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
          <form onSubmit={handleSearch} className="flex justify-center items-center gap-4">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm kiếm tên doanh nghiệp" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none" 
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-[#9b59b6] text-white px-10 rounded-full font-bold">Tìm kiếm</Button>
          </form>

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8 text-slate-500">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : enterprises.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8 text-slate-500">
                      Không có doanh nghiệp
                    </TableCell>
                  </TableRow>
                ) : (
                  enterprises.map((ent, idx) => {
                    const isFull = ent.current_slots + selectedCount > ent.max_slots;
                    return (
                      <TableRow key={ent.id}>
                        <TableCell className="text-center font-bold text-slate-600">{idx + 1}</TableCell>
                        <TableCell className="font-bold text-slate-700">{ent.name}</TableCell>
                        <TableCell className="text-center">{ent.tax_code}</TableCell>
                        <TableCell className="text-center font-bold">{ent.current_slots}/{ent.max_slots}</TableCell>
                        <TableCell className="text-center">
                          <button 
                            disabled={isFull || isAssigning}
                            onClick={() => handleAssign(ent.company_id || ent.id)}
                            className={`px-6 py-2 text-white text-[11px] font-bold rounded-lg uppercase shadow-md ${isFull || isAssigning ? "bg-slate-300 cursor-not-allowed" : "bg-[#7786d1] hover:bg-[#5c6bb2]"}`}
                          >
                            {isFull ? "Hết chỗ" : isAssigning ? "Đang xử lý..." : "Phân công"}
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination?.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                ← Trước
              </button>

              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded-lg font-bold ${
                    currentPage === page
                      ? "bg-[#7786d1] text-white"
                      : "border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}