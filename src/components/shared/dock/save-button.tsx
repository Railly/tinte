"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface SaveButtonProps {
  onClick: () => void
}

export default function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <Button
      className="h-7 px-3 text-[13px] bg-white text-black hover:bg-white/90 rounded-[99px] transition-colors duration-200 font-medium"
      onClick={onClick}
    >
      Save
    </Button>
  )
}
