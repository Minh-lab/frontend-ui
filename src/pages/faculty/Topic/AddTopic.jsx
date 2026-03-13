import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { topicService } from "@/services/faculty";

const topicSchema = yup.object({
  topicName: yup.string().required("Tên đề tài không được để trống"),
  technology: yup.string().required("Công nghệ không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
  specialization: yup.string().required("Chuyên môn không được để trống"),
});

export default function AddTopic() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const form = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: {
      topicName: "",
      technology: "",
      description: "",
      specialization: "",
    },
  });

  // Fetch danh sách chuyên môn khi component mount
  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const response = await topicService.getSpecializations();
      
      if (response.success) {
        setSpecializations(response.data);
      } else {
        toast.error(response.message || "Không thể tải danh sách chuyên môn");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách chuyên môn");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Chuyển đổi dữ liệu từ form sang format API
      const topicData = {
        topic: data.topicName,           // API dùng "topic"
        technology: data.technology,
        description: data.description,
        specialization: data.specialization,
        status: 'active'                  // Mặc định là active
      };

      const response = await topicService.addTopic(topicData);
      
      if (response.success) {
        toast.success(response.message || "Thêm đề tài thành công!");
        navigate("/faculty_staff/topics");
      } else {
        toast.error(response.message || "Không thể thêm đề tài");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi thêm đề tài");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-500">
      <button
        onClick={() => navigate("/faculty_staff/topics")}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition mb-6 group"
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Quay lại
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-12 py-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Thêm đề tài</h1>
          <p className="text-purple-100 text-xs mt-1 opacity-80 uppercase tracking-widest font-medium">
            Khoa Công nghệ thông tin - TLU
          </p>
        </div>

        <div className="bg-[#fcfcff] px-12 py-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Tên Đề Tài */}
              <FormField
                control={form.control}
                name="topicName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center gap-8">
                      <FormLabel className="text-sm font-bold text-slate-600 whitespace-nowrap">
                        Tên đề tài
                      </FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập tên đề tài..."
                            className="border-2 rounded-xl focus:ring-4 focus:ring-purple-500/10"
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold italic mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Công Nghệ */}
              <FormField
                control={form.control}
                name="technology"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center gap-8">
                      <FormLabel className="text-sm font-bold text-slate-600 whitespace-nowrap">
                        Công nghệ
                      </FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="VD: React, Node.js, Python..."
                            className="border-2 rounded-xl focus:ring-4 focus:ring-purple-500/10"
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold italic mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Chuyên Môn */}
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center gap-8">
                      <FormLabel className="text-sm font-bold text-slate-600 whitespace-nowrap">
                        Chuyên môn
                      </FormLabel>
                      <div className="flex-1 relative">
                        <FormControl>
                          <select
                            {...field}
                            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-sm appearance-none bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting || loading}
                          >
                            <option value="">Chọn chuyên môn</option>
                            {specializations.map((spec) => (
                              <option key={spec} value={spec}>
                                {spec}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                        <FormMessage className="text-[10px] font-bold italic mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Mô Tả Chi Tiết */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-start gap-8">
                      <FormLabel className="text-sm font-bold text-slate-600 whitespace-nowrap mt-3">
                        Mô tả chi tiết
                      </FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <textarea
                            {...field}
                            rows={5}
                            placeholder="Nhập mô tả chi tiết về đề tài..."
                            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold italic mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/faculty_staff/topics")}
                  className="px-8 py-2.5 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-12 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Lưu đề tài"
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}