
import  {  useContext, useEffect, useRef, useState } from "react"
import Button from "../shared/Button"
import Card from "../shared/Card"
import Context from "../Context"
// import HttpInterceptor from "../../lib/HttpInterceptor"
import CatchError from "../../lib/CatchError"
import { Modal, notification } from "antd"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import type { AudioSrcType, CallType, onAnswerInterface, onCandidateInterface, onOfferInterface } from "./Video"
import socket from '../../lib/socket'


const config = {
    iceServers: [
        {
          urls: "stun:stun.l.google.com:19302" // Free Google STUN server
        },
    ]
}

const AudioChat = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [isMic, setIsMic] = useState(false)
    const{session, liveActiveSession,sdp,setSdp} = useContext(Context)
    const localAudio = useRef<HTMLAudioElement | null>(null)
    const remoteAudio = useRef<HTMLAudioElement | null>(null)
    const localStream = useRef<MediaStream | null>(null)
    const [notify, notifyUi] = notification.useNotification()
    const rtc = useRef<RTCPeerConnection | null>(null)
    const audio = useRef<HTMLAudioElement | null>(null)
    const[status, setStatus] = useState<CallType>("pending")
    const[open,setOpen] = useState(false)

    const stopAudio = ()=>{
        if(!audio.current){
            return
        }
        const player = audio.current
        player.pause()
        player.currentTime = 0
    }

    const playAudio = (src:AudioSrcType, loop:boolean = false) =>{
        stopAudio()
        if(!audio.current){
            audio.current = new Audio()
        }

        const player = audio.current
        player.src = src
        player.loop = loop
        player.load()
        player.play()
    }

    const toggleMic = async()=>{
        try {
            if(!localStream.current && !isMic){
                const stream = await navigator.mediaDevices.getUserMedia({audio:true})

                if(localAudio.current){
                    localAudio.current.srcObject = stream
                    localAudio.current.play()
                }

                localStream.current = stream
                setIsMic(true)
            }
            else{
                localStream.current?.getTracks().forEach((track)=>track.stop())
                if(localAudio.current){
                    localAudio.current.pause()
                    localAudio.current.srcObject = null
                }
                
                localStream.current = null
                setIsMic(false)
            }
            
        } catch (err) {
            CatchError(err)
        }
    }

    const connection = async()=>{
        try {
            // const {data} = await HttpInterceptor.get('/twilio/turn-server')
            rtc.current = new RTCPeerConnection(config)
            const localStreaming = localStream.current
            
            if(!localStreaming){
                return
            }

            localStreaming?.getTracks().forEach((track)=>{
                rtc.current?.addTrack(track,localStreaming)
            })

            rtc.current.onicecandidate = (e) =>{
                if(e){
                    socket.emit("candidate",{candidate:e.candidate, to:id})
                }
            }

            rtc.current.onconnectionstatechange = () =>{
                console.log(rtc.current?.connectionState)
            }

            rtc.current.ontrack = (e) =>{
               if(e && remoteAudio.current){
                    const remoteStream = e.streams[0]
                    remoteAudio.current.srcObject = remoteStream
               }
            }
        } catch (err) {
            CatchError(err)
        }
    }

    const startCall = async()=>{
        try {

            await connection()
            if(!rtc.current){
                return
            }

            const offer = await rtc.current.createOffer()
            await rtc.current.setLocalDescription(offer)
            playAudio("/sound/ring.mp3",true)
            setStatus("calling")
            notify.open({
                message:<h1 className="capitalize font-medium">{liveActiveSession.fullname}</h1>,
                description:"Calling....",
                duration:30,
                placement:"bottomRight",
                onClose :stopAudio,
                actions :[
                    <button key="end" className="bg-rose-500 rounded text-white px-3 py-1 hover:bg-rose-600">End Call</button>
                ]
                
            })
            
            socket.emit("offer",{offer,to:id,from:session,type:"audio"})
            
            
        } catch (err) {
            CatchError(err)
        }
    }

   const acceptCall = async(paylaod:onOfferInterface)=>{
    try {
        setSdp(null)
        await connection()
        if(!rtc){
            return
        }

        const offer = new RTCSessionDescription(paylaod.offer)
        await rtc.current?.setRemoteDescription(offer)

        const answer = await rtc.current?.createAnswer()
        await rtc.current?.setLocalDescription(answer)

        notify.destroy()
        setStatus("talking")
        stopAudio()

        socket.emit("answer", {answer, to:id})
    } catch (err) {
        CatchError(err)
    }
   }

    const redirectOnCallEnd = () =>{
        setOpen(false)
        return navigate("/app")
    }

   const endStreaming = ()=>{
    localStream.current?.getTracks().forEach((track)=> track.stop())
    if(localAudio.current){
        localAudio.current.srcObject = null
        localAudio.current.pause()
        localAudio.current.currentTime = 0
    }

    if(remoteAudio.current){
        remoteAudio.current.srcObject = null
        remoteAudio.current.pause()
        remoteAudio.current.currentTime = 0
    }
   }

    const endCallOnLocal = ()=>{
        setStatus("end")
        playAudio("/sound/reject.mp3")
        notify.destroy()
        socket.emit("end",{to:id})
        endStreaming()
        setOpen(true)
    }
    const endCallOnRemote = () =>{
        setStatus("end")
        playAudio("/sound/reject.mp3")
        notify.destroy()
        endStreaming()
        setOpen(true)
    }

    if (!liveActiveSession) {
        return <Navigate to="/app" replace />
    }

    useEffect(()=>{
        toggleMic()

    },[])

    const onOffer = (payload:onOfferInterface) =>{
        try {
            setStatus("incoming")
            notify.open({
                message:<h1 className="font-medium capitalize">{payload.from.fullname}</h1>,
                description:"Incoming.....",
                duration:30,
                placement:"bottomRight",
                onClose : stopAudio,
                actions:[
                    <button onClick={()=>acceptCall(payload)} className="bg-green-500 mr-3 text-white font-medium px-4 py-2 hover:bg-green-600">Accept</button>,
                    <button onClick={endCallOnLocal} className="bg-rose-500 text-white font-medium px-4 py-2 hover:bg-rose-600">Reject</button>
                ]
                     
            })
            
        } catch (err) {
            CatchError(err)
        }
    }

    const onAnswer = async(payload:onAnswerInterface)=>{
        try {
            if(!rtc.current){
                return
            }

            const answer = new RTCSessionDescription(payload.answer)
            await rtc.current.setRemoteDescription(answer)

            setStatus("talking")
            stopAudio()
            notify.destroy()
            
        } catch (err) {
            CatchError(err)
        }
    }

    const onCandidate = async(payload:onCandidateInterface)=>{
        try {
            if(!rtc.current){
                return
            }

            const candidate = new RTCIceCandidate(payload.candidate)
            await rtc.current.addIceCandidate(candidate)
            
        } catch (err) {
            CatchError(err)
        }
    }

    // event listener
    useEffect(()=>{
        socket.on("offer",onOffer)
        socket.on("answer", onAnswer)
        socket.on("candidate", onCandidate)
        socket.on("end", endCallOnRemote)

        return ()=>{
            socket.off("offer",onOffer)
            socket.off("answer", onAnswer)
            socket.off("candidate", onCandidate)
            socket.off("end", endCallOnRemote)
        }

    },[])

    useEffect(()=>{
        if(sdp){
            notify.destroy()
            onOffer(sdp)
        }
    },[sdp])

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">    
            <Card title={session.fullname}>
                <audio hidden ref={localAudio} muted autoPlay playsInline/>
                <audio hidden ref={remoteAudio} autoPlay playsInline/>
                
                <div className="flex flex-col items-center">
                    <img 
                        src={session.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4" } 
                        alt="user-1 image" 
                        className="w-40 h-40 rounded-full object-cover"
                    />
                </div>
            </Card>
            <Card title={liveActiveSession.fullname}>
                <div className="flex flex-col items-center">
                    <img 
                        src={liveActiveSession.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4"}
                        alt="user-1 image" 
                         className="w-40 h-40 rounded-full object-cover"
                    />
                </div>
            </Card>
        </div> 
      <div className="flex items-center justify-between">
        <div className="space-x-6">
            <button onClick={toggleMic} className="bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white ">
                {
                    isMic ?
                    <i className="ri-mic-line" title="microphone"></i>
                    :
                    <i className="ri-mic-off-line" title="microphone"></i>

                }
            </button>
        </div>
        {
            (status === "pending" || status === "end") &&
            <Button onClick={startCall} icon="phone-line" type="success">Start Call</Button>
        }
        {
            (status === "calling" || status === "talking") && 
            <Button onClick={endCallOnLocal} icon="phone-line" type="danger">End Call</Button>

        }
        
      </div>
      {notifyUi}
        <Modal open={open} footer={null} maskClosable centered onCancel={redirectOnCallEnd}>
            <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold">Call Ended</h1>
                <Button onClick={redirectOnCallEnd} type="danger">Thank You !</Button>
            </div>
      </Modal>
    </div> 
  )
}
export default AudioChat
