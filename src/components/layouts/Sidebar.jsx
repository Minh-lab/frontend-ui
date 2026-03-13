import { NavLink } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { MASTER_MENU } from "@/config/menu.config"; // Import config mới

export function Sidebar() {
  // Sử dụng selector để lấy role, tránh re-render thừa và lỗi IDE
  const role = useAuthStore((state) => state.role);

  // Lọc các mục menu mà role hiện tại có quyền truy cập
  const filteredMenu = MASTER_MENU.filter((item) => 
    item.roles.includes(role)
  );

  return (
    <nav className="flex flex-col h-full bg-white py-4 overflow-y-auto custom-scrollbar border-r border-slate-200">
      <div className="px-4 space-y-1">
        {filteredMenu.map((item, index) => {
          // Render nhãn tiêu đề (Label)
          if (item.label) {
            return (
              <p 
                key={`label-${index}`} 
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2 px-2"
              >
                {item.label}
              </p>
            );
          }

          // Render các mục chuyển trang (Link)
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-primary shadow-sm font-bold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              )}
            >
              <Icon className={cn(
                "size-5 shrink-0",
                "group-hover:text-primary transition-colors"
              )} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}