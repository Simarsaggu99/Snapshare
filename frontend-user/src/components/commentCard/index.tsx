import React from 'react'
import Image from 'next/image'
import userProfile from "~/images/userProfile.png";
import { getCollectionPosts } from '@/services/mycollection';

const CommentCard = () => {
    const array2 = [
        {
          id: 1,
          name: "Nimisha Tiwari",
          name2: "YO_Nimisha_U_know",
          count: 1,
          img: "https://img.freepik.com/premium-photo/businesswoman-posing_23-2148142777.jpg?w=1060",
        },
        {
          id: 2,
          name: "Nimisha Tiwari",
          name2: "YO_Nimisha_U_know",
          count: 1,
          img: "https://img.freepik.com/premium-photo/businesswoman-posing_23-2148142777.jpg?w=1060",
        },
        {
          id: 3,
          name: "Nimisha Tiwari",
          name2: "YO_Nimisha_U_know",
          count: 1,
          img: "https://img.freepik.com/premium-photo/businesswoman-posing_23-2148142777.jpg?w=1060",
        },
      ];
    return (
        
        <div className="flex align-center justify-between">
            <div className="overflow-hidden rounded-[10px] bg-white px-4 py-2 mt-5 mr-16 pt-2.5 shadow-md  ">
                <p className="w-full rounded-md py-2 text-start text-xl font-[400] ">
                 Notifications
                </p>
                <div className='text-end text-primary-600'>
                <button>See</button>
                </div>
                <div className="p-4 border-t border-b px-3 text-gray-700 text-base  flex justify-between">

                    <div className="relative h-10 w-10 rounded-full  ">
                        <Image
                            src={userProfile}
                            // style={{ borderRadius: "10px" }}
                            alt="userProfile"
                            layout='fill'
                            objectFit='cover'
                        
                        />
                    </div>
                    <div className="text-sm text-center pt-2">
                        <p className="text-gray-900 leading-none text-left"><span>Nimisha Singh </span>
                            and 5 other friends like your photo</p>
                        <p className="text-primary-600 text-left">2 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentCard