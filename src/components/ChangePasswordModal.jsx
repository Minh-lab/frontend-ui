import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import authService from "@/services/authService";
import useAuthStore from "@/stores/useAuthStore";

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
    .notOneOf(
      [yup.ref("currentPassword")],
      "Mật khẩu mới không được trùng với mật khẩu cũ"
    ),
  confirmPassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu mới")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const logout = useAuthStore((state) => state.logout);

  const form = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // GỬI ĐỦ 3 TRƯỜNG theo ChangePasswordRequest
      const response = await authService.changePassword({
        current_password: data.currentPassword,    // current_password
        password: data.newPassword,                // password
        password_confirmation: data.confirmPassword // password_confirmation
      });
      
      if (response.success) {
        toast.success(response.message || "Đổi mật khẩu thành công!");
        form.reset();
        
        // Backend xóa token -> logout
        logout();
        
        if (onSuccess) onSuccess();
        onClose();
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } catch (error) {
      // Xử lý lỗi từ backend
      if (error.errors) {
        // Laravel validation errors
        Object.keys(error.errors).forEach(key => {
          if (key === 'current_password') {
            form.setError('currentPassword', { message: error.errors[key][0] });
          } else if (key === 'password') {
            form.setError('newPassword', { message: error.errors[key][0] });
          } else if (key === 'password_confirmation') {
            form.setError('confirmPassword', { message: error.errors[key][0] });
          }
        });
        toast.error("Vui lòng kiểm tra lại thông tin");
      } else if (error.message === "Mật khẩu hiện tại không chính xác.") {
        toast.error("Mật khẩu hiện tại không chính xác.");
        form.setError("currentPassword", { 
          message: "Mật khẩu hiện tại không đúng" 
        });
      } else if (error.message?.includes("trùng mật khẩu hiện tại")) {
        toast.error("Mật khẩu mới không được trùng mật khẩu cũ.");
        form.setError("newPassword", { 
          message: "Vui lòng chọn mật khẩu khác" 
        });
      } else {
        toast.error(error.message || "Đổi mật khẩu thất bại");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-lg shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Mật khẩu hiện tại */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Mật khẩu hiện tại
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showCurrent ? "text" : "password"}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="pr-10"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrent ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mật khẩu mới */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showNew ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="pr-10"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nhập lại mật khẩu mới
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showConfirm ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu mới"
                          className="pr-10"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nút Xác nhận */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#6155F5] hover:bg-[#5247E0] text-white rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}