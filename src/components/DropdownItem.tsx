import { IDropdownItemProps } from '../types/dropdown'
import React from 'react'
import 'tailwindcss/tailwind.css'

export default function Item({
  item,
  highlighted,
  highlightColor,
  highlightTextColor,
  dropdownItemClassnames,
}: IDropdownItemProps) {
  if (typeof item === 'string') {
    return (
      <div className={highlighted ? highlightColor : ''}>
        <p className={highlighted ? highlightTextColor : ''}>{item}</p>
      </div>
    )
  } else {
    return (
      <div
        className={
          dropdownItemClassnames + ' ' + (highlighted ? highlightColor : '')
        }
      >
        {item?.icon && (
          <img src={item.icon.url} alt={item.icon.alt} className="w-6" />
        )}
        <p className={highlighted ? highlightTextColor : ''}>{item?.label}</p>
      </div>
    )
  }
}
