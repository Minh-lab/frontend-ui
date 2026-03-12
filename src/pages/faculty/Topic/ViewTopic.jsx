import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Mock data - In a real app, you'd fetch this based on ID
const MOCK_TOPICS = {
  1: {
    id: 1,
    topicName: "Hệ thống quản lý đồ án",
    technology: "React, Node.js",
    description: "Xây dựng quy trình quản lý đồ án tốt nghiệp cho khoa CNTT.",
    specialization: "WEB",
  },
  2: {
    id: 2,
    topicName: "Dự báo xâm nhập mặn",
    technology: "Python, LSTM",
    description: "Sử dụng mạng thần kinh để dự báo độ mặn vùng ĐBSCL.",
    specialization: "AI",
  },
  3: {
    id: 3,
    topicName: "App quản lý thực tập",
    technology: "Flutter, Firebase",
    description: "Ứng dụng di động giúp sinh viên đăng ký và báo cáo thực tập.",
    specialization: "Mobile",
  },
  4: {
    id: 4,
    topicName: "Phân loại rác thải",
    technology: "Computer Vision",
    description: "Hệ thống nhận diện và phân loại rác qua camera.",
    specialization: "AI",
  },
  5: {
    id: 5,
    topicName: "Website bán hoa tươi",
    technology: "PHP, Laravel",
    description: "Xây dựng sàn thương mại điện tử cho cửa hàng hoa.",
    specialization: "WEB",
  },
};

export default function ViewTopic() {
  const navigate = useNavigate();
  const { id } = useParams();
  const topic = MOCK_TOPICS[id] || MOCK_TOPICS[1];

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-500">
      <button
        onClick={() => navigate("/faculty/topics")}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition mb-6 group"
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Quay lại
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-4xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-linear-to-r from-purple-600 to-indigo-700 text-white px-12 py-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Chi tiết đề tài</h1>
          <p className="text-purple-100 text-xs mt-1 opacity-80 uppercase tracking-widest font-medium">
            Khoa Công nghệ thông tin - TLU
          </p>
        </div>

        <div className="bg-[#fcfcff] px-12 py-12 space-y-8">
          {/* Tên Đề Tài */}
          <div className="flex justify-between items-center gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
              Tên đề tài
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm">{topic.topicName}</p>
            </div>
          </div>

          {/* Công Nghệ */}
          <div className="flex justify-between items-center gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
              Công nghệ
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm">{topic.technology}</p>
            </div>
          </div>

          {/* Chuyên Môn */}
          <div className="flex justify-between items-center gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
              Chuyên môn
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm">{topic.specialization}</p>
            </div>
          </div>

          {/* Mô Tả Chi Tiết */}
          <div className="flex justify-between items-start gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap mt-3">
              Mô tả chi tiết
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {topic.description}
              </p>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-100">
            <button
              onClick={() => navigate("/faculty/topics")}
              className="px-8 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
            >
              Đóng
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
