import { useContext, useEffect, useRef, useState } from "react"
import Button from "../shared/Button"
import CatchError from "../../lib/CatchError"
import { toast } from "react-toastify"
import Context from "../Context"
import socket from "../../lib/socket"
import { useNavigate, useParams } from "react-router-dom"
import { Modal, notification } from "antd"
import '@ant-design/v5-patch-for-react-19';


const config = {
    iceServers: [
        {
          urls: "stun:stun.l.google.com:19302" // Free Google STUN server
        },
    ]
}

export type CallType = "pending" | "calling" | "incoming" | "talking" |"end"

export type AudioSrcType = "/sound/ring.mp3" | "/sound/reject.mp3" | "/sound/busy.mp3" | "/sound/chat.mp3"

export interface onOfferInterface{
    offer: RTCSessionDescriptionInit
    from: any
    type: "audio" | "video" | "chat"
}
export interface onAnswerInterface{
    answer: RTCSessionDescriptionInit
    from: string
}

export interface onCandidateInterface {
    candidate: RTCIceCandidateInit
    from:string
}

function getCallTiming(seconds:number): string{
    const hrs = Math.floor(seconds/3600)
    .toString().padStart(2,'0')

    const mins = Math.floor((seconds % 3600) / 60)
    .toString().padStart(2,'0')

    const secs = Math.floor(seconds % 60)
    .toString().padStart(2,'0')

    return `${hrs}:${mins}:${secs}`
}

