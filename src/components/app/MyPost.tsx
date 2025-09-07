import { Empty, Skeleton } from "antd"
const env = import.meta.env
import Button from "../shared/Button"
import useSWR from "swr"
import Fetcher from "../../lib/Fetcher"
import Card from "../shared/Card"
import Divider from "../shared/Divider"
import {useMediaQuery} from 'react-responsive'
import SmallButton from "../shared/SmallButton"
import moment from "moment"


const MyPost = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const {data, error,isLoading} = useSWR('/post/user',Fetcher)
    return (
        <div className="space-y-6">
        {
            isLoading && 
            <Skeleton active/>
        }
        {
            error && 
            <Empty/>
        }

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

export default MyPost
