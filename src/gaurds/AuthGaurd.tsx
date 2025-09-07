import { useContext, useEffect } from "react"
import HttpInterceptor from "../lib/HttpInterceptor"
import Context from "../components/Context"
import { Navigate, Outlet } from "react-router-dom"
import { Skeleton } from "antd"




const AuthGaurd = () => {
    const{session,setSession} = useContext(Context)
    useEffect(()=>{
        getSession()
    },[])

    const getSession = async()=>{
        try {
            const {data} = await HttpInterceptor.get('/auth/session')
            setSession(data)
        } catch (err) {
            setSession(false)
        }
    }   
    if(session === null){
        return <Skeleton active/>
    }

    if(session===false){
        return <Navigate to="/login"/>
    }

    return <Outlet/>
}

export default AuthGaurd
