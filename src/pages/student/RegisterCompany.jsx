import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import FileUpload from "../../components/FileUpload";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getStudentAccess } from "@/lib/studentAccess";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const defaultForm = {
  tenCongTy: "Cong ty co phan ABC",
  maSoThue: "0001637913",
  email: "abchanoi@gmail.com",
  diaChi: "So 11 Hai Ba Trung, Ha Noi",
  file: "",
};

const schema = yup.object({
  tenCongTy: yup
    .string()
    .required("Vui lòng nhập tên công ty")
    .min(3, "Tên công ty phải ít nhất 3 ký tự"),
  maSoThue: yup
    .string()
    .required("Vui lòng nhập mã số thuế")
    .matches(/^\d{10,13}$/, "Mã số thuế phải gồm 10-13 chữ số"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  diaChi: yup
    .string()
    .required("Vui lòng nhập địa chỉ"),
  file: yup
    .mixed()
    .required("Vui lòng upload giấy giới thiệu")
    .test("fileSize", "File tối đa 3MB", (value) => {
      if (!value) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return value.size <= 3 * 1024 * 1024;
    }),
});


function ChuaDangKy({ defaultValues, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  useEffect(() => {
    register("file");
  }, [register]);
  const file = watch("file");
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center justify-between">
        <span className="font-semibold">Đăng ký doanh nghiệp thực tập</span>
        <StatusBadge status="Chưa đăng ký" />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0 mt-2">Tên công ty *:</label>
          <div className="flex-1">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
              {...register("tenCongTy")}
            />
            {errors.tenCongTy && (
              <p className="text-red-500 text-xs mt-1">{errors.tenCongTy.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0 mt-2">Mã số thuế *:</label>
          <div className="flex-1">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
              {...register("maSoThue")}
            />
            {errors.maSoThue && (
              <p className="text-red-500 text-xs mt-1">{errors.maSoThue.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0 mt-2">Email *:</label>
          <div className="flex-1">
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4">
          <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0 mt-2">Địa chỉ *:</label>
          <div className="flex-1">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
              {...register("diaChi")}
            />
            {errors.diaChi && (
              <p className="text-red-500 text-xs mt-1">{errors.diaChi.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0 mt-2">Giấy giới thiệu (tối đa 3MB):</label>
          <div className="flex-1">
            <FileUpload value={file} onChange={(v) => setValue("file", v, { shouldValidate: true })} />
            {errors.file && (
              <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
            )}
          </div>
        </div>

        {/* Warning notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>Lưu ý: Thông tin doanh nghiệp bạn đăng ký sẽ được Văn phòng khoa xác minh tính xác thực. Vui lòng kiểm tra lại thật kỹ thông tin!</p>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSubmit(onSubmit)} className="bg-[#3b3f8c] hover:bg-[#2e3278] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow">
            Đăng ký doanh nghiệp
          </button>
        </div>
      </div>
    </div>
  );
}

function DaDangKy({ form }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center justify-between">
        <span className="font-semibold">Đăng ký doanh nghiệp thực tập</span>
        <StatusBadge status="Chờ duyệt" />
      </div>
      <div className="p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
          <p className="text-green-700 font-semibold text-sm">Bạn đã thực hiện đăng ký doanh nghiệp!</p>
          <p className="text-green-600 text-xs mt-0.5">Vì số lượng lớn yêu cầu, việc duyệt đăng ký của bạn có thể tốn chút thời gian.</p>
        </div>

        <div className="space-y-4">
          {[
            ["Tên công ty:", form.tenCongTy],
            ["Mã số thuế:", form.maSoThue],
            ["Email:", form.email],
            ["Địa chỉ:", form.diaChi],
          ].map(([lbl, val]) => (
            <div key={lbl} className="flex items-center gap-4">
              <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0">{lbl}</label>
              <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white">{val}</div>
            </div>
          ))}
          <div className="flex items-center gap-4">
            <label className="w-44 text-sm font-semibold text-[#5c60c0] text-right flex-shrink-0">Giấy giới thiệu (tối đa 3MB):</label>
            <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-400 flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>{form.file?.name ?? form.file ?? "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DangKyDoanhNghiepPage() {
  const navigate = useNavigate();
  const [access] = useState(() => getStudentAccess());
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(defaultForm);
  if (!access.internEnabled) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl font-semibold">
            Đăng ký doanh nghiệp thực tập
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
  return (
    <div className="p-6">
      {submitted ? (
        <DaDangKy form={form} />
      ) : (
        <ChuaDangKy
          defaultValues={form}
          onSubmit={(data) => {
            setForm(data);
            setSubmitted(true);
          }}
        />
      )}
    </div>
  );
}
