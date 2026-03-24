import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import FileUpload from "../../components/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import tlu from "@/assets/logo-tlu.png"
import { useNavigate } from "react-router-dom";
import { getStudentAccess } from "@/lib/studentAccess";
import studentService from "@/services/studentService";

function PreviewBaoCao({ type = "do_an" }) {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center space-y-3 min-h-55 flex flex-col items-center justify-center">
      <p className="text-xs font-semibold text-gray-500 tracking-wide">BỘ GIÁO DỤC VÀ ĐÀO TẠO &nbsp;&nbsp;&nbsp; BỘ NÔNG NGHIỆP VÀ PTNT</p>
      <p className="text-xs font-semibold text-gray-500 tracking-wide">TRƯỜNG ĐẠI HỌC THỦY LỢI</p>
      <img src={tlu} alt="" className="mx-auto" />
      <p className="text-xs font-semibold text-blue-700 tracking-widest mt-1">
        {type === "do_an" ? "BÁO CÁO ĐỒ ÁN" : "BÁO CÁO THỰC TẬP"}
      </p>
    </div>
  );
}

function ModalXemChiTiet({ bc, onClose }) {
  return (
    <Modal title={`${bc.ten} (xem chi tiết)`} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-gray-500">
           {bc.reportInfo?.link && <span>Source code: <a href={bc.reportInfo.link} target="_blank" className="text-blue-500 hover:underline">{bc.reportInfo.link}</a></span>}
           <span>Ngày nộp: {bc.ngayNop}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Preview báo cáo:</p>
          <PreviewBaoCao />
        </div>
        {bc.nhanXetGV && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Nhận xét của giảng viên:</p>
            <div className="border border-purple-300 rounded-lg px-4 py-3 bg-purple-50 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {bc.nhanXetGV}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white">
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}

const reportSchema = yup.object().shape({
  file: yup
    .mixed()
    .required("Vui lòng tải lên file báo cáo")
    .test("file-present", "Vui lòng tải lên file báo cáo", (value) => {
      if (!value) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return true;
    }),
  link: yup
    .string()
    .required("Vui lòng nhập link source code")
    .test("is-github", "Link source code phải là link GitHub hợp lệ", (value) => {
      if (!value) return false;
      const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(\/.*)?$/;
      return githubRegex.test(value);
    }),
});

function ModalNopBaoCao({ bc, capstoneId, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reportSchema),
    mode: "onChange",
    defaultValues: {
      file: "",
      link: "",
    },
  });

  const fileValue = watch("file");

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('capstone_id', capstoneId);
      formData.append('milestone_id', bc.milestone_id);
      formData.append('link', data.link);
      formData.append('report_file', data.file);
      
      await studentService.submitCapstoneReport(formData);
      
      toast.success("Nộp báo cáo đồ án thành công", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
      onClose(true); // true to indicate success/reload needed
    } catch (error) {
      toast.error(error.message || "Lỗi nộp báo cáo");
    }
  };

  return (
    <Modal title={`${bc.ten} (Nộp báo cáo)`} onClose={() => onClose(false)} size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Nộp báo cáo:</p>
          <FileUpload value={fileValue} onChange={(v) => setValue("file", v, { shouldValidate: true })} />
          {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Link source code:</p>
          <input
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0] ${errors.link ? "border-red-500" : "border-gray-300"}`}
            {...register("link")}
          />
          {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link.message}</p>}
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Button onClick={() => onClose(false)} className="bg-red-500 hover:bg-red-600 text-white">
            Hủy
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSubmit(onSubmit)}
          >
            Nộp
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function ProjectReports() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [modal, setModal] = useState(null);
  
  const [capstone, setCapstone] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [statusRes, milestonesRes, historyRes] = await Promise.all([
        studentService.getMyCapstoneStatus(),
        studentService.getCapstoneMilestones(),
        studentService.getCapstoneReportHistory()
      ]);
      
      // Assumes shape depending on how API is structured
      const capstoneData = statusRes.data || statusRes;
      setCapstone(capstoneData.capstone || capstoneData);
      setMilestones(milestonesRes.data || []);
      setReports(historyRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access.projectEnabled) {
      fetchReportsData();
    }
  }, [access.projectEnabled]);

  if (!access.projectEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Báo cáo đồ án
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-lg">
              Bạn chưa mở đợt đồ án nên chưa thể sử dụng chức năng này.
            </div>
            <Button onClick={() => navigate("/student/dashboard")} className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white">
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const combinedList = milestones.map((ms) => {
    const report = reports.find(r => r.milestone_id === ms.milestone_id);
    const start = new Date(ms.start_date || ms.created_at);
    const end = new Date(ms.end_date);
    const now = new Date();
    
    return {
      id: ms.milestone_id,
      milestone_id: ms.milestone_id,
      ten: ms.phase_name,
      thoiHanNop: `${start.toLocaleString('vi-VN')} - ${end.toLocaleString('vi-VN')}`,
      hanChot: end.toLocaleString('vi-VN'),
      trangThai: report ? report.status : "INCOMPLETE",
      nhanXetGV: report ? report.lecturer_feedback : null,
      ngayNop: report ? new Date(report.submission_date || report.created_at).toLocaleString('vi-VN') : null,
      reportInfo: report || null,
      isEnabled: now <= end && report?.status !== "APPROVED",
      rawEnd: end
    };
  });

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-4xl mx-auto">
        <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
          Báo cáo đồ án
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center p-8"><p className="text-gray-500">Đang tải dữ liệu...</p></div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-sm font-bold text-gray-700 mb-2">Thông tin đề tài:</p>
                <div className="text-sm space-y-1 text-gray-600">
                  <p>Tên đề tài: <span className="font-semibold text-gray-800">{capstone?.topic?.title || capstone?.topic_title || "Đang cập nhật"}</span></p>
                  <p>Giảng viên hướng dẫn: <span className="font-semibold">{capstone?.lecturer?.full_name || capstone?.lecturer_name || "Chưa phân công"}</span></p>
                  <p>Giảng viên phản biện: <span className="font-semibold">Thưa phân công</span></p>
                  <p>Hội đồng bảo vệ: <span className="font-semibold">Chưa phân công</span></p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Mốc báo cáo", "Thời hạn nộp", "Hạn chót", "Trạng thái", "Hành động"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-xs text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {combinedList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">Chưa có đợt nộp báo cáo nào.</td>
                      </tr>
                    )}
                    {combinedList.map((bc) => {
                      const isSubmitted = bc.reportInfo !== null;
                      const disableSubmit = isSubmitted || !bc.isEnabled;
                      
                      return (
                        <tr key={bc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-700">{bc.ten}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-pre">{bc.thoiHanNop}</td>
                          <td className="px-4 py-3 text-red-500 font-semibold text-xs whitespace-pre">{bc.hanChot}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={bc.trangThai === "Chưa hoàn thành" ? "INCOMPLETE" : bc.trangThai} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => setModal({ type: "view", bc })}
                                className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white"
                                size="sm"
                                disabled={!isSubmitted}
                              >
                                Xem chi tiết
                              </Button>
                              {bc.isEnabled ? (
                                <Button
                                  onClick={() => setModal({ type: "nop", bc })}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  size="sm"
                                >
                                  {isSubmitted ? "Nộp lại" : "Nộp bài"}
                                </Button>
                              ) : (
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                  bc.trangThai === "APPROVED" || bc.trangThai === "Đã duyệt"
                                  ? "text-green-600 bg-green-50" 
                                  : (new Date() > bc.rawEnd ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-50")
                                }`}>
                                  {bc.trangThai === "APPROVED" || bc.trangThai === "Đã duyệt"
                                    ? "Đã hoàn tất" 
                                    : (new Date() > bc.rawEnd ? "Đã quá hạn" : "Chưa đến hạn")
                                  }
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {modal?.type === "view" && <ModalXemChiTiet bc={modal.bc} onClose={() => setModal(null)} />}
      {modal?.type === "nop" && (
        <ModalNopBaoCao 
          bc={modal.bc} 
          capstoneId={capstone?.capstone_id}
          onClose={(shouldReload) => {
            setModal(null);
            if (shouldReload) fetchReportsData();
          }} 
        />
      )}
    </div>
  );
}

