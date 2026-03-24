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
import internshipService from "../../services/internship";

const formatDate = (dateString, showTime = true) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    if (!showTime) return `${d}/${m}/${y}`;

    const h = date.getHours().toString().padStart(2, '0');
    const mi = date.getMinutes().toString().padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${mi}`;
  } catch (e) {
    return "—";
  }
};

function PreviewBaoCao() {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center space-y-3 min-h-55 flex flex-col items-center justify-center">
      <p className="text-xs font-semibold text-gray-500 tracking-wide">BỘ GIÁO DỤC VÀ ĐÀO TẠO &nbsp;&nbsp;&nbsp; BỘ NÔNG NGHIỆP VÀ PTNT</p>
      <p className="text-xs font-semibold text-gray-500 tracking-wide">TRƯỜNG ĐẠI HỌC THỦY LỢI</p>
      <img src={tlu} alt="TLU Logo" className="w-16 h-16 object-contain mx-auto" />
      <p className="text-xs font-semibold text-blue-700 tracking-widest mt-1 uppercase">Báo cáo thực tập</p>
    </div>
  );
}

function ModalXemChiTiet({ bc, onClose }) {
  return (
    <Modal title={`${bc.ten} (xem chi tiết)`} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Ngày nộp: {bc.ngayNop}</span>
          {bc.reportInfo?.file_url && (
            <a
              href={bc.reportInfo.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Tải xuống tệp tin
            </a>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Preview báo cáo:</p>
          <PreviewBaoCao />
        </div>
        {bc.reportInfo?.description && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Mô tả/Ghi chú:</p>
            <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-sm text-gray-700 italic">
              {bc.reportInfo.description}
            </div>
          </div>
        )}
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
      return true;
    }),
  description: yup.string().max(500, "Mô tả không quá 500 ký tự"),
});

function ModalNopBaoCao({ bc, internshipId, onClose }) {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reportSchema),
    mode: "onChange",
    defaultValues: {
      file: null,
      description: "",
    },
  });

  const fileValue = watch("file");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('internship_id', internshipId);
      formData.append('milestone_id', bc.milestone_id);
      formData.append('file', data.file);
      if (data.description) {
        formData.append('description', data.description);
      }

      await internshipService.submitReport(formData);

      toast.success("Nộp báo cáo thực tập thành công", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
      onClose(true);
    } catch (error) {
      toast.error(error.message || "Lỗi nộp báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`${bc.ten} (Nộp báo cáo)`} onClose={() => onClose(false)} size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Tải lên tệp tin (PDF):</p>
          <FileUpload value={fileValue} onChange={(v) => setValue("file", v, { shouldValidate: true })} accept=".pdf" />
          {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Mô tả/Ghi chú (Tùy chọn):</p>
          <textarea
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0] min-h-[100px] ${errors.description ? "border-red-500" : "border-gray-300"}`}
            {...register("description")}
            placeholder="Nhập ghi chú hoặc mô tả về bản báo cáo này..."
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Button onClick={() => onClose(false)} variant="ghost" className="px-6" disabled={loading}>
            Hủy
          </Button>
          <Button
            className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-8"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Nộp bài"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function InternReports() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [modal, setModal] = useState(null);

  const [internship, setInternship] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [statusRes, milestonesRes, historyRes] = await Promise.all([
        internshipService.getStatus(),
        internshipService.getMilestones(),
        internshipService.getReportHistory() // Fetch all history
      ]);

      setInternship(statusRes.data || statusRes);

      // Include all internship milestones for that semester
      const allInternMilestones = milestonesRes.data || milestonesRes;
      
      setMilestones(allInternMilestones);
      setReports(historyRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access.internEnabled) {
      fetchReportsData();
    }
  }, [access.internEnabled]);

  if (!access.internEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Báo cáo thực tập
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-lg">
              Bạn chưa mở đợt thực tập nên chưa thể sử dụng chức năng này.
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
    // Tìm báo cáo mới nhất cho milestone này
    const report = reports.find(r => r.milestone_id === ms.milestone_id);
    const start = new Date(ms.start_date || ms.created_at);
    const end = new Date(ms.end_date);
    const now = new Date();

    const name = ms.phase_name.toLowerCase();
    
    // Determine status from database values
    let displayStatus = "INCOMPLETE";
    if (report) {
      displayStatus = report.status;
    } else {
      // Logic for non-report milestones (Registration)
      if (ms.milestone_id === 1 || name.includes("đăng ký đợt")) {
        displayStatus = internship ? "APPROVED" : "INCOMPLETE";
      } else if (ms.milestone_id === 2 || name.includes("doanh nghiệp")) {
        displayStatus = internship?.company ? "APPROVED" : "INCOMPLETE";
      }
    }

    return {
      id: ms.milestone_id,
      milestone_id: ms.milestone_id,
      ten: ms.phase_name,
      thoiHanNop: `${formatDate(ms.start_date)} - ${formatDate(ms.end_date)}`,
      hanChot: formatDate(ms.end_date),
      trangThai: displayStatus,
      nhanXetGV: report ? report.lecturer_feedback : null,
      ngayNop: report ? formatDate(report.submission_date) : null,
      reportInfo: report || null,
      // Disable if out of window, APPROVED, COMPLETED, or if it's the first milestone and already INITIALIZED
      // Enable only if deadline is in the future and not yet approved/completed
      isEnabled: (now <= end) && displayStatus !== "APPROVED" && displayStatus !== "COMPLETED",
      isReportPhase: (name.includes("báo cáo") || name.includes("đề cương")) && !name.includes("chấm điểm"),
      rawEnd: end
    };
  });

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-4xl mx-auto">
        <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold flex justify-between items-center">
          <span>Báo cáo thực tập</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Học kỳ: {internship?.semester?.name || "—"}</span>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center p-8"><p className="text-gray-500">Đang tải dữ liệu...</p></div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Thông tin thực tập:</p>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p>Doanh nghiệp: <span className="font-semibold text-gray-800">{internship?.company?.name || internship?.latest_request?.company_name || "Chưa xác định"}</span></p>
                    <p>Vị trí: <span className="font-semibold">{internship?.position || "—"}</span></p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Hướng dẫn & Trạng thái:</p>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p>Giảng viên hướng dẫn: <span className="font-semibold text-gray-800">{internship?.lecturer?.full_name || "Chưa phân công"}</span></p>
                    <div className="flex items-center gap-2">
                      Trạng thái: <StatusBadge status={internship?.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Mốc báo cáo", "Thời hạn nộp", "Hạn chót", "Trạng thái", "Hành động"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-xs text-gray-500 uppercase tracking-tight">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {combinedList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">Chưa có đợt nộp báo cáo nào cho thực tập.</td>
                      </tr>
                    )}
                    {combinedList.map((bc) => {
                      const isSubmitted = bc.reportInfo !== null;
                      const disableSubmit = !bc.isEnabled; // In combined view, we might allow re-submit if needed, but for now match capstone

                      return (
                        <tr key={bc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-700">{bc.ten}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{bc.thoiHanNop}</td>
                          <td className="px-4 py-3 text-red-500 font-semibold text-xs">{bc.hanChot}</td>
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
                                Xem
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
                                  (bc.trangThai === "APPROVED" || bc.trangThai === "COMPLETED" || (bc.milestone_id === 1 && bc.trangThai === "INITIALIZED"))
                                  ? "text-green-600 bg-green-50" 
                                  : (new Date() > bc.rawEnd ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-50")
                                }`}>
                                  {(bc.trangThai === "APPROVED" || bc.trangThai === "COMPLETED" || (bc.milestone_id === 1 && bc.trangThai === "INITIALIZED"))
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
          internshipId={internship?.internship_id}
          onClose={(shouldReload) => {
            setModal(null);
            if (shouldReload) fetchReportsData();
          }}
        />
      )}
    </div>
  );
}
