import React, { useState } from "react";
import { 
  User, Mail, Fingerprint, Calendar, 
  Users, ArrowLeft, Edit3, Save, X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form, FormItem, FormLabel, 
  FormControl, FormField, FormMessage 
} from "@/components/ui/form";

/**
 * Schema Validation với Yup
 */
const profileSchema = yup.object().shape({
  full_name: yup
    .string()
    .required("Họ tên không được để trống")
    .min(5, "Họ tên phải có ít nhất 5 ký tự"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Định dạng email không hợp lệ"),
  gender: yup.string().required("Vui lòng nhập giới tính"),
  dob: yup.string().required("Vui lòng chọn ngày sinh"),
});

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      usercode: user?.usercode || "ADMIN_001",
      full_name: user?.displayName || "Quản trị viên",
      email: user?.email || "admin@tlu.edu.vn",
      gender: "Nam",
      dob: "1990-01-01",
    }
  });

  const onSubmit = (data) => {
    // Giả lập gửi API cập nhật
    if (updateUser) {
      updateUser({ 
        displayName: data.full_name, 
        email: data.email 
      });
    }
    setIsEditing(false);
    toast.success("Đã lưu thay đổi thông tin cá nhân!");
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-full size-9"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Thông tin cá nhân Admin</h1>
        </div>
        {!isEditing && (
          <Button 
            variant="default" 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Edit3 className="mr-2 size-4" /> Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Card nội dung chính */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <User className="size-5" />
            </div>
            <h3 className="font-bold text-slate-700">Chi tiết tài khoản</h3>
          </div>
          {isEditing && (
            <span className="text-xs font-semibold text-amber-600 px-2 py-1 bg-amber-50 rounded border border-amber-100 animate-pulse">
              Đang trong chế độ chỉnh sửa
            </span>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Mã nhân viên - Luôn khóa (ReadOnly) */}
              <FormField
                control={form.control}
                name="usercode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 font-semibold flex items-center gap-2">
                      <Fingerprint className="size-4" /> Mã nhân viên
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        readOnly 
                        className="bg-slate-100 font-bold text-slate-600 cursor-not-allowed border-dashed" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Họ tên */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 font-semibold flex items-center gap-2">
                      <User className="size-4" /> Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        readOnly={!isEditing} 
                        className={!isEditing ? "bg-slate-50 border-transparent font-medium" : "border-primary ring-1 ring-primary/10"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-slate-500 font-semibold flex items-center gap-2">
                      <Mail className="size-4" /> Địa chỉ Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        readOnly={!isEditing} 
                        className={!isEditing ? "bg-slate-50 border-transparent font-medium" : "border-primary ring-1 ring-primary/10"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giới tính */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 font-semibold flex items-center gap-2">
                      <Users className="size-4" /> Giới tính
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        readOnly={!isEditing} 
                        className={!isEditing ? "bg-slate-50 border-transparent font-medium" : "border-primary ring-1 ring-primary/10"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ngày sinh */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 font-semibold flex items-center gap-2">
                      <Calendar className="size-4" /> Ngày sinh
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type={isEditing ? "date" : "text"}
                        readOnly={!isEditing} 
                        className={!isEditing ? "bg-slate-50 border-transparent font-medium" : "border-primary ring-1 ring-primary/10"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cụm nút bấm điều khiển */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t animate-in slide-in-from-bottom-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleCancel}
                  className="px-6 h-11 border-slate-200 hover:bg-slate-50"
                >
                  <X className="mr-2 size-4" /> Hủy bỏ
                </Button>
                <Button 
                  variant="submit" 
                  type="submit" 
                  className="px-10 h-11 shadow-md"
                >
                  <Save className="mr-2 size-4" /> Lưu thông tin
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>

    </div>
  );
}