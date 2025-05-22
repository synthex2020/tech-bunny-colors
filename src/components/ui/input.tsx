import React from "react"
import { cn } from "../../libs/utils"

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-lg border border-gray-300 px-3 py-2 text-sm", className)} {...props} />
}
