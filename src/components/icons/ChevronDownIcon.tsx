import React from 'react'
import 'tailwindcss/tailwind.css'

const ChevronDownIcon = ({
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
      <path d="M12 16.59l-4.29-4.29-1.41 1.41L12 18.41l5.7-5.7-1.41-1.41z" />
    </svg>
  )
}

export default ChevronDownIcon
