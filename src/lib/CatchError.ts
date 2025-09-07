import { toast, type ToastPosition } from "react-toastify"
import axios from "axios"

const CatchError = (err: unknown , position : ToastPosition = "top-right" ) => {
    if(axios.isAxiosError(err)){
        return toast.error(err.response?.data.message || err.message ,{position})
    }

    if(err instanceof Error)
        return toast.error(err.message ,{position})

    return toast.error('Network Error' , {position})
}

export default CatchError
