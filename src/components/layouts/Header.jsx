import * as React from "react"
import { Bell, UserCircle } from "lucide-react"
import useAuthStore from "@/store/useAuthStore"
import logoTLU from "@/assets/logo-tlu.png" 
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Modal from "../Modal"
import { Button } from "../ui/button"
import { toast } from "sonner"
export function Header() {
  const { user, role } = useAuthStore()
  const [dropOpen, setDropOpen] = useState(false);
  const [dropLogout, setDropLogout] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="flex flex-col w-full text-white shadow-md z-50">
      <div className="bg-[#37437C] px-6 py-3 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
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
              <p className="text-sm font-bold">{user?.displayName || "Người dùng"}</p>
              <p className="text-[10px] text-blue-200 uppercase tracking-tighter">
                {role || "Khách"}
              </p>
            </div>
            <div className="bg-cyan-400 p-1 rounded-full border-2 border-white/50">
               <UserCircle onClick={() => setDropOpen(!dropOpen)} className="size-7 text-white" />

                {dropOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white text-gray-700 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100">
                    <button
                      onClick={() => 
                      {
                        setDropOpen(false);
                        navigate(`/${role}/profile`)
                      }
                       }
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      {role === "company"? "Thông tin doanh nghiệp" : "Thông tin" }
                    </button>
                    <div className="border-t border-gray-100" />
                    <button onClick={() => setDropLogout(true)} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-500">Đăng xuất</button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#43529C] px-6 py-2">
        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em]">
          Hệ thống quản lý đồ án & thực tập
        </h2>
      </div>

      {dropLogout && (
        <Modal onClose={() => setDropLogout(false)}>
          <div className="text-center">
            <span className="text-[#000000]">Bạn có chắc chắn muốn đăng xuất?</span>
          </div>
          
          <div className='flex gap-4 p-4 justify-center'>
            <Button onClick = {() => setDropLogout(false) } className="bg-[#FF0000] hover:bg-[#cc0000] text-white w-[60px] h-9 p-0">Huy</Button>
            <Button onClick = {() => {setDropLogout(false); toast.success("Hành động của bạn đã được ghi nhận",{className: "!bg-[#AAFAB8] !text-[#24AD47]"})}} className="bg-[#FF0000] hover:bg-[#cc0000] text-white w-[80px] h-9 p-0">Dang xuat</Button>
          </div>
          
        </Modal>
      )}

    </header>
  )
}