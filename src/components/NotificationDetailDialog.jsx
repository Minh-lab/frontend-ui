import React from "react";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationDetailDialog({ notification, isOpen, onClose }) {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{notification.title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Clock className="size-4" />
              <span>{notification.time}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition flex-shrink-0"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {notification.content}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#6155F5] hover:bg-[#5247E0] text-white"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
