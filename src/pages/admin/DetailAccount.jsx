import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  ArrowLeft, Save, X, RotateCcw, Edit3, 
  User, ShieldCheck, Mail, Fingerprint, Lock
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

const schema = yup.object().shape({
  username: yup.string().required("Tên đăng nhập không được để trống"),
  email: yup.string().required("Email không được để trống").email("Email không hợp lệ"),
  status: yup.string().required("Vui lòng chọn trạng thái"),
  code: yup.string().required("Mã định danh không được để trống"),
});

export default function DetailAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // 1. Giả lập lấy dữ liệu dựa trên ID ngay tại đây (thay vì useEffect)
  // Việc dùng useMemo giúp dữ liệu ổn định và form nhận diện được ngay lần render đầu
  const accountData = useMemo(() => {
    const allData = {
      "1": { role: "admin", code: "AD001", username: "admin_tlu", email: "admin@tlu.edu.vn", status: "Hoạt động", full_name: "Quản trị viên hệ thống", gender: "Nam", dob: "1990-01-01" },
      "2": { role: "student", code: "SV21001", username: "vanan_sv", email: "an.nv@sinhvien.tlu.edu.vn", status: "Hoạt động", full_name: "Nguyễn Văn An", gender: "Nam", dob: "2003-05-20", phone_number: "0987654321", class: "65KTPM1", gpa: "3.8" },
      "3": { role: "lecturer", code: "GV502", username: "hoang_gv", email: "hoang.lecturer@tlu.edu.vn", status: "Vô hiệu hóa", full_name: "Lê Minh Hoàng", gender: "Nam", dob: "1985-11-12", degree: "Tiến sĩ", phone_number: "0912233445", department: "Công nghệ phần mềm" },
      "4": { role: "company", code: "MST010203", username: "fpt_software", email: "hr@fpt.com.vn", status: "Hoạt động", company_name: "FPT Software", address: "Khu CNC Hòa Lạc, Hà Nội", website: "https://fpt-software.com", partner_status: "1" }
    };
    return allData[id] || {};
  }, [id]);

  const form = useForm({
    resolver: yupResolver(schema),
    values: accountData, // Dùng 'values' thay cho reset() trong useEffect
  });

  const selectedRole = useWatch({ control: form.control, name: "role" });

  const onSubmit = (data) => {
    console.log("Cập nhật:", data);
    toast.success("Cập nhật tài khoản thành công!");
    setIsEditing(false);
  };

  const getCodeLabel = () => {
    switch (selectedRole) {
      case "student": return "Mã SV";
      case "lecturer": return "Mã GV";
      case "faculty": return "Mã NV";
      case "company": return "Mã số thuế";
      case "admin": return "Mã QTV";
      default: return "Mã định danh";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/admin/accounts")} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition group">
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </button>

        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg px-8 font-bold text-white">
              <Edit3 className="mr-2 size-4" /> Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => { setIsEditing(false); form.reset(); }} className="border-slate-200 font-bold">
                <X className="mr-2 size-4" /> Hủy bỏ
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 shadow-lg px-8 font-bold text-white">
                <Save className="mr-2 size-4" /> Lưu thông tin
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase">
            <User className="size-5 text-indigo-600" /> Chi tiết tài khoản
          </h2>
        </div>

        <Form {...form}>
          <form className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* VAI TRÒ (Vô hiệu hóa) */}
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-bold text-slate-700">Vai trò hệ thống</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={true}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-100 opacity-80 cursor-not-allowed">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-200 shadow-xl">
                      <SelectItem value="student">Sinh viên</SelectItem>
                      <SelectItem value="lecturer">Giảng viên</SelectItem>
                      <SelectItem value="faculty">Văn phòng Khoa</SelectItem>
                      <SelectItem value="company">Doanh nghiệp</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">{getCodeLabel()}</FormLabel>
                  <FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                    <FormControl>
                      <SelectTrigger className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"}><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                      <SelectItem value="Vô hiệu hóa">Vô hiệu hóa</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Tên đăng nhập</FormLabel>
                  <FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Email</FormLabel>
                  <FormControl><Input {...field} type="email" readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl>
                </FormItem>
              )} />

              {isEditing && (
      
                  <Button type="button" variant="outline" onClick={() => setIsResetOpen(true)} className="border-amber-300 text-amber-700 hover:bg-amber-100 font-bold">
                    <RotateCcw className="mr-2 size-4" /> Reset mật khẩu
                  </Button>
              )}

              <div className="md:col-span-2 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Thông tin chi tiết hồ sơ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* SINH VIÊN */}
                  {selectedRole === "student" && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel className="font-bold">Họ tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="font-bold">Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"}><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-white"><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>)} />
                      <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel className="font-bold">Ngày sinh</FormLabel><FormControl><Input {...field} type={isEditing ? "date" : "text"} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="phone_number" render={({ field }) => (<FormItem><FormLabel className="font-bold">Số điện thoại</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="class" render={({ field }) => (<FormItem><FormLabel className="font-bold">Lớp</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold text-indigo-600" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gpa" render={({ field }) => (<FormItem><FormLabel className="font-bold">GPA</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"} /></FormControl></FormItem>)} />
                    </>
                  )}

                  {/* GIẢNG VIÊN */}
                  {selectedRole === "lecturer" && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel className="font-bold">Họ tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="font-bold">Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"}><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-white"><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>)} />
                      <FormField control={form.control} name="degree" render={({ field }) => (<FormItem><FormLabel className="font-bold">Học hàm/Học vị</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="department" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-bold">Khoa</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl></FormItem>)} />
                    </>
                  )}

                  {/* DOANH NGHIỆP */}
                  {selectedRole === "company" && (
                    <>
                      <FormField control={form.control} name="company_name" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-bold">Tên doanh nghiệp</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-bold">Địa chỉ</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel className="font-bold">Website</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none text-blue-500 underline" : "bg-white"} /></FormControl></FormItem>)} />
                    </>
                  )}

                  {/* VPK / ADMIN */}
                  {(selectedRole === "faculty" || selectedRole === "admin") && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel className="font-bold">Họ tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="font-bold">Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"}><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-white"><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>)} />
                      <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel className="font-bold">Ngày sinh</FormLabel><FormControl><Input {...field} type={isEditing ? "date" : "text"} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none" : "bg-white"} /></FormControl></FormItem>)} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <ConfirmAction 
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={() => {
          toast.success(`Reset thành công mật khẩu cho "${form.getValues("username")}"!`);
          setIsResetOpen(false);
        }}
        title="Xác nhận Reset mật khẩu"
        description="Mật khẩu của tài khoản này sẽ quay về mặc định hệ thống. Bạn có chắc chắn?"
        confirmText="Reset mật khẩu"
      />
    </div>
  );
}