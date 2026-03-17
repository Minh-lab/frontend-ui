import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { planService } from "@/services/faculty";

/**
 * Danh sách các tên giai đoạn được định nghĩa sẵn
 */
const PREDEFINED_PHASE_NAMES = {
  CAPSTONE: [
    "Đăng ký đợt đồ án",
    "Đăng ký đề tài",
    "Đăng ký GVHDDA",
    "Nộp báo cáo đồ án 1",
    "Nộp báo cáo đồ án 2",
    "Nộp báo cáo đồ án 3",
    "Nộp báo cáo đồ án 4",
    "Chấm điểm đồ án"
  ],
  INTERNSHIP: [
    "Đăng ký đợt thực tập",
    "Đăng ký doanh nghiệp thực tập",
    "Nộp đề cương thực tập",
    "Nộp báo cáo thực tập",
    "Chấm điểm thực tập"
  ]
};

/**
 * Định nghĩa Schema Validation với Yup
 */
const milestoneSchema = yup.object().shape({
  phase_name: yup.string().required("Tên giai đoạn không được để trống"),
  type: yup.string().required("Vui lòng chọn loại mốc"),
  description: yup.string().required("Mô tả không được để trống"),
  start_date: yup.date().required("Vui lòng chọn ngày bắt đầu").typeError("Ngày không hợp lệ"),
  end_date: yup
    .date()
    .required("Vui lòng chọn ngày kết thúc")
    .typeError("Ngày không hợp lệ")
    .min(yup.ref('start_date'), "Ngày kết thúc phải sau ngày bắt đầu"),
});

export default function EditMilestone() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // ID của mốc thời gian cần sửa
  
  const [loading, setLoading] = useState(!location.state?.milestone);
  const [submitting, setSubmitting] = useState(false);
  const [filteredPhaseNames, setFilteredPhaseNames] = useState([]);
  const [notFound, setNotFound] = useState(!location.state?.milestone);

  const form = useForm({
    resolver: yupResolver(milestoneSchema),
    defaultValues: {
      phase_name: "",
      type: "",
      description: "",
      start_date: "",
      end_date: "",
    },
  });

  // Theo dõi sự thay đổi của type để lọc phase names
  const watchType = form.watch("type");

  // Sử dụng dữ liệu milestone từ route state
  useEffect(() => {
    if (location.state?.milestone) {
      const data = location.state.milestone;
      form.reset({
        phase_name: data.phase_name,
        type: data.type,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
      });
      setLoading(false);
    } else {
      setNotFound(true);
      toast.error("Không tìm thấy dữ liệu mốc thời gian. Quay lại trang trước.");
      setLoading(false);
    }
  }, [location.state?.milestone, form]);

  // Lọc phase names khi type thay đổi
  useEffect(() => {
    if (watchType) {
      const filtered = PREDEFINED_PHASE_NAMES[watchType] || [];
      setFilteredPhaseNames(filtered);
    } else {
      setFilteredPhaseNames([]);
    }
  }, [watchType]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Use milestone_id from route state
      const milestoneId = location.state?.milestone?.milestone_id || id;
      const response = await planService.updateMilestone(milestoneId, data);
      
      if (response.success) {
        toast.success(response.message || "Cập nhật mốc thời gian thành công!");
        navigate(-1); // Quay lại trang chi tiết học kỳ
      } else {
        toast.error(response.message || "Không thể cập nhật mốc thời gian");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật mốc thời gian");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải thông tin mốc thời gian...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy mốc thời gian</h2>
          <p className="text-slate-500 mb-8">Mốc thời gian bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition group"
        disabled={submitting}
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Hủy bỏ và quay lại
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">
          Chỉnh sửa mốc thời gian
        </h1>
      </div>

      {/* Card Form Chính */}
      <div className="bg-[#f0f4ff] rounded-[32px] shadow-xl overflow-hidden border border-slate-100 px-12 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              
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
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={submitting}
                      >
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

              {/* Tên giai đoạn - Combobox từ danh sách cố định */}
              <FormField
                control={form.control}
                name="phase_name"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
                    <FormLabel className="text-lg font-bold text-[#4a5568] md:text-right">
                      Tên giai đoạn
                    </FormLabel>
                    <FormItem>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!watchType || submitting}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl py-6 focus:bg-white transition-all">
                            <SelectValue placeholder={
                              !watchType ? "Chọn loại mốc trước" : 
                              "Chọn tên giai đoạn"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white max-h-60">
                          {filteredPhaseNames.length > 0 ? (
                            filteredPhaseNames.map((phaseName) => (
                              <SelectItem key={phaseName} value={phaseName}>
                                {phaseName} 
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-slate-500 italic text-center">
                              {watchType ? "Không có tên giai đoạn nào" : "Vui lòng chọn loại mốc trước"}
                            </div>
                          )}
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
                          className="bg-slate-50 border-slate-200 rounded-xl min-h-[120px] focus:bg-white transition-all resize-none shadow-sm"
                          disabled={submitting}
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
                name="start_date"
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
                          disabled={submitting}
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
                name="end_date"
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
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage className="font-semibold italic" />
                    </FormItem>
                  </div>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-200">
              <Button
                variant="cancel"
                type="button"
                onClick={() => navigate(-1)}
                className="px-10 py-6 font-bold rounded-2xl shadow-md transition transform hover:scale-105 active:scale-95"
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button
                variant="submit"
                type="submit"
                className="px-12 py-6 font-bold rounded-2xl shadow-lg transition transform hover:-translate-y-1 active:scale-95 shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}