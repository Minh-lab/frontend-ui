import { useEffect, useState } from "react";
import { student } from "../../data/studentData";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import profileStudent from "@/services/student/profileStudent";

function Field({ label, value }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-44 text-right text-sm font-semibold text-[#5c60c0] flex-shrink-0">{label}</span>
      <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">{value}</div>
    </div>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ProfilePage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileStudent.getProfile();
        setProfile(data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
        <div className="bg-[#5c60c0] px-6 py-5 flex items-center gap-4 text-white">
          <div>
            <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
            <p className="text-blue-200 text-sm">{profile?.user?.usercode}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Mã sinh viên:" value={profile?.user?.usercode} />
          <Field label="Họ và tên:" value={profile?.user?.full_name} />
          <Field label="Ngày sinh:" value={formatDate(profile?.user?.dob)} />
          <Field label="Giới tính:" value={profile?.user?.gender} />
          <Field label="Email:" value={profile?.user?.email} />
          <Field label="Lớp:" value={profile?.user?.class} />
          <Field label="GPA:" value={profile?.user?.gpa} />
          <Field label="Ngành:" value={profile?.user?.major} />

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Sử dụng ChangePasswordModal với đúng props */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}