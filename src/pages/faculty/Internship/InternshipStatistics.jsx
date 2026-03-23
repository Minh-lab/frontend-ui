import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Search, 
  FileDown, BarChart3, Eye 
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
import internshipService from "@/services/faculty/internshipService";

export default function InternshipStatistics() {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    semester_id: "all",
    status: "all",
    lecturer_id: "all",
    company_id: "all",
    page: 1,
    perPage: 10
  });

  // Load initial data (filters)
  useEffect(() => {
    fetchFilterData();
  }, []);

  // Load statistics when filters change
  useEffect(() => {
    loadStatistics();
  }, [filters]);

  const fetchFilterData = async () => {
    try {
      const [semestersRes, lecturersRes, companiesRes] = await Promise.all([
        internshipService.getSemesters(),
        internshipService.getLecturersForFilter(),
        internshipService.getCompaniesForFilter()
      ]);

      if (semestersRes.success) {
        const semesterData = Array.isArray(semestersRes.data) ? semestersRes.data : semestersRes.data?.data || [];
        setSemesters(semesterData.map(s => ({
          id: s.semester_id,
          name: `${s.semester_name} - ${s.year_name || ''}`.trim()
        })));
      }

      if (lecturersRes.success) {
        const lecturerData = Array.isArray(lecturersRes.data) ? lecturersRes.data : lecturersRes.data?.data || [];
        setLecturers(lecturerData.map(l => ({
          id: l.lecturer_id,
          name: l.full_name
        })));
      }

      if (companiesRes.success) {
        const companyData = Array.isArray(companiesRes.data) ? companiesRes.data : companiesRes.data?.data || [];
        setCompanies(companyData.map(c => ({
          id: c.company_id,
          name: c.name
        })));
      }
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await internshipService.getStatistics(filters);
      if (response.success && response.data) {
        setStatistics(response.data.statistics);
        setStudents(response.data.students || []);
      } else {
        toast.error(response.message || "Lỗi tải thống kê");
      }
    } catch (error) {
      toast.error("Lỗi tải thống kê");
      console.error("Error loading statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1  // Reset to first page when filter changes
    }));
  };

  const handleApplyFilters = () => {
    loadStatistics();
  };

  const handleExport = async () => {
    try {
      await internshipService.exportReport(filters);
      toast.success("Báo cáo đã được tải xuống");
    } catch (error) {
      toast.error("Lỗi xuất báo cáo");
      console.error("Error exporting report:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "Đang chờ":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "Không đạt":
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "Bị hủy":
      case "CANCEL":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Nút quay lại */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="p-0 hover:bg-transparent text-slate-500 font-bold hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="size-5 mr-1" /> QUAY LẠI
      </Button>

      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-[0.2em] mb-10">
        Thống kê quản lý thực tập
      </h1>

      {/* 1. BỘ LỌC THỐNG KÊ (Hàng trên cùng) */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <Select value={filters.semester_id} onValueChange={(value) => handleFilterChange("semester_id", value)}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="Học kỳ" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả học kỳ</SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem.id} value={sem.id.toString()}>
                  {sem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="INTERNING">Đang thực tập</SelectItem>
              <SelectItem value="FAILED">Không đạt</SelectItem>
              <SelectItem value="CANCEL">Bị hủy</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.lecturer_id} onValueChange={(value) => handleFilterChange("lecturer_id", value)}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="GVHD" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả giảng viên</SelectItem>
              {lecturers.map((lec) => (
                <SelectItem key={lec.id} value={lec.id.toString()}>
                  {lec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.company_id} onValueChange={(value) => handleFilterChange("company_id", value)}>
            <SelectTrigger className="rounded-xl border-slate-200">
              <SelectValue placeholder="Doanh nghiệp" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả doanh nghiệp</SelectItem>
              {companies.map((comp) => (
                <SelectItem key={comp.id} value={comp.id.toString()}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleApplyFilters}
          className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-2xl font-bold shadow-md h-11 transition-all active:scale-95"
        >
          Thống kê
        </Button>
      </div>

      {/* 2. CHỈ SỐ VÀ NÚT XUẤT BÁO CÁO */}
      {statistics && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
          <div className="space-y-2">
            <p className="font-bold text-slate-700">
              Tổng sinh viên hoàn thành thực tập: <span className="text-green-600">{statistics.total_completed}</span>
            </p>
            <p className="font-bold text-slate-700">
              Số sinh viên chưa hoàn thành: <span className="text-orange-600">{statistics.total_incompleted}</span>
            </p>
            <p className="font-bold text-slate-700">
              Tổng cộng: <span className="text-indigo-600">{statistics.total_students}</span>
            </p>
          </div>
          
          <Button 
            onClick={handleExport}
            className="bg-[#7786d1] hover:bg-[#5c6bb2] text-white px-8 rounded-2xl font-bold shadow-md h-11 flex items-center gap-2"
          >
            <FileDown className="size-4" /> Xuất báo cáo
          </Button>
        </div>
      )}

      {/* 3. BẢNG DỮ LIỆU THỐNG KÊ */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-16 font-bold text-slate-800 uppercase text-[11px] text-center">STT</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Lớp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">GVHD</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px]">Tên doanh nghiệp</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Điểm QT</TableHead>
              <TableHead className="font-bold text-slate-800 uppercase text-[11px] text-center">Điểm TK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="9" className="text-center py-8 text-slate-500">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan="9" className="text-center py-8 text-slate-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              students.map((item, index) => (
                <TableRow key={item.internship_id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-bold text-slate-400">{index + 1}</TableCell>
                  <TableCell className="font-bold text-slate-700" title={item.student?.usercode}>{item.student?.usercode || 'N/A'}</TableCell>
                  <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{item.class}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-700 font-medium">{item.lecturer || "---"}</TableCell>
                  <TableCell className="text-slate-600 italic max-w-[150px] truncate">{item.enterprise}</TableCell>
                  <TableCell className="text-center font-semibold">{item.process_score || 0}</TableCell>
                  <TableCell className="text-center font-semibold">{item.exam_score !== null ? item.exam_score : "Chưa chấm"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}