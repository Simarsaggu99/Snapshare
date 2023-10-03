import Image from "next/image";
import React, { useEffect, useRef, useState, version } from "react";
import tree from "~/images/trees.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import { useGetAllPost } from "@/hooks/post/query";
import Button from "@/components/buttons/Button";
import { AddUserIcon, RemoveUser } from "@/utils/AppIcons";
import { useGetUserFollower } from "@/hooks/user/query";
import { useRouter } from "next/router";
import Avatar from "@/components/UIComponents/Avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import { getUsersFollowers } from "@/services/user";
import {
  useFollowUser,
  useRemoveFollower,
  useUnfollowUser,
} from "@/hooks/users/mutation";
import Link from "next/link";
import { useAtom } from "jotai";
import { loggedInUser } from "@/store";
import { FollowbtnIcon } from "@/components/Icons";
import Spin from "@/components/UIComponents/Spin";
import { notifyError } from "@/components/UIComponents/Notification";
import DotsLoading from "@/components/DotsLoading";

interface FollowerProps {
  type: string;
  getSingleUser: any;
}
const FollowerList = ({ type, getSingleUser }: FollowerProps) => {
  const [followerList, setFollowerList] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const viewSize = 10;
  let firstStartIndex = 0;
  const router = useRouter();
  const userId = router.query.id;
  const [currentUser] = useAtom(loggedInUser);
  const unfollowUser = useUnfollowUser();
  const followUser = useFollowUser();
  const [totalFollowerCount, setTotalFollowerCount] = useState<any>();
  const dataFetchedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const removeFollower = useRemoveFollower();
  console.log(isLoading, "this is good");
  useEffect(() => {
    setIsLoading(true);
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    if (userId && followerList?.length <= 0) {
      getUsersFollowers({
        pathParams: { userId },
        query: {
          startIndex: firstStartIndex,
          viewSize,
          isFilterChangedOrStartIndexZero: firstStartIndex === 0,
        },
      }).then((res: any) => {
        if (res?.message === "success") {
          if (firstStartIndex !== 0) {
            setFollowerList([...followerList, ...res?.data?.data]);
          } else {
            setFollowerList(res?.data?.data);
          }
          setStartIndex((prev) => prev + viewSize);
          firstStartIndex += 10;
          setTotalFollowerCount(res?.data?.total);
          setIsLoading(false);
        }
      });
    }

    return () => {
      setStartIndex(0);
      setFollowerList([]);
      dataFetchedRef.current = false;
    };
  }, [userId]);

  const getFollower = () => {
    getUsersFollowers({
      pathParams: { userId },
      query: {
        viewSize,
        startIndex,
        isFilterChangedOrStartIndexZero: startIndex === 0,
      },
    }).then((res: any) => {
      if (res?.message === "success") {
        if (startIndex) {
          setFollowerList([...followerList, ...res?.data?.data]);
        } else {
          setFollowerList(res?.data?.data);
        }
        setStartIndex((prev) => prev + viewSize);
        setTotalFollowerCount(res?.data?.total);
      }
    });
  };
  const removeFollwer = (id: any) => {
    setFollowerList(followerList?.filter((fil: any) => fil?._id !== id));
    setTotalFollowerCount(
      totalFollowerCount === 0 ? 0 : totalFollowerCount - 1
    );
    removeFollower
      .mutateAsync({
        pathParams: { id: id },
      })
      .then((res: any) => {})
      .catch((er) => {
        notifyError({
          message: "OPPS something went wrong. while unfollow user!",
        });
      });
  };

  return (
    <div>
      <div className=" mt-5 w-full">
        <div className=" h-full rounded-md bg-white px-2  py-2 pt-2.5  shadow-md">
          <div className="mb-2  flex justify-center rounded-md bg-primary-200">
            <p className="py-2 text-center text-lg  text-primary-600">
              FOLLOWERS {totalFollowerCount}
            </p>
          </div>

          {isLoading ? (
            <div className="relative flex h-[450px] items-center justify-center">
              <DotsLoading />
            </div>
          ) : followerList?.length > 0 ? (
            <div
              id="scrollableDiv"
              style={{
                overflow: "auto",
                
                height: "450px",
                background: "white",
                borderRadius: "10px",
              }}
            >
              <InfiniteScroll
                className="grid grid-cols-1 gap-3  md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2"
                dataLength={followerList?.length}
                next={getFollower}
                hasMore={followerList?.length < totalFollowerCount}
                loader={
                  <h4
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      top: 170,
                      right: "44%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <p>Loading...</p>
                  </h4>
                }
                
                scrollableTarget="scrollableDiv"
              >
                {followerList?.map((item: any) => (
                  <div
                    key={item?._id}
                    className="flex  justify-start gap-2 rounded-md  border p-3"
                  >
                    <div className=" flex cursor-pointer items-center">
                      <Link href={`/profile/${item?._id}`}>
                        {item?.avatar_url ? (
                          <Image
                            className="rounded-full"
                            src={item?.avatar_url}
                            height={60}
                            width={60}
                            alt="follower"
                            objectFit="cover"
                          />
                        ) : (
                          <div className="h-[60px] w-[60px] text-sm">
                            <Avatar name={item?.user_handle} />
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="mt-3 ">
                      <Link href={`/profile/${item?._id}`}>
                        <p className="w-32 cursor-pointer overflow-hidden text-ellipsis xs:w-full 2xl:w-32">
                          {item?.user_handle}
                        </p>
                      </Link>
                      {userId === currentUser?.data?._id ? (
                        <div className=" w-[100%]">
                          {/* <p className="w-fit">{item?.name}</p> */}
                          {type === "Followers" ? (
                            <button
                              onClick={() => {
                                removeFollwer(item?._id);
                              }}
                              className=" mt-2 h-8 w-24 rounded-lg border  border-primary-600  py-1.5  text-sm text-primary-600"
                            >
                              Remove
                            </button>
                          ) : (
                            <button className="mt-2  h-8 w-24  rounded-lg border  border-primary-600  py-1.5 px-2 text-sm font-medium text-primary-600">
                              <div className="flex gap-2">
                                <div className="mt-1">
                                  <RemoveUser />
                                </div>
                                <span> Unfollow </span>
                              </div>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          {item?._id !== currentUser?.data?._id && (
                            <div>
                              {item?.is_following === true ? (
                                <div>
                                  <button
                                    className="mt-2 h-8 w-24  rounded-md border  border-primary-600  py-1.5  text-sm font-medium text-primary-600"
                                    onClick={() => {
                                      setFollowerList(
                                        followerList?.map((val) => {
                                          return val?._id === item?._id
                                            ? {
                                                ...val,
                                                is_following: false,
                                              }
                                            : { ...val };
                                        })
                                      );
                                      unfollowUser
                                        .mutateAsync({
                                          pathParams: { userId: item?._id },
                                        })
                                        .then((res) => {})
                                        .catch((err) => {
                                          notifyError({
                                            message:
                                              "OPPS someting went wrong. while unfollow user ",
                                          });
                                        });
                                    }}
                                  >
                                    <div className="flex items-center justify-center px-3">
                                      <AddUserIcon fill={"#EA4115"} />
                                      <span> Unfollow </span>
                                    </div>
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  className=" mt-2  h-8 w-24 py-0.5 "
                                  onClick={() => {
                                    setFollowerList(
                                      followerList?.map((val) => {
                                        return val?._id === item?._id
                                          ? {
                                              ...val,
                                              is_following: true,
                                            }
                                          : { ...val };
                                      })
                                    );
                                    followUser
                                      .mutateAsync({
                                        pathParams: { userId: item?._id },
                                      })
                                      .then((res) => {
                                        getSingleUser.refetch();
                                      })
                                      .catch((err) => {
                                        notifyError({
                                          message:
                                            "OPPS someting went wrong. while follow user ",
                                        });
                                      });
                                  }}
                                >
                                  <div className="flex w-full items-center justify-center ">
                                    <div>
                                      <AddUserIcon fill={"white"} />
                                    </div>
                                    <span className=""> Follow</span>
                                  </div>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500">
              No follower found yet!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowerList;
