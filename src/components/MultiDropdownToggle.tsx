import React, { ReactNode } from 'react'
import 'tailwindcss/tailwind.css'
import { IMultiDropdownToggleProps, IObjectItem } from '../types/dropdown'
import DropdownLabelItem from './DropdownLabelItem'

export default function MultiDropdownToggle({
  label,
  iconColour,
  handleRemoveSingle,
  stylingClassnames,
  searchable,
  input,
}: IMultiDropdownToggleProps) {
  if (typeof label === 'string')
    return searchable ? <div className="w-full">{input}</div> : <p>{label}</p>
  const labelArray: ReactNode[] = label.map(
    (item: IObjectItem, index: number) => (
      <DropdownLabelItem
        key={index}
        item={item}
        handleRemoveSingle={handleRemoveSingle}
        containerStyles={stylingClassnames?.multi?.selectedItemContainer ?? ''}
        iconContainerStyles={
          stylingClassnames?.multi?.selectedItemIconBox ?? ''
        }
        iconStyles={stylingClassnames?.multi?.selectedItemIcon ?? ''}
        iconColour={iconColour ?? ''}
      />
    )
  )

  searchable && labelArray.push(input)
  return (
    <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
      <div className={stylingClassnames?.multi?.multiLabelContainer}>
        {labelArray}
      </div>
    </div>
  )
}
