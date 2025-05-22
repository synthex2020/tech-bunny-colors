import React from "react"
import { cn } from "../../libs/utils"

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full rounded-lg border border-gray-300 p-3 text-sm", className)} {...props} />
}