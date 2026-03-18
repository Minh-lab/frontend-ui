import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, BookOpen, Building2, User, Calendar, Award } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import internshipService from "@/services/faculty/internshipService";

export default function ViewInternshipDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const response = await internshipService.getInternshipDetail(id);
        if (response.success) {
          setInternship(response.data);
        } else {
          toast.error(response.message || "Lỗi tải chi tiết thực tập");
          navigate("/faculty_staff/internships");
        }
      } catch (error) {
        toast.error("Lỗi tải chi tiết thực tập");
        console.error("Error loading internship detail:", error);
        navigate("/faculty_staff/internships");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadDetail();
    }
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Không tìm thấy thông tin thực tập</p>
          <Button onClick={() => navigate("/faculty_staff/internships")} className="bg-[#9b59b6] text-white px-6 rounded-xl font-bold">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const STATUS_COLORS = {
    "Yêu cầu đăng ký công ty": "bg-amber-100 text-amber-700",
    "Yêu cầu hủy": "bg-orange-100 text-orange-700",
    "Chưa có dữ liệu": "bg-slate-100 text-slate-500",
    "Đã có GVHD": "bg-blue-100 text-blue-700",
    "Đã có DN": "bg-indigo-100 text-indigo-700",
    "Đang thực tập": "bg-cyan-100 text-cyan-700",
    "Bị hủy": "bg-red-100 text-red-600",
    "Hoàn thành": "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/faculty_staff/internships")}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="size-6 text-slate-600" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Chi tiết Thực tập</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#5c56be] to-[#7786d1] p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{internship.name}</h2>
                <p className="text-blue-100 text-lg">Mã sinh viên: {internship.id}</p>
              </div>
              <span className={`px-6 py-2 rounded-full font-bold text-sm ${STATUS_COLORS[internship.status]}`}>
                {internship.status}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-10 space-y-8">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 uppercase flex items-center gap-2">
                  <User className="size-5 text-[#5c56be]" /> Thông tin sinh viên
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lớp:</span>
                    <span className="font-semibold text-slate-800">{internship.class}</span>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 uppercase flex items-center gap-2">
                  <Calendar className="size-5 text-[#5c56be]" /> Trạng thái
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trạng thái hiện tại:</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${STATUS_COLORS[internship.status]}`}>
                      {internship.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Info */}
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-lg font-bold text-slate-800 uppercase flex items-center gap-2 mb-4">
                <Building2 className="size-5 text-[#5c56be]" /> Thông tin Doanh nghiệp
              </h3>
              <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tên doanh nghiệp:</span>
                  <span className="font-semibold text-slate-800">
                    {internship.enterprise !== "---" ? internship.enterprise : "Chưa có"}
                  </span>
                </div>
              </div>
            </div>

            {/* Lecturer Info */}
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-lg font-bold text-slate-800 uppercase flex items-center gap-2 mb-4">
                <BookOpen className="size-5 text-[#5c56be]" /> Thông tin Giảng viên hướng dẫn
              </h3>
              <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tên giảng viên:</span>
                  <span className="font-semibold text-slate-800">
                    {internship.lecturer ? internship.lecturer : "Chưa có"}
                  </span>
                </div>
              </div>
            </div>

            {/* Score Info */}
            {internship.score !== null && internship.score !== undefined && (
              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-bold text-slate-800 uppercase flex items-center gap-2 mb-4">
                  <Award className="size-5 text-[#5c56be]" /> Điểm số
                </h3>
                <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Điểm thực tập:</span>
                    <span className="font-bold text-2xl text-[#5c56be]">{internship.score}/10</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-slate-200 pt-8 flex gap-4 justify-end">
              <Button
              onClick={() => navigate("/faculty_staff/internships")}
                className="bg-slate-200 text-slate-800 hover:bg-slate-300 px-8 font-bold rounded-xl"
              >
                <ArrowLeft className="mr-2 size-4" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
