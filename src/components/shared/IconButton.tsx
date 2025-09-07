import type { FC } from "react"

const IconButtonModel = {
    primary:'bg-blue-50 hover:bg-blue-400 rounded text-blue-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center',
    secondary:'bg-indigo-50 hover:bg-indigo-400 rounded text-indigo-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center',
    danger:'bg-rose-50 hover:bg-rose-400 rounded text-rose-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center',
    warning:'bg-amber-50 hover:bg-amber-400 rounded text-amber-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center',
    dark:'bg-zinc-50 hover:bg-zinc-400 rounded text-zinc-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center',
    success:'bg-green-50 hover:bg-green-400 rounded text-green-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center',
    info:'bg-cyan-50 hover:bg-cyan-400 rounded text-cyan-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center'
}

interface IconButtonInterface{
    type?:"primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info"
    onClick?:()=> void
    icon:string
}
const IconButton : FC<IconButtonInterface> = ({type="primary",onClick,icon}) => {
  return (
    <button className={IconButtonModel[type]} onClick={onClick}>
        <i className={`ri-${icon} text-base`}></i>
    </button>
  )
}

export default IconButton
