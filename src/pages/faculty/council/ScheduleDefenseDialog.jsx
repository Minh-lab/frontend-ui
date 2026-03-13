import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
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

export default function ScheduleDefenseDialog({ isOpen, onClose, council }) {
  // 1. Khởi tạo Form với dữ liệu mặc định
  const form = useForm({
    defaultValues: {
      semester: "2024_2025_1",
      building: "A1",
      room: "302",
      startDate: "2025-07-16", // Định dạng YYYY-MM-DD để hoạt động với input type="date"
      endDate: "2025-08-16",
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    console.log("Dữ liệu xếp lịch gửi lên server:", data);
    toast.success(`Đã lưu lịch bảo vệ cho ${council?.name || "hội đồng"}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
        
        {/* Header Bar - Màu tím đặc trưng */}
        <div className="bg-[#5c60c0] p-3 flex justify-between items-center shadow-md">
          <h2 className="text-white text-lg font-bold ml-4 tracking-tight">Xếp lịch bảo vệ</h2>
          <button 
            onClick={onClose}
            className="bg-[#ff0000] hover:bg-red-700 text-white p-2 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-10 space-y-10">
            
            {/* Vùng nhập liệu màu xanh nhạt */}
            <div className="bg-[#e9f2ff] p-10 rounded-2xl space-y-8 shadow-inner border border-blue-50">
              {/* Hàng 1: Học kỳ - Tòa - Phòng */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormLabel className="font-bold text-slate-700 whitespace-nowrap text-sm">Học kỳ</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white rounded-xl border-slate-200 h-10 text-center font-bold text-slate-600" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormLabel className="font-bold text-slate-700 whitespace-nowrap text-sm">Tòa</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white rounded-xl border-slate-200 h-10 text-center font-bold text-slate-600" />
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
                        <Input {...field} className="bg-white rounded-xl border-slate-200 h-10 text-center font-bold text-slate-600" />
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
                        <Input type="date" {...field} className="bg-white rounded-xl border-slate-200 h-10 font-bold text-slate-600" />
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
                        <Input type="date" {...field} className="bg-white rounded-xl border-slate-200 h-10 font-bold text-slate-600" />
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
                className="rounded-xl px-10 h-11 font-bold shadow-md shadow-red-100 active:scale-95 transition-all"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                className="bg-[#e2edff] hover:bg-[#d4e4ff] text-[#1e3a8a] rounded-xl px-10 h-11 font-bold shadow-md active:scale-95 transition-all"
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