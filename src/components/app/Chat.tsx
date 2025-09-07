import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"
import socket from "../../lib/socket"
import { useContext, useEffect, useRef, useState, type ChangeEvent, type FC } from "react"
import Form from "../shared/Form"
import { useParams } from "react-router-dom"
import Context from "../Context"
import useSWR from "swr"
import Fetcher from "../../lib/Fetcher"
import CatchError from "../../lib/CatchError"
import {v4 as uuid} from 'uuid'
import HttpInterceptor from "../../lib/HttpInterceptor"
import Card from "../shared/Card"
import SmallButton from "../shared/SmallButton"
import moment from 'moment'


interface MessageReceivedInterface {
    from:string
    message:string
    
}

interface AttachmentInterface{
    file:{
        path:string
        type:string
    }
}

const AttachmentUI : FC<AttachmentInterface> = ({file}) =>{
    if (!file || !file.type) {
        return null;
    }
    if (file.type.startsWith('video/')) {
        return (
            <video className="w-full h-full" controls src={file.path}></video>
        );
    }
    if (file.type.startsWith("image/")) {
        return (
            <img className="w-full" src={file.path} />
        );
    }
    return (
        <Card>
            <i className="ri-file-line text-5xl"></i>
        </Card>
    )
}

const Chat = () => {
    const chatContainer = useRef<HTMLDivElement | null>(null)
    const[chats, setChats] = useState<any>([])
    const{session} = useContext(Context)   
    const {id} = useParams()
    const {data} = useSWR(id ? `/chat/${id}` : null , id ? Fetcher : null)


    const receiveMessageHandler = (recievedMessage:MessageReceivedInterface) =>{
        setChats((prev:any)=>[...prev, recievedMessage])
    }

    const attachmentHandler = (receiveAttachment:any)=>{
        setChats((prev:any)=>[...prev, receiveAttachment])
    }

    

    useEffect(()=>{
        socket.on('message', receiveMessageHandler)
        socket.on('attachment', attachmentHandler)

        return ()=>{
            socket.off('message', receiveMessageHandler)
            socket.off('attachment', attachmentHandler)
        }
    },[])

    useEffect(()=>{
        const chatDiv = chatContainer.current
        if(chatDiv){
            chatDiv.scrollTop = chatDiv.scrollHeight
        }

    },[chats])

    useEffect(()=>{
        if(data){
            // console.log(data) 
            setChats(data)
        }
    },[data])

    const sendMessage = (values: any) =>{
        const payload = {
            from:session,
            to:id,
            message: values.message
        }
        setChats((prev:any)=> [...prev, payload])
        socket.emit('message', payload)
    }
    
    const fileHandler = async(e: ChangeEvent<HTMLInputElement>) =>{
        try {
            const input = e.target
            
            if(!input.files){
                return
            }
    
            const file = input.files[0]
            const url = URL.createObjectURL(file)
            const ext = file.name.split(".").pop()
            const filename = `${uuid()}.${ext}`
            const path = `chats/${filename}`

            const payload = {
                path,
                type: file.type,
                status:"private"

            }

            const options = {
                headers:{
                    "Content-Type": file.type
                }
            }

            const{data} = await HttpInterceptor.post('/storage/upload', payload)
            await HttpInterceptor.put(data.url,file,options)

            const remoteMetaData = {
                files:{
                    path:path,
                    type: file.type
                }
            }

            const localMetaData = {
                files:{
                    path:url,
                    type: file.type
                }
            }

            
            const attachmenPayload = {
                from: session,
                to: id,
                message:filename,
                files:{
                    path,
                    type: file.type
                }
            }
            setChats((prev:any)=>[...prev,{...attachmenPayload, ...localMetaData}])
            socket.emit("attachment",{...attachmenPayload, ...remoteMetaData})
            
        } catch (err) {
            CatchError(err)
        }
    }

    const downloadAttachment = async(filename:string) =>{
        try {
            const path = `chats/${filename}`
            const{data} = await HttpInterceptor.post('/storage/download', {path})
            const a = document.createElement("a")
            a.href = data.url
            a.download = filename
            a.click()
            
        } catch (err) {
            CatchError(err)
        }
    }
  return (
    <div>
        <div className="h-[450px] p-6 overflow-auto space-y-6" ref={chatContainer}>
            {
                chats.map((item:any,index:number)=>{
                    return <div className="space-y-6" key={index}>
                            {
                                (item.from?.id === session.id || item.from?._id === session.id) ?
                                    <div className="flex  items-start gap-6">
                                        <Avatar image={ session.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4"} size="md"/>
                                        <div className=" flex flex-col gap-3 bg-rose-50 relative px-4 py-2 rounded-lg flex-1 text-pink-500 border border-rose-100">
                                            <h1 className="font-medium text-black capitalize">You</h1>
                                            {
                                                item.files && 
                                                <AttachmentUI file={item.files}/>
                                            }
                                            <label>
                                                {item.message}
                                            </label>
                                            {
                                                item.files && 
                                                <div>
                                                    <SmallButton onClick={()=>downloadAttachment(item.message)}  icon="download-line">Download</SmallButton>

                                                </div>
                                            }
                                            <div className="text-gray-400 text-right text-xs">
                                                {moment(item.createdAt).format('MMM DD, YYYY hh:mm:ss A')}
                                            </div>
                                            
                                            <i className="ri-arrow-left-s-fill text-4xl absolute top-0 -left-5 text-rose-50"></i>
                                        </div>
                                    </div>
                                :
                                <div className="flex items-start gap-6">
                                    <div className=" flex flex-col gap-3 bg-violet-50 relative px-4 py-2 rounded-lg flex-1 text-blue-500 border border-violet-100">
                                        <h1 className="font-medium text-black capitalize">{item.from?.fullname}</h1>
                                        {
                                            item.files && 
                                            <AttachmentUI file={item.files}/>
                                        }
                                        <label>
                                           {item.message}
                                        </label>
                                        {
                                            item.files && 
                                            <div>
                                                <SmallButton onClick={()=>downloadAttachment(item.message)} type="danger"  icon="download-line">Download</SmallButton>
                                            </div>
                                        }
                                        <div className="text-gray-400 text-right text-xs">
                                            {moment(item.createdAt).format('MMM DD, YYYY hh:mm:ss A')}
                                        </div>
                                        <i className="ri-arrow-right-s-fill text-4xl absolute top-0 -right-5 text-violet-50"></i>
                                    </div>
                                    <Avatar image={ item.from &&  item.from.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4"} size="md"/>
                                </div>
                            }
                        </div>
                })
            }
        </div>
        <div className="p-3 mt-2">
            <div className="flex items-center gap-4">
                <Form className="flex items-center gap-4 flex-1" onValue={sendMessage} reset>
                    <Input name="message" placeholder="Type your message here"/>
                    <Button type="secondary" icon="send-plane-fill">Send</Button>
                </Form>
                <button className=" relative w-12 h-12 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-400 hover:text-white  ">
                    <i className="ri-attachment-2"></i>
                    <input onChange={fileHandler} type="file" className=" opacity-2 w-full h-full absolute top-0 left-0 rounded-full  " />
                </button>
            </div>
        </div>
    </div>
  )
}

export default Chat
