import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ChevronLeft, ChevronRight, 
  FileCheck, BarChart3, Loader2
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

// Import service
import { capstoneService } from "@/services/faculty";

export default function ManageCapstones() {
  const navigate = useNavigate();
  
  // State cho dữ liệu
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [capstones, setCapstones] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  // State cho filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCouncil, setSelectedCouncil] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [councils, setCouncils] = useState([]);

  // State cho selection
  const [selectedRows, setSelectedRows] = useState([]);
  
  // State quản lý Dialogs
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isReviewerOpen, setIsReviewerOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [targetCapstone, setTargetCapstone] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch khi filter thay đổi
  useEffect(() => {
    fetchCapstones();
  }, [pagination.current_page, searchTerm, selectedStatus, selectedLecturer, selectedCouncil]);

  const fetchInitialData = async () => {
    try {
      // Fetch song song các dữ liệu cần thiết
      const [statusesRes, lecturersRes, councilsRes] = await Promise.all([
        capstoneService.getCapstoneStatuses(),
        capstoneService.getLecturers(),
        capstoneService.getCouncils()
      ]);

      if (statusesRes.success) setStatuses(statusesRes.data);
      if (lecturersRes.success) setLecturers(lecturersRes.data);
      if (councilsRes.success) setCouncils(councilsRes.data);

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu filter");
    }
  };

  const fetchCapstones = async () => {
    try {
      setLoading(true);
      const response = await capstoneService.getCapstones({
        page: pagination.current_page,
        itemsPerPage: pagination.items_per_page,
        search: searchTerm,
        status: selectedStatus === "all" ? "" : selectedStatus,
        lecturer: selectedLecturer === "all" ? "" : selectedLecturer
      });

      if (response.success) {
        setCapstones(response.data.capstones);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách đồ án");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC KIỂM TRA TRƯỚC KHI PHÂN CÔNG ---
  const handleOpenAssign = (type) => {
    if (selectedRows.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sinh viên");
      return;
    }

    const alreadyAssigned = capstones.filter(s => {
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

  // --- LOGIC XỬ LÝ HỦY ĐỒ ÁN ---
  const handleProcessCancel = async (actionType) => {
    if (!targetCapstone) return;
    
    try {
      setProcessing(true);
      
      const response = await capstoneService.processCancelRequest(
        targetCapstone.id, 
        actionType
      );
      
      if (response.success) {
        if (actionType === "approve") {
          toast.success(response.message);
        } else {
          toast.info(response.message);
        }
        
        // Refresh lại danh sách
        await fetchCapstones();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xử lý yêu cầu hủy");
    } finally {
      setProcessing(false);
      setIsConfirmCancelOpen(false);
      setIsDetailOpen(false);
      setTargetCapstone(null);
    }
  };

  // Xử lý chọn/deselect tất cả
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(capstones.map(c => c.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Xử lý chọn một dòng
  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(item => item !== id));
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  // Refresh data sau khi phân công thành công
  const handleAssignSuccess = async () => {
    setSelectedRows([]);
    await fetchCapstones();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedLecturer("");
    setSelectedCouncil("");
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Hiển thị loading
  if (loading && capstones.length === 0) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải danh sách đồ án...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Danh sách sinh viên thực hiện đồ án
      </h1>

      {/* 1. Thanh tìm kiếm & Bộ lọc */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên sinh viên" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination(prev => ({ ...prev, current_page: 1 }));
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" 
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={selectedStatus} 
            onValueChange={(value) => {
              setSelectedStatus(value);
              setPagination(prev => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedLecturer} 
            onValueChange={(value) => {
              setSelectedLecturer(value);
              setPagination(prev => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="GVHD" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả</SelectItem>
              {lecturers.map(lecturer => (
                <SelectItem key={lecturer.id} value={lecturer.name}>{lecturer.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedCouncil} 
            onValueChange={(value) => {
              setSelectedCouncil(value);
              setPagination(prev => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Hội đồng" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả</SelectItem>
              {councils.map(council => (
                <SelectItem key={council.id} value={council.name}>{council.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={fetchCapstones}
          className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-full font-bold shadow-md"
        >
          Tìm kiếm
        </Button>
        <Button 
          onClick={handleResetFilters}
          variant="outline"
          className="px-6 rounded-full font-bold border-slate-200"
        >
          Làm mới
        </Button>
      </div>

      {/* 2. Nút chức năng nhanh */}
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto pt-4">
        <Button 
          onClick={() => setIsApproveOpen(true)}
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          <FileCheck className="mr-2 size-4" /> Phê duyệt đề tài
        </Button>
        <Button 
          onClick={() => handleOpenAssign("ADVISOR")} 
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          Phân công GVHD
        </Button>
        <Button 
          onClick={() => handleOpenAssign("REVIEWER")} 
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          Phân công phản biện
        </Button>
        <Button 
          onClick={() => navigate("/faculty_staff/capstones/statistics")}  
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all hover:scale-105"
        >
          <BarChart3 className="mr-2 size-4" /> Thống kê đồ án
        </Button>
      </div>

      {/* 3. Bảng dữ liệu */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-center">
                <input 
                  type="checkbox" 
                  className="accent-purple-600 size-4" 
                  checked={selectedRows.length === capstones.length && capstones.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Mã SV</TableHead>
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
            {capstones.length > 0 ? (
              capstones.map((item) => (
                <TableRow 
                  key={item.id} 
                  className={`border-b border-slate-50 transition-colors ${selectedRows.includes(item.id) ? "bg-purple-50/40" : ""}`}
                >
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(item.id)} 
                      onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                      className="accent-purple-600 size-4" 
                    />
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{item.id}</TableCell>
                  <TableCell className="font-bold text-slate-700 capitalize">{item.name}</TableCell>
                  <TableCell className="text-slate-600">{item.class}</TableCell>
                  <TableCell className="max-w-[150px]">
                    <p className="font-bold text-slate-700 capitalize truncate" title={item.topic}>
                      {item.topic}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold text-[11px] ${
                      item.status === "Chờ phản biện" || item.status === "Yêu cầu hủy đồ án" 
                        ? "text-red-500" 
                        : "text-slate-700"
                    }`}>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-slate-500">
                  Không có dữ liệu đồ án
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 4. Phân trang */}
      {pagination.total_pages > 0 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200"
          >
            <ChevronLeft className="size-4" /> Previous
          </Button>
          
          <div className="flex gap-1 items-center px-4">
            <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm">
              {pagination.current_page}
            </span>
            <span className="text-slate-400 font-bold px-2">/</span>
            <span className="text-slate-400 font-bold text-sm">
              {pagination.total_pages}
            </span>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
            className="rounded-xl h-9 w-24 gap-2 font-bold text-slate-500 border-slate-200"
          >
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* DIALOGS */}
      <CapstoneDetailDialog 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        data={targetCapstone} 
        onOpenCancelAction={() => setIsConfirmCancelOpen(true)} 
      />
      
      {/* DIALOG XÁC NHẬN HỦY */}
      {isConfirmCancelOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Duyệt yêu cầu hủy đồ án</h3>
              <p className="text-sm text-slate-500 italic">
                Xử lý yêu cầu của sinh viên <span className="font-bold">{targetCapstone?.name}</span>?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => handleProcessCancel("approve")} 
                disabled={processing}
                className="w-full bg-red-600 text-white font-bold rounded-xl h-11 hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Duyệt hủy"}
              </Button>
              <Button 
                onClick={() => handleProcessCancel("reject")} 
                variant="outline" 
                disabled={processing}
                className="w-full border-slate-200 text-slate-700 font-bold rounded-xl h-11 hover:bg-slate-50 disabled:opacity-50"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Không duyệt"}
              </Button>
              <button 
                onClick={() => setIsConfirmCancelOpen(false)} 
                className="w-full py-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
                disabled={processing}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      <ApproveProjectDialog 
        isOpen={isApproveOpen} 
        onClose={() => setIsApproveOpen(false)} 
        onSuccess={handleAssignSuccess}
      />

      <AssignAdvisorDialog 
        isOpen={isAdvisorOpen} 
        onClose={() => setIsAdvisorOpen(false)} 
        selectedCount={selectedRows.length} 
        selectedIds={selectedRows}
        onSuccess={handleAssignSuccess}
      />

      <AssignReviewerDialog 
        isOpen={isReviewerOpen} 
        onClose={() => setIsReviewerOpen(false)} 
        selectedCount={selectedRows.length} 
        selectedIds={selectedRows}
        onSuccess={handleAssignSuccess}
      />
    </div>
  );
}