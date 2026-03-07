import { Button } from "./ui/button";


export default function Sidebar({ page, onNavigate , MENU }) {
  return (
    <aside className="w-[210px] flex-shrink-0 bg-white border-r border-gray-200 min-h-full shadow-sm">
      <nav className="py-4 select-none">
        {MENU.map((item, i) => {
          if (item.group && !item.label) {
            return (
              <div key={i} className="px-4 pt-4 pb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {item.group}
              </div>
            );
          }

          const isActive = page === item.page;

          return (
            <button
              key={i}
              onClick={() => onNavigate(item.page)}
              className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#3b3f8c] text-white font-semibold"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-[#3b3f8c]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
