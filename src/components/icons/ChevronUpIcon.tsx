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
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      className={className}
      onClick={onClick}
    >
      <path
        fillRule="evenodd"
        d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
      />
    </svg>
  )
}

export default ChevronUpIcon
