import { IDropdownToggleProps } from '@/types/dropdown'
import React from 'react'
import 'tailwindcss/tailwind.css'

export default function DropdownToggle({ label }: IDropdownToggleProps) {
  return (
    <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
      <p>{label}</p>
    </div>
  )
}
