import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Users } from "lucide-react";

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

export default function CouncilDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [council, setCouncil] = useState(null);

  // Giả lập lấy dữ liệu chi tiết hội đồng
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      // Giả lập gọi API
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setCouncil({
        id: id,
        name: "Hội đồng 1",
        members: [
          "Giảng viên 1",
          "Giảng viên 2",
          "Giảng viên 3",
          "Giảng viên 4",
          "Giảng viên 5",
        ],
        semester: "2024_2025_1",
        startDate: "15/7/2025",
        endDate: "17/7/2025",
        studentCount: 35,
        building: "A1",
        room: "302",
      });
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

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
            {council?.members.map((member, index) => (
              <p key={index} className="font-bold text-slate-700">
                {index + 1}. {member}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng chi tiết học kỳ và địa điểm */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#E2F2FF]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-slate-700 text-center">Học kỳ</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Ngày bắt đầu</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Ngày kết thúc</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Số sinh viên</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Tòa</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Phòng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-none">
              <TableCell className="text-center font-bold text-slate-600 py-6">{council?.semester}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.startDate}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.endDate}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.studentCount}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.building}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{council?.room}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}