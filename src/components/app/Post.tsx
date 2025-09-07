const env = import.meta.env
import { useState } from "react"
import Button from "../shared/Button"
import Card from "../shared/Card"
import Divider from "../shared/Divider"
import Editor from "../shared/Editor"
import {Card as AntCard, message, Skeleton} from 'antd'
import CatchError from "../../lib/CatchError"
import HttpInterceptor from "../../lib/HttpInterceptor"
import {v4 as uuid} from 'uuid'
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/Fetcher"
import moment from "moment"
import SmallButton from "../shared/SmallButton"
import { useMediaQuery } from 'react-responsive'


interface InputAttachData {
  url:string
  file:File
}

const Post = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const {data,isLoading} = useSWR('/post', Fetcher)
  const [value,setValue] = useState('')
  const [fileData, setFileData] = useState<InputAttachData | null>(null)

  const AttachFile = () =>{
    const input = document.createElement('input')
    input.type = "file"
    input.accept = "image/* , video/*"
    input.click()

    input.onchange = () => {
      if(!input.files){
        return
      }

      const file = input.files[0]
      input.remove()
      const url = URL.createObjectURL(file)
      setFileData({
        url:url,
        file:file
      })

    }
  }

  const createPost = async()=>{
    try{
      let path = null
      
      if(fileData){

        const ext = fileData.file.name.split(".").pop()
        const filename = `${uuid()}.${ext}`
        path = `posts/${filename}`

        const payload = {
          path:path,
          type:fileData.file.type,
          status:'public-read'
        }
        const options = {
          headers:{
            'Content-Type':fileData.file.type
          }
        }
        const {data} =await HttpInterceptor.post('/storage/upload',payload)
        await HttpInterceptor.put(data.url,fileData.file, options)
        setFileData(null)
        setValue('')
      }
      const formData = {
        attachment : path,
        type: path ? fileData?.file.type : null ,
        content : value
      }
      await HttpInterceptor.post('/post', formData)
      mutate('/post')
      mutate('/post/user')
      message.success("Post created Successfully")
    } catch (err) {
      CatchError(err)
    }
  }



  return (
    <div className="space-y-6">
      {
        isLoading && 
        <Skeleton active/>
      }
      <div className="flex flex-col gap-8">
        {
          value.length === 0 && 
          <h1 className="text-lg font-medium text-black">Write Your Post Here ...</h1>
        }
        {
          value.length > 0 && 
          <AntCard>
            <div className="space-y-6 ">
              {
                fileData && fileData.file.type.startsWith("image/") &&
                <img src={fileData.url} className="rounded-lg object-cover w-full"/>

              }
              {
                fileData && fileData.file.type.startsWith("video/") && 
                <video src={fileData.url} className="rounded-lg object-cover w-full" controls />
              }
              <div  dangerouslySetInnerHTML={{__html:value}} className="hard-reset" />
            </div>
          </AntCard>
        }
        <Editor
          value={value}
          onChange={setValue}
        />
        <div className=" grid grid-cols-2 lg:grid-cols-3 gap-4 ">
          <Button onClick={AttachFile} type="danger" icon="attachment-line">Attach</Button>
          {
            fileData && 
            <Button onClick={()=> setFileData(null)} type="warning" icon="attachment-line">Reset</Button>
          }
          <Button onClick={createPost} type="secondary" icon="arrow-right-line">Post</Button>
        </div>
      </div>
      {
        data && data.map((item:any, index:number)=>{
          return <Card key={index}
          > 
            <div className="space-y-4">
              {
                item.attachment && item.type.startsWith("image/") && 
                <img src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-center  w-full" />
              }
              
              {
                item.attachment && item.type.startsWith("video/") && 
                <video src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full" controls />
              }
              <div dangerouslySetInnerHTML={{__html: item.content}} className="hard-reset"/>
             
              <div className="flex items-center justify-between">
                <label className="text-sm font-normal">{moment(item.createdAt).format('MMM DD YYYY, h:mm A')}</label>
              </div>
              <Divider/>
              <div className="space-x-4 lg:space-y-0 space-y-3">
                {
                  isMobile ?
                  <div className="space-x-4">
                    <SmallButton type="info" icon="thumb-up-line">{item.like || 0}</SmallButton>
                    <SmallButton type="warning" icon="thumb-down-line">{item.dislike || 0}</SmallButton>
                    <SmallButton type="danger" icon="chat-ai-line">{item.comment|| 0}</SmallButton>
                  </div>
                  :
                  <div className="space-x-4">
                    <Button type="info" icon="thumb-up-line">{item.like || 0}</Button>
                    <Button type="warning" icon="thumb-down-line">{item.dislike || 0}</Button>
                    <Button type="danger" icon="chat-ai-line">{item.comment || 0}</Button>
                  </div>

                }
              </div>
            </div>
          </Card>
        })
      }
    </div>
  )
}

export default Post
