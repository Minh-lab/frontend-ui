import { useEffect } from "react";
import FileUpload from "../../../components/FileUpload";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
    .required("Vui lòng upload giấy giới thiệu/chứng minh")
    .test("fileSize", "File tối đa 3MB", (value) => {
      if (!value) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return value.size <= 3 * 1024 * 1024;
    }),
});

export default function DeXuatMoiForm({ onBack, onDangKy }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tenCongTy: "",
      maSoThue: "",
      email: "",
      diaChi: "",
      file: "",
    },
  });

  useEffect(() => {
    register("file");
  }, [register]);

  const file = watch("file");

  const onSubmit = (data) => {
    // Simulate API call
    onDangKy({ ...data, type: "PROPOSAL" });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-sm">Đề xuất doanh nghiệp thực tập mới</span>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tên công ty *</label>
            <input
              type="text"
              placeholder="Nhập tên đầy đủ của doanh nghiệp"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition"
              {...register("tenCongTy")}
            />
            {errors.tenCongTy && <p className="text-red-500 text-[10px] mt-0.5">{errors.tenCongTy.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mã số thuế *</label>
              <input
                type="text"
                placeholder="10-13 chữ số"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition"
                {...register("maSoThue")}
              />
              {errors.maSoThue && <p className="text-red-500 text-[10px] mt-0.5">{errors.maSoThue.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email liên hệ *</label>
              <input
                type="email"
                placeholder="hr@company.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ *</label>
            <input
              type="text"
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition"
              {...register("diaChi")}
            />
            {errors.diaChi && <p className="text-red-500 text-[10px] mt-0.5">{errors.diaChi.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Giấy giới thiệu/Xác nhận *</label>
            <FileUpload value={file} onChange={(v) => setValue("file", v, { shouldValidate: true })} />
            {errors.file && <p className="text-red-500 text-[10px] mt-0.5">{errors.file.message}</p>}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 text-xs text-amber-700">
           <svg className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>Lưu ý: Thông tin bạn cung cấp sẽ được nhà trường thẩm định trước khi chấp nhận. Đề xuất sai lệch có thể dẫn đến việc hủy tư cách thực tập.</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-6 py-2 rounded-lg text-sm font-semibold transition shadow-md"
          >
            Gửi đề xuất
          </button>
        </div>
      </div>
    </div>
  );
}
