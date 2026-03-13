import { useEffect, useState } from "react";
import { nganHangDeTai, registeredTopic } from "../../data/studentData";
import StatusBadge from "../../components/StatusBadge";
import FileUpload from "../../components/FileUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getStudentAccess } from "@/lib/studentAccess";

const schema = yup.object({
  ten: yup
    .string()
    .required("Tên đề tài không được để trống")
    .min(10, "Tên đề tài phải ít nhất 10 ký tự"),

  linhVuc: yup
    .string()
    .required("Vui lòng chọn lĩnh vực"),

  congNghe: yup
    .string()
    .required("Vui lòng nhập công nghệ sử dụng"),

  moTa: yup
    .string()
    .max(500, "Mô tả tối đa 500 ký tự"),

  fileDeCuong: yup
    .mixed()
    .required("Vui lòng upload file đề cương")
});

function ChuaDangKy({ onDeXuatMoi, onNganHang }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center justify-between">
        <span className="font-semibold">Đăng ký đề tài</span>
        <StatusBadge status="Chưa đăng ký" />
      </div>
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm font-semibold px-4 py-3 rounded-lg mb-5">
          Bạn chưa đăng ký đề tài đồ án nào cả!
        </div>
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">Thông tin đề tài:</p>
          {["Tên đề tài:", "Lĩnh vực:", "Giảng viên hướng dẫn:", "Công nghệ sử dụng:", "Mô tả:", "File đề cương (PDF):"].map((l) => (
            <div key={l} className="flex items-start gap-4 mb-2">
              <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0 mt-0.5">{l}</span>
              <span className="text-sm text-gray-300">—</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={onDeXuatMoi} className="flex-1 bg-[#d0d5f0] hover:bg-[#c0c7e8] text-[#3b3f8c] font-semibold text-sm py-3 rounded-lg transition">
            Đăng ký đề tài mới
          </button>
          <button onClick={onNganHang} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold text-sm py-3 rounded-lg transition border border-red-200">
            Đăng ký đề tài từ ngân hàng đề tài
          </button>
        </div>
      </div>
    </div>
  );
}

function DeXuatMoiForm({ onBack,onDangKy }) {
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ten: "",
      linhVuc: "Trí tuệ nhân tạo (AI)",
      gvhd: "Ths. Nguyen Thi Huong - CNTT",
      congNghe: "",
      moTa: "",
      fileDeCuong: null
    }
  });
  useEffect(() => {
    register("fileDeCuong");
  }, [register]);
  const onSubmit = (data) => {
    onDangKy({
      ...data,
      gvhd: "Ths. Nguyen Thi Huong - CNTT"
    });
  };
  const file = watch("fileDeCuong");
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold">Đề xuất đề tài mới</span>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="font-semibold text-gray-700 ">Tên đề tài <span className="text-red-500">*</span></label>
          <Input
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
            placeholder="Ví dụ: Xây dựng Website....."
            
            {...register("ten")}
          />
          {errors.ten && (
            <p className="text-red-500 text-xs mt-1">{errors.ten.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Lĩnh vực <span className="text-red-500">*</span></label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]" {...register("linhVuc")} onChange={(e) => set("linhVuc", e.target.value)}>
              <option>Trí tuệ nhân tạo (AI)</option>
              <option>Phát triển Web</option>
              <option>Phát triển ứng dụng di động</option>
              <option>An toàn thông tin</option>
              <option>Hệ thống thông tin</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Giảng viên hướng dẫn</label>
            <Input
              className="text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              value="Ths. Nguyen Thi Huong - CNTT" readOnly
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Công nghệ sử dụng <span className="text-red-500">*</span></label>
          <Input
            className="text-sm "
             onChange={(e) => set("congNghe", e.target.value)}
            {...register("congNghe")}
          />
          {errors.congNghe && (
            <p className="text-red-500 text-xs">{errors.congNghe.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mô tả</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
            placeholder="Python, Scikit-learn,Python FastAPI,...."
           onChange={(e) => set("moTa", e.target.value)}
            {...register("moTa")}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">File đề cương (PDF)</label>
          <FileUpload 
          valua = {file}
          onChange={(file) => {
            setValue("fileDeCuong", file, { shouldValidate: true });
          }} />
            {errors.fileDeCuong && (
            <p className="text-red-500 text-xs">{errors.fileDeCuong.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onBack} className="bg-red-500 hover:bg-red-600 text-white ">
            Hủy
          </Button>
          <Button 
              onClick={handleSubmit((data) => {
                onSubmit(data); // xử lý form
                toast.success("Hành động đã được ghi nhận", {
                  className: "!bg-[#AAFAB8] !text-[#24AD47]",
                });
              })}
           className="bg-[#3b3f8c] hover:bg-[#2e3278] text-white ">
            Gửi đề xuất
          </Button>
        </div>
      </div>
    </div>
  );
}

function NganHangView({ onBack, onDangKy }) {
  const [search, setSearch] = useState("Mo hinh du doan|");
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold">Ngân hàng đề tài</span>
      </div>
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <Input
            className="pl-9"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
          <option>Công nghệ ▾</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
          <option>Lĩnh vực ▾</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
          <option>Trạng thái ▾</option>
        </select>
        <Button className="bg-[#5c60c0] text-white hover:bg-[#4a4ea8]">
          Tìm kiếm
        </Button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Mã đề tài", "Tên đề tài", "Lĩnh vực", "Công nghệ", "Mô tả", "Hành động"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nganHangDeTai.map((dt) => (
              <tr key={dt.ma} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{dt.ma}</td>
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px]">{dt.ten}</td>
                <td className="px-4 py-3 max-w-[120px]">
                  {dt.linhVuc.split(",").map((lv, i) => (
                    <span key={i} className="inline-block text-[#5c60c0] text-xs mr-1">{lv.trim()}</span>
                  ))}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px]">{dt.congNghe}</td>
                <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] leading-relaxed">{dt.moTa}</td>
                <td className="px-4 py-3">
                  <Button
                    onClick={() => {onDangKy(dt);
                      toast.success("Hạnh động đã được ghi nhận", {
                            className: "!bg-[#AAFAB8] !text-[#24AD47]",
                      })
                    }
    
                     }
                    className={`
                      ${dt.daDangKy
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      size="sm"
                      disabled = {dt.daDangKy}
                  >     
                    {dt.daDangKy ? "Đã đăng ký" : "Đăng ký"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DaDangKy({ onDeXuatMoi, onNganHang ,topic}) {
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
              ["Tên đề tài:", topic?.ten],
              ["Lĩnh vực:", topic?.linhVuc],
              ["Giảng viên hướng dẫn:", registeredTopic.gvhd],
              ["Công nghệ sử dụng:", topic?.congNghe],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex items-start gap-4">
                <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0">{lbl}</span>
                <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">{val}</div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <span className="text-sm font-semibold text-gray-600 w-48 flex-shrink-0">Mô tả:</span>
              <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 leading-relaxed">{topic?.moTa}</div>
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

export default function DangKyDeTaiPage() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [view, setView] = useState("");
  const [topic, setTopic] = useState(null);
  if (!access.projectEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Đăng ký đề tài
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
  if (view === "form-moi") return <div className="p-6"><DeXuatMoiForm onBack={() => setView("empty")} onDangKy={(dt) => {setView("registered");setTopic(dt)} } /></div>;
  if (view === "ngan-hang") return <div className="p-6"><NganHangView onBack={() => setView("empty")} onDangKy={(dt) => {setView("registered");setTopic(dt)} } /></div>;
  if (view === "registered") return <div className="p-6"><DaDangKy topic={topic} onDeXuatMoi={() => setView("form-moi")} onNganHang={() => setView("ngan-hang")} /></div>;
  return <div className="p-6"><ChuaDangKy onDeXuatMoi={() => setView("form-moi")} onNganHang={() => setView("ngan-hang")} /></div>;
}
