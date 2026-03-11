import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  ArrowLeft, Save, X, RotateCcw, Edit3, 
  User, Mail, Fingerprint, Phone, Calendar, 
  Users, MapPin, Globe, GraduationCap, Building2, ShieldCheck
} from "lucide-react";
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
import { ConfirmAction } from "@/components/ui/ConfirmAction";

/**
 * 1. Schema Validation mở rộng cho tất cả các role
 */
const schema = yup.object().shape({
  username: yup.string().required("Mã số/Tên đăng nhập là bắt buộc"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  role: yup.string().required("Vui lòng chọn vai trò"),
  status: yup.string().required("Vui lòng chọn trạng thái"),
  full_name: yup.string().when("role", { is: (val) => val !== "công ty", then: (s) => s.required("Họ tên là bắt buộc") }),
  name: yup.string().when("role", { is: "công ty", then: (s) => s.required("Tên công ty là bắt buộc") }),
});

export default function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "", email: "", role: "", status: "",
      full_name: "", name: "", gender: "Nam", dob: "", 
      phone_number: "", class: "", gpa: "",
      degree: "", department: "", address: "", website: "", is_partnered: "0"
    }
  });

  const selectedRole = form.watch("role");

  // Giả lập lấy dữ liệu từ server dựa trên ID
  useEffect(() => {
    const fetchUserData = () => {
      // Mock data cho sinh viên
      const mockData = {
        username: "SV21001",
        email: "an.nv@sinhvien.tlu.edu.vn",
        role: "sinh viên",
        status: "active",
        full_name: "Nguyễn Văn An",
        gender: "Nam",
        dob: "2003-05-20",
        phone_number: "0987654321",
        class: "63CNTT1",
        gpa: "3.6"
      };
      form.reset(mockData);
    };
    fetchUserData();
  }, [id, form]);

  const onSubmit = (data) => {
    console.log("Dữ liệu cập nhật:", data);
    toast.success("Cập nhật thông tin tài khoản thành công!");
    setIsEditing(false);
  };

  const handleResetPassword = () => {
    toast.success("Mật khẩu đã được đặt lại về mặc định.");
    setIsResetOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/accounts")}
          className="p-0 hover:bg-transparent text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 size-4" /> Quay lại danh sách
        </Button>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button variant="default" onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit3 className="mr-2 size-4" /> Chỉnh sửa thông tin
            </Button>
          ) : (
            <Button variant="outline" onClick={() => { setIsEditing(false); form.reset(); }} className="border-slate-200">
              <X className="mr-2 size-4" /> Hủy bỏ
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Card Title */}
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Chi tiết tài khoản #{id}</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">
              Loại tài khoản: {selectedRole}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsResetOpen(true)}
            className="border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            <RotateCcw className="mr-2 size-3.5" /> Reset mật khẩu
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            
            {/* PHẦN 1: THÔNG TIN HỆ THỐNG (BẮT BUỘC) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="size-4" /> Thông tin định danh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Fingerprint className="size-4" /> Mã số / Username</FormLabel>
                    <FormControl><Input {...field} readOnly className="bg-white font-bold" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><ShieldCheck className="size-4" /> Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                      <FormControl><SelectTrigger className={!isEditing ? "bg-white border-transparent shadow-none" : "bg-white"}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="disabled">Vô hiệu hóa</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2"><Mail className="size-4" /> Email liên hệ</FormLabel>
                    <FormControl><Input {...field} type="email" readOnly={!isEditing} className={!isEditing ? "bg-white border-transparent shadow-none font-medium" : "bg-white"} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* PHẦN 2: THÔNG TIN CHI TIẾT (THEO ROLE) */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="size-4" /> Thông tin chi tiết hồ sơ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ROLE: SINH VIÊN */}
                {selectedRole === "sinh viên" && (
                  <>
                    <FormField control={form.control} name="full_name" render={({ field }) => (
                      <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-semibold" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem><FormLabel>Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={!isEditing ? "border-transparent shadow-none" : ""}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>
                    )} />
                    <FormField control={form.control} name="dob" render={({ field }) => (
                      <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><Input {...field} type={isEditing ? "date" : "text"} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="phone_number" render={({ field }) => (
                      <FormItem><FormLabel>Số điện thoại</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="class" render={({ field }) => (
                      <FormItem><FormLabel>Lớp sinh hoạt</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-bold text-blue-600" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="gpa" render={({ field }) => (
                      <FormItem><FormLabel>Điểm GPA</FormLabel><FormControl><Input {...field} type="number" step="0.1" readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-bold" : ""} /></FormControl></FormItem>
                    )} />
                  </>
                )}

                {/* ROLE: GIẢNG VIÊN */}
                {selectedRole === "giảng viên" && (
                  <>
                    <FormField control={form.control} name="full_name" render={({ field }) => (
                      <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-semibold" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="degree" render={({ field }) => (
                      <FormItem><FormLabel>Học vị</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Khoa / Bộ môn</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-medium" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="phone_number" render={({ field }) => (
                      <FormItem><FormLabel>Số điện thoại</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                  </>
                )}

                {/* ROLE: DOANH NGHIỆP */}
                {selectedRole === "công ty" && (
                  <>
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Tên doanh nghiệp</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-bold text-lg" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="website" render={({ field }) => (
                      <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none text-blue-500 underline" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="is_partnered" render={({ field }) => (
                      <FormItem><FormLabel>Trạng thái hợp tác</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={!isEditing ? "border-transparent shadow-none" : ""}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="1">Đối tác chính thức</SelectItem><SelectItem value="0">Chưa ký kết</SelectItem></SelectContent></Select></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Địa chỉ trụ sở</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                  </>
                )}

                {/* ROLE: VĂN PHÒNG KHOA / ADMIN */}
                {(selectedRole === "văn phòng khoa" || selectedRole === "admin") && (
                  <>
                    <FormField control={form.control} name="full_name" render={({ field }) => (
                      <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none font-semibold" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem><FormLabel>Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={!isEditing ? "border-transparent shadow-none" : ""}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>
                    )} />
                    <FormField control={form.control} name="phone_number" render={({ field }) => (
                      <FormItem><FormLabel>Số điện thoại</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="dob" render={({ field }) => (
                      <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><Input {...field} type={isEditing ? "date" : "text"} readOnly={!isEditing} className={!isEditing ? "border-transparent shadow-none" : ""} /></FormControl></FormItem>
                    )} />
                  </>
                )}
              </div>
            </div>

            {/* Nút hành động */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t animate-in slide-in-from-bottom-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => { setIsEditing(false); form.reset(); }}
                  className="px-6 border-slate-200"
                >
                  <X className="mr-2 size-4" /> Hủy thay đổi
                </Button>
                <Button variant="submit" type="submit" className="px-10 shadow-lg shadow-blue-100">
                  <Save className="mr-2 size-4" /> Lưu thông tin
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      <ConfirmAction 
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetPassword}
        title="Xác nhận Reset mật khẩu"
        description={`Mật khẩu của tài khoản ${form.getValues("username")} sẽ được đặt lại về mặc định của hệ thống. Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận Reset"
      />
    </div>
  );
}