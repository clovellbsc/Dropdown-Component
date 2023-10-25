import React from 'react'
import 'tailwindcss/tailwind.css'

const XIcon = ({
  className,
  fill,
  onClick,
}: {
  fill: string
  className: string
  onClick?: () => void
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      className={className}
      onClick={onClick}
    >
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  )
}

export default XIcon
