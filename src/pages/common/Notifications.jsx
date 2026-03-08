import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, ArrowLeft, ChevronLeft, 
  ChevronRight, Calendar, Info, Trash2 
} from "lucide-react";

// Import các UI components từ thư viện của bạn
import { Button } from "@/components/ui/button";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";

// Dữ liệu mẫu (Mock Data)
const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Phê duyệt đề tài tốt nghiệp", content: "Chúc mừng! Đề tài 'Xây dựng hệ thống quản lý đồ án' của bạn đã được phê duyệt. Vui lòng cập nhật đề cương chi tiết trước ngày 15/03.", created_at: "2026-03-08 14:30" },
  { id: 2, title: "Nhắc nhở nộp báo cáo tuần", content: "Bạn có báo cáo tiến độ tuần 5 chưa hoàn thành. Hạn cuối nộp bài là 23:59 tối nay. Vui lòng kiểm tra lại.", created_at: "2026-03-07 09:00" },
  { id: 3, title: "Phản hồi từ giảng viên", content: "Thầy Nguyễn Văn A đã để lại nhận xét mới trong phần tài liệu đặc tả yêu cầu của bạn. Hãy xem và chỉnh sửa kịp thời.", created_at: "2026-03-06 16:15" },
  { id: 4, title: "Thông báo bảo trì hệ thống", content: "Hệ thống sẽ tạm dừng hoạt động để nâng cấp server từ 00:00 đến 02:00 ngày 10/03/2026. Xin lỗi vì sự bất tiện này.", created_at: "2026-03-05 10:00" },
  { id: 5, title: "Đăng ký thực tập doanh nghiệp", content: "Khoa CNTT mở cổng đăng ký thực tập đợt 2 cho sinh viên khóa 63. Danh sách các công ty liên kết đã được cập nhật.", created_at: "2026-03-04 08:30" },
  { id: 6, title: "Kết quả chấm điểm giữa kỳ", content: "Điểm quá trình môn Đồ án chuyên ngành đã được cập nhật. Sinh viên có khiếu nại vui lòng liên hệ văn phòng khoa.", created_at: "2026-03-03 15:45" },
  { id: 7, title: "Lịch bảo vệ thử", content: "Danh sách chia nhóm và thời gian bảo vệ thử đồ án đợt 1 đã có. Các nhóm chuẩn bị slide và demo sản phẩm.", created_at: "2026-03-02 11:20" },
];

export default function Notifications() {
  const navigate = useNavigate();
  
  // Logic phân trang (5 thông báo mỗi trang)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(MOCK_NOTIFICATIONS.length / itemsPerPage);

  // Cắt dữ liệu theo trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = MOCK_NOTIFICATIONS.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="size-5 text-slate-600" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Thông báo hệ thống</h1>
        </div>
      </div>

      {/* Bảng danh sách chi tiết */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-all">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-15 text-center font-bold">STT</TableHead>
              <TableHead className="w-55 font-bold">Tiêu đề</TableHead>
              <TableHead className="font-bold">Nội dung chi tiết</TableHead>
              <TableHead className="w-45 font-bold">Thời gian gửi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                <TableCell className="text-center font-medium text-slate-400">
                  {indexOfFirstItem + index + 1}
                </TableCell>
                <TableCell className="font-bold text-slate-700">
                  <div className="truncate w-50" title={item.title}>
                    {item.title}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed text-sm">
                    {item.content}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="size-3.5" />
                    <span className="text-[13px]">{item.created_at}</span>
                  </div>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Phần điều khiển Phân trang */}
        <div className="p-4 border-t flex items-center justify-between bg-slate-50/30">
          <p className="text-xs text-slate-500 font-medium italic">
            Hiển thị mục {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, MOCK_NOTIFICATIONS.length)} trong tổng số {MOCK_NOTIFICATIONS.length}
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 border-slate-200"
            >
              <ChevronLeft className="size-4 mr-1" /> Trước
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 p-0 font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-600'}`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 px-3 border-slate-200"
            >
              Sau <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer hỗ trợ */}
      <div className="flex justify-center items-center gap-2 text-slate-400 text-[11px] uppercase tracking-widest font-semibold">
        <span className="w-8 h-px bg-slate-200"></span>
        Hệ thống quản lý đồ án TLU
        <span className="w-8 h-px bg-slate-200"></span>
      </div>
    </div>
  );
}