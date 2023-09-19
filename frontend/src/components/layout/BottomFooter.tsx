import { loggedInUser } from "@/store";
import { HomeIcon } from "@/utils/AppIcons";
import { getFirstLetter } from "@/utils/common";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AddPost from "../addPost";
import { CreatePost, HeaderMessageIcon, NotificationIcon } from "../Icons";
import { useCheckTodayPostCount } from "@/hooks/post/query";
import { notifyError } from "../UIComponents/Notification";

const BottomFooter = () => {
  const [isAddPost, setIsAddPost] = useState(false);
  const [currentUser] = useAtom(loggedInUser);
  const addPostProps = {
    isAddPost,
    setIsAddPost,
  };
  const checkTodayPostCount: any = useCheckTodayPostCount({
    currentUser,
  });
  return (
    <div className="fixed bottom-0 z-10 block w-full rounded-t-md  shadow-md lg:hidden ">
      <div className="flex w-[100%] justify-between gap-1 rounded-t-3xl bg-[#2D2525] py-2 px-1">
        
        <div>
          <Link href={`/`}>
            <button className="rounded-full bg-[#564C4C]  p-2.5">
              <HomeIcon />
            </button>
          </Link>
        </div>
        <div>
          <Link href={`/notifications`}>
            <button className="relative rounded-full bg-[#564C4C] p-2.5">
              <NotificationIcon />
              {currentUser?.data?.notificationCount > 0 && (
                <p className="item-center absolute -top-1 -right-1.5   w-6 rounded-full bg-red-500 py-0.5 text-center text-xs font-medium text-white ">
                  {currentUser?.data?.notificationCount}
                </p>
              )}
            </button>
          </Link>
        </div>
        <div className="">
          
          <button
            onClick={() => {
              if (checkTodayPostCount?.data?.postCount === 0) {
                return notifyError({
                  message: "You already posted 10 posts!",
                });
              }
              setIsAddPost(true);
            }}
            className="relative  mx-2  flex items-center gap-3 rounded-full bg-primary-600 py-1 pr-5 pl-2 "
          >
            <div className=" rounded-full bg-primary-400 px-2 py-2 pb-1 pl-3 ">
              <CreatePost />{" "}
            </div>
            <p className="  text-white">{`${
              checkTodayPostCount?.data?.postCount || 0
            }/10`}</p>
          </button>
        </div>
        <div>
          <Link href={`/messages?tab=All`}>
            <button className="relative rounded-full bg-[#564C4C] p-2.5 ">
              <HeaderMessageIcon />
              {currentUser?.data?.messageCount > 0 && (
                <p className="item-center absolute top-0 right-0 hidden w-6 rounded-full   bg-red-500 py-0.5 text-center text-xs font-medium text-white lg:block">
                  {currentUser?.data?.messageCount}
                </p>
              )}
            </button>
          </Link>
        </div>
        <div className="">
          {" "}
          <Link href={`/profile/${currentUser?.data?._id}`}>
            {currentUser?.data?.avatar_url ? (
              <Image
                src={currentUser?.data?.avatar_url}
                alt="profile"
                height={40}
                width={40}
                className="rounded-full "
                objectFit="cover"
              />
            ) : (
              <div className="h-[40px] w-[40px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-600 text-white">
                  {getFirstLetter(currentUser?.data?.user_handle)}
                </div>
              </div>
            )}
          </Link>
          
        </div>
      </div>
      <AddPost postProps={addPostProps} />
    </div>
  );
};

export default BottomFooter;
