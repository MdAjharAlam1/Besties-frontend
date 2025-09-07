import {Link,useNavigate } from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/HttpInterceptor"
import { toast } from "react-toastify"
import CatchError from "../lib/CatchError"


const Signup = () => {

  const navigate = useNavigate()

  const handleSignup = async(values : FormDataType) =>{
    try {
      const {data} = await HttpInterceptor.post('/auth/signup',values)
      toast.success(data.message)
      navigate('/login')
    } 
    catch (err : unknown) {
      CatchError(err)
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="w-6/12 animate__animated animate__fadeIn">
        <Card noPadding>
          <div className="grid grid-cols-2">
            <div className="p-8 space-y-6">
              <div> 
                <h1 className="font-bold text-black text-xl">SIGN UP</h1>
                <p className="text-gray-500">Start your first chat now !</p>
              </div>
              <Form className="space-y-6" onValue={handleSignup}>
                <Input
                  name="fullname"
                  placeholder="Fullname"
                />
                <Input
                  name="email"
                  placeholder="Email"
                  type="email"
                />
                <Input
                  name="mobile"
                  placeholder="Mobile No"
                  
                />
                <Input
                  name="password"
                  placeholder="Password"
                  type="password"
                />
                <Button type="danger" icon="arrow-right-up-line">Sign up</Button>
              </Form>
              <div className="flex items-center gap-2">
                <p>Already have an account ?</p>
                <Link to="/login" className="text-green-400  hover:underline">Sign in </Link>
              </div>
            </div>
            <div className="h-[500px] overflow-hidden bg-linear-to-t from-sky-500 to-indigo-500 flex items-center justify-center rounded-r-xl">
              <img src="images/auth.svg"  alt="auth" className="w-full animate__animated animate__slideInUp animate__faster"/>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

export default Signup
