import ClosePopUp from "@/components/closePopUp";
import Avatar from "@/components/UIComponents/Avatar";
import { useGetConversationList } from "@/hooks/message/query";
import { conversationCount, loggedInUser } from "@/store";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
interface conversationPopupProps {
  isMessagePopUp: boolean;
  messageCardRef: React.MutableRefObject<any>;
  messageRef: React.MutableRefObject<any>;
  setIsMessagePopUp: React.Dispatch<React.SetStateAction<boolean>>;
}
const ConversaionPopUp = ({
  messageCardRef,
  messageRef,
  isMessagePopUp,
  setIsMessagePopUp,
}: conversationPopupProps) => {
  const [currentUser, setcurrentUser] = useAtom(loggedInUser);
  const conversationUserList: any = useGetConversationList({
    query: { type: "All" },
  });
  const [conversationCounts, setConversationCounts] =
    useAtom(conversationCount);
  const popUpProps = {
    menuPopUp: isMessagePopUp,
    userCardRef: messageCardRef,
    userRef: messageRef,
    setMenuPopUp: setIsMessagePopUp,
  };
  ClosePopUp(popUpProps);
  const conversationCard = (item: any) => {
    const member = item?.members?.filter(
      (fil: any) => fil?._id !== currentUser?.data?._id
    );
    return (
      <div
        className="flex  justify-between gap-2 border-b bg-white py-5 last:border-none"
        onClick={() => {
          //   handleConversation(member?.[0]);
        }}
      >
        <div className="">
          {member?.[0]?.avatar_url ? (
            <Image
              className="rounded-full"
              src={member?.[0]?.avatar_url}
              alt="profile"
              height={64}
              width={64}
              objectFit="cover"
            />
          ) : (
            <div className="h-[64px] w-[64px]">
              <Avatar name={member?.[0]?.user_handle} />
            </div>
          )}
        </div>
        <a className="mt-1 flex-grow">
          <div className="w-44   break-all font-medium">
            {member?.[0]?.user_handle}
          </div>
          <p className="break-all text-justify text-sm text-gray-500">
            {item?.last_message?.type === "post" ? (
              <p>Shared Post</p>
            ) : item?.last_message?.type === "image" ? (
              <p>Shared image</p>
            ) : (
              item?.last_message?.message
            )}
          </p>
        </a>
        <div className="mt-2.5 text-xs">
          {dayjs(item?.updated_at).format("hh:mm A")}
        </div>
      </div>
    );
  };
  //   ClosePopUp();
  return (
    <div
      style={{ maxHeight: "37rem" }}
      className="absolute top-16 w-[22rem]  overflow-auto rounded-lg bg-white p-4 shadow-lg lg:-right-14 xl:-right-20"
    >
      <div>
        <p className="py-2 text-xl font-medium">Message</p>
        <div className="flex justify-end">
          <Link href={`/messages?tab=All`}>
            <div
              onClick={() => {
                setTimeout(() => {
                  setIsMessagePopUp(false);
                }, 500);
              }}
            >
              <p className="cursor-pointer text-sm text-primary-500 ">
                {" "}
                See all
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <div className="mb-30  relative px-4 ">
          {conversationUserList?.data?.data?.conversationList?.length > 0 ? (
            conversationUserList?.data?.data?.conversationList?.map(
              (item: any) => {
                return (
                  <div key={item._id} className={`border-b last:border-none `}>
                    <Link href={`/messages/${item?._id}?tab=All`}>
                      <a
                        className="flex-grow"
                        onClick={() => {
                          conversationUserList.refetch();
                          if (item?.unread_count) {
                            setConversationCounts(conversationCounts - 1);
                          }
                        }}
                      >
                        <div>{conversationCard(item)}</div>
                      </a>
                    </Link>
                  </div>
                );
              }
            )
          ) : (
            <div className="p-10 text-center font-medium text-primary-500">
              Conversation not found yet!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversaionPopUp;
