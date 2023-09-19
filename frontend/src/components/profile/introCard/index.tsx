import { loggedInUser } from "@/store";
import { FileIcon, LockIcon, UnlockIcon } from "@/utils/AppIcons";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import SuggestFollowList from "../suggestFollowList";
import { useUserCrux } from "@/hooks/common/query";


const IntroCard = ({ introProps }: any) => {
  const { getSingleUser, getSuggestedFollowersList } = introProps;
  const [currentUser] = useAtom(loggedInUser);
  const { data: crux, refetch }: any = useUserCrux();

  const cruxArray = [
    {
      id: 1,
      title: "Crux :1",
      des: "Complete profile ",
    },
    {
      id: 2,
      title: "Crux :2",
      des: "Publish 10 posts",
    },
    {
      id: 3,
      title: "Crux :3",
      des: "Achieve 25 followers ",
    },
    {
      id: 4,
      title: "Crux :4",
      des: "Achieve total 500 views on post",
    },
    {
      id: 5,
      title: "Crux :5",
      des: "Achieve 100 followers",
    },
    {
      id: 6,
      title: "Crux :6",
      des: "Achieve total 2500  views on post",
    },
    {
      id: 7,
      title: "Crux :7",
      des: "Achieve 500 follower",
    },
    {
      id: 8,
      title: "Crux :8",
      des: "Achieve total 25,000  views on post",
    },
    {
      id: 9,
      title: "Crux :9",
      des: "Publish 500 posts",
    },
    {
      id: 10,
      title: "Crux :10",
      des: "Achieve total 100,000  views on post",
    },
    {
      id: 11,
      title: "Crux :11",
      des: "Achieve  1000 followers",
    },
    {
      id: 12,
      title: "Crux :12",
      des: "Achieve total 1M  views on post",
    },
    {
      id: 13,
      title: "Crux :13",
      des: "Achieve 25,000 followers",
    },
    {
      id: 14,
      title: "Crux :14",
      des: "Achieve 10M views on post",
    },
    {
      id: 15,
      title: "Crux :15",
      des: "Achieve 1M followers",
    },
  ];
  const otherUserCrux =
    getSingleUser?.data?.data?.cruxLevel > 0
      ? cruxArray?.find(
          (fil) => fil?.id === getSingleUser?.data?.data?.cruxLevel
        )
      : null;
  useEffect(() => {
    refetch();
  }, [getSingleUser?.data, currentUser]);

  return (
    <div className=" static space-y-3 lg:sticky  lg:-top-44 ">
      <div
        className="  rounded-md bg-white p-2 "
        style={{
          boxShadow: "0px 4px 10px rgba(104, 104, 104, 0.1)",
        }}
      >
        <div className="w-full rounded-md bg-primary-200 p-0.5 ">
          <p className="py-1.5 text-center text-lg font-medium text-primary-600">
            Intro
          </p>
        </div>
        <div className="my-5 space-y-5 px-5 xl:text-sm 2xl:text-base">
          {/* <div className="flex  gap-2">
            <div className=" h-max rounded-full bg-black p-1.5 ">
              <UserIcon />
            </div>
            <p className="font-[400] ">
              User Name :
              <span className="break-word  ml-1 w-20 text-justify  font-medium">
                {getSingleUser?.data?.data?.user_handle}
              </span>
            </p>
          </div> */}
          <div className="flex  gap-2">
            <div>
              {/* <div className="h-max w-max rounded-full bg-black p-1.5">
                <FileIcon />
              </div> */}
            </div>
            {getSingleUser?.data?.data?.bio ? (
              <p className="mt-1.5 w-full break-all text-justify">
                {getSingleUser?.data?.data?.bio}
              </p>
            ) : (
              <p className="mt-0.5"> I&apos;m here for the sake of memes</p>
            )}
          </div>
          {/* <div className="flex w-max gap-2">
            <div className="rounded-full bg-black p-1.5">
              <GenderIcon />
            </div>
            <p>
              Gender :<span>{getSingleUser?.data?.data?.gender}</span>
            </p>
          </div> */}
          {/* <div className="flex w-max gap-2">
            <div className="rounded-full bg-black p-1.5">
              <BirthdayIcon />
            </div>
            <p>
              Date of Birth :
              <span>
                {dayjs(getSingleUser?.data?.data?.dob).format("DD-MMMM-YYYY")}
              </span>
            </p>
          </div> */}
          {/* <div className=" flex gap-2">
            <div className="h-max rounded-full bg-black p-1.5">
              <Location />
            </div>
            <p className="">
              Locaiton :
              <span className="break-word w-20">
                {/* {getSingleUser?.data?.data?.state}, */}
          {/* {getSingleUser?.data?.data?.country} */}
          {/* </span> */}
          {/* </p> */}
          {/* </div> */}
        </div>
      </div>
 
    </div>
  );
};


export default IntroCard;
