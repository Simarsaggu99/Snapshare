import Input from "@/components/form/inputField";
import Avatar from "@/components/UIComponents/Avatar";
import { useGetConversationList } from "@/hooks/message/query";
import {
  checkIfConversationExists,
  createConversation,
  getUserForConversation,
} from "@/services/message";
import { conversationCount, loggedInUser } from "@/store";
import { Ellipse } from "@/utils/AppIcons";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ConversationList = () => {
  const router = useRouter();
  const tabName = router.query.tab;
  const conversationId = router.query.conversationId;

  const [currentUser] = useAtom(loggedInUser);
  const [userList, setUserList] = useState([]);
  const [isSearchPopUp, setIsSearchPopUp] = useState(false);
  const [conversationCounts, setConversationCounts] =
    useAtom(conversationCount);

  const tabs = [
    { name: "All", id: 1 },
    { name: "Primary", id: 2 },
    { name: "Unknown", id: 3 },
    { name: "Archived", id: 4 },
  ];
  const conversationUserList: any = useGetConversationList({
    query: { type: tabName },
  });
  useEffect(() => {
    setTimeout(() => {
      conversationUserList.refetch();
    }, 200);
    return () => {
      setTimeout(() => {
        conversationUserList.refetch();
      }, 200);
    };
  }, [conversationId]);
  // const user: any = useGetUserForConversation({});

  const handleConversation = (user: any) => {
    checkIfConversationExists({
      sender: user?._id,
      receiver: currentUser?.data?._id,
    }).then((res: any) => {
      if (res?.data?.exists) {
        router.push(`/messages/${res?.data?.conversation_id}?tab=${tabName}`);
        // conversationUserList.refetch();
      } else if (!res?.data?.exists) {
        createConversation({
          body: {
            usersList: [user?._id, currentUser?.data?._id],
            type: "single",
          },
        }).then((res: any) => {
          router.push(`/messages/${res?.data?._id}`);
          // conversationUserList.refetch();
        });
      }
    });
  };
  const conversationCard = (item: any) => {
    const member = item?.members?.find(
      (fil: any) => fil?._id !== currentUser?.data?._id
    );
    return (
      <div className="w-full border">
        <div
          className={`flex w-full cursor-pointer justify-between gap-2 border-b bg-white py-5 px-2 hover:bg-gray-100 ${
            item?._id === conversationId && "bg-gray-100 "
          }`}
          onClick={() => {
            handleConversation(member);
            if (item?.unread_count) {
              setConversationCounts(conversationCounts - 1);
            }
          }}
        >
          <div className="relative">
            {member?.avatar_url ? (
              <div className="relative h-[64px]  w-16">
                <Image
                  className="rounded-full"
                  src={member?.avatar_url}
                  alt="profile"
                  // height={64}
                  // width={64}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="h-[64px]  w-16">
                <Avatar name={member?.user_handle} />
              </div>
            )}
            {conversationId !== item?._id && item?.unread_count > 0 && (
              <p className="item-center absolute top-0 right-0 hidden  w-6 rounded-full bg-red-500 py-0.5 text-center text-xs font-medium text-white lg:block">
                {item?.unread_count}
              </p>
            )}

            {member?.status === "online" ? (
              <div className="absolute bottom-1.5 right-0 z-20">
                <Ellipse />
              </div>
            ) : null}
          </div>
          <a className="mt-1  flex-grow ">
            <div className=" break-all font-medium">{member?.user_handle}</div>
            <p className="break-all text-justify text-sm text-gray-500">
              {item?.last_message?.type === "post" ? (
                <p>Shared Post</p>
              ) : (
                <div>
                  {item?.last_message?.type === "image" ? (
                    <p>Shared Image</p>
                  ) : (
                    item?.last_message?.message
                  )}
                </div>
              )}
            </p>
          </a>
          <div className="mt-2.5 text-xs text-gray-500">
            {dayjs(item?.updated_at).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };
  const handleSearchUser = (keyword: any) => {
    getUserForConversation({
      query: {
        keyword,
      },
    }).then((res: any) => {
      setUserList(res?.data?.users);
    });
  };
  return (
    <div className=" flex h-[100%] justify-end border">
      <div className=" relative w-full">
        <div className="w-full">
          <div className="mt-8 flex justify-between gap-1 border-b pb-[2.3rem] lg:justify-start  lg:pl-2 2xl:pl-4">
            {tabs?.map((ite) => (
              <div
                key={ite?.id}
                onClick={() => router.push(`/messages/?tab=${ite?.name}`)}
                className={`cursor-pointer ${
                  tabName === ite?.name
                    ? "border-b border-primary-400 font-medium text-primary-400"
                    : ""
                } text-[16px]  font-[400] text-gray-500`}
              >
                <p className="px-1">{ite?.name}</p>
              </div>
            ))}
          </div>
          <div className=" relative  overflow-auto   ">
            {conversationUserList?.data?.data?.conversationList?.map(
              (item: any) => {
                return <div key={item._id}>{conversationCard(item)}</div>;
              }
            )}
          </div>
        </div>
        <div
          className="absolute bottom-5 w-full  "
          // onBlur={() => {
          //   setUserList([]);
          // }}
        >
          {/* {isSearchPopUp && ( */}
          <div
            style={{ maxHeight: "230px" }}
            className=" mx-3 cursor-pointer overflow-auto  bg-white px-1"
          >
            {userList?.length
              ? userList?.map((item: any) => (
                  <div
                    key={item?.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConversation(item);
                    }}
                    className="flex gap-4"
                  >
                    <div className="item-center relative my-2 h-[40px] w-[40px] gap-2">
                      {item?.avatar_url ? (
                        <Image
                          className="rounded-full"
                          src={item?.avatar_url}
                          // height="40"
                          // width=" 40"
                          layout="fill"
                          alt="Profile"
                        />
                      ) : (
                        <div className=" h-[40px] w-[40px]">
                          <Avatar name={item?.user_handle} />
                        </div>
                      )}
                    </div>
                    <p className="mt-3 ">{item?.user_handle}</p>
                  </div>
                ))
              : null}
          </div>
          {/* )} */}
          <div className="w-[90%] lg:w-[90%]">
            <input
              placeholder="Search user here..."
              style={{
                width: "100%",
              }}
              onFocus={() => {
                setIsSearchPopUp(true);
              }}
              onChange={(e: any) => {
                if (e.target.value) {
                  handleSearchUser(e.target.value);
                } else {
                  setUserList([]);
                }
              }}
              className={
                "border-1 mx-4 w-full rounded-md border bg-white px-1  text-lg  outline-none ring-0"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
