import { useState } from "react";
import { student } from "../../data/studentData";
import Modal from "../../components/Modal";
import ChangePassword from "@/components/layouts/ChangePassword";

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
  
  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
        <div className="bg-[#5c60c0] px-6 py-5 flex items-center gap-4 text-white">
          <div>
            <h2 className="text-xl font-bold">Thong tin ca nhan</h2>
            <p className="text-blue-200 text-sm">{student.maSV}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Ma sinh vien:" value={student.maSV} />
          <Field label="Ho va ten:" value={student.hoTen} />
          <Field label="Ngay sinh:" value={student.ngaySinh} />
          <Field label="Gioi tinh:" value={student.gioiTinh} />
          <Field label="Email:" value={student.email} />
          <Field label="Lop:" value={student.lop} />
          <Field label="Khoa:" value={student.khoa} />

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
