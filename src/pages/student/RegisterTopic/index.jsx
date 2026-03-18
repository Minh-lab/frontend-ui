import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getStudentAccess } from "@/lib/studentAccess";

import ChuaDangKy from "./ChuaDangKy";
import DeXuatMoiForm from "./DeXuatMoiForm";
import NganHangView from "./NganHangView";
import DaDangKy from "./DaDangKy";

const STORAGE_KEY = "student_registered_topic";

export default function DangKyDeTaiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [access] = useState(() => getStudentAccess());

  // Initialize state from localStorage
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { view: savedView } = JSON.parse(saved);
      return savedView;
    }
    return location.state?.view ?? "empty";
  });

  const [topic, setTopic] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { topic: savedTopic } = JSON.parse(saved);
      return savedTopic;
    }
    return null;
  });

  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view);
    }
  }, [location.state?.view]);

  // Function to handle registration and persistence
  const handleDangKy = (dt) => {
    const nextView = "registered";

    // Convert File object to string name for serialization
    const serializableTopic = { ...dt };
    if (dt.fileDeCuong instanceof File) {
      serializableTopic.fileDeCuong = dt.fileDeCuong.name;
    }

    setView(nextView);
    setTopic(serializableTopic);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ view: nextView, topic: serializableTopic }));
  };

  const handleUpdateView = (nextView) => {
    setView(nextView);
    const saved = localStorage.getItem(STORAGE_KEY);
    const existingTopic = saved ? JSON.parse(saved).topic : null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ view: nextView, topic: existingTopic }));
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

  if (view === "form-moi")
    return <div className="p-6"><DeXuatMoiForm onBack={() => handleUpdateView("empty")} onDangKy={handleDangKy} /></div>;
  if (view === "ngan-hang")
    return <div className="p-6"><NganHangView onBack={() => handleUpdateView("empty")} onDangKy={handleDangKy} /></div>;
  if (view === "registered")
    return <div className="p-6"><DaDangKy topic={topic} onDeXuatMoi={() => handleUpdateView("form-moi")} onNganHang={() => handleUpdateView("ngan-hang")} /></div>;

  return <div className="p-6"><ChuaDangKy onDeXuatMoi={() => handleUpdateView("form-moi")} onNganHang={() => handleUpdateView("ngan-hang")} /></div>;
}
