import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  ArrowLeft, Save, X, RotateCcw, Edit3, 
  User, Loader2
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
import adminService from "@/services/adminService";

// Schema cập nhật theo field backend
const schema = yup.object().shape({
  username: yup.string().required("Tên đăng nhập không được để trống"),
  email: yup.string().required("Email không được để trống").email("Email không hợp lệ"),
  status: yup.string().required("Vui lòng chọn trạng thái"),
  usercode: yup.string().required("Mã định danh không được để trống"),
});

export default function DetailAccount() {
  const { role, id } = useParams();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "", username: "", email: "", status: "", usercode: "",
      full_name: "", gender: "Nam", dob: "", phone_number: "",
      class_id: "", gpa: "", degree: "", department: "",
      name: "", address: "", website: "", is_partnered: "0" // Mặc định là "0" (Chưa ký kết)
    }
  });

  // 1. Fetch dữ liệu: Cần cả ID và Role
  useEffect(() => {
    const fetchAccount = async () => {
      if (!role) {
        toast.error("Thiếu thông tin vai trò (role) để truy vấn");
        return;
      }
      try {
        setLoading(true);
        const res = await adminService.getAccountById(id, role);
        if (res.success) {
          // Backend trả về 'active'/'inactive', map sang label hiển thị
          const displayStatus = res.data.status === "active" ? "Hoạt động" : "Vô hiệu hóa";
          
          // Chuyển đổi is_partnered từ boolean sang string cho Select
          if (res.data.is_partnered !== undefined) {
            res.data.is_partnered = res.data.is_partnered ? "1" : "0";
          }
          
          form.reset({ ...res.data, status: displayStatus });
        }
      } catch (error) {
        toast.error(error.message || "Không thể tải dữ liệu tài khoản");
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [id, role, form]);

  const selectedRole = useWatch({ control: form.control, name: "role" });

  const onSubmit = async (data) => {
    try {
      // Chuyển đổi status từ hiển thị sang API
      const apiStatus = data.status === "Hoạt động" ? "active" : "inactive";
      
      // Tạo payload với status đã chuyển đổi
      const payload = { 
        ...data, 
        status: apiStatus,
        // Chuyển is_partnered từ string "1"/"0" sang int 1/0
        is_partnered: data.is_partnered === "1" ? 1 : 0
      };
      
      const res = await adminService.updateAccount(id, role, payload);
      if (res.success) {
        toast.success("Cập nhật tài khoản thành công!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.message || "Cập nhật thất bại");
    }
  };

  // 3. Reset mật khẩu: Theo logic backend (gửi username để hash làm pass)
  const handleConfirmReset = async () => {
    try {
      const username = form.getValues("username");
      await adminService.resetPassword(id, role, username);
      toast.success(`Reset thành công mật khẩu cho "${username}"!`);
      setIsResetOpen(false);
    } catch (error) {
      toast.error(error.message || "Không thể reset mật khẩu");
    }
  };

  const getCodeLabel = () => {
    switch (selectedRole) {
      case "student": return "Mã SV";
      case "lecturer": return "Mã GV";
      case "faculty_staff": return "Mã NV";
      case "company": return "Mã doanh nghiệp";
      case "admin": return "Mã QTV";
      default: return "Mã định danh";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 font-sans">
      {/* Header Buttons */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/admin/accounts")} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition group">
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </button>

        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg px-8 font-bold text-white transition-all active:scale-95">
              <Edit3 className="mr-2 size-4" /> Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => { setIsEditing(false); form.reset(); }} className="border-slate-200 font-bold">
                <X className="mr-2 size-4" /> Hủy bỏ
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 shadow-lg px-8 font-bold text-white transition-all active:scale-95">
                <Save className="mr-2 size-4" /> Lưu thông tin
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
            <User className="size-5 text-indigo-600" /> Chi tiết tài khoản
          </h2>
        </div>

        <Form {...form}>
          <form className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Role - Readonly always as per Backend logic */}
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Vai trò hệ thống</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={true}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-100 opacity-80 cursor-not-allowed h-11">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-200 shadow-xl">
                      <SelectItem value="student">Sinh viên</SelectItem>
                      <SelectItem value="lecturer">Giảng viên</SelectItem>
                      <SelectItem value="faculty_staff">Văn phòng Khoa</SelectItem>
                      <SelectItem value="company">Doanh nghiệp</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <FormField control={form.control} name="usercode" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">{getCodeLabel()}</FormLabel>
                  <FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                    <FormControl>
                      <SelectTrigger className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`}><SelectValue /></SelectTrigger>
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
                  <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Tên đăng nhập</FormLabel>
                  <FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">Email</FormLabel>
                  <FormControl><Input {...field} type="email" readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl>
                </FormItem>
              )} />

              {isEditing && (
                <div className="flex items-end">
                  <Button type="button" variant="outline" onClick={() => setIsResetOpen(true)} className="border-amber-300 text-amber-700 hover:bg-amber-50 font-bold h-11 w-full md:w-auto px-6">
                    <RotateCcw className="mr-2 size-4" /> Reset mật khẩu
                  </Button>
                </div>
              )}

              {/* Chi tiết theo vai trò */}
              <div className="md:col-span-2 pt-6 border-t border-slate-100 mt-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Thông tin chi tiết hồ sơ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedRole === "student" && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel className="font-bold">Họ tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold h-11" : "h-11 bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="font-bold">Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`}><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-white"><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>)} />
                      <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel className="font-bold">Ngày sinh</FormLabel><FormControl><Input {...field} type={isEditing ? "date" : "text"} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="phone_number" render={({ field }) => (<FormItem><FormLabel className="font-bold">Số điện thoại</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="class_id" render={({ field }) => (<FormItem><FormLabel className="font-bold">Lớp</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-black text-indigo-600" : "bg-white"}`} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gpa" render={({ field }) => (<FormItem><FormLabel className="font-bold">GPA</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-black" : "bg-white"}`} /></FormControl></FormItem>)} />
                    </>
                  )}
                  {selectedRole === "lecturer" && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel className="font-bold">Họ tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold h-11" : "h-11 bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="font-bold">Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`}><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-white"><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>)} />
                      <FormField control={form.control} name="degree" render={({ field }) => (<FormItem><FormLabel className="font-bold">Học hàm/Học vị</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="department" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-bold">Khoa</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
                    </>
                  )}
                  {selectedRole === "company" && (
                    <>
                      <FormField control={form.control} name="name" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-bold">Tên doanh nghiệp</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-black h-11" : "h-11 bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="font-bold">Địa chỉ</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel className="font-bold">Website</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none text-blue-600 underline font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
                      
                      {/* THÊM TRƯỜNG IS_PARTNERED - Trạng thái đối tác */}
                      <FormField control={form.control} name="is_partnered" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Trạng thái đối tác</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                            <FormControl>
                              <SelectTrigger className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`}>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="1">Đã ký kết</SelectItem>
                              <SelectItem value="0">Chưa ký kết</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </>
                  )}
                  {(selectedRole === "faculty_staff" || selectedRole === "admin") && (
                    <>
                      <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel className="font-bold">Họ tên</FormLabel><FormControl><Input {...field} readOnly={!isEditing} className={!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold h-11" : "h-11 bg-white"} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="font-bold">Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`}><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-white"><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent></Select></FormItem>)} />
                      <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel className="font-bold">Ngày sinh</FormLabel><FormControl><Input {...field} type={isEditing ? "date" : "text"} readOnly={!isEditing} className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-bold" : "bg-white"}`} /></FormControl></FormItem>)} />
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
        onConfirm={handleConfirmReset}
        title="Xác nhận Reset mật khẩu"
        description="Mật khẩu của tài khoản này sẽ quay về mặc định hệ thống. Bạn có chắc chắn?"
        confirmText="Reset mật khẩu"
        variant="cancel"
      />
    </div>
  );
}