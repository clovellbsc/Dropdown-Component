import React from 'react'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from './icons'
import 'tailwindcss/tailwind.css'
import { IObjectItem, IStylingClassnames } from '../types/dropdown'
import DropdownLabelItem from './DropdownLabelItem'

interface IProps {
  label: string | IObjectItem[]
  placeholder: string
  handleRemoveSelected?: () => void
  removeSearchText: () => void
  isOpen: boolean
  iconColour?: string
  handleToggle: () => void
  clearable: boolean
  handleRemoveSingle: (item: IObjectItem) => void
  stylingClassnames?: IStylingClassnames
}

export default function MultiDropdownToggle({
  label,
  placeholder,
  handleRemoveSelected,
  removeSearchText,
  isOpen,
  iconColour,
  handleToggle,
  clearable,
  handleRemoveSingle,
  stylingClassnames,
}: IProps) {
  const iconClassnames =
    'w-5 h-5 transition-all cursor-pointer duration-300 ease-in-out'

  return (
    <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
      <div>
        {Array.isArray(label) ? (
          <div className="flex flex-wrap gap-y-1.5 gap-x-2">
            {label.map((item: IObjectItem, index: number) => (
              <DropdownLabelItem
                key={index}
                item={item}
                handleRemoveSingle={handleRemoveSingle}
                containerStyles={
                  stylingClassnames?.multi?.selectedItemContainer ?? ''
                }
                iconContainerStyles={
                  stylingClassnames?.multi?.selectedItemIconBox ?? ''
                }
                iconStyles={stylingClassnames?.multi?.selectedItemIcon ?? ''}
                iconColour={iconColour ?? ''}
              />
            ))}
          </div>
        ) : (
          <p>{label}</p>
        )}
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
