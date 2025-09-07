import type { FC, ReactNode } from "react"

interface AvatarInterface{
  title?:string
  subtitle?:ReactNode
  image?:string
  titleColor?:string
  subtitleColor?:string
  size?: "lg" | "md",
  onClick?: ()=> void
}
const Avatar : FC<AvatarInterface> = ({onClick,size="lg",title,subtitle="subtitle is missing",image,titleColor="#000",subtitleColor="#fff"}) => {
  return (
    <div className="flex items-center gap-3">
      {
        image && 
        <img onClick={onClick} className={`${size === "lg" ? "w-14 h-14" : "w-8 h-8"} rounded-full object-center`} src={image} alt="profile Img" />

      }
      {
        (title && subtitle) &&
        <div className="flex flex-col gap-2">
          <h1 className={`${size === "lg" ? "text-lg/6" : "text-sm"} font-medium capitalize`} style={{color:titleColor}}>{title}</h1>
          <div  style={{color:subtitleColor}}>
            {subtitle}
          </div>
        </div>
      }
    </div>
  )
}

export default Avatar
