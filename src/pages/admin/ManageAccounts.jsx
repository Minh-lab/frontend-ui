import React, { useState, useEffect, useCallback } from "react";
import {
  Search, UserPlus, Eye, Trash2,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import các UI components
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

// Import Service
import adminService from "@/services/adminService";

export default function ManageAccounts() {
  const navigate = useNavigate();

  // --- States Dữ liệu ---
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, last_page: 1, total: 0 });
  
  // --- States Lọc & Tìm kiếm ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- States Điều khiển Xóa ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 1. Hàm gọi API lấy danh sách tài khoản
  const fetchAccounts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        keyword: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        page: page
      };
      
      const response = await adminService.getAccounts(params);
      if (response.success) {
        setAccounts(response.data);
        // Cập nhật pagination từ object "meta" của Backend
        setPagination(response.meta); 
      }
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Tự động tải dữ liệu khi component mount hoặc thay đổi bộ lọc
  useEffect(() => {
    const timer = setTimeout(() => fetchAccounts(1), 400); // Debounce search
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fetchAccounts]);

  // 2. Xử lý khi nhấn nút xóa
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // 3. Xác nhận xóa (vô hiệu hóa) tài khoản qua API
  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      setDeleting(true);
      const res = await adminService.deleteAccount(selectedUser.id, selectedUser.role);
      if (res.success) {
        toast.success(res.message || "Đã vô hiệu hóa tài khoản thành công");
        fetchAccounts(pagination.page); // Tải lại trang hiện tại
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xóa tài khoản");
    } finally {
      setDeleting(false);
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };
  const getRoleVietnamese = (role) => {
  return role === "student" ? "Sinh viên" : 
         role === "lecturer" ? "Giảng viên" : 
         role === "faculty_staff" ? "Văn phòng Khoa" : 
         role === "company" ? "Doanh nghiệp" : 
         role === "admin" ? "Quản trị viên" : role;
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      {/* 1. Header & Nút thêm nhanh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý tài khoản</h1>
          <p className="text-sm text-slate-500 mt-1">Hệ thống quản lý và phân quyền người dùng Đại học Thủy Lợi.</p>
        </div>
        <Button 
          onClick={() => navigate("/admin/accounts/add")}
          className="bg-indigo-600 hover:bg-indigo-700 font-bold gap-2"
        >
          <UserPlus className="size-4" /> Thêm tài khoản
        </Button>
      </div>

      {/* 2. Bộ lọc tìm kiếm (Giữ nguyên phác thảo của bạn) */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
        <h3 className="text-center font-bold text-xl text-slate-800">Tìm kiếm tài khoản</h3>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Nhập tên tài khoản..."
              className="pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="--Trạng thái--" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => fetchAccounts(1)} className="px-8 bg-blue-600 hover:bg-blue-700 font-bold">
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className="p-1 bg-slate-50/50">
        <h3 className="font-bold text-lg text-slate-700">Danh sách tài khoản</h3>
      </div>

      {/* 3. Bảng danh sách (Giữ nguyên kiểu bảng bạn thiết lập) */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-500 text-white">
            <TableRow className="hover:bg-blue-500 border-none">
              <TableHead className="w-20 text-white font-bold">Stt</TableHead>
              <TableHead className="text-white font-bold">Tên tài khoản</TableHead>
              <TableHead className="text-white font-bold">Email</TableHead>
              <TableHead className="text-white font-bold">Vai trò</TableHead>
              <TableHead className="text-white font-bold">Trạng thái</TableHead>
              <TableHead className="text-center text-white font-bold">Hành động</TableHead>
            </TableRow>
          </TableHeader>
         
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="animate-spin" />
                    Đang tải dữ liệu...
                  </div>
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                  Không tìm thấy kết quả nào.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="font-medium">
                    {(pagination.page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell className="capitalize text-slate-600">{getRoleVietnamese(item.role)}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === "active"
                        ? "text-blue-600 bg-blue-50 border border-blue-100"
                        : "text-red-600 bg-red-50 border border-red-100"
                    }`}>
                      {item.status === "active" ? "Hoạt động" : "Vô hiệu hóa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => navigate(`/admin/detail-account/${item.role}/${item.id}`)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="cancel"
                      size="sm"
                      className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 4. Phân trang (Pagination) - Đã sửa lỗi current_page */}
        <div className="p-4 border-t flex items-center justify-between bg-slate-50/30">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-slate-600"
            disabled={pagination.page === 1 || loading}
            onClick={() => fetchAccounts(pagination.page - 1)}
          >
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>
         
          <div className="flex gap-1">
            <span className="text-sm font-bold text-slate-600 px-4">
              Trang {pagination.page} / {pagination.last_page}
            </span>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="text-slate-600"
            disabled={pagination.page === pagination.last_page || loading}
            onClick={() => fetchAccounts(pagination.page + 1)}
          >
            Next <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Hộp thoại xác nhận xóa */}
      <ConfirmAction
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa tài khoản"
        description={`Bạn có chắc chắn muốn loại bỏ tài khoản "${selectedUser?.username}" khỏi hệ thống?`}
        confirmText={deleting ? "Đang xử lý..." : "Xác nhận xóa"}
        variant="cancel"
      />
    </div>
  );
}