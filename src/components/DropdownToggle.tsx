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

export default function DropdownToggle({
  label,
  placeholder,
  handleRemoveSelected,
  removeSearchText,
  isOpen,
  iconColour,
  handleToggle,
  clearable,
}: IProps) {
  const iconClassnames =
    'w-5 h-5 transition-all cursor-pointer duration-300 ease-in-out'

  return (
    <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
      <div>
        <p>{label}</p>
      </div>
      <div className="flex">
        {label !== placeholder && clearable && (
          <XIcon
            fill={iconColour ?? '#000'}
            className={iconClassnames}
            onClick={() => {
              handleRemoveSelected && handleRemoveSelected()
              removeSearchText()
            }}
          />
        )}
        {isOpen ? (
          <ChevronUpIcon
            fill={iconColour ?? '#000'}
            className={iconClassnames + 'rotate'}
            onClick={handleToggle}
          />
        ) : (
          <ChevronDownIcon
            fill={iconColour ?? '#000'}
            className={iconClassnames + 'rotate-back'}
            onClick={handleToggle}
          />
        )}
      </div>
    </div>
  )
}
