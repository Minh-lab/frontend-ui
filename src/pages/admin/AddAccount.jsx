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
  username: yup.string().required("Tên tài khoản không được để trống").min(4, "Tên tài khoản phải có ít nhất 4 ký tự"),
  email: yup.string().required("Email không được để trống").email("Định dạng email không hợp lệ"),
  role: yup.string().required("Vui lòng chọn vai trò"),
  // Các trường bổ sung (optional trong schema nhưng render theo điều kiện)
  full_name: yup.string().when("role", { is: (val) => val !== "company" && val !== "", then: (s) => s.required("Họ tên không được để trống") }),
  name: yup.string().when("role", { is: "company", then: (s) => s.required("Tên doanh nghiệp không được để trống") }),
});

export default function AddAccount() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
      full_name: "",
      name: "",
      address: "",
      website: "",
      is_partnered: "0",
      gender: "Nam",
      dob: "",
      phone_number: "",
      class: "",
      gpa: "",
      degree: "",
      department: "",
    }
  });

  // Theo dõi giá trị role để hiển thị input tương ứng
  const selectedRole = form.watch("role");

  const onSubmit = async (data) => {
    try {
      console.log("Dữ liệu gửi đi:", data);
      toast.success("Tạo tài khoản mới thành công!");
      navigate("/admin/accounts");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <UserPlus className="mr-2 size-5 text-primary" />
            Thêm tài khoản mới
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Các trường chung */}
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl><Input {...field} placeholder="VD: nguyenvanan" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="an.nv@tlu.edu.vn" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Vai trò hệ thống</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn vai trò" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="student">Sinh viên</SelectItem>
                      <SelectItem value="lecturer">Giảng viên</SelectItem>
                      <SelectItem value="faculty">Văn phòng Khoa</SelectItem>
                      <SelectItem value="company">Doanh nghiệp</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* RENDER THEO ROLE SINH VIÊN */}
              {selectedRole === "student" && (
                <>
                  <FormField control={form.control} name="full_name" render={({ field }) => (
                    <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><Input {...field} type="date" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="phone_number" render={({ field }) => (
                    <FormItem><FormLabel>Số điện thoại</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="class" render={({ field }) => (
                    <FormItem><FormLabel>Lớp</FormLabel><FormControl><Input {...field} placeholder="VD: 63CNTT1" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="gpa" render={({ field }) => (
                    <FormItem><FormLabel>GPA</FormLabel><FormControl><Input {...field} type="number" step="0.1" /></FormControl></FormItem>
                  )} />
                </>
              )}

              {/* RENDER THEO ROLE GIẢNG VIÊN */}
              {selectedRole === "lecturer" && (
                <>
                  <FormField control={form.control} name="full_name" render={({ field }) => (
                    <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><Input {...field} type="date" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="phone_number" render={({ field }) => (
                    <FormItem><FormLabel>Số điện thoại</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="degree" render={({ field }) => (
                    <FormItem><FormLabel>Học vị</FormLabel><FormControl><Input {...field} placeholder="VD: Tiến sĩ" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem><FormLabel>Khoa/Bộ môn</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                </>
              )}

              {/* RENDER THEO ROLE DOANH NGHIỆP */}
              {selectedRole === "company" && (
                <>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Tên doanh nghiệp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Địa chỉ</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="is_partnered" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái đối tác</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="1">Đã ký kết</SelectItem><SelectItem value="0">Chưa ký kết</SelectItem></SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </>
              )}

              {/* RENDER THEO ROLE VĂN PHÒNG KHOA */}
              {selectedRole === "faculty" && (
                <>
                  <FormField control={form.control} name="full_name" render={({ field }) => (
                    <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="phone_number" render={({ field }) => (
                    <FormItem><FormLabel>Số điện thoại</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><Input {...field} type="date" /></FormControl></FormItem>
                  )} />
                </>
              )}

              {/* RENDER THEO ROLE ADMIN */}
              {selectedRole === "admin" && (
                <>
                  <FormField control={form.control} name="full_name" render={({ field }) => (
                    <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><Input {...field} type="date" /></FormControl></FormItem>
                  )} />
                </>
              )}
            </div>

            <div className="flex justify-between items-center gap-3 pt-6 border-t">
              <Button variant="outline" type="button" onClick={() => navigate(-1)} className="px-6 border-slate-200">
                <X className="mr-2 size-4" /> Hủy bỏ
              </Button>
              <Button variant="submit" type="submit" className="px-10 shadow-md">
                Tạo tài khoản
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}