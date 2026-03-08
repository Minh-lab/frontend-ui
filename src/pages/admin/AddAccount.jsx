import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, UserPlus, X, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

// Import UI components từ thư viện của bạn
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
  username: yup
    .string()
    .required("Tên tài khoản không được để trống")
    .min(4, "Tên tài khoản phải có ít nhất 4 ký tự"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Định dạng email không hợp lệ"),
  role: yup
    .string()
    .required("Vui lòng chọn vai trò cho tài khoản này"),
});

export default function AddAccount() {
  const navigate = useNavigate();

  /**
   * 2. Khởi tạo React Hook Form
   */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
    }
  });

  /**
   * 3. Xử lý gửi dữ liệu (Submit)
   */
  const onSubmit = async (data) => {
    try {
      console.log("Đang gửi dữ liệu tạo tài khoản:", data);
      
      // Giả lập gọi API với Axios (Sẽ được cấu hình sau)
      // await adminService.createAccount(data);
      
      toast.success("Tạo tài khoản mới thành công!");
      navigate("/admin/accounts"); // Quay về danh sách sau khi thêm
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo tài khoản.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header của Card */}
        <div className="p-6 border-b bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <UserPlus className="mr-2 size-5 text-primary" />
            Thêm tài khoản mới
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Điền đầy đủ thông tin bên dưới để cấp quyền truy cập hệ thống.
          </p>
        </div>

        {/* Form nhập liệu */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              
              {/* Trường Tên tài khoản (Username) */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tài khoản (Username)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: nguyenvanan2026" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="an.nv@gmail.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường Vai trò (Select) */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò hệ thống</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò người dùng" />
                        </SelectTrigger>
                      </FormControl>
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
                )}
              />

              <p className="text-center text-xs text-slate-400">
                Mật khẩu mặc định của tài khoản là tên tài khoản.
              </p>
            </div>

            {/* Các nút hành động */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => form.reset()}
                className="px-4"
              >
                <RefreshCcw className="mr-2 size-4" /> Làm mới
              </Button>
              <Button 
                variant="submit" 
                type="submit" 
                className="px-8 shadow-md"
              >
                Tạo tài khoản
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}