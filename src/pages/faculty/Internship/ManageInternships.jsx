import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, FileCheck, UserPlus, BarChart3, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

import AssignEnterpriseDialog from "./AssignEnterpriseDialog";
import AssignLecturerDialog from "./AssignLecturerDialog";
import ViewInternshipDialog from "./ViewInternshipDialog";

import internshipService from "@/services/faculty/internshipService";

const STATUS_MAP = {
  // Backend status values
  "COMPLETED": "bg-green-100 text-green-700 border-green-200",
  "INTERNING": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "LECTURER_APPROVED": "bg-blue-100 text-blue-700 border-blue-200",
  "COMPANY_APPROVED": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "PENDING": "bg-amber-100 text-amber-700 border-amber-200",
  "IN_PROGRESS": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "INITIALIZED": "bg-slate-100 text-slate-500 border-slate-200",
  "FAILED": "bg-red-100 text-red-600 border-red-200",
  "CANCEL": "bg-red-100 text-red-600 border-red-200",
  
  // Display status values (fallback)
  "Yêu cầu đăng ký công ty": "bg-amber-100 text-amber-700 border-amber-200",
  "Yêu cầu hủy": "bg-orange-100 text-orange-700 border-orange-200",
  "Chưa có dữ liệu": "bg-slate-100 text-slate-500 border-slate-200",
  "Đã có GVHD": "bg-blue-100 text-blue-700 border-blue-200",
  "Đã có DN": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Đang thực tập": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Bị hủy": "bg-red-100 text-red-600 border-red-200",
  "Hoàn thành": "bg-green-100 text-green-700 border-green-200",
};

const STATUS_DISPLAY = {
  "COMPLETED": "Hoàn thành",
  "INTERNING": "Đang thực tập",
  "LECTURER_APPROVED": "Đã có GVHD",
  "COMPANY_APPROVED": "Đã có DN",
  "PENDING": "Chờ xử lý",
  "IN_PROGRESS": "Đang thực tập",
  "INITIALIZED": "Chưa có dữ liệu",
  "FAILED": "Không đạt",
  "CANCEL": "Bị hủy"
};

