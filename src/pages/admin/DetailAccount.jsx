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

// Schema cập nhật theo CSDL database schema
const schema = yup.object().shape({
  // Chung cho tất cả role
  username: yup.string()
    .required("Tên đăng nhập không được để trống")
    .min(1, "Tên đăng nhập phải có ít nhất 1 ký tự")
    .max(255, "Tên đăng nhập không được vượt quá 255 ký tự"),
  email: yup.string()
    .required("Email không được để trống")
    .email("Email không hợp lệ")
    .max(255, "Email không được vượt quá 255 ký tự"),
  usercode: yup.string()
    .required("Mã định danh không được để trống")
    .max(50, "Mã định danh không được vượt quá 50 ký tự"),
  status: yup.string()
    .required("Trạng thái không được để trống"),
  role: yup.string()
    .required("Vai trò không được để trống"),

  // Chung cho Student, Lecturer, Faculty_staff, Admin (người dùng)
  full_name: yup.string().when('role', {
    is: (role) => ['student', 'lecturer', 'faculty_staff', 'admin'].includes(role),
    then: (schema) => schema.required("Họ tên không được để trống").max(255, "Họ tên không được vượt quá 255 ký tự"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  gender: yup.string().when('role', {
    is: (role) => ['student', 'lecturer', 'faculty_staff', 'admin'].includes(role),
    then: (schema) => schema.notRequired().nullable(),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  dob: yup.string().when('role', {
    is: (role) => ['student', 'lecturer', 'faculty_staff', 'admin'].includes(role),
    then: (schema) => schema.notRequired().nullable(),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  phone_number: yup.string().when('role', {
    is: (role) => ['student', 'lecturer', 'faculty_staff', 'admin'].includes(role),
    then: (schema) => schema.notRequired().nullable().max(15, "Số điện thoại không được vượt quá 15 ký tự").matches(/^[0-9\-\+\s]*$/, "Số điện thoại chỉ được chứa chữ số, dấu cộng, dấu gạch ngang hoặc khoảng trắng"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),

  // Student fields (chỉ validate khi role === 'student')
  class_id: yup.string().when('role', {
    is: 'student',
    then: (schema) => schema.required("Lớp không được để trống"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  gpa: yup.number().when('role', {
    is: 'student',
    then: (schema) => schema.notRequired().nullable().typeError("GPA phải là một số").min(0, "GPA phải >= 0").max(4, "GPA phải <= 4"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),

  // Lecturer fields (chỉ validate khi role === 'lecturer')
  degree: yup.string().when('role', {
    is: 'lecturer',
    then: (schema) => schema.notRequired().nullable().max(100, "Học vị không được vượt quá 100 ký tự"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  department: yup.string().when('role', {
    is: 'lecturer',
    then: (schema) => schema.notRequired().nullable().max(255, "Khoa không được vượt quá 255 ký tự"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),

  // Company fields (chỉ validate khi role === 'company')
  name: yup.string().when('role', {
    is: 'company',
    then: (schema) => schema.required("Tên doanh nghiệp không được để trống").max(255, "Tên doanh nghiệp không được vượt quá 255 ký tự"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  address: yup.string().when('role', {
    is: 'company',
    then: (schema) => schema.notRequired().nullable().max(500, "Địa chỉ không được vượt quá 500 ký tự"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  website: yup.string().when('role', {
    is: 'company',
    then: (schema) => schema.notRequired().nullable().test('valid-url', 'Website phải hợp lệ', (value) => {
      if (!value) return true; // Cho phép để trống
      return /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/.test(value);
    }),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  is_partnered: yup.string().when('role', {
    is: 'company',
    then: (schema) => schema.required("Trạng thái đối tác không được để trống"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
});

export default function DetailAccount() {
  const { role, id } = useParams();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "", username: "", email: "", status: "", usercode: "",
      full_name: "", gender: "", dob: "", phone_number: "",
      class_id: "", gpa: null, degree: "", department: "",
      name: "", address: "", website: "", is_partnered: ""
    },
    mode: "onBlur"
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
          
          // Chuyển đổi gender từ "male"/"female" sang "Nam"/"Nữ" để hiển thị trong form
          if (res.data.gender) {
            res.data.gender = res.data.gender === "male" ? "Nam" : (res.data.gender === "female" ? "Nữ" : res.data.gender);
          }
          
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

  // 2. Fetch danh sách lớp học
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await adminService.getClasses();
        if (response.success && response.data) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách lớp:", error);
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const selectedRole = useWatch({ control: form.control, name: "role" });

  const onSubmit = async (data) => {
    try {
      // Chuyển đổi status từ hiển thị sang API
      const apiStatus = data.status === "Hoạt động" ? "active" : "inactive";
      
      // Tạo payload với các chuyển đổi cần thiết
      const payload = { 
        ...data, 
        status: apiStatus,
        // Chuyển giới tính từ "Nam"/"Nữ" sang "male"/"female"
        gender: data.gender === "Nam" ? "male" : (data.gender === "Nữ" ? "female" : data.gender),
        // Chuyển is_partnered từ string "1"/"0" sang number 1/0
        is_partnered: Number(data.is_partnered)
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
                      <FormField control={form.control} name="class_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Lớp</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing || loadingClasses}>
                            <FormControl>
                              <SelectTrigger className={`h-11 ${!isEditing ? "bg-slate-50/50 border-transparent shadow-none font-black text-indigo-600" : "bg-white"}`}>
                                <SelectValue placeholder={loadingClasses ? "Đang tải..." : "Chọn lớp"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-slate-200 max-h-48 overflow-y-auto">
                              {classes.map((cls, index) => (
                                <SelectItem key={`${cls.class_id}-${index}`} value={String(cls.class_id)}>
                                  {cls.class_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
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