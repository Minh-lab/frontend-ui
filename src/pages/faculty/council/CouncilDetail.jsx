import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ dự án
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import Council Service
import { councilService } from "@/services/faculty";

export default function CouncilDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [council, setCouncil] = useState(null);
  const [members, setMembers] = useState([]);

  // Lấy dữ liệu chi tiết hội đồn
  useEffect(() => {
    fetchCouncilDetail();
  }, [id]);

  const fetchCouncilDetail = async () => {
    setLoading(true);
    try {
      // Lấy danh sách thành viên
      const response = await councilService.getCouncilMembers(id);
      
      if (response.success) {
        setCouncil(response.data.council);
        setMembers(response.data.members || []);
      } else {
        toast.error(response.message || "Lỗi khi tải chi tiết hội đồng");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải chi tiết hội đồng");
      console.error("Error fetching council detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Tiêu đề trang chính giữa */}
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Chi tiết hội đồng
      </h1>

      <div className="flex justify-between items-start">
        {/* Nút Quay lại */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="bg-[#C6D2FF] hover:bg-[#B4C2FF] text-[#1E3A8A] font-bold border-none rounded-xl px-6"
        >
          ← Quay lại
        </Button>

        {/* Nút Thay đổi hội đồng trỏ về path edit */}
        <Button
          onClick={() => navigate(`/faculty_staff/councils/edit/${id}`)}
          className="bg-[#C6D2FF] hover:bg-[#B4C2FF] text-[#1E3A8A] font-bold border-none rounded-xl px-6 shadow-sm"
        >
          Thay đổi hội đồng
        </Button>
      </div>

      {/* Thông tin văn bản */}
      <div className="space-y-6 px-4">
        <div>
          <p className="text-lg font-bold text-slate-800">
            Tên hội đồng: <span className="font-medium">{council?.name}</span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-slate-500 uppercase text-sm tracking-wider">
            Thành viên hội đồng
          </p>
          <div className="space-y-2 ml-2">
            {members && members.length > 0 ? (
              members.map((member, index) => (
                <p key={member.lecturer_id} className="font-bold text-slate-700">
                  {index + 1}. {member.name} - {member.degree} - {member.department}
                </p>
              ))
            ) : (
              <p className="text-slate-500 italic">Không có thành viên</p>
            )}
          </div>
        </div>
      </div>

      {/* Bảng chi tiết học kỳ và địa điểm */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#E2F2FF]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-slate-700 text-center">Ngày bắt đầu</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Ngày kết thúc</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Tòa</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Phòng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-none">
              <TableCell className="text-center font-bold text-slate-600 py-6">
                {council?.start_date ? new Date(council.start_date).toLocaleDateString('vi-VN') : 'N/A'}
              </TableCell>
              <TableCell className="text-center font-bold text-slate-600">
                {council?.end_date ? new Date(council.end_date).toLocaleDateString('vi-VN') : 'N/A'}
              </TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.buildings || 'N/A'}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.rooms || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}