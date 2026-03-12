import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar"; 
import { useState } from "react";

export function AppLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900">
      {/* 1. Header: Full width trên cùng */}
      <Header onMenuClick={() => setOpenSidebar(true)} />
      
      {/* Khối giữa chứa Sidebar và Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Cố định bên trái */}
        <aside className="w-64 bg-white border-r border-border hidden md:block shrink-0 overflow-y-auto custom-scrollbar">
          <Sidebar />
        </aside>

        {openSidebar && (
          <button
            type="button"
            aria-label="Dong sidebar"
            className="fixed inset-0 z-40 bg-slate-950/45 md:hidden"
            onClick={() => setOpenSidebar(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-white shadow-xl transition-transform duration-300 md:hidden ${
            openSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onNavigate={() => setOpenSidebar(false)} />
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
