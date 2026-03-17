import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Plus, Clock, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "sonner";

// Import các UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { planService } from "@/services/faculty";

export default function ViewPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State quản lý dữ liệu
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [notFound, setNotFound] = useState(false);
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Fetch dữ liệu kế hoạch và danh sách mốc
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch thông tin kế hoạch
        const planResponse = await planService.getPlanById(id);
        
        if (planResponse.success) {
          setPlan(planResponse.data);
          
          // Fetch danh sách mốc với phân trang
          await fetchMilestones();
        } else {
          setNotFound(true);
          toast.error(planResponse.message || "Không tìm thấy kế hoạch");
        }
      } catch (error) {
        toast.error(error.message || "Lỗi khi tải dữ liệu");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Fetch milestones khi currentPage thay đổi
  const fetchMilestones = async (page = currentPage) => {
    try {
      const milestonesResponse = await planService.getMilestonesByPlanId(id, {
        page,
        itemsPerPage
      });
      
      if (milestonesResponse.success) {
        setMilestones(milestonesResponse.data);
        if (milestonesResponse.pagination) {
          setTotalPages(milestonesResponse.pagination.total_pages);
        }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi tải danh sách mốc thời gian");
    }
  };

  useEffect(() => {
    if (id && plan) {
      fetchMilestones(currentPage);
    }
  }, [currentPage, id, plan]);

  // Format date từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Chuyển đổi loại mốc từ API sang hiển thị
  const getTypeLabel = (type) => {
    return type === "CAPSTONE" ? "Đồ án" : "Thực tập";
  };

  const getTypeClass = (type) => {
    return type === "CAPSTONE" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600";
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải thông tin kế hoạch...</p>
        </div>
      </div>
    );
  }

  if (notFound || !plan) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy kế hoạch</h2>
          <p className="text-slate-500 mb-8">Kế hoạch bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate("/faculty_staff/plans")}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/faculty_staff/plans")}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách 
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Chi tiết kế hoạch học kỳ
        </h1>
        <div className="w-32"></div>
      </div>

      {/* PHẦN 1: THÔNG TIN TỔNG QUÁT */}
      <div className="bg-[#f0f4ff] rounded-[32px] p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Năm học", value: plan.year },
            { label: "Học kỳ", value: plan.semester },
            { label: "Ngày bắt đầu", value: formatDate(plan.start_date) },
            { label: "Ngày kết thúc", value: formatDate(plan.end_date) },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">
                {item.label}
              </label>
              <Input 
                value={item.value} 
                readOnly 
                className="bg-white border-slate-200 text-center font-bold text-slate-700 rounded-xl py-5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PHẦN 2: QUẢN LÝ CÁC MỐC THỜI GIAN */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="text-purple-600 size-5" />
            <h2 className="text-lg font-bold text-slate-700 uppercase">Danh sách mốc thời gian chi tiết</h2>
          </div>
          <Button 
            onClick={() => navigate(`/faculty_staff/plans/${id}/milestone/add`)}
            className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] hover:text-[#4f46e5] font-bold border-none px-6 rounded-xl shadow-sm transition-all"
          >
            <Plus className="mr-2 size-4" /> Thêm mốc thời gian
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#e3f2fd]">
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider">Tên giai đoạn</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Loại mốc</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Ngày bắt đầu</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Ngày kết thúc</TableHead>
                <TableHead className="font-bold text-slate-800 h-14 uppercase text-xs tracking-wider text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.length > 0 ? (
                milestones.map((m) => (
                  <TableRow key={m.id} className="group transition-colors border-b border-slate-50">
                    <TableCell className="font-bold text-slate-700">{m.phase_name}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getTypeClass(m.type)}`}>
                        {getTypeLabel(m.type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-slate-600 font-medium">{formatDate(m.start_date)}</TableCell>
                    <TableCell className="text-center text-slate-600 font-medium">{formatDate(m.end_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/faculty_staff/milestone/view/${m.milestone_id}`, { state: { milestone: m } })}
                          className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase transition-all active:scale-95"
                        >
                          xem chi tiết
                        </button>
                        <button 
                          onClick={() => navigate(`/faculty_staff/milestone/edit/${m.milestone_id}`, { state: { milestone: m } })}
                          className="px-4 py-1.5 bg-[#4fd1c5] hover:bg-[#38b2ac] text-white text-[10px] font-bold rounded-full uppercase transition-all active:scale-95"
                        >
                          sửa
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Chưa có mốc thời gian nào. Hãy thêm mốc mới.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="mr-2 size-4" /> Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                    currentPage === page 
                    ? "bg-purple-600 text-white" 
                    : "text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Next <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}