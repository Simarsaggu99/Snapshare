import ConversationList from "@/components/message/conversationList/index";
import UserData from "@/components/message/userData";
import { useGetUserForConversation } from "@/hooks/message/query";
import Image from "next/image";
import React from "react";
import messageImg from "~/images/message.png";

const Message = () => {
  const userList = useGetUserForConversation({});

  return (
    <div className="flex w-full   md:px-10 lg:px-0 ">
      <div className="flex h-[85vh] w-[100%]  justify-center md:h-auto md:w-[43%] md:justify-center lg:w-[35%] lg:justify-end 2xl:w-[]">
        <div className="  h-full  w-[100%]  border xxxs:p-2 md:p-0 lg:w-[73%] 2xl:w-[68%]">
          <ConversationList />
        </div>
      </div>
      <div className="flex justify-start md:w-[70%] lg:w-[64%]  ">
        <div className="border   xxxs:hidden xxxs:w-[100%] md:block md:h-[84vh] lg:h-[92vh] lg:w-[100%] 2xl:w-[83%]">
          <div className="mt-[12rem] flex justify-center ">
            <Image src={messageImg} alt="memsake" className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
