import React from 'react'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from './icons'
import 'tailwindcss/tailwind.css'

interface IProps {
  label: string
  placeholder: string
  handleRemoveSelected?: () => void
  removeSearchText: () => void
  isOpen: boolean
  iconColour?: string
  handleToggle: () => void
  clearable: boolean
}

export default function DropdownToggle({ label }: IProps) {
  return (
    <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
      <p>{label}</p>
    </div>
  )
}
