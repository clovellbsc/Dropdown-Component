import { IObjectItem } from '../types/dropdown'
import React from 'react'
import 'tailwindcss/tailwind.css'

interface IDropdownItemProps {
  item: IObjectItem
  highlighted: boolean
  selected: boolean
  highlightColor: string
  highlightTextColor: string
  dropdownItemClassnames?: string
}

export default function Item({
  item,
  highlighted,
  // selected,
  highlightColor,
  highlightTextColor,
  dropdownItemClassnames,
}: IDropdownItemProps) {
  if (typeof item === 'string') {
    return (
      <div
        // className={classnames}
        style={{
          backgroundColor: highlighted ? highlightColor : 'transparent',
          color: highlighted ? highlightTextColor : 'inherit',
        }}
      >
        <p>{item}</p>
      </div>
    )
  } else {
    return (
      <div
        className={dropdownItemClassnames}
        style={{
          backgroundColor: highlighted ? highlightColor : 'transparent',
          color: highlighted ? highlightTextColor : 'inherit',
        }}
      >
        {item?.icon && (
          <img src={item.icon.url} alt={item.icon.alt} className="w-6" />
        )}
        <p>{item?.label}</p>
      </div>
    )
  }
}
