import { useState } from "react";
import { thucTap, baoCaoThucTapList } from "../../data/studentData";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import FileUpload from "../../components/FileUpload";
import { Button } from "@/components/ui/button";

function PreviewBaoCao() {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center space-y-3 min-h-55 flex flex-col items-center justify-center">
      <p className="text-xs font-semibold text-gray-500 tracking-wide">BỘ GIÁO DỤC VÀ ĐÀO TẠO &nbsp;&nbsp;&nbsp; BỘ NÔNG NGHIỆP VÀ PTNT</p>
      <p className="text-xs font-semibold text-gray-500 tracking-wide">TRƯỜNG ĐẠI HỌC THỦY LỢI</p>
      <div className="w-20 h-20 rounded-full bg-blue-800 border-4 border-blue-600 flex items-center justify-center mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-800 font-bold text-xs">DHTL</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-blue-700 tracking-widest mt-1">BÁO CÁO THỰC TẬP</p>
    </div>
  );
}
function ModalXemChiTiet({ bc, onClose }) {
  return (
    <Modal title={`${bc.ten}(xem chi tiết)`} onClose={onClose} size="lg">
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
          <button onClick={onClose} className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ModalNopBaoCao({ bc, onClose }) {
  const [file, setFile] = useState("bao_cao_thuc_tap3.pdf");

  
  return (
    <Modal title={`${bc.ten} (Nộp báo cáo)`} onClose={onClose} size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Nộp báo cáo:</p>
          <FileUpload value={file} onChange={setFile} />
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white ">
            Hủy
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white "
            onClick={onClose}
          >
            Nộp
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function BaoCaoThucTapPage() {
  const [modal, setModal] = useState(null);

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
          Báo cáo thực tập
        </div>

        <div className="p-5">
          {/* Thông tin thực tập */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-700 mb-3">Thông tin thực tập:</p>
            <div className="text-sm space-y-1.5 text-gray-600">
              <p>Tên doanh nghiệp: <span className="font-semibold text-gray-800">{thucTap.tenDN}</span></p>
              <p>Vị trí thực tập: &nbsp;&nbsp;<span className="font-semibold text-gray-800">{thucTap.viTri}</span></p>
              <p>GVHD thực tập: <span className="font-semibold text-gray-800">{thucTap.gvhd}</span></p>
              <div className="flex items-center gap-2">
                <span>Trạng thái:</span>
                <StatusBadge status={thucTap.trangThai} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 text-center border-b border-gray-100">
              <p className="font-semibold text-gray-700 text-sm">Nộp báo cáo thực tập</p>
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
                {baoCaoThucTapList.map((bc) => (
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
                            ${bc.trangThai === "Da hoan thanh"
                              ? "bg-gray-300 cursor-default"
                              : "bg-green-500 hover:bg-green-600"
                            }`}
                            size="sm"
                            disable = {bc.trangThai === "Da hoan thanh"}
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
