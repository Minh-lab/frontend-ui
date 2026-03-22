import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getStudentAccess } from "@/lib/studentAccess";
import studentService from "@/services/studentService";

import ChuaDangKy from "./ChuaDangKy";
import DeXuatMoiForm from "./DeXuatMoiForm";
import NganHangView from "./NganHangView";
import DaDangKy from "./DaDangKy";

export default function DangKyDeTaiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [access] = useState(() => getStudentAccess());
  const [view, setView] = useState("empty");
  const [topic, setTopic] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);
        const response = await studentService.getMyCapstoneStatus();
        const capstone = response?.data;

        if (capstone) {
          setTopic({
            title: capstone.topic?.title,
            linhVuc: capstone.topic?.expertise?.name,
            lecturer: {
              name: capstone.lecturer?.full_name || "Chua phan cong",
              lecturer_id: capstone.lecturer?.lecturer_id || null,
            },
            technologies: capstone.topic?.technologies,
            description: capstone.topic?.description,
            fileDeCuong: null,
            requestStatus: capstone.status,
          });
          setView("registered");
        } else {
          setTopic(null);
          setView(location.state?.view ?? "empty");
        }
      } catch (error) {
        setTopic(null);
        setView(location.state?.view ?? "empty");
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [location.state?.view]);

  // Function to handle registration and persistence
  const handleDangKy = (dt) => {
    setView("registered");
    setTopic(dt);
  };

  const handleUpdateView = (nextView) => {
    setView(nextView);
  };




  if (!access.projectEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Đăng ký đề tài
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-lg">
              Bạn chưa mở đợt đồ án nên chưa thể sử dụng chức năng này.
            </div>
            <Button onClick={() => navigate("/student/dashboard")} className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white">
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingStatus) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Dang ky de tai
          </div>
          <div className="p-8 text-center text-gray-500">Dang tai trang thai de tai...</div>
        </div>
      </div>
    );
  }

  if (view === "form-moi")
    return <div className="p-6"><DeXuatMoiForm onBack={() => handleUpdateView("empty")} onDangKy={handleDangKy} /></div>;
  if (view === "ngan-hang")
    return <div className="p-6"><NganHangView onBack={() => handleUpdateView("empty")} onDangKy={handleDangKy} /></div>;
  if (view === "registered")
    return <div className="p-6"><DaDangKy topic={topic} onDeXuatMoi={() => handleUpdateView("form-moi")} onNganHang={() => handleUpdateView("ngan-hang")} /></div>;

  return <div className="p-6"><ChuaDangKy onDeXuatMoi={() => handleUpdateView("form-moi")} onNganHang={() => handleUpdateView("ngan-hang")} /></div>;
}
