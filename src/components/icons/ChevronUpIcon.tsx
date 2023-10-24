import React from 'react'
import 'tailwindcss/tailwind.css'

const ChevronUpIcon = ({
  fill,
  className,
  onClick,
}: {
  fill: string
  className: string
  onClick?: () => void
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      onClick={onClick}
    >
      <path d="M12 7.41l4.29 4.29 1.41-1.41L12 4.59 6.3 10.29l1.41 1.41z" />
    </svg>
  )
}

export default ChevronUpIcon
