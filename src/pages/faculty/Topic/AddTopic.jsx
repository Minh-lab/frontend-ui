import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const topicSchema = yup.object({
  topicName: yup.string().required("Tên đề tài không được để trống"),
  technology: yup.string().required("Công nghệ không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
  specialization: yup.string().required("Chuyên môn không được để trống"),
});

const SPECIALIZATIONS = [
  "AI", "WEB", "Cấp nước", "Data Science", 
  "Frontend", "Backend", "Mobile", "Bảo mật",
];

export default function AddTopic() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: {
      topicName: "",
      technology: "",
      description: "",
      specialization: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Adding topic:", data);
    navigate("/faculty/topics");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-500">
      <button
        onClick={() => navigate("/faculty/topics")}
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
                            className="border-2 rounded-xl focus:ring-4 focus:ring-purple-500/10"
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
                            className="border-2 rounded-xl focus:ring-4 focus:ring-purple-500/10"
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
                            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-sm appearance-none bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                          >
                            <option value="">Chọn chuyên môn</option>
                            {SPECIALIZATIONS.map((spec) => (
                              <option key={spec} value={spec}>{spec}</option>
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
                            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none"
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
                  onClick={() => navigate("/faculty/topics")}
                  className="px-8 py-2.5 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-12 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
                >
                  Lưu đề tài
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}