import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Import Council Service
import { councilService } from "@/services/faculty";

export default function ScheduleDefenseDialog({ isOpen, onClose, council, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Định dạng ngày từ ISO string sang YYYY-MM-DD cho input date
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // 1. Khởi tạo Form với dữ liệu mặc định từ council
  const form = useForm({
    defaultValues: {
      startDate: council?.start_date ? formatDateToInput(council.start_date) : "",
      endDate: council?.end_date ? formatDateToInput(council.end_date) : "",
      building: council?.buildings || "",
      room: council?.rooms || "",
    },
  });

  // Re-update form values khi council thay đổi
  React.useEffect(() => {
    if (council) {
      form.reset({
        startDate: council?.start_date ? formatDateToInput(council.start_date) : "",
        endDate: council?.end_date ? formatDateToInput(council.end_date) : "",
        building: council?.buildings || "",
        room: council?.rooms || "",
      });
    }
  }, [council, form]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    if (!council?.council_id) {
      toast.error("Không tìm thấy hội đồng");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi API xếp lịch
      const response = await councilService.scheduleDefense(council.council_id, {
        startDate: `${data.startDate} 08:00:00`, // Thêm giờ để match format backend
        endDate: `${data.endDate} 17:00:00`,
        buildings: data.building,
        rooms: data.room
      });

      if (response.success) {
        toast.success("Xếp lịch bảo vệ thành công!");
        onClose();
        if (onSuccess) onSuccess(); // Refresh parent component
      } else {
        toast.error(response.message || "Lỗi khi xếp lịch bảo vệ");
      }
    } catch (error) {
      if (error.message === "Lịch bảo vệ đồ án bị trùng") {
        toast.error("Lịch bảo vệ đồ án bị trùng. Vui lòng chọn thời gian khác.");
      } else {
        toast.error(error.message || "Lỗi khi xếp lịch bảo vệ");
      }
      console.error("Error scheduling defense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
        
        {/* Header Bar - Màu tím đặc trưng */}
        <div className="bg-[#5c60c0] p-3 flex justify-between items-center shadow-md">
          <h2 className="text-white text-lg font-bold ml-4 tracking-tight">
            Xếp lịch bảo vệ - {council?.name || ""}
          </h2>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-[#ff0000] hover:bg-red-700 text-white p-2 transition-colors disabled:opacity-50"
          >
            <X className="size-6" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-10 space-y-10">
            
            {/* Vùng nhập liệu màu xanh nhạt */}
            <div className="bg-[#e9f2ff] p-10 rounded-2xl space-y-8 shadow-inner border border-blue-50">
              {/* Hàng 1: Tòa - Phòng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormLabel className="font-bold text-slate-700 whitespace-nowrap text-sm">Tòa</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={isSubmitting}
                          placeholder="VD: A1"
                          className="bg-white rounded-xl border-slate-200 h-10 text-center font-bold text-slate-600" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormLabel className="font-bold text-slate-700 whitespace-nowrap text-sm">Phòng</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={isSubmitting}
                          placeholder="VD: 302"
                          className="bg-white rounded-xl border-slate-200 h-10 text-center font-bold text-slate-600" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Hàng 2: Ngày bắt đầu - Ngày kết thúc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 space-y-0">
                      <FormLabel className="font-bold text-slate-700 whitespace-nowrap text-sm">Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          disabled={isSubmitting}
                          className="bg-white rounded-xl border-slate-200 h-10 font-bold text-slate-600" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 space-y-0">
                      <FormLabel className="font-bold text-slate-700 whitespace-nowrap text-sm">Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          disabled={isSubmitting}
                          className="bg-white rounded-xl border-slate-200 h-10 font-bold text-slate-600" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cụm nút hành động */}
            <div className="flex justify-end gap-4 pr-2">
              <Button 
                type="button"
                variant="cancel"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl px-10 h-11 font-bold shadow-md shadow-red-100 active:scale-95 transition-all disabled:opacity-50"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#e2edff] hover:bg-[#d4e4ff] text-[#1e3a8a] rounded-xl px-10 h-11 font-bold shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
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