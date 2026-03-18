import StatusBadge from "@/components/StatusBadge";
import { doAn, thucTap } from "../../data/studentData";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentAccess, setStudentAccess } from "@/lib/studentAccess";
import { toast } from "sonner";
import { ConfirmAction } from "@/components/ui/ConfirmAction";

const steps = [
  { label: "Dang ky", done: true },
  { label: "Cho duyet", done: true },
  { label: "Bao cao", done: false, failed: true },
  { label: "Bao ve", done: false, num: 4 },
];

function StepIcon({ done, failed, num }) {
  if (done) return <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center text-green-600">✓</div>;
  if (failed) return <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center text-red-500">x</div>;
  return <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-500 text-sm font-bold">{num}</div>;
}


export default function HomePageStudent() {
  const navigate = useNavigate();
  const [access, setAccess] = useState(() => getStudentAccess());
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null });

  const handleEnableProject = () => {
    setAccess(setStudentAccess({ projectEnabled: true }));
    toast.success("Đã mở đợt đồ án", {
      className: "!bg-[#AAFAB8] !text-[#24AD47]",
    });
  };

  const handleDisableProject = () => {
    setConfirmModal({ isOpen: true, type: "project" });
  };

  const handleEnableIntern = () => {
    setAccess(setStudentAccess({ internEnabled: true }));
    toast.success("Đã mở đợt thực tập", {
      className: "!bg-[#AAFAB8] !text-[#24AD47]",
    });
  };

  const handleDisableIntern = () => {
    setConfirmModal({ isOpen: true, type: "intern" });
  };

  const processConfirm = () => {
    if (confirmModal.type === "project") {
      setAccess(setStudentAccess({ projectEnabled: false }));
      toast.success("Đã hủy đợt đồ án", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
    } else if (confirmModal.type === "intern") {
      setAccess(setStudentAccess({ internEnabled: false }));
      toast.success("Đã hủy đợt thực tập", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-3 justify-end">
        <Button
          onClick={handleEnableProject}
          disabled={access.projectEnabled}
          className="bg-[#5c60c0] hover:bg-[#4a4ea8]"
        >
          {access.projectEnabled ? "Đã mở đợt đồ án" : "Đăng ký đợt đồ án"}
        </Button>
        <Button
          onClick={handleEnableIntern}
          disabled={access.internEnabled}
          className="bg-[#5c60c0] hover:bg-[#4a4ea8] "
        >
          {access.internEnabled ? "Đã mở đợt thực tập" : "Đăng ký đợt thực tập"}
        </Button>
        <Button
          onClick={handleDisableProject}
          disabled={!access.projectEnabled}
          className="bg-red-400 hover:bg-red-500 "
        >
          {access.projectEnabled ? "Yêu cầu hủy đồ án" : "Đã hủy đồ án"}
        </Button>
        <Button
          onClick={handleDisableIntern}
          disabled={!access.internEnabled}
          className="bg-red-400 hover:bg-red-500 "
        >
          {access.internEnabled ? "Yêu cầu hủy thực tập" : "Đã hủy thực tập"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#5c60c0] text-white px-4 py-2.5 flex items-center justify-between">
            <div className="text-sm font-semibold">Thong tin thuc tap</div>
            <StatusBadge status={thucTap.trangThai} />
          </div>
          <div className="p-4 space-y-1">
            <p className="font-bold text-gray-800 text-base">{thucTap.tenDN}</p>
            <p className="text-sm text-gray-500">Vị trí: {thucTap.viTri}</p>
            <p className="text-sm text-gray-500">GVHD thực tập: {thucTap.gvhd}</p>
            <button
              onClick={() => access.internEnabled && navigate("/student/intern-reports")}
              disabled={!access.internEnabled}
              className={`mt-3 w-full border text-sm font-medium py-2 rounded-lg transition ${access.internEnabled
                ? "bg-[#e6ecff] border-indigo-300 text-[#5c60c0] hover:bg-indigo-50"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Truy cap =&gt;
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#5c60c0] text-white px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold">Tiến độ đồ án</span>
            <button
              onClick={() => access.projectEnabled && navigate("/student/project-reports")}
              disabled={!access.projectEnabled}
              className={`text-xs underline ${access.projectEnabled ? "text-blue-200 hover:text-white" : "text-blue-100/60 cursor-not-allowed"
                }`}
            >
              Xem chi tiet
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between relative mb-4">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0 mx-6" />
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1 z-10">
                  <StepIcon done={s.done} failed={s.failed} num={s.num} />
                  <span className="text-xs text-gray-500 mt-1">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="text-sm space-y-1 border-t border-gray-100 pt-3">
              <p className="text-gray-700 text-center font-bold">Tên đề tài: {doAn.tenDeTai}</p>
              <p className="text-gray-500">Trạng thái: <span className="text-orange-500 font-medium">{doAn.trangThai}</span></p>
              <p className="text-gray-500">GVHDDA : {doAn.gvhd}</p>
              <p className="text-gray-500">GVPB : {doAn.gvpb}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          access.projectEnabled &&
          navigate("/student/register-topic", { state: { view: "ngan-hang" } })
        }
        disabled={!access.projectEnabled}
        className={`w-full rounded-xl p-6 flex flex-col items-center gap-2 transition group ${access.projectEnabled
          ? "bg-[#ecf9ff] border border-[#ecf9ff] hover:border-indigo-400"
          : "bg-gray-100 border border-gray-100 cursor-not-allowed"
          }`}
      >
        <p
          className={`text-base font-semibold transition ${access.projectEnabled ? "text-gray-700 group-hover:text-[#5c60c0]" : "text-gray-400"
            }`}
        >
          Ngan hang de tai
        </p>
        <p className="text-sm text-gray-400">Tham khao 200+ de tai co san</p>
      </button>

      <ConfirmAction
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={processConfirm}
        title="Xác nhận yêu cầu"
        description={`Bạn có chắc chắn muốn gửi yêu cầu hủy đợt ${confirmModal.type === "project" ? "đồ án" : "thực tập"} này không? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận hủy"
        variant="destructive"
      />
    </div>
  );
}
