import React, { useState } from "react";
import { 
  Search, UserPlus, Eye, Trash2, 
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import các UI components từ thư mục ui của bạn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { ConfirmAction } from "@/components/ui/ConfirmAction";

// Dữ liệu mẫu mô phỏng từ ảnh phác thảo của bạn
const MOCK_ACCOUNTS = [
  { id: 1, username: "Admin", email: "admin@gmail.com", role: "Admin", status: "Hoạt động" },
  { id: 2, username: "Sv001", email: "vanan@gmail.com", role: "sinh viên", status: "Hoạt động" },
  { id: 3, username: "GV002", email: "hoang@gmail.com", role: "giảng viên", status: "Vô hiệu hóa" },
  { id: 4, username: "VPK01", email: "vpk@tlu.edu.vn", role: "văn phòng khoa", status: "Hoạt động" },
];

export default function ManageAccounts() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  // Xử lý khi nhấn nút xóa
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Xử lý xác nhận xóa cuối cùng
  const confirmDelete = () => {
    console.log("Đã thực hiện xóa tài khoản:", selectedUser?.username);
    setIsDeleteOpen(false);
    // Ở đây sau này sẽ gọi API: adminService.deleteAccount(selectedUser.id)
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Header & Nút thêm nhanh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý tài khoản</h1>
          <p className="text-sm text-slate-500 mt-1">Hệ thống quản lý và phân quyền người dùng Đại học Thủy Lợi.</p>
        </div>
        
      </div>

      {/* 2. Bộ lọc tìm kiếm (Theo phác thảo của bạn) */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
        <h3 className="text-center font-bold text-xl text-slate-800">Tìm kiếm tài khoản</h3>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Nhập tên tài khoản..." 
              className="pl-10 h-10" 
            />
          </div>
          <Select>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="--Trạng thái--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="disabled">Vô hiệu hóa</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" className="px-8 bg-blue-600 hover:bg-blue-700">
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className="p-1 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-700">Danh sách tài khoản</h3>
        </div>
      {/* 3. Bảng danh sách tài khoản chuyên nghiệp */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        
        <Table>
          <TableHeader className="bg-blue-500 text-white">
            <TableRow>
              <TableHead className="w-20">Stt</TableHead>
              <TableHead>Tên tài khoản</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {MOCK_ACCOUNTS.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-semibold text-slate-700">{item.username}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell className="capitalize text-slate-600">{item.role}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    item.status === "Hoạt động" 
                      ? "text-blue-600 bg-blue-50 border border-blue-100" 
                      : "text-red-600 bg-red-50 border border-red-100"
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => navigate(`/admin/detail-account/${item.id}`)} // Chuyển sang trang edit với ID
                    >
                    <Eye className="size-4" />
                  </Button>
                  <Button 
                    variant="cancel" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 4. Phân trang (Pagination) */}
        <div className="p-4 border-t flex items-center justify-between bg-slate-50/30">
          <Button variant="outline" size="sm" className="text-slate-600">
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>
          
          <div className="flex gap-1">
            {[1, 2, 3, "...", 10].map((p, i) => (
              <Button 
                key={i} 
                variant={p === 1 ? "default" : "ghost"} 
                size="sm" 
                className={`w-8 h-8 p-0 ${p === 1 ? 'bg-blue-600 text-white' : ''}`}
              >
                {p}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="text-slate-600">
            Next <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Hộp thoại xác nhận xóa  */}
      <ConfirmAction 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa tài khoản"
        description={`Bạn có chắc chắn muốn loại bỏ tài khoản "${selectedUser?.username}" khỏi hệ thống?`}
        confirmText="Xác nhận xóa"
        variant="cancel" 
      />
    </div>
  );
}