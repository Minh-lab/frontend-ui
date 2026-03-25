import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button"; 
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"; 

// Import service
import { lecturerService } from "@/services/faculty";

export default function ManageLecturers() {
  const navigate = useNavigate();
  
  // State cho dữ liệu
  const [loading, setLoading] = useState(true);
  const [lecturers, setLecturers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 5
  });

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch dữ liệu khi searchTerm hoặc current_page thay đổi
  useEffect(() => {
    fetchLecturers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, searchTerm]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.current_page,
        itemsPerPage: pagination.items_per_page,
        search: searchTerm
      };
      
      const response = await lecturerService.getLecturers(params);

      if (response.success) {
        setLecturers(response.data.lecturers);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput); // Cập nhật searchTerm
    setPagination(prev => ({ ...prev, current_page: 1 })); // Reset về trang 1
    // useEffect sẽ tự động gọi fetchLecturers vì searchTerm thay đổi
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Hoạt động":
        return "bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm";
      case "Yêu cầu nghỉ phép":
        return "bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm";
      case "Nghỉ phép":
        return "bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm";
      case "Ngưng công tác":
        return "bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm";
      default:
        return "bg-slate-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm";
    }
  };

  if (loading && lecturers.length === 0) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải danh sách giảng viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Tiêu đề trang căn giữa theo mẫu */}
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Danh sách giảng viên
      </h1>

      {/* Thanh tìm kiếm - phải nhấn nút mới tìm */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên giảng viên"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
          />
        </div>

        <Button 
          type="submit"
          className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-full font-bold shadow-md transition-all active:scale-95"
        >
          Tìm kiếm
        </Button>
      </form>

      {/* Bảng danh sách giảng viên */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider">Mã GV</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider">Tên giảng viên</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider">Chuyên môn</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase text-xs tracking-wider text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lecturers.length > 0 ? (
              lecturers.map((lecturer) => (
                <TableRow key={lecturer.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                  <TableCell className="text-slate-600 font-medium">{lecturer.id}</TableCell>
                  <TableCell className="font-bold text-slate-700 capitalize">{lecturer.name}</TableCell>
                  <TableCell className="text-slate-600">{lecturer.specialization}</TableCell>
                  <TableCell className="text-center">
                    <span className={getStatusColor(lecturer.status)}>
                      {lecturer.status?.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => navigate(`/faculty_staff/lecturers/view/${lecturer.id}`)}
                        className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase transition-all shadow-sm active:scale-95"
                      >
                        xem chi tiết
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Không có dữ liệu giảng viên
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      {pagination.total_pages > 0 && (
        <div className="flex items-center justify-center gap-6 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>

          <div className="flex gap-1">
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
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    pagination.current_page === pageNum 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-400 hover:bg-slate-100"
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
            className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Next <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      )}

      {/* Hiển thị tổng số bản ghi */}
      {pagination.total_items > 0 && (
        <div className="text-center text-sm text-slate-400">
          Hiển thị {((pagination.current_page - 1) * pagination.items_per_page) + 1} - {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} trên tổng số {pagination.total_items} giảng viên
        </div>
      )}
    </div>
  );
}