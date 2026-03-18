/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getStudentAccess } from "@/lib/studentAccess";

import ChuaDangKy from "./ChuaDangKy";
import DeXuatMoiForm from "./DeXuatMoiForm";
import NganHangView from "./NganHangView";
import DaDangKy from "./DaDangKy";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [access] = useState(() => getStudentAccess());
  const [view, setView] = useState(() => location.state?.view ?? "");
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (location.state?.view) setView(location.state.view);
  }, [location.state?.view]);

  if (!access.internEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Đăng ký doanh nghiệp thực tập
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-lg">
              Bạn chưa mở đợt thực tập nên chưa thể sử dụng chức năng này.
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
    return <div className="p-6"><DeXuatMoiForm onBack={() => setView("empty")} onDangKy={(data) => { setView("registered"); setRegistration(data) }} /></div>;
  if (view === "ngan-hang")
    return <div className="p-6"><NganHangView onBack={() => setView("empty")} onDangKy={(data) => { setView("registered"); setRegistration(data) }} /></div>;
  if (view === "registered")
    return <div className="p-6"><DaDangKy registration={registration} onDeXuatMoi={() => setView("form-moi")} onNganHang={() => setView("ngan-hang")} /></div>;

  return <div className="p-6"><ChuaDangKy onDeXuatMoi={() => setView("form-moi")} onNganHang={() => setView("ngan-hang")} /></div>;
}
