import type { FC } from "react"

interface InputInterface{
    name:string
    type?:string
    placeholder?:string
}

const Input : FC<InputInterface> = ({name,type="text",placeholder}) => {
  return (
    <input
        className="border border-gray-300 rounded px-3 py-2 w-full "
        type={type}
        name={name}
        placeholder={placeholder}
    />
  )
}

export default Input
