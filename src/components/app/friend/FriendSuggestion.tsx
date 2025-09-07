
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';
import useSWR, { mutate } from 'swr';
import Fetcher from '../../../lib/Fetcher';
import { Empty, Skeleton } from 'antd';
import CatchError from '../../../lib/CatchError';
import HttpInterceptor from '../../../lib/HttpInterceptor';
import { toast } from 'react-toastify';

const FriendSuggestion= () => {
    const {data,isLoading} = useSWR('/friend/suggestion', Fetcher)

    const sendFriendRequest = async(id:string) =>{
        try {
            await HttpInterceptor.post('/friend',{friend:id})
            mutate('/friend/suggestion')
            mutate('/friend/all')
            mutate('/friend/request')
            toast.success("Friend Request Sent",{position:"top-center"})
            
        } catch (err) {
            CatchError(err)
        }
    }
    if(isLoading){
        return <Skeleton/>
    }
  return (
    <Card title="Suggestion" divider>
        {
            data.length===0 && 
            <Empty/>
        }
        <div>
            <Swiper
                slidesPerView={2}
                spaceBetween={30}
                pagination={{
                    clickable:true
                }}
                className="mySwiper"
            >
                {
                    data && data.map((item:any,index:number)=>{
                       return  <SwiperSlide key={index}>

                                    <div className='flex flex-col items-center gap-2 border border-gray-100 rounded-lg p-4 '>
                                        <img 
                                            src={item.image || "https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4" }
                                            alt="profile image"
                                            className='w-[60px] h-[60px] rounded-full object-center' 
                                        />
                                        <h1 className='text-[15px] font-medium capitalize text-black'>{item.fullname}</h1>
                                        <SmallButton onClick={()=>sendFriendRequest(item._id)} type='success' icon='user-add-line'>Add</SmallButton>
                                    </div>
                       
                                </SwiperSlide>
                        
                    })
                }

            </Swiper>
        </div>
    </Card>
  );
}

export default FriendSuggestion
