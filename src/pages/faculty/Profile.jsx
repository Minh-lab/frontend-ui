import React, { useState, useEffect } from "react";
import { User, ArrowLeft, Mail, Fingerprint, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { profileService } from "@/services/faculty";

import { toast } from "sonner";

export default function FacultyProfile() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const form = useForm({
    defaultValues: {
      usercode: "",
      full_name: "",
      email: "",
      gender: "",
      dob: "",
      phone: "",
      address: "",
      department: "",
      position: "",
    },
  });

  // Fetch profile data từ API
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      
      console.log("API Response:", response); // Debug: xem cấu trúc dữ liệu
      
      if (response.success) {
        // API trả về: { success: true, data: { user: {...}, role: "faculty_staff" } }
        const userData = response.data.user; // Lấy user từ response.data.user
        // eslint-disable-next-line no-unused-vars
        const role = response.data.role;
        
        console.log("User Data:", userData); // Debug: xem user data
        
        setProfileData(userData);
        
        // Cập nhật form values với userData
        form.reset({
          usercode: userData.usercode || "",
          full_name: userData.full_name || "",
          email: userData.email || "",
          gender: userData.gender || "",
          dob: userData.dob || "",
          phone: userData.phone || "",
          address: userData.address || "",
          department: userData.department || "",
          position: userData.position || "",
        });
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error(error.message || "Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Nút quay lại đơn giản */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI
        </button>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {/* Header Bar - Dùng màu Indigo dịu nhẹ, không quá gắt */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-500 relative">
             <div className="absolute -bottom-12 left-10 p-2 bg-white rounded-3xl shadow-lg">
                <div className="bg-indigo-50 p-4 rounded-2xl">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
             </div>
          </div>

          <div className="pt-16 pb-10 px-10 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h1>
                <p className="text-sm text-slate-400 font-medium">
                  {profileData?.department || "Văn phòng Khoa"} - Đại học Thủy Lợi
                </p>
              </div>
              <Button 
                onClick={() => setShowPasswordModal(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-6 rounded-xl border-none shadow-none transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4 mr-2" /> Đổi mật khẩu
              </Button>
            </div>

            <Form {...form}>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                
                {/* Mã nhân viên */}
                <FormField
                  control={form.control}
                  name="usercode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Mã nhân viên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input 
                            {...field} 
                            readOnly 
                            className="pl-10 bg-slate-50/50 border-transparent font-bold text-slate-700 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Chức vụ */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Chức vụ
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly 
                          className="bg-slate-50/50 border-transparent font-medium text-slate-700 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
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
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Họ và Tên
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly 
                          className="bg-slate-50/50 border-transparent font-bold text-slate-800 text-lg h-12 rounded-xl focus-visible:ring-0 cursor-default" 
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
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Email công vụ
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input 
                            {...field} 
                            readOnly 
                            className="pl-10 bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Số điện thoại */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly 
                          className="bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
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
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input 
                            {...field} 
                            readOnly 
                            className="pl-10 bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
                          />
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
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Giới tính
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly 
                          className="bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Địa chỉ - Full width */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly 
                          className="bg-slate-50/50 border-transparent font-medium text-slate-600 h-12 rounded-xl focus-visible:ring-0 cursor-default" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* Footer với thông tin cập nhật */}
            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-400 italic">
                * Thông tin được cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
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