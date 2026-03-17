import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserPlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, FormItem, FormLabel, 
  FormControl, FormMessage, FormField 
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import adminService from "@/services/adminService";

/**
 * 1. Định nghĩa Schema Validation với Yup [cite: 848]
 */
const schema = yup.object().shape({
  role: yup.string().required("Vui lòng chọn vai trò"),
  username: yup.string().required("Tên đăng nhập không được để trống"),
  email: yup.string().required("Email không được để trống").email("Định dạng email không hợp lệ"),
  code: yup.string().required("Mã định danh không được để trống"),
});

export default function AddAccount() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      username: "",
      email: "",
      code: "", 
      full_name: "",
      gender: "Nam",
      dob: "",
      phone_number: "",
      class: "",
      gpa: "",
      degree: "",
      department: "",
      company_name: "",
      address: "",
      website: "",
      partner_status: "0",
    }
  });

  const selectedRole = form.watch("role");

  // Hàm lấy nhãn mã định danh theo vai trò [cite: 879]
  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case "student": return "Mã SV";
      case "lecturer": return "Mã GV";
      case "faculty_staff": return "Mã NV";
      case "company": return "Mã số thuế";
      case "admin": return "Mã QTV";
      default: return "Mã định danh";
    }
  };

  // Hàm xử lý gửi dữ liệu lên API 
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await adminService.createAccount(data);
      if (response.success) {
        toast.success(response.message || "Tạo tài khoản mới thành công!");
        navigate("/admin/accounts");
      }
    } catch (error) {
      toast.error(error.message || "Tạo tài khoản thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header [cite: 898] */}
        <div className="p-6 border-b bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800 flex items-center uppercase tracking-tight">
            <UserPlus className="mr-2 size-5 text-indigo-600" />
            Thêm tài khoản mới
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              
              {/* CHỌN VAI TRÒ [cite: 908] */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Vai trò hệ thống</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200 h-11">
                          <SelectValue placeholder="Chọn vai trò người dùng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-slate-200 shadow-md">
                        <SelectItem value="student">Sinh viên</SelectItem>
                        <SelectItem value="lecturer">Giảng viên</SelectItem>
                        <SelectItem value="faculty_staff">Văn phòng Khoa</SelectItem>
                        <SelectItem value="company">Doanh nghiệp</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HIỂN THỊ CÁC TRƯỜNG KHI ĐÃ CHỌN VAI TRÒ [cite: 933] */}
              {selectedRole && (
                <>
                  <FormField control={form.control} name="code" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">{getIdentifierLabel()}</FormLabel>
                      <FormControl><Input {...field} placeholder={`Nhập ${getIdentifierLabel()}`} className="h-11" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Email</FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="an.nv@tlu.edu.vn" className="h-11" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Tên đăng nhập</FormLabel>
                      <FormControl><Input {...field} placeholder="VD: nguyenan" className="h-11" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* TRƯỜNG DÀNH CHO CÁC VAI TRÒ CON NGƯỜI [cite: 958] */}
                  {selectedRole !== "company" && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Họ và tên</FormLabel>
                          <FormControl><Input {...field} className="h-11" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Giới tính</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white h-11"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="Nam">Nam</SelectItem>
                              <SelectItem value="Nữ">Nữ</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="dob" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Ngày sinh</FormLabel>
                          <FormControl><Input {...field} type="date" className="h-11" /></FormControl>
                        </FormItem>
                      )} />
                    </>
                  )}

                  {/* THÔNG TIN RIÊNG SINH VIÊN [cite: 988] */}
                  {selectedRole === "student" && (
                    <>
                      <FormField control={form.control} name="phone_number" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">SĐT</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="class" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Lớp</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="gpa" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">GPA</FormLabel><FormControl><Input {...field} type="number" step="0.1" className="h-11" /></FormControl></FormItem>
                      )} />
                    </>
                  )}

                  {/* THÔNG TIN RIÊNG GIẢNG VIÊN [cite: 1002] */}
                  {selectedRole === "lecturer" && (
                    <>
                      <FormField control={form.control} name="degree" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Học hàm/Học vị</FormLabel><FormControl><Input {...field} placeholder="VD: Tiến sĩ" className="h-11" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="phone_number" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">SĐT</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="department" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel className="font-bold text-slate-700">Khoa</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl></FormItem>
                      )} />
                    </>
                  )}

                  {/* THÔNG TIN RIÊNG DOANH NGHIỆP [cite: 1016] */}
                  {selectedRole === "company" && (
                    <>
                      <FormField control={form.control} name="company_name" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Tên doanh nghiệp</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel className="font-bold text-slate-700">Địa chỉ trụ sở</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Địa chỉ website công ty</FormLabel><FormControl><Input {...field} placeholder="https://..." className="h-11" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="partner_status" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Trạng thái đối tác</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white h-11"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="1">Đã ký kết</SelectItem>
                              <SelectItem value="0">Chưa ký kết</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons [cite: 1046] */}
            <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => navigate(-1)} className="px-8 border-slate-200 h-12 font-bold transition-all active:scale-95">
                <X className="mr-2 size-4" /> Hủy bỏ
              </Button>
              <Button 
                variant="submit" 
                type="submit" 
                disabled={isSubmitting}
                className="px-12 h-12 font-bold shadow-indigo-100 shadow-lg bg-[#6155F5] hover:bg-[#5247E0] transition-all active:scale-95 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Tạo tài khoản"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}