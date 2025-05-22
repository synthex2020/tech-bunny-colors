import React from "react"
import { cn } from "../../libs/utils"

export function Avatar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200", className)} {...props}>{children}</div>
}

export function AvatarFallback({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm font-medium text-gray-700", className)} {...props}>{children}</span>
}