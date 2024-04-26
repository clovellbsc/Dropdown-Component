import { IDropDownLabelItemProps } from '../types/dropdown'
import { XIcon } from './icons'
import React from 'react'

export default function DropdownLabelItem({
  handleRemoveSingle,
  item,
  containerStyles,
  iconContainerStyles,
  iconStyles,
  iconColour,
}: IDropDownLabelItemProps) {
  return (
    <button
      className={containerStyles}
      type="button"
      onClick={() => {
        handleRemoveSingle && handleRemoveSingle(item)
      }}
    >
      <p>{item.label}</p>
      <div className={`${iconContainerStyles}`}>
        <XIcon className={iconStyles} fill={iconColour} />
      </div>
    </button>
  )
}
