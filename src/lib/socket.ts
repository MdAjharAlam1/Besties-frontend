const env = import.meta.env

import { io } from 'socket.io-client'
const socket = io(env.VITE_SERVER,{withCredentials:true})
export default socket