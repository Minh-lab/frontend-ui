import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import UI components từ thư viện của bạn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { planService } from "@/services/faculty";

/**
 * 1. Định nghĩa Schema Validation với Yup
 * Kiểm tra logic: Ngày bắt đầu < Ngày kết thúc
 */
const planSchema = yup.object().shape({
  year: yup
    .string()
    .required("Vui lòng nhập năm học")
    .matches(/^\d{4}-\d{4}$/, "Năm học phải có định dạng YYYY-YYYY (VD: 2024-2025)"),
  semester: yup
    .string()
    .required("Học kỳ không được để trống")
    .matches(/^[1-3]$/, "Học kỳ phải là 1, 2 hoặc 3"),
  startDate: yup
    .date()
    .required("Vui lòng chọn ngày bắt đầu")
    .typeError("Ngày không hợp lệ"),
  endDate: yup
    .date()
    .required("Vui lòng chọn ngày kết thúc")
    .typeError("Ngày không hợp lệ")
    .min(yup.ref('startDate'), "Ngày kết thúc phải sau ngày bắt đầu"),
});

export default function AddPlan() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // 2. Khởi tạo Form
  const form = useForm({
    resolver: yupResolver(planSchema),
    defaultValues: {
      year: "",
      semester: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Chuyển đổi dữ liệu từ form sang format API
      const planData = {
        year: data.year,
        semester: data.semester,
        start_date: data.startDate,  // API dùng start_date
        end_date: data.endDate        // API dùng end_date
      };

      const response = await planService.addPlan(planData);
      
      if (response.success) {
        toast.success(response.message || "Thêm học kỳ mới thành công!");
        navigate("/faculty_staff/plans");
      } else {
        toast.error(response.message || "Không thể thêm học kỳ");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi thêm học kỳ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate("/faculty_staff/plans")}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
        disabled={submitting}
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Quay lại
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Thêm học kỳ
        </h1>
      </div>

      {/* Card Form Chính */}
      <div className="bg-[#f0f4ff] rounded-[32px] shadow-xl overflow-hidden border border-slate-100 px-12 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              
              {/* Năm học - chuyển từ combobox sang input */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Năm học
                    </FormLabel>
                    <FormItem className="relative">
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="VD: 2024-2025"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all"
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-1 font-bold italic" />
                    </FormItem>
                  </div>
                )}
              />

              {/* Học kỳ */}
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4 pt-2">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Học kỳ
                    </FormLabel>
                    <FormItem className="relative">
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="1, 2 hoặc 3"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all"
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-1 font-bold italic" />
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
                    <FormItem className="relative">
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all"
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-1 font-bold italic" />
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
                    <FormItem className="relative">
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all"
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-1 font-bold italic" />
                    </FormItem>
                  </div>
                )}
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-200">
              <Button
                variant="cancel"
                type="button"
                onClick={() => navigate("/faculty_staff/plans")}
                className="px-10 py-6 font-bold rounded-2xl shadow-md transition transform hover:scale-105"
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button
                variant="submit"
                type="submit"
                className="px-12 py-6 font-bold rounded-2xl shadow-lg transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}