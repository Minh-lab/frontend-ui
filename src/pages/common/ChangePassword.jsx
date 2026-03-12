import React, { useState } from "react";
import { Lock, Eye, EyeOff, Save, X, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, FormItem, FormLabel, 
  FormControl, FormField, FormMessage 
} from "@/components/ui/form";

/**
 * Schema Validation với Yup để kiểm tra tính hợp lệ của mật khẩu
 */
const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Mật khẩu hiện tại không được để trống"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới không được để trống")
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .notOneOf([yup.ref('currentPassword')], "Mật khẩu mới không được trùng với mật khẩu cũ"),
  confirmPassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu mới")
    .oneOf([yup.ref('newPassword')], "Mật khẩu xác nhận không khớp"),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log("Dữ liệu gửi lên server:", data);
      // Giả lập gọi API đổi mật khẩu
      // await authService.changePassword(data);
      
      toast.success("Đổi mật khẩu thành công!");
      form.reset();
      navigate(-1); // Quay lại trang trước đó
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Mật khẩu hiện tại không chính xác.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Thiết lập mật khẩu</h1>
        <p className="text-sm text-slate-500">
          Vui lòng sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="font-bold text-slate-700">Đổi mật khẩu</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {/* Mật khẩu hiện tại */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showCurrent ? "text" : "password"} 
                        placeholder="••••••••"
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <hr className="border-slate-100" />

            {/* Mật khẩu mới */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showNew ? "text" : "password"} 
                        placeholder="Ít nhất 8 ký tự"
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nhập lại mật khẩu mới */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showConfirm ? "text" : "password"} 
                        placeholder="Xác nhận lại mật khẩu"
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 order-2 sm:order-1"
              >
                <X className="mr-2 size-4" /> Hủy bỏ
              </Button>
              <Button 
                variant="submit" 
                type="submit" 
                className="px-8 shadow-md order-1 sm:order-2"
              >
                <Save className="mr-2 size-4" /> Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
