import { useState, useEffect } from "react";
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
      <img src={tlu} alt="TLU Logo" className="w-16 h-16 object-contain" />
      <p className="text-xs font-semibold text-blue-700 tracking-widest mt-1">BÁO CÁO THỰC TẬP</p>
    </div>
  );
}

function ModalXemChiTiet({ report, onClose }) {
  return (
    <Modal title={`${report.phase_name} (Xem chi tiết)`} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="flex justify-end text-xs text-gray-500 font-medium">
          Ngày nộp: {formatDate(report.submission_date)}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">Xem tài liệu:</p>
          <div className="flex flex-col items-center gap-4">
            <PreviewBaoCao />
            {report.file_url && (
              <a
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tải xuống tệp tin
              </a>
            )}
          </div>
        </div>
        {report.description && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Mô tả/Ghi chú:</p>
            <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-sm text-gray-700 leading-relaxed italic">
              "{report.description}"
            </div>
          </div>
        )}
        {report.lecturer_feedback && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2 text-purple-700">Nhận xét của giảng viên:</p>
            <div className="border border-purple-200 rounded-lg px-4 py-3 bg-purple-50 text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium shadow-sm">
              {report.lecturer_feedback}
            </div>
          </div>
        )}
        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2.5 rounded-lg font-semibold text-sm transition font-medium">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ModalNopBaoCao({ milestone, internshipId, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubit = async () => {
    if (!file) {
      toast.error("Vui lòng chọn tệp tin báo cáo.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("milestone_id", milestone.milestone_id);
      formData.append("internship_id", internshipId);
      formData.append("file", file);
      if (description) formData.append("description", description);

      await internshipService.submitReport(formData);

      toast.success("Nộp báo cáo thành công!", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
      onSuccess();
    } catch (error) {
      console.error("Lỗi nộp báo cáo:", error);
      toast.error(error.message || "Không thể nộp báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`${milestone.phase_name} (Nộp báo cáo)`} onClose={onClose} size="md">
      <div className="space-y-4 p-1">
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
            Tải lên tệp tin (PDF): <span className="text-red-500">*</span>
          </p>
          <FileUpload value={file} onChange={setFile} accept=".pdf" />
          <p className="text-[10px] text-gray-400 mt-1 italic">* Chỉ chấp nhận định dạng PDF, tối đa 10MB.</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">Mô tả/Ghi chú (Tùy chọn):</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/20 focus:border-[#5c60c0] min-h-[100px] resize-none"
            placeholder="Nhập ghi chú hoặc mô tả về bản báo cáo này..."
          ></textarea>
        </div>
        <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 mt-2">
          <Button onClick={onClose} variant="ghost" className="text-gray-500 hover:bg-gray-100 px-6">
            Hủy
          </Button>
          <Button
            className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-10 shadow-lg shadow-indigo-100 transition-all font-bold"
            onClick={handleSubit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Nộp báo cáo"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function BaoCaoThucTapPage() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [loading, setLoading] = useState(true);
  const [internship, setInternship] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [reports, setReports] = useState([]);
  const [modal, setModal] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusResp, milestoneResp] = await Promise.all([
        internshipService.getStatus(),
        internshipService.getMilestones()
      ]);

      setInternship(statusResp.data);

      // Lọc bỏ các milestone không phải là nộp báo cáo (như Đăng ký, Chấm điểm...)
      const filteredMilestones = milestoneResp.data.filter(m => {
        const name = m.phase_name.toLowerCase();
        return (name.includes("báo cáo") || name.includes("đề cương")) && !name.includes("chấm điểm");
      });

      setMilestones(filteredMilestones);

      // Chọn milestone đầu tiên mặc định
      if (filteredMilestones.length > 0) {
        setSelectedMilestone(filteredMilestones[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchHistory = async (milestoneId) => {
    try {
      const resp = await internshipService.getReportHistory(milestoneId);
      setReports(resp.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử nộp:", error);
    }
  };

  useEffect(() => {
    if (selectedMilestone) {
      fetchHistory(selectedMilestone.milestone_id);
    }
  }, [selectedMilestone]);

  const handleSuccess = () => {
    setModal(null);
    // Reload trang theo yêu cầu của user (Bước 9)
    window.location.reload();
  };

  if (!access.internEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Báo cáo thực tập
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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

  if (loading && !internship) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5c60c0] border-t-transparent animate-spin rounded-full"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const isExpired = selectedMilestone && new Date() > new Date(selectedMilestone.end_date);
  const canSubmit = !isExpired && reports.length < 5;

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md max-w-5xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-[#5c60c0] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h1 className="text-lg font-bold tracking-tight">Báo cáo thực tập</h1>
          <div className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
            Học kỳ: {internship?.semester?.name || "—"}
          </div>
        </div>

        <div className="p-6">
          {/* Thông tin thực tập */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thông tin thực tập</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-32">Doanh nghiệp:</span>
                  <span className="font-bold text-gray-800">{internship?.company?.name || internship?.latest_request?.company_name || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-32">Vị trí:</span>
                  <span className="font-semibold text-gray-700 italic">
                    {internship?.position || internship?.latest_request?.student_message || "—"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cố vấn & Trạng thái</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-32">GV hướng dẫn:</span>
                  <span className="font-bold text-gray-800">{internship?.lecturer?.full_name || "Chưa phân công"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-32">Trạng thái:</span>
                  <StatusBadge status={internship?.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Chọn loại báo cáo */}
          <div className="mb-6">
            <label className="text-sm font-bold text-gray-700 mb-2 block">Chọn nội dung nộp báo cáo:</label>
            <div className="flex flex-wrap gap-2">
              {milestones.length === 0 && <p className="text-sm text-gray-400 italic">Không có đợt nộp báo cáo nào được mở.</p>}
              {milestones.map((m) => (
                <button
                  key={m.milestone_id}
                  onClick={() => setSelectedMilestone(m)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all border-2 
                    ${selectedMilestone?.milestone_id === m.milestone_id
                      ? "bg-[#5c60c0] text-white border-[#5c60c0] shadow-lg shadow-indigo-100 scale-105"
                      : "bg-white text-gray-600 border-gray-100 hover:border-[#5c60c0]/30 hover:bg-gray-50"}`}
                >
                  {m.phase_name}
                </button>
              ))}
            </div>
          </div>

          {/* Table & Form */}
          {selectedMilestone && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
                  <div className="space-y-1">
                    <p className="font-bold text-[#5c60c0] text-base">{selectedMilestone.phase_name}</p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Bắt đầu: {formatDate(selectedMilestone.start_date)}
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Kết thúc: {formatDate(selectedMilestone.end_date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2 hidden md:block">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Số lần nộp</p>
                      <p className="text-sm font-bold text-gray-700">{reports.length} / 5</p>
                    </div>
                    <Button
                      onClick={() => setModal({ type: "nop", milestone: selectedMilestone })}
                      className={`px-8 py-5 text-sm font-bold shadow-md transition-all
                        ${canSubmit ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      disabled={!canSubmit}
                    >
                      {isExpired ? "Đã hết hạn" : reports.length >= 5 ? "Đã hết lượt nộp" : "Nộp bài ngay"}
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white border-b border-gray-100">
                        <th className="px-6 py-4 text-left font-bold text-xs text-gray-400 uppercase tracking-widest">STT</th>
                        <th className="px-6 py-4 text-left font-bold text-xs text-gray-400 uppercase tracking-widest">Thời gian nộp</th>
                        <th className="px-6 py-4 text-left font-bold text-xs text-gray-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="px-6 py-4 text-right font-bold text-xs text-gray-400 uppercase tracking-widest">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {reports.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                            Bạn chưa có lịch sử nộp báo cáo cho đợt này.
                          </td>
                        </tr>
                      )}
                      {reports.map((report, index) => (
                        <tr key={report.report_id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4 font-bold text-gray-400">#{reports.length - index}</td>
                          <td className="px-6 py-4 text-gray-600 font-medium">
                            {formatDate(report.submission_date)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setModal({ type: "view", report })}
                              className="text-[#5c60c0] hover:text-[#4a4ea8] font-bold text-xs underline decoration-2 underline-offset-4 active:scale-95 transition-all"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {modal?.type === "view" && <ModalXemChiTiet report={modal.report} onClose={() => setModal(null)} />}
      {modal?.type === "nop" && (
        <ModalNopBaoCao
          milestone={modal.milestone}
          internshipId={internship.internship_id}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

