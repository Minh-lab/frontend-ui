import { use, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { giangVienList, student } from "../../data/studentData";
import FileUpload from "../../components/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getStudentAccess } from "@/lib/studentAccess";

function DanhSachGV({ listGV, onChon, isRegister }) {
  const [search, setSearch] = useState("Tran Thi Huong|");
  const [keyword, setKeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusKeyword, setStatusKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [topicKeyword, setTopicKeyword] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const filteredGV = useMemo(() => {
    return listGV.filter((gv) => {
      const matchesKeyword =
        !searchTerm ||
        gv.ten.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        !statusFilter || gv.conNhan === (statusFilter === "true");
      const matchesTopic = !topicFilter || gv.chuyenMon.some(mon => mon.toLowerCase().includes(topicFilter.toLowerCase()));

      return matchesKeyword && matchesStatus && matchesTopic
    })
  }, [listGV, searchTerm, statusFilter, topicFilter])


  return (
    <div className="max-w-3xl mx-auto">
      {/* Search bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="pl-9 "

          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <select
          value={topicKeyword}
          onChange={(event) => setTopicKeyword(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
          <option value="">Chuyên môn ▾</option>
          <option value="Mang may tinh">Mạng máy tính</option>
          <option value="Lap trinh Web">Lập trình web</option>
          <option value="An toan thong tin">An toàn thông tin</option>
          <option value="Quan tri Mang">Quản trị mạng</option>
          <option value="Phan tich du lieu lon">Phân tích dữ liệu lớn</option>
          <option value="DevOps">DevOps</option>
        </select>
        <select
          value={statusKeyword}
          onChange={(e) => setStatusKeyword(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
        >
          <option value="">Trạng thái ▾</option>
          <option value="true">Còn nhận</option>
          <option value="false">Không nhận</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm(keyword)
            setStatusFilter(statusKeyword)
            setTopicFilter(topicKeyword)

          }}
          className="bg-[#5c60c0]/10 hover:bg-[#5c60c0]/20 text-[#5c60c0] px-4 py-2 rounded-lg text-sm font-medium transition border border-[#5c60c0]/20">
          Tìm kiếm
        </button>
      </div>

      <h3 className="font-bold text-gray-700 mb-3">Danh sách giảng viên</h3>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {filteredGV.map((gv) => {
          const full = gv.daDangKy >= gv.max;
          return (
            <div key={gv.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-[#3b3f8c] font-bold text-sm flex-shrink-0">
                {gv.initials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800 text-sm">{gv.ten}</p>
                </div>
                <p className="text-xs text-gray-500">Ngành đào tạo: {gv.nganh}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {gv.chuyenMon.map((cm) => (
                    <span key={cm} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                      {cm}
                    </span>
                  ))}
                </div>
              </div>
              {/* Status + Action */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`text-xs font-semibold ${full ? "text-red-500" : "text-green-600"}`}>
                  Đã đăng ký: {gv.daDangKy}/{gv.max}
                </span>
                <Button
                  onClick={() => onChon(gv)}
                  disabled={full || isRegister}
                  className={`
                    ${full || isRegister ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const schema = yup.object().shape({
  linhVuc: yup.string().required("Vui lòng nhập lĩnh vực dự kiến"),
  yTuong: yup.string().optional(),
  file: yup.mixed().optional(),
});

function FormDangKyGVHD({ gv, onBack, setIsRegister }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      linhVuc: "",
      yTuong: "",
      file: "",
    },
  });

  const fileValue = watch("file");

  const onSubmit = (data) => {
    onBack();
    setIsRegister(true);
    gv.daDangKy += 1;
    toast.success("Hạnh động đã được ghi nhận", {
      className: "!bg-[#AAFAB8] !text-[#24AD47]",
    });
    console.log("Form data:", data);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl">
        <span className="font-semibold">Đăng ký giảng viên hướng dẫn</span>
      </div>
      <div className="p-6 space-y-5">
        {/* Thông tin GV */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">Thông tin giảng viên:</p>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-[#3b3f8c] font-bold text-lg flex-shrink-0">
              {gv.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="font-bold text-gray-800">{gv.ten}</p>
                  <p className="text-sm text-gray-500">Ngành đào tạo: Công nghệ thông tin ({gv.nganh})</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {gv.chuyenMon.map((cm) => (
                      <span key={cm} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">{cm}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  {gv.conNhan && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-200 mb-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Còn nhận
                    </span>
                  )}
                  <p className="text-xs text-green-600 font-medium">Đã đăng ký: {gv.daDangKy}/{gv.max}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-bold text-gray-700 mb-3">Thông tin sinh viên:</p>
          <div className="grid grid-cols-3 gap-3 text-sm mb-2">
            <div><span className="text-gray-400">Mã sinh viên:</span> <span className="font-medium">{student.maSV}</span></div>
            <div><span className="text-gray-400">Họ và tên:</span> <span className="font-medium">{student.hoTen}</span></div>
            <div><span className="text-gray-400">Lớp:</span> <span className="font-medium">{student.lop}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div><span className="text-gray-400">Email:</span> <span className="font-medium">{student.maSV}@e.tlu.edu.vn</span></div>
            <div><span className="text-gray-400">SĐT:</span> <span className="font-medium">{student.sdt}</span></div>
            <div className="flex items-center gap-2"><span className="text-gray-400">GPA:</span> <span className="font-medium">{student.gpa}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Lĩnh vực dự kiến: <span className="text-red-500">*</span></label>
          <input
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0] ${errors.linhVuc ? "border-red-500" : "border-gray-300"}`}
            {...register("linhVuc")}
          />
          {errors.linhVuc && <p className="text-red-500 text-xs mt-1">{errors.linhVuc.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Ý tưởng đề tài sơ bộ (Nếu có):</label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
            {...register("yTuong")}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">CV/ Bảng điểm (Tùy chọn):</label>
          <FileUpload value={fileValue} onChange={(v) => setValue("file", v)} />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onBack} className="bg-red-500 hover:bg-red-600 text-white">
            Hủy
          </Button>
          <Button
            variant="submit"
            className="bg-[#3b3f8c] hover:bg-[#2e3278] text-white"
            onClick={handleSubmit(onSubmit)}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DangKyGVHDPage() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [listGV, setListGV] = useState(giangVienList);
  const [selectedGV, setSelectedGV] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  if (!access.projectEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Đăng ký giảng viên hướng dẫn
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
  return <div className="p-6">{selectedGV ? <FormDangKyGVHD setIsRegister={setIsRegister} gv={selectedGV} onBack={() => setSelectedGV(null)} /> : <DanhSachGV listGV={listGV} onChon={(gv) => setSelectedGV(gv)} isRegister={isRegister} />}</div>;
}
