import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup"; // Import yup 
import { yupResolver } from "@hookform/resolvers/yup"; // Import resolver
import { ArrowLeft, Save, X, RotateCcw } from "lucide-react";
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
 * 1. Định nghĩa Schema Validation bằng Yup
 */
const schema = yup.object().shape({
  username: yup
    .string()
    .required("Tên tài khoản không được để trống")
    .min(3, "Tên tài khoản phải có ít nhất 3 ký tự"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Định dạng email không hợp lệ"),
  role: yup
    .string()
    .required("Vui lòng chọn vai trò người dùng"),
  status: yup
    .string()
    .required("Vui lòng chọn trạng thái"),
});

export default function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isResetOpen, setIsResetOpen] = useState(false);

  /**
   * 2. Khởi tạo Form với Yup Resolver
   */
  const form = useForm({
    resolver: yupResolver(schema), 
    defaultValues: {
      username: "",
      email: "",
      role: "",
      status: "",
    }
  });

  // Giả lập dữ liệu trả về từ server
  useEffect(() => {
    const userData = {
      username: "Sv001",
      email: "vanan@gmail.com",
      role: "sinh viên",
      status: "active"
    };
    form.reset(userData);
  }, [id, form]);

  const onSubmit = (data) => {
    console.log("Dữ liệu hợp lệ:", data);
    toast.success("Cập nhật thông tin thành công!");
    navigate("/admin/accounts");
  };

  const handleResetPassword = () => {
    toast.info("Đã gửi yêu cầu cấp lại mật khẩu.");
    setIsResetOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/admin/accounts")}
        className="hover:bg-transparent p-0 text-slate-500 hover:text-primary"
      >
        <ArrowLeft className="mr-2 size-4" /> Quay lại danh sách
      </Button>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">Chỉnh sửa tài khoản</h1>
          <Button 
            variant="outline" 
            type="button"
            onClick={() => setIsResetOpen(true)}
            className="border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            <RotateCcw className="mr-2 size-4" /> Reset mật khẩu
          </Button>
        </div>

        <Form {...form}> {/* [cite: 370] */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem> 
                    <FormLabel>Tên tài khoản / Mã số</FormLabel> 
                    <FormControl> 
                      <Input {...field} />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sinh viên">Sinh viên</SelectItem>
                        <SelectItem value="giảng viên">Giảng viên</SelectItem>
                        <SelectItem value="văn phòng khoa">Văn phòng khoa</SelectItem>
                        <SelectItem value="công ty">Doanh nghiệp</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="disabled">Vô hiệu hóa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/admin/accounts")}
                className="px-6"
              >
                <X className="mr-2 size-4" /> Hủy
              </Button>
              <Button 
                variant="submit" 
                type="submit" 
                className="px-8"
              >
                <Save className="mr-2 size-4" /> Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <ConfirmAction 
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetPassword}
        title="Xác nhận Reset mật khẩu"
        description="Mật khẩu của người dùng này sẽ được đặt về giá trị mặc định của hệ thống."
        confirmText="Xác nhận"
        variant="default"
      />
    </div>
  );
}