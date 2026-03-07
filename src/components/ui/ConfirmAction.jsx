import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ConfirmAction({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận hành động", 
  description = "Hành động này không thể hoàn tác.",
  confirmText = "Xác nhận",
  variant = "default" // default, submit, hoặc cancel
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-xl border-border shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-lg">Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            // Sử dụng các variant màu chúng ta đã cấu hình cho Button trước đó
            variant={variant} 
            className="rounded-lg px-6"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}