import { useEffect, useState } from "react";
import FileUpload from "../../../components/FileUpload";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import internshipService from "@/services/internship";

const schema = yup.object({
  tenCongTy: yup
    .string()
    .required("Vui lòng nhập tên công ty")
    .min(3, "Tên công ty phải ít nhất 3 ký tự"),
  maSoThue: yup
    .string()
    .trim()
    .required("Vui lòng nhập mã số thuế")
    .matches(/^\d{9,13}$/, "Mã số thuế phải gồm 9-13 chữ số"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  diaChi: yup
    .string()
    .required("Vui lòng nhập địa chỉ"),
  position: yup
    .string()
    .required("Vui lòng nhập vị trí thực tập"),
  file: yup
    .mixed()
    .required("Vui lòng upload giấy giới thiệu/chứng minh")
    .test("fileSize", "File tối đa 3MB", (value) => {
      if (!value) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return value.size <= 3 * 1024 * 1024;
    }),
});

export default function DeXuatMoiForm({ onBack, onDangKy, initialData = null, internshipId }) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isReadonly, setIsReadonly] = useState(!!initialData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tenCongTy: initialData?.name || initialData?.tenCongTy || "",
      maSoThue: initialData?.tax_code || initialData?.maSoThue || "",
      email: initialData?.email || "",
      diaChi: initialData?.address || initialData?.diaChi || "",
      position: "",
      file: "",
    },
  });

  useEffect(() => {
    register("file");
  }, [register]);

  const file = watch("file");
  const taxCode = watch("maSoThue");

  const handleCheckTaxCode = async () => {
    const isValid = await trigger("maSoThue");
    if (!isValid) return;

    const currentTaxCode = getValues("maSoThue");
    setChecking(true);
    try {
      const response = await internshipService.checkCompany(currentTaxCode);
      if (response.exists) {
        toast.success(`Tìm thấy thông tin doanh nghiệp ${response.type === 'OFFICIAL' ? 'đối tác' : 'đề xuất'}`);
        setValue("tenCongTy", response.data.name || "");
        setValue("email", response.data.email || response.data.contact_email || "");
        setValue("diaChi", response.data.address || "");
        setIsReadonly(response.readonly);
      } else {
        toast.info("Mã số thuế chưa có trên hệ thống. Vui lòng tự nhập thông tin.");
        setIsReadonly(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kiểm tra mã số thuế");
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("tax_code", data.maSoThue);
    formData.append("name", data.tenCongTy);
    formData.append("email", data.email);
    formData.append("address", data.diaChi);
    formData.append("position", data.position);
    formData.append("file", data.file);

    // Sử dụng internship_id từ prop truyền vào, fallback là 1 để DEV test
    formData.append("internship_id", internshipId || 1);

    try {
      const resp = await internshipService.registerCompany(formData);
      if (resp.success) {
        toast.success("Gửi đề xuất thành công!");
        onDangKy({ ...data, type: isReadonly ? "OFFICIAL" : "PROPOSAL" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Đăng ký không thành công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-sm">Đăng ký doanh nghiệp thực tập mới</span>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mã số thuế *</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập 10-13 chữ số"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition"
                {...register("maSoThue")}
                disabled={checking || loading}
              />
              <button
                type="button"
                onClick={handleCheckTaxCode}
                disabled={checking || loading}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1 shrink-0"
              >
                {checking ? (
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                  </svg>
                )}
                Kiểm tra
              </button>
            </div>
            {errors.maSoThue && <p className="text-red-500 text-[10px] mt-0.5">{errors.maSoThue.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tên công ty *</label>
            <input
              type="text"
              placeholder="Nhập tên đầy đủ của doanh nghiệp"
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition ${isReadonly ? 'bg-gray-50 text-gray-400' : ''}`}
              {...register("tenCongTy")}
              readOnly={isReadonly}
            />
            {errors.tenCongTy && <p className="text-red-500 text-[10px] mt-0.5">{errors.tenCongTy.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email liên hệ *</label>
              <input
                type="email"
                placeholder="hr@company.com"
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition ${isReadonly ? 'bg-gray-50 text-gray-400' : ''}`}
                {...register("email")}
                readOnly={isReadonly}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vị trí thực tập *</label>
              <input
                type="text"
                placeholder="VD: Java Developer, HR Intern..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition"
                {...register("position")}
              />
              {errors.position && <p className="text-red-500 text-[10px] mt-0.5">{errors.position.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ *</label>
            <input
              type="text"
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5c60c0]/20 focus:outline-none transition ${isReadonly ? 'bg-gray-50 text-gray-400' : ''}`}
              {...register("diaChi")}
              readOnly={isReadonly}
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
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-[#5c60c0] hover:bg-[#4a4ea8] text-white px-6 py-2 rounded-lg text-sm font-semibold transition shadow-md flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                Đang gửi...
              </>
            ) : "Gửi đề xuất"}
          </button>
        </div>
      </div>
    </div>
  );
}
