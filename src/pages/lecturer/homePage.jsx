import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { lecturerProfileData } from "@/data/lecturerData";

const reviewSchema = yup.object().shape({
  comment: yup.string().required("Vui lòng nhập nhận xét cho sinh viên"),
});

export default function LecturerHomePage() {
  const [lecturerInfo] = useState(lecturerProfileData);
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reviewSchema),
  });

  // We only show items that are 'chưa duyệt' (Pending) or similar urgent status.
  const urgentTasks = [
    {
      id: 1,
      sinhVien: "Trần Thị Kiều An",
      msv: "2351170102",
      class: "65CNPM",
      nghiepVu: "Đồ án (UC 19)",
      noiDung: "Đề xuất đề tài mới",
      topicName: "Phát triển hệ thống AI nhận diện bệnh về da",
      tech: "TensorFlow, Keras, Flutter",
      desc: "Ứng dụng di động giúp người dùng chụp ảnh da và nhận diện các bệnh lý phổ biến qua AI, hỗ trợ tư vấn sơ bộ.",
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

    const onApprove = (data) => {
    toast.success("Đã phê duyệt đề xuất của " + selectedTask.sinhVien, {
      className: "!bg-[#dcfce7] !text-[#047857]",
    });
    setSelectedTask(null);
    reset();
  };

  const onReject = (data) => {
    toast.error("Đã từ chối đề xuất của " + selectedTask.sinhVien, {
      className: "!bg-[#fee2e2] !text-[#b91c1c]",
    });
    setSelectedTask(null);
    reset();
  };

  const handleOpenReview = (task) => {
    setSelectedTask(task);
    reset({ comment: "" });
  };

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
                        {task.thaoTac === "Xem & Duyệt" ? (
                          <button
                            onClick={() => handleOpenReview(task)}
                            className="text-[13px] font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline"
                          >
                            {task.thaoTac}
                          </button>
                        ) : (
                          <Link
                            to="#"
                            className="text-[13px] font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline"
                          >
                            {task.thaoTac}
                          </Link>
                        )}
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
      {/* Review Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#6d28d9] flex items-center justify-between p-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-base md:text-lg">
                XÉT DUYỆT ĐỀ XUẤT
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    SINH VIÊN ĐỀ XUẤT
                  </label>
                  <p className="font-bold text-slate-800 text-sm sm:text-base">
                    {selectedTask.sinhVien}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">MSV: {selectedTask.msv} - Lớp: {selectedTask.class}</p>
                </div>
                <div className="text-right">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    LOẠI NGHIỆP VỤ
                  </label>
                  <p className="font-bold text-[#7C3AED] text-sm sm:text-base underline underline-offset-4">
                    {selectedTask.nghiepVu}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    NỘI DUNG ĐỀ TÀI (TOPIC INFO)
                  </label>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 mb-0.5">Tên đề tài:</p>
                      <p className="font-bold text-slate-800 text-sm">{selectedTask.topicName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 mb-0.5">Công nghệ:</p>
                      <p className="text-sm text-slate-700">{selectedTask.tech}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 mb-0.5">Mô tả:</p>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        {selectedTask.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-xs font-bold text-slate-600 block mb-2">
                    Nhận xét cho sinh viên: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("comment")}
                    placeholder="Nhập nhận xét chi tiết hoặc lý do từ chối..."
                    className={`w-full min-h-[100px] p-3 text-sm border ${errors.comment ? "border-red-500" : "border-slate-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/20 focus:border-[#6d28d9] transition-all resize-none shadow-inner`}
                  ></textarea>
                  {errors.comment && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.comment.message}</p>}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <Button
                variant="outline"
                onClick={handleSubmit(onReject)}
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 px-6 font-semibold rounded-lg h-11"
              >
                Từ chối
              </Button>
              <Button
                onClick={handleSubmit(onApprove)}
                className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white px-8 font-semibold rounded-lg h-11 shadow-md shadow-purple-100"
              >
                Duyệt đề tài
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
