import React from 'react'
import 'tailwindcss/tailwind.css'

const XIcon = ({
  className,
  fill,
  onClick,
}: {
  fill: string
  className?: string
  onClick?: () => void
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  )
}

export default XIcon
