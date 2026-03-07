import * as React from "react"
import { Bell, UserCircle } from "lucide-react"
import useAuthStore from "@/store/useAuthStore"
// Import logo ở đây
import logoTLU from "@/assets/logo-tlu.png" 

export function Header() {
  const { user, role } = useAuthStore()

  return (
    <header className="flex flex-col w-full text-white shadow-md">
      <div className="bg-primary px-6 py-3 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          {/* Sử dụng biến logo đã import */}
          <img 
            src={logoTLU} 
            alt="TLU Logo" 
            className="h-14 w-14 object-contain bg-white rounded-full p-1" 
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold leading-tight tracking-wide">
              TRƯỜNG ĐẠI HỌC THỦY LỢI
            </h1>
            <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] opacity-90 uppercase">
              Thuyloi University
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <Bell className="size-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full border border-primary bg-red-500 px-1 text-[8px] font-bold text-white leading-none">
              99+
            </span>
          </div>
          
          <div className="flex items-center gap-3 cursor-pointer border-l border-white/20 pl-4 md:pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.displayName || "Nguyễn Văn A"}</p>
              <p className="text-[10px] text-blue-200 uppercase tracking-tighter">
                {role || "Sinh viên"}
              </p>
            </div>
            <div className="bg-cyan-400 p-1 rounded-full border-2 border-white/50">
               <UserCircle className="size-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/95 px-6 py-2">
        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em]">
          Hệ thống quản lý đồ án & thực tập
        </h2>
      </div>
    </header>
  )
}