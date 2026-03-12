import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserPlus, X } from "lucide-react";
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

/**
 * 1. Định nghĩa Schema Validation với Yup
 */
const schema = yup.object().shape({
  role: yup.string().required("Vui lòng chọn vai trò"),
  username: yup.string().required("Tên đăng nhập không được để trống").min(4, "Tên tài khoản phải có ít nhất 4 ký tự"),
  email: yup.string().required("Email không được để trống").email("Định dạng email không hợp lệ"),
  code: yup.string().required("Mã định danh không được để trống"),
});

export default function AddAccount() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      username: "",
      email: "",
      code: "", // Dùng chung cho Mã SV, Mã GV, Mã NV, MST, Mã QTV
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

  // Hàm lấy nhãn mã định danh theo vai trò
  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case "student": return "Mã SV";
      case "lecturer": return "Mã GV";
      case "faculty": return "Mã NV";
      case "company": return "Mã số thuế";
      case "admin": return "Mã QTV";
      default: return "Mã định danh";
    }
  };

  const onSubmit = async (data) => {
    console.log("Dữ liệu tạo tài khoản:", data);
    toast.success("Tạo tài khoản mới thành công!");
    navigate("/admin/accounts");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <UserPlus className="mr-2 size-5 text-indigo-600" />
            Thêm tài khoản mới
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              
              {/* 1. CHỌN VAI TRÒ - Chiếm cả 2 cột */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-slate-700">Vai trò hệ thống</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Chọn vai trò người dùng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-slate-200 shadow-md">
                        <SelectItem value="student">Sinh viên</SelectItem>
                        <SelectItem value="lecturer">Giảng viên</SelectItem>
                        <SelectItem value="faculty">Văn phòng Khoa</SelectItem>
                        <SelectItem value="company">Doanh nghiệp</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CHỈ HIỂN THỊ CÁC TRƯỜNG KHI ĐÃ CHỌN VAI TRÒ */}
              {selectedRole && (
                <>
                  {/* Mã định danh (Mã SV, GV, NV, MST, QTV) */}
                  <FormField control={form.control} name="code" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">{getIdentifierLabel()}</FormLabel>
                      <FormControl><Input {...field} placeholder={`Nhập ${getIdentifierLabel()}`} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Email</FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="an.nv@tlu.edu.vn" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Tên đăng nhập</FormLabel>
                      <FormControl><Input {...field} placeholder="VD: nguyenan" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* TRƯỜNG DÀNH CHO CÁC VAI TRÒ CON NGƯỜI */}
                  {selectedRole !== "company" && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Họ và tên</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Giới tính</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="Nam">Nam</SelectItem>
                              <SelectItem value="Nữ">Nữ</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="dob" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Ngày sinh</FormLabel>
                          <FormControl><Input {...field} type="date" /></FormControl>
                        </FormItem>
                      )} />
                    </>
                  )}

                  {/* THÔNG TIN RIÊNG SINH VIÊN */}
                  {selectedRole === "student" && (
                    <>
                      <FormField control={form.control} name="phone_number" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">SĐT</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="class" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Lớp</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="gpa" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">GPA</FormLabel><FormControl><Input {...field} type="number" step="0.1" /></FormControl></FormItem>
                      )} />
                    </>
                  )}

                  {/* THÔNG TIN RIÊNG GIẢNG VIÊN */}
                  {selectedRole === "lecturer" && (
                    <>
                      <FormField control={form.control} name="degree" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Học hàm/Học vị</FormLabel><FormControl><Input {...field} placeholder="VD: Tiến sĩ" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="phone_number" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">SĐT</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="department" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel className="font-bold text-slate-700">Khoa</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                    </>
                  )}

                  {/* THÔNG TIN RIÊNG DOANH NGHIỆP */}
                  {selectedRole === "company" && (
                    <>
                      <FormField control={form.control} name="company_name" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Tên doanh nghiệp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel className="font-bold text-slate-700">Địa chỉ trụ sở</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-slate-700">Địa chỉ website công ty</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="partner_status" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Trạng thái đối tác</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="1">Đã ký kết</SelectItem>
                              <SelectItem value="0">Chưa ký kết</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </>
                  )}

                  {/* VPK & Admin chỉ cần các trường chung + cá nhân đã render ở trên */}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4 pt-6 border-t">
              <Button variant="outline" type="button" onClick={() => navigate(-1)} className="px-8 border-slate-200">
                <X className="mr-2 size-4" /> Hủy bỏ
              </Button>
              <Button variant="submit" type="submit" className="px-12 font-bold shadow-indigo-100 shadow-lg">
                Tạo tài khoản
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}