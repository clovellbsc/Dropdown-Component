import React from 'react'
import 'tailwindcss/tailwind.css'

const XIcon = ({
  className,
  fill,
  onClick,
}: {
  fill: string
  className: string
  onClick: () => void
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      onClick={onClick}
    >
      <path d="M20.29 3.29l-16 16c-.39.39-1.02.39-1.41 0s-.39-1.02 0-1.41l16-16c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41z" />
      <path d="M3.29 3.29l16 16c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-16-16c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41z" />
    </svg>
  )
}

export default XIcon
