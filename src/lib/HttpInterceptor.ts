import axios from "axios";
const env = import.meta.env

const HttpInterceptor = axios.create({
    baseURL:env.VITE_SERVER,
    withCredentials:true
})

export default HttpInterceptor