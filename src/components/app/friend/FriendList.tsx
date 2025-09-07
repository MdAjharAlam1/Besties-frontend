import useSWR, { mutate } from "swr"
import Card from "../../shared/Card"
import SmallButton from "../../shared/SmallButton"
import type { FC } from "react"
import Fetcher from "../../../lib/Fetcher"
import { Empty, Skeleton } from "antd"
import CatchError from "../../../lib/CatchError"
import HttpInterceptor from "../../../lib/HttpInterceptor"


interface FriendInterface{
    columns?:number,
    gap?:number
}


const FriendList : FC<FriendInterface> = ({columns= 3 , gap = 4 }) => {
    const {data, error,isLoading} = useSWR('/friend/all',Fetcher)
    if(isLoading){
        return <Skeleton/>
    }
    if(error){
        return <Empty/>
    }

    const unfriend = async(id:string) =>{
        try {
            await HttpInterceptor.delete(`/friend/${id}`)
            mutate('/friend/all')
            mutate('/friend/suggestion')
            mutate('/friend/request')
            
        } catch (err) {
            CatchError(err)
        }
    }
  return (
    
    <div className={ `grid grid-cols-2 lg:grid-cols-${columns} gap-${gap}`}>
      {
        data && data.map((item:any,index:number)=>{
        
            return <Card key={index}>
                    <div className="flex flex-col items-center gap-3">
                        <img 
                            src={item.friend.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4"}
                            alt="profile image"
                            className='w-[60px] h-[60px] rounded-full object-center' 
                        />
                        <h1 className="capitalize">{item.friend.fullname}</h1>
                        <div>
                            {
                                item.status === "requested" ?
                                <SmallButton type="primary" icon="user-minus-line"> Friend Request Sent</SmallButton>
                                :
                                <SmallButton onClick={()=>unfriend(item._id)} type="danger" icon="user-minus-line"> Unfriend</SmallButton>
                                
                            }

                        </div>  
                    </div>
                </Card>
        })
      }
    </div>
  )
}

export default FriendList
