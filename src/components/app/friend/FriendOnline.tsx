import { useContext, useEffect, useState } from "react"
import Card from "../../shared/Card"
import socket from "../../../lib/socket"
import { useNavigate} from "react-router-dom"
import Context from "../../Context"



const FriendOnline = () => {
  const[onlineFriends, setOnlineFriends] = useState([])
  const {session,setLiveActiveSession} = useContext(Context)
  const navigate = useNavigate()

  const generateActiveLiveSession = (url:string,user:any) =>{
    navigate(url)
    setLiveActiveSession(user)
  }

  const onlineHandler = (users: any) => {
    const filteredUsers = users.filter((user: any) => user.id !== session.id);
    setOnlineFriends(filteredUsers);
  };

  useEffect(()=>{
      socket.on('online',onlineHandler)

      socket.emit('get-online');
      socket.on("connect", () => {
      socket.emit("get-online");
    });

    return ()=>{
      socket.off('online',onlineHandler)
    }
  },[session])
  return (
    <Card title="Online Friends" divider>

        {
          session && onlineFriends.map((item:any,index:number)=>{
            return <div key={index}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center lg:gap-3 my-2">
                      <div className="flex gap-4">
                          <img 
                            src={ item.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4"}
                            alt="" 
                            className="w-12 h-12 rounded-full object-center"
                          />
                          <div>
                            <h1 className="text-sm capitalize">{item.fullname}</h1>
                            <label className="text-green-400 text-[14px] font-medium"> Online</label>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={()=>generateActiveLiveSession(`/app/chat/${item.id}`,item)} >
                          <i className="ri-chat-ai-line bg-amber-50 hover:bg-amber-400 rounded text-amber-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center"></i>
                        </button>
                        <button className="hover:cursor-pointer" onClick={()=>generateActiveLiveSession(`/app/audio-chat/${item.id}`,item)}>
                          <i className="ri-phone-line bg-green-50 hover:bg-green-400 rounded text-green-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center"></i>
                        </button>
                        <button className="hover:cursor-pointer" onClick={()=>generateActiveLiveSession(`/app/video-chat/${item.id}`,item)}>
                          <i className="ri-video-on-ai-line bg-rose-50 hover:bg-rose-400 rounded text-rose-600 font-medium hover:text-white w-9 h-9 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </div>
                  </div>
          })
        }
    </Card>
  )
}

export default FriendOnline
