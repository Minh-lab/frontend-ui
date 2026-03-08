import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar"; 

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      {/* Header luôn cố định trên cùng */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar cố định bên trái, ẩn trên mobile */}
        <aside className="w-64 bg-white border-r border-border hidden md:block shrink-0 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Khu vực nội dung chính có thanh cuộn riêng */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {/* Nơi hiển thị các trang chức năng (Dashboard, Register, etc.) */}
            <Outlet /> 
          </div>
          
          {/* Footer nằm dưới cùng của khu vực nội dung */}
          <Footer />
        </main>
      </div>
    </div>
  );
}