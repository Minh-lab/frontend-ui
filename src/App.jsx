import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

// Layouts - Đảm bảo đường dẫn layouts (có s)
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { Sidebar } from "@/components/layouts/Sidebar";

// UI Components - Theo cấu trúc thư mục thực tế của bạn
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmAction } from "@/components/ui/ConfirmAction";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";

import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";

export default function App() {
  // SỬA LỖI TẠI ĐÂY: Dùng selector để IDE không báo đỏ
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Giả lập đăng nhập Giảng viên
  useEffect(() => {
    setAuth(
      { full_name: "Nguyễn Văn C", usercode: "GV001", degree: "Tiến sĩ", department: "CNPM" },
      "token-test-123",
      "lecturer" 
    );
  }, [setAuth]);

  const form = useForm({ defaultValues: { test_input: "" } });

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Toaster position="top-right" richColors />
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 border-r bg-white hidden md:block overflow-y-auto">
            <Sidebar />
          </aside>

          <main className="flex-1 p-8 overflow-y-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Chào mừng, {user?.displayName || "Giảng viên"}
                </h1>
                <p className="text-sm text-muted-foreground italic">
                  Quyền truy cập: <span className="text-primary font-bold uppercase">{role}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="submit" onClick={() => toast.success("Hệ thống hoạt động tốt!")}>
                  Test Toast
                </Button>
                <Button variant="cancel" onClick={() => setIsConfirmOpen(true)}>
                  Test Confirm
                </Button>
              </div>
            </div>

            {/* Table Test */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sinh viên</TableHead>
                    <TableHead>Nghiệp vụ</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Trần Thị Kiều An</TableCell>
                    <TableCell>Đồ án tốt nghiệp</TableCell>
                    <TableCell className="text-right text-purple-600 font-bold">CHỜ DUYỆT</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Form Test */}
            <div className="bg-white p-6 rounded-xl border shadow-sm max-w-md">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="test_input"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kiểm tra Input</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập thử nội dung..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" className="w-full">Gửi thử</Button>
                </form>
              </Form>
            </div>
          </main>
        </div>

        <Footer />

        <ConfirmAction 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            toast.error("Đã xác nhận hủy!");
            setIsConfirmOpen(false);
          }}
          title="Xác nhận?"
          description="Kiểm tra tính năng Confirm Dialog của bạn."
          variant="cancel"
        />
      </div>
    </BrowserRouter>
  );
}