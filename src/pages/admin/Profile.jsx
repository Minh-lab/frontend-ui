import React, { useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Dữ liệu hiển thị (ưu tiên dữ liệu từ store, nếu không có thì dùng mặc định)
  const profileData = {
    usercode: user?.usercode || "N/A",
    full_name: user?.displayName || "Chưa cập nhật",
    email: user?.email || "Chưa cập nhật",
    gender: user?.gender || "Nam",
    dob: user?.dob || "01/01/1990",
  };

  const form = useForm({
    defaultValues: {
      usercode: profileData.usercode,
      full_name: profileData.full_name,
      email: profileData.email,
      gender: profileData.gender,
      dob: profileData.dob,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header với gradient */}
        <div className="bg-gradient-to-r from-[#6155F5] to-[#7B68EE] rounded-t-3xl px-6 py-6 flex items-center gap-4 shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Thông tin cá nhân</h1>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-b-3xl shadow-lg overflow-hidden p-8">
          <Form {...form}>
            <form className="space-y-4">
              {/* Mã nhân viên */}
              <FormField
                control={form.control}
                name="usercode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">Mã nhân viên</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="bg-gray-100 cursor-default border-gray-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="bg-gray-100 cursor-default border-gray-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Họ Tên */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">Họ Tên</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="bg-gray-100 cursor-default border-gray-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Giới tính */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">Giới tính</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="bg-gray-100 cursor-default border-gray-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Ngày sinh */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">Ngày sinh</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="bg-gray-100 cursor-default border-gray-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Nút Đổi mật khẩu */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => setShowPasswordModal(true)}
            className="bg-[#6155F5] hover:bg-[#5247E0] text-white px-8 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition"
          >
            Đổi mật khẩu
          </Button>
        </div>

        <ChangePasswordModal 
          isOpen={showPasswordModal} 
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
}