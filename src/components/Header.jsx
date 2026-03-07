import { useState } from "react";
import tlu from "../assets/tlu.jpg";
export default function Header({ onNavigate ,notifications ,name }) {
  const [dropOpen, setDropOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-[#3b4288] text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden border-2 border-blue-200">
            <img src={tlu} alt="tlu" />
          </div>
          <div>
            <div className="font-bold text-4 leading-tight tracking-wide uppercase">Truong Dai Hoc Thuy Loi</div>
            <div className="text-xs tracking-[0.25em] text-blue-200 font-light uppercase">Thuyloi University</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-white/10 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">U</div>
              <span className="text-sm font-medium">{name}</span>
            </button>

            {dropOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white text-gray-700 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100">
                <button
                  onClick={() => { onNavigate("profile"); setDropOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                >
                  Thong tin ca nhan
                </button>
                <div className="border-t border-gray-100" />
                <button className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-500">Dang xuat</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-1 bg-indigo-400/50" />
    </header>
  );
}
