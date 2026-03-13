import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";

export function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 
  const role = useAuthStore((state) => state.role); 

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, đẩy về trang login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Nếu sai role, đẩy về trang thông báo không có quyền
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu hợp lệ, cho phép render nội dung trang con (Outlet)
  return <Outlet />;
}