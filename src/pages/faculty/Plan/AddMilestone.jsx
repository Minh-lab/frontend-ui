import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư viện hệ thống
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

/**
 * Định nghĩa Schema Validation với Yup
 */
const milestoneSchema = yup.object().shape({
  name: yup.string().required("Tên giai đoạn không được để trống"),
  type: yup.string().required("Vui lòng chọn loại mốc"),
  description: yup.string().required("Mô tả không được để trống"),
  startDate: yup.date().required("Vui lòng chọn ngày bắt đầu").typeError("Ngày không hợp lệ"),
  endDate: yup
    .date()
    .required("Vui lòng chọn ngày kết thúc")
    .typeError("Ngày không hợp lệ")
    .min(yup.ref('startDate'), "Ngày kết thúc phải sau ngày bắt đầu"),
});

export default function AddMilestone() {
  const navigate = useNavigate();
  const { id: planId } = useParams();

  const form = useForm({
    resolver: yupResolver(milestoneSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Dữ liệu mốc thời gian mới:", data);
    toast.success("Thêm mốc thời gian thành công!");
    navigate(`/faculty/plans/view/${planId}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Quay lại chi tiết học kỳ
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Thêm mốc thời gian
        </h1>
      </div>

      <div className="bg-[#f0f4ff] rounded-[32px] shadow-xl overflow-hidden border border-slate-100 px-12 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              
              {/* Tên giai đoạn */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Tên giai đoạn
                    </FormLabel>
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="VD: Nộp đề cương chi tiết"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all shadow-sm" 
                        />
                      </FormControl>
                      <FormMessage className="font-semibold italic" />
                    </FormItem>
                  </div>
                )}
              />

              {/* Loại mốc */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Loại mốc
                    </FormLabel>
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all">
                            <SelectValue placeholder="Chọn loại mốc thời gian" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="INTERNSHIP">Thực tập</SelectItem>
                          <SelectItem value="CAPSTONE">Đồ án</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-semibold italic" />
                    </FormItem>
                  </div>
                )}
              />

              {/* Mô tả */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-start gap-4 pt-2">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right mt-3">
                      Mô tả
                    </FormLabel>
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Nhập mô tả chi tiết cho giai đoạn này..."
                          className="bg-slate-50 border-slate-200 rounded-xl min-h-[120px] focus:bg-white transition-all resize-none shadow-sm" 
                        />
                      </FormControl>
                      <FormMessage className="font-semibold italic" />
                    </FormItem>
                  </div>
                )}
              />

              {/* Ngày bắt đầu */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4 pt-2">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Ngày bắt đầu
                    </FormLabel>
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all shadow-sm" 
                        />
                      </FormControl>
                      <FormMessage className="font-semibold italic" />
                    </FormItem>
                  </div>
                )}
              />

              {/* Ngày kết thúc */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4 pt-2">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Ngày kết thúc
                    </FormLabel>
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all shadow-sm" 
                        />
                      </FormControl>
                      <FormMessage className="font-semibold italic" />
                    </FormItem>
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-200">
              <Button
                variant="cancel"
                type="button"
                onClick={() => navigate(-1)}
                className="px-10 py-6 font-bold rounded-2xl shadow-md transition transform hover:scale-105 active:scale-95"
              >
                Hủy
              </Button>
              <Button
                variant="submit"
                type="submit"
                className="px-12 py-6 font-bold rounded-2xl shadow-lg transition transform hover:-translate-y-1 active:scale-95"
              >
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}