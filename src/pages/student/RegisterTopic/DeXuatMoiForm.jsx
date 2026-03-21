import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

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

export default function DeXuatMoiForm({ onBack, onDangKy }) {
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
      title: data.ten,
      linhVuc: data.linhVuc,
      lecturer: {
        name: "Ths. Nguyen Thi Huong - CNTT"
      },
      technologies: data.congNghe,
      description: data.moTa,
      fileDeCuong: data.fileDeCuong
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
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]" {...register("linhVuc")}>
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
            {...register("moTa")}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">File đề cương (PDF)</label>
          <FileUpload 
          value={file}
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
