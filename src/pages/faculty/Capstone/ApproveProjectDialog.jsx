import React, { useState, useEffect } from "react";
import { X, Search, ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { capstoneService } from "@/services/faculty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ApproveProjectDialog({ isOpen, onClose, onSuccess }) {
  const [view, setView] = useState("list"); // "list" hoặc "detail"
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // State cho danh sách đăng ký
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 5
  });
  
  // State cho filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [majors, setMajors] = useState([]);
  
  // State cho xử lý
  const [processing, setProcessing] = useState(false);

  // Fetch dữ liệu khi mở dialog
  useEffect(() => {
    if (isOpen && view === "list") {
      fetchRegistrations();
      fetchMajors();
    }
  }, [isOpen, view, pagination.current_page, searchTerm, selectedMajor]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await capstoneService.getRegistrations({
        page: pagination.current_page,
        itemsPerPage: pagination.items_per_page,
        search: searchTerm,
        major: selectedMajor,
        status: "Chờ duyệt"
      });

      if (response.success) {
        setRegistrations(response.data.registrations);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await capstoneService.getCapstoneMajors();
      if (response.success) {
        setMajors(response.data);
      }
    } catch (error) {
      console.error("Lỗi tải chuyên ngành:", error);
    }
  };

  const handleOpenDetail = (item) => {
    setSelectedTopic(item);
    setView("detail");
  };

  const handleAction = async (type) => {
    try {
      setProcessing(true);
      
      if (type === "approve") {
        const response = await capstoneService.approveRegistration(selectedTopic.id);
        
        if (response.success) {
          toast.success(`Đã phê duyệt đề tài của ${selectedTopic.name}`);
          if (onSuccess) onSuccess();
          setView("list");
          // Refresh lại danh sách
          fetchRegistrations();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await capstoneService.rejectRegistration(selectedTopic.id);
        
        if (response.success) {
          toast.error(`Đã từ chối đề tài của ${selectedTopic.name}`);
          setView("list");
          // Refresh lại danh sách
          fetchRegistrations();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xử lý đề tài");
    } finally {
      setProcessing(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchRegistrations();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-white">
        
        {/* HEADER */}
        <div className="bg-[#5c56be] p-5 flex justify-between items-center relative text-white">
          <h2 className="text-2xl font-bold px-4 uppercase tracking-wide text-[18px]">
            {view === "list" ? "Danh sách đăng ký đề tài" : "Yêu cầu duyệt đồ án"}
          </h2>
          <button 
            onClick={() => { 
              setView("list"); 
              onClose(); 
            }} 
            className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-16 flex items-center justify-center font-bold text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-10">
          {view === "list" ? (
            /* --- GIAO DIỆN DANH SÁCH --- */
            <div className="space-y-6">
              {/* Thanh tìm kiếm và filter */}
              <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mã SV, đề tài..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                  <SelectTrigger className="w-40 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Chuyên môn" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tất cả</SelectItem>
                    {majors.map(major => (
                      <SelectItem key={major} value={major}>{major}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-6 rounded-xl">
                  Tìm
                </Button>
              </form>

              {/* Bảng dữ liệu */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Mã SV</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Tên sinh viên</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Lớp</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Đề tài</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Chuyên môn</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Trạng thái</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase text-[11px] text-center">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600" />
                        </TableCell>
                      </TableRow>
                    ) : registrations.length > 0 ? (
                      registrations.map((item) => (
                        <TableRow key={item.id} className="border-b border-slate-50">
                          <TableCell className="text-slate-600 text-xs">{item.id}</TableCell>
                          <TableCell className="font-bold text-slate-700 text-xs">{item.name}</TableCell>
                          <TableCell className="text-slate-600 text-xs">{item.class}</TableCell>
                          <TableCell className="text-slate-600 text-xs italic max-w-[150px] truncate" title={item.topic}>
                            {item.topic}
                          </TableCell>
                          <TableCell className="text-slate-600 text-xs">{item.major}</TableCell>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          Không có đăng ký nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Phân trang */}
              {pagination.total_pages > 0 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="rounded-xl h-8 w-24 gap-2 text-slate-400 border-slate-200"
                  >
                    <ChevronLeft className="size-4" /> Previous
                  </Button>
                  
                  <div className="flex gap-1 items-center px-4">
                    <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm">
                      {pagination.current_page}
                    </span>
                    <span className="text-slate-400 font-bold text-sm">/</span>
                    <span className="text-slate-400 font-bold text-sm">
                      {pagination.total_pages}
                    </span>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.total_pages}
                    className="rounded-xl h-8 w-24 gap-2 text-slate-400 border-slate-200"
                  >
                    Next <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* --- GIAO DIỆN CHI TIẾT PHÊ DUYỆT --- */
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 px-4">
                <div className="space-y-6">
                  <p className="text-[18px] text-slate-800">
                    <span className="font-bold">Mã Sinh Viên:</span> {selectedTopic?.id}
                  </p>
                  <p className="text-[18px] text-slate-800">
                    <span className="font-bold">Tên Sinh Viên:</span> {selectedTopic?.name}
                  </p>
                  <p className="text-[18px] text-slate-800">
                    <span className="font-bold">Lớp:</span> {selectedTopic?.class}
                  </p>
                </div>
                <div className="space-y-6">
                  <p className="text-[18px] text-slate-800">
                    <span className="font-bold">Tên Đề Tài:</span> {selectedTopic?.topic}
                  </p>
                  <p className="text-[18px] text-slate-800">
                    <span className="font-bold">Mô tả:</span> {selectedTopic?.description}
                  </p>
                  <p className="text-[18px] text-slate-800">
                    <span className="font-bold">Chuyên môn:</span> {selectedTopic?.major}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-12 pt-8">
                <Button 
                  onClick={() => handleAction("reject")}
                  disabled={processing}
                  className="bg-[#c24238] hover:bg-red-800 text-white font-bold px-12 py-6 rounded-xl text-lg shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Từ chối"}
                </Button>
                <Button 
                  onClick={() => handleAction("approve")}
                  disabled={processing}
                  className="bg-[#5c6bb2] hover:bg-indigo-800 text-white font-bold px-12 py-6 rounded-xl text-lg shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Chấp nhận"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}