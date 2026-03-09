import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, UserCircle, ChevronDown, 
  LogOut, KeyRound, User as UserIcon 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { ConfirmAction } from "@/components/ui/ConfirmAction";
import logoTLU from "@/assets/logo-tlu.png"; 

// 1. Dữ liệu mẫu cho danh sách thông báo nhanh
const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Hệ thống", content: "Đề tài 'Quản lý đồ án' đã được phê duyệt thành công.", time: "2 phút trước" },
  { id: 2, title: "Giảng viên", content: "Thầy Nguyễn Văn A đã gửi phản hồi về báo cáo tuần 5.", time: "1 giờ trước" },
  { id: 3, title: "Lịch nhắc", content: "Hạn cuối nộp báo cáo tiến độ thực tập là ngày mai.", time: "3 giờ trước" },
];

export function Header() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const notiRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setIsNotiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
    navigate("/login");
  };

  return (
    <header className="flex flex-col w-full text-white shadow-md z-50">
      {/* 2. Thanh điều hướng chính (Top Bar) */}
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
          
          {/* 3. Cụm Thông báo */}
          <div className="relative" ref={notiRef}>
            <div 
              className="relative cursor-pointer hover:opacity-80 transition-all p-1"
              onClick={() => {
                setIsNotiOpen(!isNotiOpen);
                setIsDropdownOpen(false);
              }}
            >
              <Bell className="size-6 text-white" />
              <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-primary">
                3
              </span>
            </div>

            {isNotiOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Thông báo</span>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {MOCK_NOTIFICATIONS.map((noti) => (
                    <div 
                      key={noti.id} 
                      className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-bold text-xs text-blue-600 uppercase tracking-wide truncate flex-1">
                          {noti.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {noti.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1 leading-snug group-hover:text-slate-900">
                        {noti.content}
                      </p>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/notifications"
                  onClick={() => setIsNotiOpen(false)}
                  className="block w-full py-3 text-center text-sm font-semibold text-primary bg-slate-50 hover:bg-slate-100 transition-colors border-t"
                >
                  Xem tất cả chi tiết
                </Link>
              </div>
            )}
          </div>
          
          {/* 4. Dropdown Tài khoản */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-3 cursor-pointer border-l border-white/20 pl-4 md:pl-8 group"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotiOpen(false);
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
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                <Link 
                  to={`/${role}/profile`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="size-4 text-blue-600" />
                  <span>Thông tin cá nhân</span>
                </Link>

                <Link 
                  to="/change-password"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <KeyRound className="size-4 text-amber-500" />
                  <span>Đổi mật khẩu</span>
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

      {/* 5. Dòng tiêu đề hệ thống (Đã chỉnh sang bên PHẢI theo ảnh mẫu) */}
      <div className="bg-primary/95 px-6 py-2 shadow-inner flex justify-start">
        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] opacity-90">
          Hệ thống quản lý đồ án & thực tập
        </h2>
      </div>

      {/* 6. Hộp thoại xác nhận đăng xuất */}
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