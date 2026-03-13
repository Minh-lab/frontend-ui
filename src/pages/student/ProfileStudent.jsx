import { useEffect, useState } from "react";
import { student } from "../../data/studentData";
import ChangePassword from "@/components/layouts/ChangePassword";
import api from "@/lib/api";

function Field({ label, value }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-44 text-right text-sm font-semibold text-[#5c60c0] flex-shrink-0">{label}</span>
      <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const [showPwd, setShowPwd] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    api.get("/profile")
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy profile:", err);
      });
  }, []); // 👈 CHỈ GỌI 1 LẦN

  if (!profile) return <p>Loading...</p>;
  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
        <div className="bg-[#5c60c0] px-6 py-5 flex items-center gap-4 text-white">
          <div>
            <h2 className="text-xl font-bold">Thong tin ca nhan</h2>
            
            <p className="text-blue-200 text-sm">{profile.usercode}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Ma sinh vien:" value={profile.user?.usercode} />
          <Field label="Ho va ten:" value={profile.user?.full_name} />
          <Field label="Ngay sinh:" value={profile.user?.dob?new Date(profile.user.dob).getFullYear() : ''} />
          <Field label="Gioi tinh:" value={profile.user?.gender} />
          <Field label="Email:" value={profile.user?.email} />
          <Field label="Lop:" value={profile.user?.class} />
          <Field label="Khoa:" value={profile.user?.class} />

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowPwd(true)} className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow">Doi mat khau</button>
          </div>
        </div>
      </div>

      {showPwd && (
        <ChangePassword setShowPwC={() => setShowPwd(false)}/>
      )}
    </div>
  );
}
