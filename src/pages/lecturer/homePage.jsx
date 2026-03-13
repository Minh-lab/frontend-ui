import React, { useState } from "react";
import { Link } from "react-router-dom";
import { lecturerProfileData, projectReportData } from "@/data/lecturerData";

export default function LecturerHomePage() {
    const [lecturerInfo] = useState(lecturerProfileData);

    // We only show items that are 'chưa duyệt' (Pending) or similar urgent status.
    const urgentTasks = [
        {
            id: 1,
            sinhVien: "Trần Thị Kiều An",
            nghiepVu: "Đồ án (UC 19)",
            noiDung: "Đề xuất đề tài mới",
            trangThai: "Chưa duyệt",
            thaoTac: "Xem & Duyệt"
        },
        {
            id: 2,
            sinhVien: "Lê Văn Bình",
            nghiepVu: "Đồ án (UC 20)",
            noiDung: "Báo cáo tiến độ đợt 2",
            trangThai: "Chưa duyệt",
            thaoTac: "Xem chi tiết"
        }
    ];

    return (
        <div className="p-6 bg-[#F9FAFB] min-h-[calc(100vh-64px)] w-full">
            <div className="max-w-[70rem] mx-auto bg-white shadow-sm border border-gray-100 rounded-xl min-h-[500px] overflow-hidden">

                {/* Welcome Section */}
                <div className="p-8 pb-4">
                    <h1 className="text-[26px] font-bold text-[#1E293B] mb-1">
                        Chào bạn, {lecturerInfo.full_name}!
                    </h1>
                    <p className="text-sm font-medium text-gray-400">
                        Học vị: {lecturerInfo.degree} <span className="mx-1.5 text-gray-300">|</span> Bộ môn: {lecturerInfo.department}
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: SV Hướng dẫn Đồ án */}
                    <div className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-center">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                            SV Hướng dẫn Đồ án
                        </h3>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                {lecturerInfo.load.graduate.current}
                            </span>
                            <span className="text-xl font-bold text-gray-400">
                                / {lecturerInfo.load.graduate.max}
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-gray-400 mt-1">
                            Giới hạn tối đa {lecturerInfo.load.graduate.max} sinh viên
                        </p>
                    </div>

                    {/* Card 2: SV Hướng dẫn Thực tập */}
                    <div className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-center">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                            SV Hướng dẫn Thực tập
                        </h3>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                {lecturerInfo.load.intern.current > 9 ? lecturerInfo.load.intern.current : `0${lecturerInfo.load.intern.current}`}
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-gray-400 mt-1">
                            Đang thực hiện báo cáo
                        </p>
                    </div>

                    {/* Card 3: Tình trạng */}
                    <div className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-center">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Tình trạng
                        </h3>
                        <div className="mt-1">
                            <span className="text-[22px] font-bold text-[#10B981] leading-tight block">
                                Đang nhận hướng dẫn
                            </span>
                        </div>
                    </div>

                </div>

                {/* Urgent Tasks Table */}
                <div className="px-8 py-6 mb-8">
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-white px-6 py-5 border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-gray-800">Tác vụ cần xử lý ngay</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                                        <th className="px-6 py-4 font-bold">Sinh viên</th>
                                        <th className="px-6 py-4 font-bold">Nghiệp vụ</th>
                                        <th className="px-6 py-4 font-bold">Nội dung</th>
                                        <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                                        <th className="px-6 py-4 font-bold text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {urgentTasks.map((task) => (
                                        <tr key={task.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-5 text-[13.5px] font-semibold text-gray-700">
                                                {task.sinhVien}
                                            </td>
                                            <td className="px-6 py-5 text-[13.5px] font-medium text-gray-600">
                                                {task.nghiepVu}
                                            </td>
                                            <td className="px-6 py-5 text-[13.5px] font-medium text-gray-600">
                                                {task.noiDung}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#F5F3FF] text-[#8B5CF6] border border-[#EDE9FE]">
                                                    {task.trangThai}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Link
                                                    to="#"
                                                    className="text-[13px] font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline"
                                                >
                                                    {task.thaoTac}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {urgentTasks.length === 0 && (
                                <div className="px-6 py-8 text-center text-gray-400 text-sm font-medium bg-white">
                                    Không có tác vụ nào cần xử lý ngay.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
