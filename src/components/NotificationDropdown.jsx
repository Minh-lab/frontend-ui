import React, { useState } from "react";
import { Bell } from "lucide-react";
import NotificationDetailDialog from "./NotificationDetailDialog";

// Mock notifications - sắp xếp theo thời gian giảm (mới nhất trên cùng)
const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    title: "Đề xuất đề tài thành công", 
    content: "Hệ thống đã tiếp nhận đề xuất đề tài từ bạn thành công. Thông tin đề xuất hiện đang được chuyển tới Hội đồng bộ môn để xem xét tham định.....", 
    time: "7 giờ trước", 
    isRead: false 
  },
  { 
    id: 2, 
    title: "Thông báo từ chỉ hướng dẫn", 
    content: "Rất tiếc, giảng viên đã từ chối yêu cầu hướng dẫn của bạn do số lượng sinh viên đăng ký trong học kỳ này đã đủ chỉ tiêu....", 
    time: "17 giờ trước", 
    isRead: false 
  },
  { 
    id: 3, 
    title: "Phê duyệt báo cáo tốt nghiệp", 
    content: "Chúc mừng! Báo cáo tiến độ của bạn được giảng viên kiểm tra và phê duyệt.....", 
    time: "20/2/2026", 
    isRead: true 
  },
  { 
    id: 4, 
    title: "Đăng ký đề tài bị từ chối", 
    content: "Yêu cầu đăng ký đề tài của bạn không thành công. Lý do: Đề tài có nội dung trùng lặp với các nghiên cứu trước đó hoặc không....", 
    time: "19/2/2026", 
    isRead: true 
  },
  { 
    id: 5, 
    title: "Yêu cầu chính sửa báo cáo", 
    content: "Báo cáo bạn vừa nộp cần được bổ sung và chính sửa một số nội dung kỹ thuật. Vui lòng kiểm tra chi tiết các phần hỏi của giảng viên trong mục Nhận xét....", 
    time: "10/2/2026", 
    isRead: true 
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Mark as read when clicked
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <>
      {/* Bell Icon */}
      <div className="relative">
        <div
          className="relative cursor-pointer hover:opacity-80 transition-all p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="size-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-primary">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-4 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base">Thông báo</h3>
              <p className="text-xs text-slate-500 mt-1">({unreadCount > 99 ? "99+" : unreadCount})</p>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {MOCK_NOTIFICATIONS.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  Không có thông báo nào
                </div>
              ) : (
                MOCK_NOTIFICATIONS.map((noti) => (
                  <div
                    key={noti.id}
                    onClick={() => {
                      handleNotificationClick(noti);
                      setIsOpen(false);
                    }}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${
                      noti.isRead
                        ? "bg-white hover:bg-slate-50 text-slate-600"
                        : "bg-blue-50/60 hover:bg-blue-100/60 text-slate-900 font-medium border-l-4 border-l-blue-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Blue dot for unread */}
                      {!noti.isRead && (
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{noti.title}</h4>
                        <p className="text-xs line-clamp-2 leading-relaxed">
                          {noti.content}
                        </p>
                        <p className="text-xs text-slate-400 mt-1.5">{noti.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <NotificationDetailDialog
        notification={selectedNotification}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}