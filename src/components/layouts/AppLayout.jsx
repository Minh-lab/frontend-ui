import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar"; 

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar cố định bên trái */}
        <aside className="w-64 bg-white border-r border-border hidden md:block">
          <Sidebar />
        </aside>

        {/* Khu vực nội dung chính */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            <Outlet /> {/* Nơi hiển thị các trang con */}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}