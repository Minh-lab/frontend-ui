import React from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { registeredTopic } from "@/data/studentData";

export default function DaDangKy({ onDeXuatMoi, onNganHang, topic }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center justify-between">
        <span className="font-semibold">Đăng ký đề tài</span>
        <StatusBadge status="Chờ duyệt" />
      </div>
      <div className="p-5">
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-lg mb-5">
          Bạn đã đăng ký đề tài đồ án!
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">Thông tin đề tài:</p>
          <div className="space-y-3">
            {[
              ["Tên đề tài:", topic?.title],
              ["Lĩnh vực:", topic?.linhVuc],
              ["Giảng viên hướng dẫn:", topic?.lecturer?.name || "Chưa phân công"],
              ["Công nghệ sử dụng:", topic?.technologies],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex items-start gap-4">
                <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0">{lbl}</span>
                <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">{val}</div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0">Mô tả:</span>
              <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 leading-relaxed">{topic?.description}</div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0">File đề cương (PDF):</span>
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {topic?.fileDeCuong}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-5">
          <Button className="flex-1 bg-[#d0d5f0] hover:bg-[#c0c7e8] text-[#3b3f8c] font-semibold ">
            Đề xuất đồ án mới
          </Button>
          <Button className="flex-1 bg-[#d0d5f0] hover:bg-[#c0c7e8] text-[#3b3f8c] font-semibold text-sm ">
            Đăng ký đề tài từ ngân hàng đề tài
          </Button>
        </div>
      </div>
    </div>
  );
}
