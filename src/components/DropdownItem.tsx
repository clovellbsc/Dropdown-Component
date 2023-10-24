import { IObjectItem } from '../types/dropdown'
import React from 'react'
import 'tailwindcss/tailwind.css'

interface IDropdownItemProps {
  item: IObjectItem
  highlighted: boolean
  selected: boolean
  highlightColor: string
  highlightTextColor: string
}

export default function Item({
  item,
  highlighted,
  selected,
  highlightColor,
  highlightTextColor,
}: IDropdownItemProps) {
  const classnames = `flex gap-2.5 cursor-pointer w-full h-full text-sm pl-5 py-1 items-center`

  if (typeof item === 'string') {
    return (
      <div
        role="option"
        aria-describedby="dropdown-list"
        aria-selected={String(selected) as 'true' | 'false'}
        aria-current={String(highlighted) as 'true' | 'false'}
        className={classnames}
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
        role="option"
        aria-describedby="dropdown-list"
        aria-selected={String(selected) as 'true' | 'false'}
        aria-current={String(highlighted) as 'true' | 'false'}
        className={classnames}
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
