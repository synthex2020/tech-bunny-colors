import React from "react"
import { cn } from "../../libs/utils"

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-gray-700", className)} {...props} />
}