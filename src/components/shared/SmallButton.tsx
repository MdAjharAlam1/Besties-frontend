import type { FC } from "react"

const SmallButtonModel = {
    primary: 'w-full bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium text-white px-3 py-1.5',
    secondary: 'w-full bg-indigo-500 hover:bg-indigo-600 rounded text-sm font-medium text-white px-3 py-1.5',
    danger: 'w-full bg-rose-500 hover:bg-rose-600 rounded text-sm font-medium text-white px-3 py-1.5',
    warning: 'w-full bg-amber-500 hover:bg-amber-600 rounded text-sm font-medium text-white px-3 py-1.5',
    dark: 'w-full bg-zinc-500 hover:bg-zinc-600 rounded text-sm font-medium text-white px-3 py-1.5',
    success: 'w-full bg-green-500 hover:bg-green-600 rounded text-sm font-medium text-white px-3 py-1.5',
    info: 'w-full bg-cyan-500 hover:bg-cyan-600 rounded text-sm font-medium text-white px-3 py-1.5'
  }
  

interface ButtonInterface{
    children?:string
    type?:"primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info"
    onClick?:()=> void
    icon?:string,
    loading?:boolean
}
const SmallButton : FC<ButtonInterface> = ({children="submit",type="primary",onClick,icon,loading}) => {
  if(loading){
    return(
      <button disabled className="space-y-2 text-gray-400">
        <i className="fa fa-spinner fa-spin mr-2"></i>
        Processing....
      </button>
    )
  }
  return (
    <button className={SmallButtonModel[type]} onClick={onClick}>
      {
        icon && 
        <i className={`ri-${icon} mr-2`}></i>
      }
      {children}
    </button>
  )
}

export default SmallButton
