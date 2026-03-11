import { useState } from "react";
import { doAn, baoCaoDoAnList } from "../../data/studentData";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import FileUpload from "../../components/FileUpload";
import { Button } from "@/components/ui/button";

function PreviewBaoCao({ type = "do_an" }) {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white text-center space-y-3 min-h-55 flex flex-col items-center justify-center">
      <p className="text-xs font-semibold text-gray-500 tracking-wide">BỘ GIÁO DỤC VÀ ĐÀO TẠO &nbsp;&nbsp;&nbsp; BỘ NÔNG NGHIỆP VÀ PTNT</p>
      <p className="text-xs font-semibold text-gray-500 tracking-wide">TRƯỜNG ĐẠI HỌC THỦY LỢI</p>
      <div className="w-20 h-20 rounded-full bg-blue-800 border-4 border-blue-600 flex items-center justify-center mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-800 font-bold text-xs">DHTL</span>
        </div>
      </div>
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

function ModalNopBaoCao({ bc, onClose }) {
  const [file, setFile] = useState("bao_cao_doan3.pdf");
  const [link, setLink] = useState("https://github.com/username/project");

  return (
    <Modal title={`${bc.ten} (Nộp báo cáo)`} onClose={onClose} size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Nộp báo cáo:</p>
          <FileUpload value={file} onChange={setFile} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Link source code:</p>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
            value={link} onChange={(e) => setLink(e.target.value)}
          />
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

export default function BaoCaoDoAnPage() {
  const [modal, setModal] = useState(null);

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
          <div className="border border-gray-200 rounded-xl overflow-hidden">
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
                          disabled = {bc.trangThai  === "Da hoan thanh" || bc.trangThai === "Cho duyet"}
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