export default function ManageInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAssignDNOpen, setIsAssignDNOpen] = useState(false);
  const [isAssignGVOpen, setIsAssignGVOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [targetIntern, setTargetIntern] = useState(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Load internships from API
  const loadInternships = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setSelectedRows([]); // Clear selected rows when loading
      const response = await internshipService.getVPKInternshipsWithCancelRequests(page, itemsPerPage);
      console.log("API Response:", response); // Debug log
      
      if (response.success && Array.isArray(response.data)) {
        // Transform data to match component expectations
        const transformedData = response.data.map(item => ({
          id: item.internship_id,
          name: item.student_name,
          code: item.student_code,
          class_name: item.class_name,  // Tên lớp của sinh viên
          company_grade: item.company_grade,  // Điểm company grade
          status: item.status,
          company: item.company_name,
          lecturer: item.lecturer_name,
          position: item.position,
          has_pending_cancel_request: item.has_pending_cancel_request,
          pending_cancel_request: item.pending_cancel_request,
          // Extra fields for backward compatibility
          enterprise: item.company_name || '---',
        }));
        setInternships(transformedData);
        
        // Update pagination info
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalItems(response.pagination?.total || 0);
        setTotalPages(response.pagination?.last_page || 1);
      } else {
        toast.error(response.message || "Lỗi tải danh sách thực tập");
        console.error("Failed to load internships:", response);
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách thực tập: " + (error.message || "Unknown error"));
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  // Load internships on mount
  useEffect(() => {
    loadInternships(1);
  }, [loadInternships]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadInternships(newPage);
    }
  };

  // Logic kiểm tra sinh viên đã có DN/GV chưa trước khi mở Dialog
  const handlePreCheckAssign = (type) => {
    if (selectedRows.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sinh viên");
      return;
    }

    const alreadyAssigned = internships.filter(s => {
      const isSelected = selectedRows.includes(s.id);
      if (type === "DN") return isSelected && s.company !== null && s.company !== undefined && s.company !== '---';
      if (type === "GV") return isSelected && s.lecturer !== null && s.lecturer !== undefined && s.lecturer !== '---';
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
    if (e.target.checked) setSelectedRows(internships.map(i => i.id));
    else setSelectedRows([]);
  };

  const handleProcessCancel = async (actionType) => {
    if (!targetIntern?.pending_cancel_request?.internship_request_id) {
      toast.error("Không tìm thấy request ID");
      return;
    }

    setIsProcessingCancel(true);
    try {
      const response = await internshipService.processCancelRequest(
        targetIntern.pending_cancel_request.internship_request_id,
        actionType
      );

      if (response.success) {
        toast.success(response.message);
        // Reload data to refresh pagination
        await loadInternships(currentPage);
      } else {
        toast.error(response.message || "Lỗi xử lý yêu cầu");
      }
    } catch (error) {
      toast.error("Lỗi xử lý yêu cầu: " + error.message);
    } finally {
      setIsCancelOpen(false);
      setIsProcessingCancel(false);
    }
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
              <TableHead className="w-[50px] text-center"><input type="checkbox" onChange={toggleSelectAll} checked={internships.length > 0 && selectedRows.length === internships.length} className="accent-purple-600 rounded" /></TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Lớp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">DN</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Điểm</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">GVTT</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-xs text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="9" className="text-center py-8 text-slate-500">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : internships.length === 0 ? (
              <TableRow>
                <TableCell colSpan="9" className="text-center py-8 text-slate-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              internships.map((intern) => (
                <TableRow key={intern.id} className={`border-b border-slate-50 ${selectedRows.includes(intern.id) ? "bg-purple-50/50" : ""}`}>
                  <TableCell className="text-center"><input type="checkbox" checked={selectedRows.includes(intern.id)} onChange={() => setSelectedRows(prev => prev.includes(intern.id) ? prev.filter(i => i !== intern.id) : [...prev, intern.id])} className="accent-purple-600 rounded" /></TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm">{intern.code}</TableCell>
                  <TableCell className="font-bold text-slate-700">{intern.name}</TableCell>
                  <TableCell className="text-center text-sm">{intern.class_name || "---"}</TableCell>
                  <TableCell className="text-center italic text-sm">{intern.enterprise}</TableCell>
                  <TableCell className="text-center text-sm">{intern.company_grade !== null && intern.company_grade !== undefined ? Number(intern.company_grade).toFixed(1) : "---"}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${STATUS_MAP[intern.status] || STATUS_MAP["INITIALIZED"]}`}>
                      {STATUS_DISPLAY[intern.status] || intern.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm">{intern.lecturer || "---"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {intern.pending_cancel_request?.type === "CANCEL_REQ" && intern.pending_cancel_request?.status === "PENDING_FACULTY" && (
                        <button 
                          onClick={() => { 
                            setTargetIntern(intern); 
                            setIsCancelOpen(true); 
                          }} 
                          className="px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-200 hover:bg-red-100 transition"
                        >
                          Duyệt hủy
                        </button>
                      )}
                      <button 
                        onClick={() => { 
                          setTargetIntern(intern); 
                          setIsViewOpen(true); 
                        }} 
                        className="px-4 py-1.5 bg-[#7786d1] text-white text-[10px] font-bold rounded-full uppercase hover:bg-[#5c6bb2] transition"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-sm text-slate-500">
          Hiển thị <span className="font-semibold">{internships.length > 0 ? itemsPerPage * (currentPage - 1) + 1 : 0}</span> đến <span className="font-semibold">{Math.min(itemsPerPage * currentPage, totalItems)}</span> của <span className="font-semibold">{totalItems}</span> kết quả
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  1
                </button>
                {currentPage > 3 && <span className="text-slate-400">...</span>}
              </>
            )}
            
            {currentPage > 2 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                {currentPage - 1}
              </button>
            )}
            
            <button
              className="px-3 py-1.5 text-sm rounded-lg border border-purple-500 bg-purple-50 text-purple-700 font-semibold"
            >
              {currentPage}
            </button>
            
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                {currentPage + 1}
              </button>
            )}
            
            {currentPage < totalPages && (
              <>
                {currentPage < totalPages - 2 && <span className="text-slate-400">...</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* POPUPS */}
      <AssignEnterpriseDialog 
        isOpen={isAssignDNOpen} 
        onClose={() => setIsAssignDNOpen(false)} 
        selectedCount={selectedRows.length} 
        selectedIds={selectedRows}
        onSuccess={() => {}} 
      />

      <AssignLecturerDialog 
        isOpen={isAssignGVOpen} 
        onClose={() => setIsAssignGVOpen(false)} 
        selectedCount={selectedRows.length} 
        selectedIds={selectedRows}
        onSuccess={() => {}} 
      />

      {/* VIEW INTERNSHIP DETAIL DIALOG */}
      <ViewInternshipDialog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        internship={targetIntern}
      />

      {/* CONFIRM DIALOG DUYỆT HỦY (Tối giản) */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 text-center">Duyệt yêu cầu hủy thực tập</h3>
              <p className="text-sm text-slate-500 text-center mt-2">
                Sinh viên: <span className="font-bold">{targetIntern?.name}</span>
              </p>
            </div>
            
            {targetIntern?.pending_cancel_request && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-semibold">Lý do:</span> {targetIntern.pending_cancel_request.student_message || 'N/A'}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">Ngày gửi:</span> {new Date(targetIntern.pending_cancel_request.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => handleProcessCancel('approve')}
                disabled={isProcessingCancel}
                className="bg-red-600 text-white font-bold rounded-xl h-11 hover:bg-red-700"
              >
                Duyệt hủy
              </Button>
              <Button 
                onClick={() => handleProcessCancel('reject')}
                disabled={isProcessingCancel}
                variant="outline" 
                className="border-slate-200 font-bold rounded-xl h-11"
              >
                Từ chối
              </Button>
              <button 
                onClick={() => setIsCancelOpen(false)} 
                disabled={isProcessingCancel}
                className="w-full py-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}