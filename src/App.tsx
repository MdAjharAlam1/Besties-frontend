import { BrowserRouter,Route,Routes } from "react-router-dom"
import 'remixicon/fonts/remixicon.css'
import 'font-awesome/css/font-awesome.min.css'
import 'animate.css';
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Layout from "./components/app/Layout"
import Dashboard from "./components/app/Dashboard"
import Video from "./components/app/Video"
import AudioChat from "./components/app/AudioChat"
import Chat from "./components/app/Chat"
import NotFoundPage from "./components/NotFoundPage";
import Context from "./components/Context";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import FriendList from "./components/app/friend/FriendList";
import MyPost from "./components/app/MyPost";

const App = () => {
  const[session,setSession] = useState(null)
  const[liveActiveSession, setLiveActiveSession] = useState(null)
  const[sdp , setSdp] = useState(null)
  return (
    <Context.Provider value={{session,setSession,liveActiveSession, setLiveActiveSession , sdp , setSdp}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
            <Route path="/app" element={<Layout/>}>
              <Route path="dashboard" element={<Dashboard/>}/>
              <Route path="friends" element={<FriendList/>}/>
              <Route path="my-posts" element={<MyPost/>}/>
              <Route path="video-chat/:id" element={<Video/>}/>
              <Route path="audio-chat/:id" element={<AudioChat/>}/>
              <Route path="chat/:id" element={<Chat/>}/>
            </Route>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
        <ToastContainer/>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
