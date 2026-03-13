import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư viện của bạn
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { planService } from "@/services/faculty";

export default function ManagePlans() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 3
  });
  
  const itemsPerPage = 3;

  // Fetch plans từ API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planService.getPlans({
        page: currentPage,
        itemsPerPage: itemsPerPage
      });

      if (response.success) {
        setPlans(response.data.plans);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách học kỳ");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi currentPage thay đổi
  useEffect(() => {
    fetchPlans();
  }, [currentPage]);

  // Format date từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loading && plans.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải danh sách học kỳ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header: Tiêu đề và Nút thêm mới */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
          Danh sách học kỳ
        </h1>
        <Button 
            variant="outline"
            onClick={() => navigate("/faculty_staff/plans/add")}
            className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] hover:text-[#4f46e5] font-bold border-none px-5 rounded-lg shadow-sm transition-colors"
            >
            <Plus className="mr-2 size-4" /> Thêm học kỳ
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-20 text-center font-bold text-slate-800 h-12 uppercase tracking-wider">STT</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Năm học</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Học kỳ</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Ngày bắt đầu</TableHead>
              <TableHead className="font-bold text-slate-800 h-12 uppercase tracking-wider">Ngày kết thúc</TableHead>
              <TableHead className="w-40 text-center font-bold text-slate-800 h-12 uppercase tracking-wider">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length > 0 ? (
              plans.map((item, index) => (
                <TableRow key={item.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                  <TableCell className="text-center text-slate-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">
                    {item.year}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {item.semester}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDate(item.start_date)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDate(item.end_date)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/faculty_staff/plans/view/${item.id}`)}
                        className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-xs font-bold rounded-full transition-all shadow-sm active:scale-95"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Chưa có học kỳ nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang (Pagination) */}
      {pagination.total_pages > 0 && (
        <div className="flex items-center justify-center gap-6 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                  currentPage === page 
                  ? "bg-slate-50 text-slate-800 border border-slate-200 shadow-sm" 
                  : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
            disabled={currentPage === pagination.total_pages}
            className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Next <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      )}

      {/* Hiển thị tổng số bản ghi */}
      {pagination.total_items > 0 && (
        <div className="text-center text-sm text-slate-400">
          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination.total_items)} trên tổng số {pagination.total_items} học kỳ
        </div>
      )}
    </div>
  );
}