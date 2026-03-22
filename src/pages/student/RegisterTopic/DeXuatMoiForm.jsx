import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import studentService from "@/services/studentService";

const schema = yup.object({
  ten: yup
    .string()
    .required("Ten de tai khong duoc de trong")
    .min(10, "Ten de tai phai it nhat 10 ky tu"),
  linhVuc: yup
    .string()
    .required("Vui long chon linh vuc"),
  congNghe: yup
    .string()
    .required("Vui long nhap cong nghe su dung"),
  moTa: yup
    .string()
    .max(500, "Mo ta toi da 500 ky tu"),
});

export default function DeXuatMoiForm({ onBack, onDangKy }) {
  const [expertises, setExpertises] = useState([]);
  const [loadingExpertises, setLoadingExpertises] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ten: "",
      linhVuc: "",
      congNghe: "",
      moTa: "",
    },
  });

  useEffect(() => {
    const fetchExpertises = async () => {
      try {
        setLoadingExpertises(true);
        const response = await studentService.getExpertises();
        const list = Array.isArray(response?.data) ? response.data : [];
        setExpertises(list);
        if (list.length > 0) {
          setValue("linhVuc", String(list[0].expertise_id));
        }
      } catch (error) {
        toast.error(error?.message || "Khong the tai danh sach linh vuc");
        setExpertises([]);
      } finally {
        setLoadingExpertises(false);
      }
    };

    fetchExpertises();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const selectedExpertise = expertises.find(
        (item) => String(item.expertise_id) === String(data.linhVuc)
      );

      const response = await studentService.proposeCapstoneTopic({
        title: data.ten,
        description: data.moTa,
        technologies: data.congNghe,
        expertise_id: Number(data.linhVuc),
      });

      onDangKy({
        title: data.ten,
        linhVuc: selectedExpertise?.name || "Chua xac dinh",
        lecturer: {
          name: "Chua phan cong",
        },
        technologies: data.congNghe,
        description: data.moTa,
        requestStatus: response?.data?.status ?? null,
      });

      toast.success(response?.message || "Da gui de xuat de tai thanh cong", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
    } catch (error) {
      toast.error(error?.message || "Khong the gui de xuat de tai");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold">De xuat de tai moi</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div>
          <label className="font-semibold text-gray-700">Ten de tai <span className="text-red-500">*</span></label>
          <Input
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
            placeholder="Vi du: Xay dung he thong ..."
            {...register("ten")}
          />
          {errors.ten && <p className="text-red-500 text-xs mt-1">{errors.ten.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Chuyen mon <span className="text-red-500">*</span></label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
              {...register("linhVuc")}
              disabled={loadingExpertises}
            >
              {expertises.length === 0 ? (
                <option value="">Khong co chuyen mon</option>
              ) : (
                expertises.map((item) => (
                  <option key={item.expertise_id} value={item.expertise_id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
            {errors.linhVuc && <p className="text-red-500 text-xs mt-1">{errors.linhVuc.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Giang vien huong dan</label>
            <Input
              className="text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              value="Nha truong se phan cong sau khi duyet"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Cong nghe su dung <span className="text-red-500">*</span></label>
          <Input className="text-sm" {...register("congNghe")} />
          {errors.congNghe && <p className="text-red-500 text-xs">{errors.congNghe.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mo ta</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5c60c0]/40 focus:border-[#5c60c0]"
            placeholder="Mo ta ngan gon de tai cua ban"
            {...register("moTa")}
          />
          {errors.moTa && <p className="text-red-500 text-xs mt-1">{errors.moTa.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" onClick={onBack} className="bg-red-500 hover:bg-red-600 text-white">
            Huy
          </Button>
          <Button type="submit" disabled={submitting || loadingExpertises} className="bg-[#3b3f8c] hover:bg-[#2e3278] text-white">
            {submitting ? "Dang gui..." : "Gui de xuat"}
          </Button>
        </div>
      </form>
    </div>
  );
}