const Video = () => {
    const navigate = useNavigate()
    const[open,setOpen] = useState(false)
    const {session,liveActiveSession, sdp,setSdp} =  useContext(Context)
    const {id} = useParams()
    const[notify, notifyUi] = notification.useNotification()

    const localVideoContainerRef = useRef<HTMLDivElement | null>(null)
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const localStreamRef =  useRef<MediaStream | null>(null)
    const webRtcRef = useRef<RTCPeerConnection | null >(null)
    const audio = useRef<HTMLAudioElement | null>(null)

    const [isVideoSharing, setIsVideoSharing] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const[isMic , setIsMic] = useState(false)
    const[callStatus, setCallStatus] = useState<CallType>("pending")
    const[timer, setTimer] = useState(0)

    const stopAudio = () =>{
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

    const toggleVideo = async() =>{
        try {
            const localVideo = localVideoRef.current
            if(!localVideo){
                return
            }

            if(!isVideoSharing){
                
                const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
                
                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsVideoSharing(true)
                setIsMic(true)
            }
            else{
                const localStream = localStreamRef.current
                if(!localStream){
                    return 
                }
                localStream.getTracks().forEach((track)=>{
                    track.stop()
                    localVideo.srcObject = null
                    localStreamRef.current = null
                })
                setIsVideoSharing(false)
                setIsMic(false)
            }
            
        } catch (err) {
            CatchError(err)
        }
    }
    const toggleAudio = () =>{
        try {
            const localStream = localStreamRef.current
            if(!localStream){
                return
            }
            const audioTrack =  localStream.getTracks().find((tracks)=> tracks.kind === "audio")
            if(audioTrack){
                audioTrack.enabled = !audioTrack.enabled
                setIsMic(audioTrack.enabled)
            }
            
        } catch (err) {
            CatchError(err)
        }
        
    }
    const toggleScreenSharing = async() =>{
        try {
            const localVideo = localVideoRef.current
            if(!localVideo){
                return
            }
            if(!isScreenSharing){
                const stream = await navigator.mediaDevices.getDisplayMedia({video:true})
                const screenShareTrack = stream.getVideoTracks()[0]
                const senderVideoTrack = webRtcRef.current?.getSenders().find((s)=> s.track?.kind === "video")

                if(screenShareTrack && senderVideoTrack){
                    await senderVideoTrack.replaceTrack(screenShareTrack)
                }
                
                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsScreenSharing(true)

                // detect screen share off 

                screenShareTrack.onended = async() =>{
                    setIsScreenSharing(false)
                    const videoCamStream = await navigator.mediaDevices.getUserMedia({video:true})
                    const videoTrack = videoCamStream.getTracks()[0]
                    const senderTrack = webRtcRef.current?.getSenders().find((s)=> s.track?.kind === "video")

                    if(videoTrack && senderTrack){
                        senderTrack.replaceTrack(videoTrack)
                    }

                    localVideo.srcObject = videoCamStream
                    localStreamRef.current = videoCamStream
                    setIsScreenSharing(true)
                }
                
            }
            else{
                const localStream = localStreamRef.current
                if(!localStream){
                    return
                }
                localStream.getTracks().forEach((track)=>{
                    track.stop()
                    localStreamRef.current = null
                    localVideo.srcObject = null
                })
                setIsScreenSharing(false)
                setIsMic(false)
            }
            
        } catch (err) {
            CatchError(err)
        }
    }
    const toggleFullScreen =  (type:"local" | "remote") => {
        if(!isVideoSharing && !isScreenSharing){
            return toast.warn("Please on video first !")
        }
        const videoContainer = type === "local" ? localVideoContainerRef.current : remoteVideoContainerRef.current

        if(!videoContainer){
            return
        }
        if(!document.fullscreenElement){
            videoContainer.requestFullscreen()
        }
        else{
            document.exitFullscreen()
        }
    }

    const webRtcConnection = async() =>{
        // const {data} = await HttpInterceptor.get('/twilio/turn-server')
        webRtcRef.current = new RTCPeerConnection(config)
        const localStream = localStreamRef.current
        if(!localStream){
            return
        }
        localStream.getTracks().forEach((track)=>{
            webRtcRef.current?.addTrack(track,localStream)
        })
        
        webRtcRef.current.onicecandidate = (e) =>{    // show public  ip address of connected user 
            if(e.candidate){
                // console.log(e.candidate)
                socket.emit("candidate",{
                    candidate: e.candidate,
                    to: id
                })

            }
        }
        webRtcRef.current.onconnectionstatechange = () =>{    // show the user connected or not 
            console.log(webRtcRef.current?.connectionState)
        }
        
        // remote user send video and other message
        webRtcRef.current.ontrack = (e)=>{
            const remoteStream = e.streams[0]
            const remoteVideo = remoteVideoRef.current

            if(!remoteVideo){
                return
            }

            remoteVideo.srcObject = remoteStream

            const videoTrack = remoteStream.getVideoTracks()[0]
            if(videoTrack){
                // remote user  video off
                videoTrack.onmute = () =>{
                    remoteVideo.style.display = "none"
                }

                videoTrack.onunmute =() =>{
                    remoteVideo.style.display = "block"
                }

                videoTrack.onended = () =>{

                    remoteVideo.srcObject = null
                    remoteVideo.style.display = "none"
                }
            }
        }



    }

    const startCall = async() =>{
        try {
            if(!isVideoSharing && !isScreenSharing){
                toast.warn('Please on Video First !')
            }
            await webRtcConnection()

            if(!webRtcRef.current){
                return
            }
            const offer = await webRtcRef.current.createOffer()
            await webRtcRef.current.setLocalDescription(offer)
            setCallStatus("calling")
            playAudio("/sound/ring.mp3",true)
            notify.open({
                message:<h1 className="capitalize font-medium">{liveActiveSession.fullname}</h1>,
                description:"Calling....",
                duration:30,
                placement:"bottomRight",
                onClose :stopAudio,
                actions :[
                    <button onClick={endCallLocal} key="end" className="bg-rose-500 rounded text-white px-3 py-1 hover:bg-rose-600">End Call</button>
                ]
                
            })
            socket.emit("offer",{offer,to:id,from:session,type:"video"})
        } catch (err) {
            CatchError(err)
        }
    }

    const acceptCall = async(payload:onOfferInterface) =>{
        try {
            setSdp(null)
            await webRtcConnection()
             
            if(!webRtcRef.current){
                return
            }
            const offer = new RTCSessionDescription(payload.offer)
            await webRtcRef.current.setRemoteDescription(offer)
          
            const answer = await webRtcRef.current.createAnswer()
            await webRtcRef.current.setLocalDescription(answer)

            notify.destroy()
            setCallStatus("talking")
            stopAudio()
            socket.emit("answer",{answer, to:id})
            
        } catch (err) {
            CatchError(err)
        }
    }

    const redirectOnCallEnd = () =>{
        setOpen(true)
        navigate("/app")
    }
    const endCallStreaming = ()=>{
        localStreamRef.current?.getTracks().forEach((track)=>{
            track.stop()
        })

        if(localVideoRef.current){
            localVideoRef.current.srcObject = null
        }

        if(remoteVideoRef.current){
            remoteVideoRef.current.srcObject = null
        }
    }

    // end call for local user
    const endCallLocal = () =>{
        setCallStatus("end")
        playAudio("/sound/reject.mp3")
        notify.destroy()
        socket.emit("end",{to:id})
        endCallStreaming()
        setOpen(true)
    }

    // end call for remote user
    const onEndCallRemote = () =>{
        setCallStatus("end")
        notify.destroy()
        playAudio("/sound/reject.mp3")
        endCallStreaming()
        setOpen(true)


    }

    const onOffer = (payload:onOfferInterface) =>{
        setCallStatus("incoming")
        notify.open({
        message:<h1 className="capitalize font-medium">{payload.from.fullname}</h1>,
        description:"Incoming Calling........",
        duration:30,
        placement:"bottomRight",
        actions:[
            <div key="calls" className="space-x-5">
                <button onClick={()=>acceptCall(payload)} className="bg-green-500 px-4 py-2 text-white hover:bg-green-600 rounded">Accept</button>
                <button onClick={endCallLocal} className="bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 rounded">Reject</button>
            </div>
        ]
       })
    }

    // connect both user by webrtc 
    const onCandidate = async(payload:onCandidateInterface)=>{
        try {
            if(!webRtcRef.current){
                return
            }

            const candidate = new RTCIceCandidate(payload.candidate)
            await webRtcRef.current.addIceCandidate(candidate)

        } catch (err) {
            CatchError(err)
        }
    }

    const onAnswer = async(payload:onAnswerInterface) =>{
        try {

            if(!webRtcRef.current){
                return
            }
            const answer = new RTCSessionDescription(payload.answer)
            await webRtcRef.current.setRemoteDescription(answer)

            setCallStatus("talking")
            stopAudio()
            notify.destroy()
        } catch (err) {
            CatchError(err)
        }
    }

    // event listener web socket 
    useEffect(()=>{
        toggleVideo()
        socket.on("offer",onOffer)
        socket.on("candidate",onCandidate)
        socket.on("answer", onAnswer)
        socket.on("end",onEndCallRemote)

        return ()=>{
            socket.off("offer", onOffer)
            socket.off("candidate",onCandidate)
            socket.off("answer", onAnswer)
            socket.on("end",onEndCallRemote)
        }
    },[])

    useEffect(()=>{
        let interval :any

        if(callStatus === "talking"){
            interval = setInterval(()=>{
                setTimer((prev)=> prev+1)
            },1000)
        }

        return () =>{
            clearInterval(interval)
        }

    },[callStatus]) 

    // detect coming offer

    useEffect(()=>{
        if(sdp){
            notify.destroy()
            onOffer(sdp)
        }
    },[sdp])
    
    if(!liveActiveSession){
        navigate("/app")
    } 

    



  return (
    <div className="space-y-8">
      <div ref= {remoteVideoContainerRef} className=" bg-black w-full  relative lg:pb-[56.25%] pb-[100%] rounded-xl">
            <video ref={remoteVideoRef}  className="w-full h-full absolute top-0 left-0" autoPlay playsInline></video>
            <button className="absolute bottom-5 left-5 text-xs px-2.5 py-1 rounded-lg text-white" style={{
                background:"rgba(255,255,255,0.1)"
            }}>
                Md Ajhar Alam
            </button>
            <button onClick={()=>toggleFullScreen("remote")} className="absolute bottom-5 right-5 text-xs px-2.5 py-1 rounded-lg text-white hover:scale-125 " style={{
                background:"rgba(255,255,255,0.1)",
                transition:"0.1s"
            }}>
               <i className="ri-fullscreen-line"></i>
            </button>
           
        </div>
        <div className="grid lg:grid-col-3 grid-cols-2 gap-4">    
            <div ref={localVideoContainerRef} className=" bg-black w-full h-0 relative lg:pb-[56.25%] pb-[90%] rounded-xl">
                <video ref={localVideoRef}  className="w-full h-full absolute top-0 left-0"  autoPlay playsInline muted ></video>
                <button className=" capitalize absolute bottom-1 left-1 text-xs px-2.5 py-1 rounded-lg text-white" style={{
                    background:"rgba(0,0,0,0.7)"
                }}>
                    {
                        session && 
                        session.fullname
                    }
                </button>
                <button onClick={()=>toggleFullScreen("local")} className="absolute bottom-1  lg:right-5 right-1 text-xs px-2.5 py-1 rounded-lg text-white hover:scale-125 " style={{
                background:"rgba(0,0,0,0.7)",
                transition:"0.1s"
            }}>
               <i className="ri-fullscreen-line"></i>
            </button>
            </div>
            <Button icon="user-add-line">Add</Button>
        </div> 
      <div className="flex lg:items-center justify-between flex-col gap-8 lg:flex-row">
        <div className="space-x-6">
            <button onClick={toggleVideo} 
                className={`${isVideoSharing ? "bg-green-300" : "bg-green-500"} text-white w-12 h-12 rounded-full hover:bg-green-400 hover:text-white`}>
                {
                    isVideoSharing ?
                    <i className="ri-video-off-line" title="video"></i>
                    :
                    <i className="ri-video-on-ai-line" title="video"></i>
                }
            </button>
            <button onClick={toggleAudio} 
            className={`${isMic ? "bg-amber-300" : "bg-amber-500"} text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white`}>
                {
                    isMic ? 
                    
                    <i className="ri-mic-line" title="microphone"></i>
                    :
                    <i className="ri-mic-off-line" title="Microphone"></i>
                }
            </button>
            <button onClick={toggleScreenSharing} 
            className={`${isScreenSharing ? "bg-blue-300" : "bg-blue-500"} text-white w-12 h-12 rounded-full hover:bg-blue-400 hover:text-white`}>
                {
                    isScreenSharing ?
                    <i className="ri-tv-2-line" title="screen share"></i>
                    :
                    <i className="ri-chat-off-line" title="ScreenShare"></i>

                }
            </button>

        </div>
        <div className="space-x-4">
            {
                callStatus === "talking" &&
                <label>{getCallTiming(timer)}</label>
            }
            {
                ( callStatus ==="pending" || callStatus ==="end" )&& 
                <Button onClick={startCall} icon="phone-line" type="success">Call</Button>
            }
            {
                callStatus === "talking" &&
                <Button onClick={endCallLocal} icon="close-circle-line" type="danger">End</Button>

            }
        </div>
      </div>
      <Modal open={open} footer={null} maskClosable centered onCancel={redirectOnCallEnd}>
            <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold">Call Ended</h1>
                <Button onClick={redirectOnCallEnd} type="danger">Thank You !</Button>
            </div>
      </Modal>
      {notifyUi}
    </div>
  )
}

export default Video
