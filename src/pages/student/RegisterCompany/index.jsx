import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getStudentAccess } from "@/lib/studentAccess";
import internshipService from "@/services/internship";

import ChuaDangKy from "./ChuaDangKy";
import DeXuatMoiForm from "./DeXuatMoiForm";
import NganHangView from "./NganHangView";
import DaDangKy from "./DaDangKy";
import DangKyDotThucTap from "./DangKyDotThucTap";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [access] = useState(() => getStudentAccess());
  const [view, setView] = useState(() => location.state?.view ?? "");
  const [registration, setRegistration] = useState(null);
  const [milestone, setMilestone] = useState(null); // Step 1: Milestone
  const [skipMilestone, setSkipMilestone] = useState(false); // Testing bypass
  const [prefillData, setPrefillData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const resp = await internshipService.getStatus();
        setRegistration(resp.data);
        
        // Nếu đã đăng ký doanh nghiệp (status khác INITIALIZED), chuyển sang màn hình đã đăng ký
        if (resp.data.status !== "INITIALIZED") {
          setView("registered");
        }
      } catch (error) {
        console.error("Không thể lấy trạng thái thực tập:", error);
        // Nếu chưa đăng ký đợt thực tập (404), lấy đợt đang mở
        if (error.status === 404) {
          try {
            const mResp = await internshipService.getMilestone();
            setMilestone(mResp.data);
          } catch (mErr) {
            console.error("Lỗi lấy đợt thực tập:", mErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    if (location.state?.view) setView(location.state.view);
  }, [location.state?.view]);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-4 border-[#5c60c0] border-t-transparent animate-spin rounded-full"></div>
        <p className="text-gray-500 font-medium">Đang tải trạng thái...</p>
      </div>
    );
  }

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
  
    if (!registration && milestone && !skipMilestone) {
      return (
        <div className="p-6">
          <DangKyDotThucTap milestone={milestone} onSubscribed={(data) => {
            setRegistration(data);
            setView("");
          }} />
          {/* Nút tạm thời để bỏ qua bước 1 cho DEV test */}
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" onClick={() => setSkipMilestone(true)} className="text-gray-400 text-[10px] italic">
              (Bỏ qua bước 1 - Chế độ thử nghiệm)
            </Button>
          </div>
        </div>
      );
    }

  if (view === "form-moi")
    return (
      <div className="p-6">
        <DeXuatMoiForm 
          internshipId={registration?.internship_id}
          initialData={prefillData}
          onBack={() => { setView("empty"); setPrefillData(null); }} 
          onDangKy={(data) => { setView("registered"); setRegistration(data) }} 
        />
      </div>
    );
  if (view === "ngan-hang")
    return (
      <div className="p-6">
        <NganHangView 
          onBack={() => setView("empty")} 
          onDangKy={(data) => { 
            setPrefillData(data);
            setView("form-moi");
          }} 
        />
      </div>
    );
  if (view === "registered")
    return (
      <div className="p-6">
        <DaDangKy registration={registration} onDeXuatMoi={() => { setPrefillData(null); setView("form-moi"); }} onNganHang={() => setView("ngan-hang")} />
      </div>
    );

  if (!registration && !milestone && !skipMilestone) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Đăng ký thực tập
          </div>
          <div className="p-8 text-center space-y-4">
             <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <p className="text-gray-600 font-medium">Hiện không có đợt đăng ký thực tập nào được mở.</p>
             <p className="text-sm text-gray-400">Vui lòng quay lại sau hoặc liên hệ Văn phòng khoa.</p>
             <div className="flex flex-col gap-2 pt-4">
               <Button onClick={() => navigate("/student/dashboard")} variant="outline" className="w-full">
                  Quay về trang chủ
               </Button>
               <Button onClick={() => setSkipMilestone(true)} variant="ghost" size="sm" className="text-gray-400 text-[10px] italic">
                  (Bỏ qua kiểm tra - Chế độ thử nghiệm)
               </Button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="p-6"><ChuaDangKy onDeXuatMoi={() => { setPrefillData(null); setView("form-moi"); }} onNganHang={() => setView("ngan-hang")} /></div>;
}
