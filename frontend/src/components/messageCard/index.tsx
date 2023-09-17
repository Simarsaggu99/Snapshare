import React from 'react'
import Image from 'next/image'
import userProfile from "~/images/userProfile.png";

const Messagecard = () => {
    const data = [
        {
            id: 1,
            name: "Nimisha Tiwari",
            personName:"You",
            yourMessage: "How are you",
            count: 1,
            img: {userProfile},
            time:"2hrs ago"
          },
        {
            id: 2,
            name: "Nimisha Tiwari",
            personName:"You",
            yourMessage: "How are you",
            count: 1,
            img: {userProfile},
            time:"2hrs ago"
          },
        {
          id: 3,
          name: "Nimisha Tiwari",
          personName:"You:",
          yourMessage: "How are you",
          count: 1,
          img: {userProfile},
          time:"2hrs ago"
        },
      ];
    return (
        <div className=" relative flex align-center justify-between">
            <div className="overflow-hidden rounded-[10px] bg-white px-4 py-2 mt-5 mr-16 pt-2.5 shadow-md  ">
                <p className="w-full rounded-md py-2 text-start text-xl font-[400] ">
                    Messages
                </p>
                <div className='text-end text-primary-600'>
                    <button >See</button>
                </div>
                {data?.map((item ,idx)=>(
                <div className="p-4 border-t border-b px-3 text-gray-700 text-base  flex "key={idx}>
               
                    <div className="relative h-10 w-10 rounded-full  ">
                        <Image
                            src={userProfile}
                            // style={{ borderRadius: "10px" }}
                            alt="userProfile"
                            layout='fill'
                            objectFit='cover'
                        // height={65}
                        // width={65}
                        />
                    </div>
                    <div className="text-sm text-left   pl-4">
                        <p className="text-gray-900 leading-none text-left p-1"><span className='font-bold	'>{item.name}</span>
                           </p>
                           <div className=" px-1  flex text-gray-900 leading-none text-left">
                            <div>
                            <p>{item.personName}</p>
                            </div>
                            <p>{item.yourMessage}</p>
                           </div>
                          

                    </div>
                    
                </div>
               
                ))}





            </div>
        </div>
    )
}

export default Messagecard