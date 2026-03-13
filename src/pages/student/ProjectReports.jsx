import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { doAn, baoCaoDoAnList } from "../../data/studentData";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import FileUpload from "../../components/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import tlu from "@/assets/logo-tlu.png"
import { useNavigate } from "react-router-dom";
import { getStudentAccess } from "@/lib/studentAccess";
function PreviewBaoCao({ type = "do_an" }) {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center space-y-3 min-h-55 flex flex-col items-center justify-center">
      <p className="text-xs font-semibold text-gray-500 tracking-wide">BỘ GIÁO DỤC VÀ ĐÀO TẠO &nbsp;&nbsp;&nbsp; BỘ NÔNG NGHIỆP VÀ PTNT</p>
      <p className="text-xs font-semibold text-gray-500 tracking-wide">TRƯỜNG ĐẠI HỌC THỦY LỢI</p>
      <img src={tlu} alt="" />
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
        <div className="flex justify-end text-xs text-gray-500">Ngày nộp: {bc.ngayNop}</div>
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
          <Button onClick={onClose} className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white ">
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

function ModalNopBaoCao({ bc, onClose }) {
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

  const onSubmit = (data) => {
    onClose();
    bc.trangThai = "Cho duyet";
    toast.success("Hạnh động đã được ghi nhận", {
      className: "!bg-[#AAFAB8] !text-[#24AD47]",
    });
    console.log("Submit report data:", data);
  };

  return (
    <Modal title={`${bc.ten} (Nộp báo cáo)`} onClose={onClose} size="md">
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
          <Button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white ">
            Hủy
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white "
            onClick={handleSubmit(onSubmit)}
          >
            Nộp
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function BaoCaoDoAnPage() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [modal, setModal] = useState(null);

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

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
          Báo cáo đồ án
        </div>

        <div className="p-5">
          {/* Thông tin đề tài */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-700 mb-2">Thông tin đề tài:</p>
            <div className="text-sm space-y-1 text-gray-600">
              <p>Tên đề tài: <span className="font-semibold text-gray-800">{doAn.tenDeTai}</span></p>
              <p>Lĩnh vực: &nbsp; {doAn.linhVuc}</p>
              <p>Giảng viên hướng dẫn: <span className="font-semibold">{doAn.gvhd}</span></p>
              <p>Giảng viên phản biện: <span className="font-semibold">Ths.Phạm Văn Hải</span></p>
              <p className="indent-28 -mt-0.5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TS.Nguyễn Thị Thanh</p>
              <p>Hội đồng bảo vệ: <span className="font-semibold">{doAn.hoiDong}</span></p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto">
            <div className="bg-gray-50 px-5 py-3 text-center border-b border-gray-100">
              <p className="font-semibold text-gray-700 text-sm">Nộp báo cáo đồ án</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Ngày bắt đầu: 11-02-2026 &nbsp;10:00 &nbsp;&nbsp;&nbsp; Ngày kết thúc: 14-02-2026 &nbsp;23:00
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Báo cáo", "Thời hạn nộp", "Hạn chót", "Trạng thái", "Hành động"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-xs text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {baoCaoDoAnList.map((bc) => (
                  <tr key={bc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 font-semibold text-gray-700">{bc.ten}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-pre">{bc.thoiHanNop}</td>
                    <td className="px-4 py-3 text-red-500 font-semibold text-xs whitespace-pre">{bc.hanChot}</td>
                    <td className="px-4 py-3"><StatusBadge status={bc.trangThai} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setModal({ type: "view", bc })}
                          className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white "
                          size="sm"
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          onClick={() => setModal({ type: "nop", bc })}
                          className={`text-white 
                            ${bc.trangThai === "Da hoan thanh" || bc.trangThai === "Cho duyet" ? "bg-gray-300 cursor-default" : "bg-green-500 hover:bg-green-600"}`}
                          size="sm"
                          disabled={bc.trangThai === "Da hoan thanh" || bc.trangThai === "Cho duyet"}
                        >
                          Nộp
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal?.type === "view" && <ModalXemChiTiet bc={modal.bc} onClose={() => setModal(null)} />}
      {modal?.type === "nop" && <ModalNopBaoCao bc={modal.bc} onClose={() => setModal(null)} />}
    </div>
  );
}
