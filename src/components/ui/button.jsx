import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Phần base: mình đổi rounded-md thành rounded-lg để bo tròn giống ảnh hơn
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        // Nút Nộp - Dùng biến success trong index.css
        submit: "bg-success text-success-foreground hover:opacity-90 shadow-sm",
        // Nút Hủy - Dùng biến destructive 
        cancel: "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent/10",
        // Cho các link 
        ghost: "text-accent hover:bg-accent/10 font-bold",
      },
      size: {
        default: "h-10 px-6 py-2", // Tăng nhẹ padding để nút trông đầy đặn như ảnh
        sm: "h-8 px-3",
        lg: "h-12 px-8 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} 
    />
  );
}

export { Button, buttonVariants }