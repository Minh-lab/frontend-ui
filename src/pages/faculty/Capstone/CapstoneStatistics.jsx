import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, FileDown, 
  BarChart3, Eye, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { capstoneService } from "@/services/faculty";

export default function CapstoneStatistics() {
  const navigate = useNavigate();
  
  // State cho dữ liệu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capstones, setCapstones] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  // State cho filter
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLecturer, setSelectedLecturer] = useState("all");
  const [selectedCouncil, setSelectedCouncil] = useState("all");
  
  // State cho danh sách filter
  const [statuses, setStatuses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [councils, setCouncils] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch khi filter thay đổi
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch danh sách capstones từ statistics endpoint
      const response = await capstoneService.getCapstonesByStatistics({
        page: pagination.current_page,
        itemsPerPage: pagination.items_per_page,
        semester_id: selectedSemester !== "all" ? selectedSemester : "",
        status: selectedStatus !== "all" ? selectedStatus : "",
        lecturer_id: selectedLecturer !== "all" ? selectedLecturer : "",
        council_id: selectedCouncil !== "all" ? selectedCouncil : ""
      });

      if (response.success && response.data) {
        // Response structure: { capstones, statistics, pagination }
        const capstonesData = response.data.capstones || [];
        const paginationData = response.data.pagination || {
          current_page: pagination.current_page,
          total_items: 0,
          items_per_page: pagination.items_per_page,
          total_pages: 1
        };
        const statsData = response.data.statistics || null;
        
        setCapstones(Array.isArray(capstonesData) ? capstonesData : []);
        setPagination(paginationData);
        if (statsData) setStatistics(statsData);
        setError(null); // Clear error khi dữ liệu load thành công
      } else {
        // Response không success - show error message
        const errorMsg = response.message || "Không thể lấy dữ liệu thống kê";
        setError(errorMsg);
        console.error("API Error Response:", response);
        toast.error(errorMsg);
        setCapstones([]);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Show error message từ exception
      const errorMsg = error?.message || "Lỗi khi tải dữ liệu thống kê";
      setError(errorMsg);
      toast.error(errorMsg);
      setCapstones([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.items_per_page, selectedSemester, selectedStatus, selectedLecturer, selectedCouncil]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch song song các dữ liệu filter
      const [statusesRes, lecturersRes, councilsRes, semestersRes] = await Promise.all([
        capstoneService.getCapstoneStatuses(),
        capstoneService.getLecturersForFilter(),
        capstoneService.getCouncilsForFilter(),
        capstoneService.getSemesters()
      ]);

      // Xử lý statuses
      if (statusesRes.success && Array.isArray(statusesRes.data)) {
        setStatuses(statusesRes.data.map(s => ({ id: s.id, name: s.name })));
      }
      
      // Xử lý lecturers
      if (lecturersRes.success) {
        const lecturerData = Array.isArray(lecturersRes.data.data) ? lecturersRes.data.data : lecturersRes.data;
        setLecturers(lecturerData.map(l => ({ 
          id: l.lecturer_id, 
          name: l.full_name 
        })));
      }
      
      // Xử lý councils
      if (councilsRes.success) {
        const councilData = Array.isArray(councilsRes.data.data) ? councilsRes.data.data : councilsRes.data;
        setCouncils(councilData.map(c => ({ 
          id: c.council_id, 
          name: c.name 
        })));
      }

      // Xử lý semesters
      if (semestersRes.success) {
        const semesterData = Array.isArray(semestersRes.data.data) ? semestersRes.data.data : semestersRes.data;
        setSemesters(semesterData.map(s => ({ 
          id: s.semester_id, 
          name: `${s.semester_name} - ${s.year_name}` 
        })));
      }

    } catch (error) {
      console.error("Error loading filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchStatistics();
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const handleExport = async () => {
    try {
      toast.loading("Đang xuất báo cáo...");
      const response = await capstoneService.exportStatisticsReport("excel", {
        semester_id: selectedSemester !== "all" ? selectedSemester : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        lecturer_id: selectedLecturer !== "all" ? selectedLecturer : undefined,
        council_id: selectedCouncil !== "all" ? selectedCouncil : undefined
      });
      
      if (response.success) {
        toast.success("Xuất báo cáo thành công!");
        // Nếu có URL download, có thể mở link
        if (response.data?.download_url) {
          window.open(response.data.download_url, '_blank');
        }
      } else {
        toast.error(response.message || "Xuất báo cáo thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xuất báo cáo");
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "CANCEL":
      case "FAILED":
        return "text-red-500";
      case "COMPLETED":
        return "text-green-600 font-bold";
      case "REPORTING":
      case "REVIEW_ELIGIBLE":
      case "DEFENSE_ELIGIBLE":
        return "text-yellow-600";
      default:
        return "text-slate-800";
    }
  };

  const mapStatusToVietnamese = (status) => {
    const statusMap = {
      'INITIALIZED': 'Chưa khởi tạo',
      'LECTURER_APPROVED': 'GVHD đã phê duyệt',
      'TOPIC_APPROVED': 'Đề tài đã duyệt',
      'REPORTING': 'Đang nộp báo cáo',
      'OFFICIAL_SUBMITTED': 'Nộp báo cáo cuối cùng',
      'REVIEW_ELIGIBLE': 'Chờ phản biện',
      'DEFENSE_ELIGIBLE': 'Chờ bảo vệ',
      'CANCEL': 'Đã hủy',
      'FAILED': 'Đã trượt',
      'COMPLETED': 'Hoàn tất'
    };
    return statusMap[status] || status;
  };

  if (loading && capstones.length === 0) {
    return (
      <div className="p-8 min-h-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 pb-20 bg-[#f8fafc]">
      
      {/* NÚT QUAY LẠI */}
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/faculty_staff/capstones")} 
          className="p-0 hover:bg-transparent text-slate-500 font-bold hover:text-indigo-600 transition-colors flex items-center"
        >
          <ChevronLeft className="size-5 mr-1" /> QUAY LẠI
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-[0.2em] mb-10">
        Thống kê sinh viên thực hiện đồ án
      </h1>

      {/* 1. BỘ LỌC THỐNG KÊ */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="Học kỳ" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả học kỳ</SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem.id} value={String(sem.id)}>{sem.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="GVHD" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả giảng viên</SelectItem>
              {lecturers.map(lecturer => (
                <SelectItem key={lecturer.id} value={String(lecturer.id)}>{lecturer.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCouncil} onValueChange={setSelectedCouncil}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="Hội đồng" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả hội đồng</SelectItem>
              {councils.map(council => (
                <SelectItem key={council.id} value={String(council.id)}>{council.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleFilter}
          className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-2xl font-bold shadow-md h-11 transition-all active:scale-95"
        >
          Thống kê
        </Button>
      </div>

      {/* 2. CHỈ SỐ CHI TIẾT - Lấy từ statistics API */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 max-w-6xl mx-auto px-4">
        <div className="space-y-1.5 text-sm">
          <p className="font-bold text-slate-700">
            Tổng sinh viên thực hiện đồ án: <span className="text-slate-900 ml-1 font-extrabold">{statistics?.total_capstones || 0}</span>
          </p>
          <p className="font-bold text-slate-700">
            Số sinh viên đã hoàn thành: <span className="text-slate-900 ml-1 font-extrabold">{statistics?.completed || 0}</span>
          </p>
          <p className="font-bold text-slate-700">
            Số sinh viên chưa có GVHD: <span className="text-slate-900 ml-1 font-extrabold">{statistics?.no_gvhd || 0}</span>
          </p>
          <p className="font-bold text-slate-700">
            Số sinh viên chưa có GVPB: <span className="text-slate-900 ml-1 font-extrabold">{statistics?.no_gvpb || 0}</span>
          </p>
        </div>
        
        <Button 
          onClick={handleExport}
          className="bg-[#7786d1] hover:bg-[#5c6bb2] text-white px-10 rounded-2xl font-bold shadow-md h-11 flex items-center gap-2 transition-all"
        >
          <FileDown className="size-4" /> Xuất báo cáo
        </Button>
      </div>

      {/* 3. BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <Button 
              onClick={fetchStatistics}
              className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl font-bold"
            >
              Thử lại
            </Button>
          </div>
        ) : capstones.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 font-bold">Không có dữ liệu đồ án</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#e3f2fd]">
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="w-16 font-bold text-slate-800 uppercase text-[11px] text-center">STT</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Mã SV</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Tên sinh viên</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Lớp</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Trạng thái</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px]">GVHD</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px]">GVPB</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Hội đồng</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Điểm</TableHead>
                <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capstones.map((item, index) => (
                <TableRow key={item.capstone_id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-bold text-slate-400">
                    {(pagination.current_page - 1) * pagination.items_per_page + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">{item.student_code || "---"}</TableCell>
                  <TableCell className="font-bold text-slate-700 capitalize">{item.student_name || "---"}</TableCell>
                  <TableCell className="text-center text-slate-600 font-medium">{item.class_name || "---"}</TableCell>
                  <TableCell className="text-center font-bold">
                    <span className={getStatusClass(item.status)}>
                      {mapStatusToVietnamese(item.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-700 font-medium">{item.lecturer_name || "---"}</TableCell>
                  <TableCell className="text-slate-400 italic text-xs">
                    {item.reviewers_name || "---"}
                  </TableCell>
                  <TableCell className="text-slate-400 italic text-xs">{item.council_name || "---"}</TableCell>
                  <TableCell className="text-center font-bold text-indigo-600">
                    {item.council_grade || <span className="text-slate-300">---</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => navigate(`/faculty_staff/capstone/detail/${item.capstone_id}`)}
                        className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full transition-all shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        xem chi tiết
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 4. PHÂN TRANG */}
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
            {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
              let pageNum;
              if (pagination.total_pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.current_page <= 3) {
                pageNum = i + 1;
              } else if (pagination.current_page >= pagination.total_pages - 2) {
                pageNum = pagination.total_pages - 4 + i;
              } else {
                pageNum = pagination.current_page - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-sm transition-colors ${
                    pagination.current_page === pageNum
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-100 text-slate-400"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
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
    </div>
  );
}