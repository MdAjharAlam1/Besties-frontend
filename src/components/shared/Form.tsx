import type { FC, FormEvent, ReactNode } from "react"

export type FormDataType = Record<string,string>

interface FormInterface {
  children:ReactNode,
  className:string
  reset?:boolean
  onValue?:(value: FormDataType) => void
  

}

const Form : FC<FormInterface> = ({children, className,onValue, reset=false}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const data:FormDataType  = {}
    formData.forEach((values,name)=>{
      data[name] = values.toString()
    })
    if(onValue){
      onValue(data)
      reset && form.reset()
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export default Form
