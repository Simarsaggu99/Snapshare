import Button from "@/components/buttons/Button";
import {
  useBlockUser,
  useFollowUser,
  useUnblockUser,
  useUnfollowUser,
} from "@/hooks/users/mutation";
import { useGetSingleUser } from "@/hooks/users/query";
import { UnfollowUser } from "@/utils/AppIcons";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
SwiperCore.use([Navigation, Pagination, A11y]);
import profile from "~/images/UserProfile.webp";
import { conversationMedia } from "@/services/message";
import Avatar from "@/components/UIComponents/Avatar";
import Link from "next/link";

const UserData = ({ handle, user }: any) => {
  const router = useRouter();
  const conversationId = router.query.conversationId;
  const array = [
    {
      id: 1,
      img: profile,
    },
    {
      id: 2,
      img: profile,
    },
    {
      id: 2,
      img: profile,
    },
  ];
  
  const unblockUser = useUnblockUser();
  const blockUser = useBlockUser();
  const unfollowUser = useUnfollowUser();
  const followUser = useFollowUser();
  const userData = user?.data?.data;
  const [isFollow, setIsFollow] = useState("");
  const [mediaList, setMediaList] = useState([]);

  const [isBlockUser, setIsBlockUser] = useState("");
  useEffect(() => {
    setIsBlockUser(userData?.isblocked === false ? "UnBlock" : "Block");
    setIsFollow(userData?.isfollowing === false ? "Unfollow" : "Follow");
  }, [userData]);
  useEffect(() => {
    if (conversationId) {
      conversationMedia({
        pathParams: { conversationId },
      }).then((res: any) => {
        setMediaList(res?.getMedia);
      });
    }
  }, [conversationId]);

  return (
    <div className="relative h-full    border bg-white px-5 xxxs:hidden md:block">
      <div className="mt-2">
        {/* <Link href={`/profile/${userData?._id}`}> */}
        <div
          className="mt-5 flex cursor-pointer justify-center"
          onClick={() => {
            if (!userData?.isDeleted) {
              router.push(`/profile/${userData?._id}`);
            }
          }}
        >
          {userData?.avatar_url ? (
            <Image
              src={userData?.avatar_url}
              height={139}
              width={139}
              className=" rounded-full"
              objectFit="cover"
              alt="profile"
            />
          ) : (
            <div className="h-[139px] w-[139px] cursor-pointer">
              <Avatar name={userData?.user_handle} />
            </div>
          )}
        </div>
        {/* </Link> */}
        <div className="mt-3 flex justify-center">
          <div
            onClick={() => {
              if (!userData?.isDeleted) {
                router.push(`/profile/${userData?._id}`);
              }
            }}
            className="cursor-pointer"
          >
            {/* <Link href={`/profile/${userData?._id}`}> */}
            <div className=" break-all text-xl font-medium">
              {userData?.user_handle}
            </div>
            {/* </Link> */}
            <div className="text-center text-gray-400">{userData?.status}</div>
          </div>
        </div>
        <div className="my-4 px-2 ">
          <div>
            <p className="text-xl font-medium">Intro</p>
            <p className="break-words text-base text-gray-500">
              {userData?.bio}
            </p>
          </div>
          {/* <div>
            <p className="mt-8 mb-6 text-xl  font-medium ">
              {" "}
              Media and Collection
            </p> */}
          {/* to do add swiper  */}
          {/* <Swiper
              slidesPerView={4}
              spaceBetween={10}
              slidesPerGroupSkip={4}
              grabCursor={true}
              modules={[Autoplay]}
              style={{ zIndex: 0 }}
            >
              {mediaList?.map((ite: any) => (
                <SwiperSlide key={ite?._id}>
                  <Image
                    src={ite?.message}
                    alt="img"
                    height={150}
                    style={{ zIndex: 0 }}
                    width={200}
                    className="rounded-md"
                    objectFit="cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper> */}
          {/* <div className="mt-6">
              {isFollow === "Follow" ? (
                <Button
                  onClick={() => {
                    unfollowUser
                      .mutateAsync({
                        pathParams: {
                          userId: userData?._id,
                        },
                      })
                      .then((res) => {
                        setIsFollow("Unfollow");
                      });
                  }}
                  className="flex w-max justify-center"
                >
                  <UnfollowUser />{" "}
                  <p className="ml-2">
                    <span>Unfollow</span> {userData?.user_handle}
                  </p>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    followUser
                      .mutateAsync({
                        pathParams: {
                          userId: userData?._id,
                        },
                      })
                      .then((res) => {
                        setIsFollow("Follow");
                      });
                  }}
                  className="flex w-max justify-center"
                >
                  <UnfollowUser />{" "}
                  <p className="ml-2">
                    <span>Follow</span> {userData?.user_handle}
                  </p>
                </Button>
              )}
            </div> */}
          {/* </div> */}
          {!userData?.isDeleted && (
            <div className="absolute bottom-10 left-20">
              {isBlockUser === "UnBlock" ? (
                <button
                  onClick={() => {
                    blockUser
                      .mutateAsync({
                        pathParams: { userId: userData?._id },
                      })
                      .then((res: any) => {
                        if (res?.message === "success") {
                          setIsBlockUser("Block");
                          router.push("/messages?tab=All");
                        }
                      });
                  }}
                  className="w-44 break-words font-medium text-primary-500"
                >
                  Block <span className="ml-1 "> {userData?.user_handle}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    unblockUser
                      .mutateAsync({
                        pathParams: { userId: userData?._id },
                      })
                      .then((res: any) => {
                        if (res?.message === "success") {
                          setIsBlockUser("UnBlock");
                          window.location.reload();
                        }
                      });
                  }}
                  className="break-all text-primary-500"
                >
                  Unblock {userData?.user_handle}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserData;
