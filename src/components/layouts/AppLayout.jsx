import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar"; 

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900">
      {/* 1. Header: Full width trên cùng */}
      <Header />
      
      {/* Khối giữa chứa Sidebar và Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Cố định bên trái */}
        <aside className="w-64 bg-white border-r border-border hidden md:block shrink-0 overflow-y-auto custom-scrollbar">
          <Sidebar />
        </aside>

        {/* Khu vực nội dung chính */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
          {/* ĐÃ DI CHUYỂN FOOTER RA KHỎI ĐÂY */}
        </main>
      </div>

      {/* 4. Footer: Đưa ra ngoài khối flex để chiếm full width giống Header */}
      <Footer />
    </div>
  );
}