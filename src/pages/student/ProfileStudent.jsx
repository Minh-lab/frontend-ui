import { useEffect, useState } from "react";
import { student } from "../../data/studentData";
import ChangePasswordModal from "@/components/ChangePasswordModal";

function Field({ label, value }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-44 text-right text-sm font-semibold text-[#5c60c0] flex-shrink-0">{label}</span>
      <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
        <div className="bg-[#5c60c0] px-6 py-5 flex items-center gap-4 text-white">
          <div>
            <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
            <p className="text-blue-200 text-sm">{student.maSV}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Mã sinh viên:" value={student.maSV} />
          <Field label="Họ và tên:" value={student.hoTen} />
          <Field label="Ngày sinh:" value={student.ngaySinh} />
          <Field label="Giới tính:" value={student.gioiTinh} />
          <Field label="Email:" value={student.email} />
          <Field label="Lớp:" value={student.lop} />
          <Field label="Khoa:" value={student.khoa} />

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