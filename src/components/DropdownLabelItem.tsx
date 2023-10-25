import { IObjectItem } from '../types/dropdown'
import { XIcon } from './icons'
import React from 'react'

interface IDropDownLabelItemProps {
  handleRemoveSingle: (item: any) => void
  item: IObjectItem
  containerStyles: string
  iconContainerStyles: string
  iconStyles: string
  iconColour: string
}

export default function DropdownLabelItem({
  handleRemoveSingle,
  item,
  containerStyles,
  iconContainerStyles,
  iconStyles,
  iconColour,
}: IDropDownLabelItemProps) {
  return (
    <div
      className={containerStyles}
      onClick={() => {
        handleRemoveSingle && handleRemoveSingle(item)
      }}
    >
      <p>{item.label}</p>
      <div className={iconContainerStyles}>
        <XIcon className={iconStyles} fill={iconColour} />
      </div>
    </div>
  )
}
