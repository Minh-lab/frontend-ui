import React, { useState, useRef, useEffect } from "react";
import { 
  UserCircle, ChevronDown, 
  LogOut, User as UserIcon 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { ConfirmAction } from "@/components/ui/ConfirmAction";
import NotificationDropdown from "@/components/NotificationDropdown";
import logoTLU from "@/assets/logo-tlu.png";
import useNotificationStore from "@/stores/useNotificationStore";
import notificationService from "@/services/notificationService ";
import authService from "@/services/authService";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  const { setNotifications } = useNotificationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Fetch notifications khi component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();
        if (response.success) {
          setNotifications(response);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    
    fetchNotifications();
  }, [setNotifications]);

  // Trong Header.jsx - thêm polling
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();
        if (response.success) {
          setNotifications(response);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    
    // Fetch ngay lập tức
    fetchNotifications();
    
    // Polling mỗi 30 giây
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [setNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    try {
      // 1. Gọi API Logout của Backend
      await authService.logout(); 

      // 2. Xóa thông tin trong Zustand và LocalStorage
      logout(); 
      
      setIsLogoutDialogOpen(false);
      toast.success("Đăng xuất thành công!");
      
      // 3. Điều hướng về trang đăng nhập
      navigate("/login");
    } catch (error) {
      // Trường hợp lỗi API vẫn thực hiện logout cục bộ để đảm bảo an toàn
      console.error("Logout error:", error);
      logout();
      navigate("/login");
    }
  };

  return (
    <header className="flex flex-col w-full text-white shadow-md z-50">
      {/* Thanh điều hướng chính (Top Bar) */}
      <div className="bg-primary px-6 py-3 flex justify-between items-center border-b border-white/10">
        
        {/* Logo và Tên trường - Luôn nằm bên trái */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <img 
              src={logoTLU} 
              alt="TLU Logo" 
              className="h-14 w-14 object-contain bg-white rounded-full p-1 shadow-sm hover:opacity-80 transition-opacity cursor-pointer" 
            />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold leading-tight uppercase tracking-wide">
              Trường Đại học Thủy Lợi
            </h1>
            <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] opacity-80">
              THUYLOI UNIVERSITY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          
          {/* Cụm Thông báo */}
          <NotificationDropdown />
          
          {/* Dropdown Tài khoản */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-3 cursor-pointer border-l border-white/20 pl-4 md:pl-8 group"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold group-hover:text-blue-200 transition-colors">
                  {user?.displayName || "Người dùng TLU"}
                </p>
                <p className="text-[10px] text-blue-200 uppercase tracking-tighter opacity-80">
                  {role || "admin"}
                </p>
              </div>
              
              <div className="relative flex items-center">
                <div className="bg-cyan-400 p-1 rounded-full border-2 border-white/50 shadow-sm">
                   <UserCircle className="size-7 text-white" />
                </div>
                <ChevronDown className={`ml-1.5 size-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-60 animate-in fade-in zoom-in-95 duration-200">
                <Link 
                  to={`/${role}/profile`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="size-4 text-blue-600" />
                  <span>Thông tin cá nhân</span>
                </Link>

                <div className="h-px bg-slate-100 my-1 mx-2"></div>

                <button 
                  onClick={() => {
                    setIsLogoutDialogOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <LogOut className="size-4" />
                  <span className="font-semibold">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dòng tiêu đề hệ thống */}
      <div className="bg-primary/95 px-6 py-2 shadow-inner flex justify-start">
        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] opacity-90">
          Hệ thống quản lý đồ án & thực tập
        </h2>
      </div>

      {/* Hộp thoại xác nhận đăng xuất */}
      <ConfirmAction 
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn thoát khỏi phiên làm việc hiện tại không?"
        confirmText="Đăng xuất"
        variant="cancel" 
      />
    </header>
  );
}