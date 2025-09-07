
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';
import useSWR, { mutate } from 'swr';
import Fetcher from '../../../lib/Fetcher';
import { Empty, Skeleton } from 'antd';
import CatchError from '../../../lib/CatchError';
import HttpInterceptor from '../../../lib/HttpInterceptor';

const FriendRequest= () => {
    const {data,isLoading} = useSWR('/friend/request',Fetcher)

    if(isLoading){
        return <Skeleton/>
    }

    const acceptFriend = async(id:string) =>{
        try {
            await HttpInterceptor.put(`/friend/${id}`,{status: "accepted"})
            mutate('/friend/all')
            mutate('/friend/request')
            mutate('/friend/suggestion')

            
        } catch (err) {
            CatchError(err)
        }
    }
  return (
    <Card title="Friend Request" divider>
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

                                    <div className='flex flex-col items-center gap-2 border border-gray-100 rounded-lg p-4'>
                                        <img 
                                            src={ item.user.image ||"https://th.bing.com/th/id/OIP.aw2_9W3UMRsvRuSqSJlE1QHaHa?pid=ImgDet&w=195&h=195&c=7&dpr=1.4"}
                                            alt="profile image"
                                            className='w-[60px] h-[60px] rounded-full object-center' 
                                        />
                                        <h1 className='text-[15px] font-medium text-black'>{item.user.fullname}</h1>
                                        <SmallButton onClick={()=>acceptFriend(item._id)} type='warning' icon='check-double-line'>Accept</SmallButton>
                                    </div>
                       
                                </SwiperSlide>
                        
                    })
                }

            </Swiper>
        </div>
    </Card>
  );
}

export default FriendRequest
