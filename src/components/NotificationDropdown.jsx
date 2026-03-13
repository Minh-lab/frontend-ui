// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationDetailDialog from "./NotificationDetailDialog";
import useNotificationStore from "@/stores/useNotificationStore";
import notificationService from "@/services/notificationService ";

// eslint-disable-next-line no-unused-vars
import { toast } from "sonner";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Lấy từ store
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  // Xử lý click vào thông báo
  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
    
    // Nếu chưa đọc -> đánh dấu đã đọc
    if (!notification.is_read) {
      try {
        const response = await notificationService.markAsRead(notification.id);
        if (response.success) {
          markAsRead(notification.id); // Cập nhật store
        }
      } catch (error) {
        console.error("Mark as read error:", error);
      }
    }
  };

  // Format thời gian (ví dụ đơn giản)
  const formatTime = (dateString) => {
    // Xử lý format time từ backend
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
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

        {isOpen && (
          <div className="absolute right-0 mt-4 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Thông báo</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {unreadCount} chưa đọc
                </p>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  Không có thông báo nào
                </div>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti.id}
                    onClick={() => handleNotificationClick(noti)}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${
                      noti.is_read
                        ? "bg-white hover:bg-slate-50 text-slate-600"
                        : "bg-blue-50/60 hover:bg-blue-100/60 text-slate-900 font-medium border-l-4 border-l-blue-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!noti.is_read && (
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{noti.title}</h4>
                        <p className="text-xs line-clamp-2 leading-relaxed text-slate-600">
                          {noti.content}
                        </p>
                        <p className="text-xs text-slate-400 mt-1.5">
                          {formatTime(noti.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <NotificationDetailDialog
        notification={selectedNotification}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}