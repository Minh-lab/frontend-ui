import React from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

const DeleteTopicModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="max-w-[400px] p-0 overflow-hidden border-0 shadow-xl rounded-2xl">
        <div className="bg-[#ef4444] px-6 py-4">
          <h2 className="text-white text-[15px] font-bold uppercase tracking-wider text-left">
            XÁC NHẬN XÓA ĐỀ TÀI
          </h2>
        </div>
        <div className="px-6 py-6 pb-5 bg-white flex flex-col items-center text-center">
          <TriangleAlert className="w-16 h-16 text-black mb-4" strokeWidth={2.5} />
          <p className="text-base font-bold text-slate-800 mb-2">
            Bạn có chắc chắn muốn xóa đề tài này khỏi ngân hàng cá nhân?
          </p>
          <p className="text-xs text-[#ef4444] font-medium mb-6">
            Lưu ý: Đề tài đã có sinh viên đăng ký sẽ không thể xóa.
          </p>
          <div className="flex justify-center gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold h-10"
            >
              Quay lại
            </Button>
            <Button
              onClick={onConfirm}
              className="w-full rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold h-10"
            >
              Xóa vĩnh viễn
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTopicModal;
