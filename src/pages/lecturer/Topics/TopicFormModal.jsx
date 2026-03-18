/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

const topicSchema = yup.object().shape({
  title: yup
    .string()
    .required("Vui lòng nhập tên đề tài")
    .min(5, "Tên đề tài phải ít nhất 5 ký tự"),
  expertise_id: yup.string().required("Vui lòng chọn chuyên môn"),
  technologies: yup.string().required("Vui lòng nhập công nghệ"),
  description: yup.string().required("Vui lòng nhập mô tả chi tiết"),
  is_available: yup.boolean().required("Vui lòng chọn trạng thái"),
});

const EMPTY_FORM = {
  title: "",
  expertise_id: "",
  technologies: "",
  description: "",
  is_available: true,
  is_bank_topic: true,
};

const TopicFormModal = ({ isOpen, onClose, onSave, editingTopic, specializations, technologies }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(topicSchema),
    mode: "onChange",
    defaultValues: EMPTY_FORM,
  });

  // Reset form when modal opens or editingTopic changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingTopic) {
        reset({
          title: editingTopic.title,
          expertise_id: editingTopic.expertise_id,
          technologies: editingTopic.technologies,
          description: editingTopic.description,
          is_available: editingTopic.is_available,
        });
      } else {
        reset(EMPTY_FORM);
      }
    }
  }, [isOpen, editingTopic, reset]);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="max-w-[500px] p-0 overflow-hidden border-0 shadow-xl rounded-2xl">
        <div className="bg-[#6d28d9] px-6 py-4 flex flex-col items-center">
          <h2 className="text-white text-[15px] font-bold uppercase tracking-wider w-full text-left">
            {editingTopic ? "CHỈNH SỬA ĐỀ TÀI" : "THÊM ĐỀ TÀI MỚI"}
          </h2>
        </div>
        <div className="px-6 py-6 pb-4 bg-white max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                TÊN ĐỀ TÀI *
              </label>
              <Input
                {...register("title")}
                placeholder="Nhập tên đề tài"
                className={`h-10 rounded-lg border-slate-200 focus:border-[#6d28d9] focus:ring-[#6d28d9]/20 ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  CHUYÊN MÔN *
                </label>
                <select
                  {...register("expertise_id")}
                  className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-[#6d28d9] focus:ring-[3px] focus:ring-[#6d28d9]/20 ${errors.expertise_id ? "border-red-500" : ""}`}
                >
                  <option value="">Chọn chuyên môn</option>
                  {/* Ideally specializations is an array of expertise objects {expertise_id, expertise_name} */}
                  {specializations.map((item) => (
                    <option key={item.expertise_id} value={item.expertise_id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.expertise_id && <p className="text-red-500 text-[10px] mt-1">{errors.expertise_id.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  TRẠNG THÁI *
                </label>
                <select
                  {...register("is_available")}
                  className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-[#6d28d9] focus:ring-[3px] focus:ring-[#6d28d9]/20 ${errors.is_available ? "border-red-500" : ""}`}
                >
                  <option value="true">Khả dụng</option>
                  <option value="false">Đã đăng ký</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                CÔNG NGHỆ *
              </label>
              <Input
                {...register("technologies")}
                placeholder="Ví dụ: ReactJS, NodeJS, PHP..."
                className={`h-10 rounded-lg border-slate-200 focus:border-[#6d28d9] focus:ring-[#6d28d9]/20 ${errors.technologies ? "border-red-500" : ""}`}
              />
              {errors.technologies && <p className="text-red-500 text-[10px] mt-1">{errors.technologies.message}</p>}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                MÔ TẢ CHI TIẾT
              </label>
              <textarea
                {...register("description")}
                placeholder="Mô tả mục tiêu và yêu cầu đề tài..."
                className={`w-full min-h-[100px] p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/20 focus:border-[#6d28d9] resize-none ${errors.description ? "border-red-500" : "border-slate-200"}`}
              />
              {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 px-6 font-semibold"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit(onSave)}
              className="rounded-lg bg-[#6d28d9] hover:bg-[#5b21b6] text-white px-6 font-semibold"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TopicFormModal;
