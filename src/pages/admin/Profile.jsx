import React, { useState, useEffect } from "react";
import { User, ArrowLeft, Mail, Fingerprint, Calendar, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import adminService from "@/services/adminService";

export default function AdminProfile() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      usercode: "",
      full_name: "",
      email: "",
      gender: "",
      dob: "",
    },
  });

  // Lấy dữ liệu profile từ API khi mount component
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await adminService.getProfile();
        
        if (response.success) {
          // Ánh xạ dữ liệu từ response.data.user vào form
          const userData = response.data.user;
          form.reset({
            usercode: userData.usercode,
            full_name: userData.full_name,
            email: userData.email,
            gender: userData.gender,
            dob: userData.dob,
          });
        }
      } catch (error) {
        toast.error(error.message || "Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-6">
       
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          {/* Header Bar - Indigo Admin */}
          <div className="h-32 bg-indigo-600 relative">
             <div className="absolute -bottom-12 left-10 p-2 bg-white rounded-3xl shadow-lg">
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
             </div>
          </div>

          <div className="pt-16 pb-10 px-10 space-y-10">
            {/* Tiêu đề và Nút hành động */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Hồ sơ Quản trị viên
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </h1>
                <p className="text-sm text-slate-400 font-medium">Quyền hạn tối cao trên hệ thống quản lý thực tập</p>
              </div>
              <Button
                onClick={() => setShowPasswordModal(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-6 rounded-xl border-none shadow-none transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 mr-2" /> Đổi mật khẩu
              </Button>
            </div>

            <Form {...form}>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
               
                {/* Mã Quản trị viên */}
                <FormField
                  control={form.control}
                  name="usercode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Mã định danh</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input {...field} readOnly className="pl-10 bg-slate-50/50 border-transparent font-bold text-slate-700 h-12 rounded-xl focus-visible:ring-0 cursor-default" />
                        </div>
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
                      <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Giới tính</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-slate-50/50 border-transparent font-medium text-slate-700 h-12 rounded-xl focus-visible:ring-0 cursor-default" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Họ Tên */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Họ và Tên</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-slate-50/50 border-transparent font-bold text-slate-800 text-lg h-12 rounded-xl focus-visible:ring-0 cursor-default" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Email Quản trị */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email quản trị</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input {...field} readOnly className="pl-10 bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" />
                        </div>
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
                      <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Ngày sinh</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input {...field} readOnly className="pl-10 bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
}