import React from 'react'
import 'tailwindcss/tailwind.css'
import { IObjectItem, IStylingClassnames } from '../types/dropdown'
import DropdownLabelItem from './DropdownLabelItem'

interface IProps {
  label: string | IObjectItem[]
  iconColour?: string
  handleRemoveSingle: (item: IObjectItem) => void
  stylingClassnames?: IStylingClassnames
  searchable?: boolean
}

export default function MultiDropdownToggle({
  label,
  iconColour,
  handleRemoveSingle,
  stylingClassnames,
  searchable,
}: IProps) {
  return (
    <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-fit">
      {Array.isArray(label) ? (
        <div className={stylingClassnames?.multi?.multiLabelContainer}>
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
        <p>{!searchable && label}</p>
      )}
    </div>
  )
}
