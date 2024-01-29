import React from 'react'
import 'tailwindcss/tailwind.css'

const ChevronUpIcon = ({
  fill,
  className,
  onClick,
}: {
  fill: string
  className: string
  onClick?: (e: any) => void
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke={fill}
      className={className}
      onClick={onClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 15.75 7.5-7.5 7.5 7.5"
      />
    </svg>
  )
}

export default ChevronUpIcon
