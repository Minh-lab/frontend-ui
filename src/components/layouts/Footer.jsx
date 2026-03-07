import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-10 px-12 mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-4">
        <h3 className="font-bold text-lg uppercase tracking-wide">
          TRƯỜNG ĐẠI HỌC THỦY LỢI - KHOA CÔNG NGHỆ THÔNG TIN
        </h3>
        <div className="grid gap-2 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-white/70" />
            <span>Địa chỉ: Nhà C1, số 175 Tây Sơn, Đống Đa, Hà Nội.</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-white/70" />
            <span>Liên hệ: (+84)-024 3 5632211.</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-white/70" />
            <span>Email: vpkcntt@tlu.edu.vn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}