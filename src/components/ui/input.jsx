import * as React from "react"
import { cn } from "@/lib/utils"

// Sử dụng forwardRef để React Hook Form có thể điều khiển ref
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref} // Gán ref vào đây
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all outline-none",
        "focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }