import React from "react";

export default function FacultyDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase">
          TEST GIAO DIỆN
        </h1>
        <p className="text-sm text-slate-500">
          Quản lý kế hoạch đào tạo, đồ án và thực tập năm học 2025-2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-400 text-xs uppercase">Tổng số đồ án</h3>
          <p className="text-3xl font-black mt-2">156</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-400 text-xs uppercase">Giảng viên hướng dẫn</h3>
          <p className="text-3xl font-black mt-2">42</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-400 text-xs uppercase">Doanh nghiệp liên kết</h3>
          <p className="text-3xl font-black mt-2">12</p>
        </div>
      </div>
    </div>
  );
}