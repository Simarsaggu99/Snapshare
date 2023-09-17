import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import Button from "@/components/buttons/Button";
import { AddUserIcon, RemoveUser } from "@/utils/AppIcons";
import { useRouter } from "next/router";
import { useFollowUser, useUnfollowUser } from "@/hooks/users/mutation";
import Avatar from "@/components/UIComponents/Avatar";
import Link from "next/link";
import { useAtom } from "jotai";
import { loggedInUser } from "@/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { getFollowingList } from "@/services/users";
import Spin from "@/components/UIComponents/Spin";
import { notifyError } from "@/components/UIComponents/Notification";
import DotsLoading from "@/components/DotsLoading";

interface FollowerProps {
  getSingleUser: any;
}
interface following {
  data: any[];
}
const FollowingList = ({ getSingleUser }: FollowerProps) => {
  const router = useRouter();
  const userId = router.query.id;
  const [currentUser] = useAtom(loggedInUser);
  const [startIndex, setStartIndex] = useState(0);
  const [followingListDetails, setFollowingListDetails] = useState<any[]>([]);
  const [totalFollowingCount, setTotalFollowingCount] = useState<any>();
  // This state used for hold id to show loading on particular button
  const [isLoadingId, setIsLoadingId] = useState<string[]>([]);
  const [fetchFollowerLoading, setFetchFollowerLoading] = useState(false);
  const viewSize = 10;
  let firstStartIndex = 0;
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    console.log("hiii");

    // if (dataFetchedRef.current) return;
    setFetchFollowerLoading(true);
    // dataFetchedRef.current = true;

    if (userId) {
      getFollowingList({
        pathParams: { userId },
        query: {
          startIndex: firstStartIndex,
          viewSize,
          isFilterChangedOrStartIndexZero: firstStartIndex === 0,
        },
      }).then((res: any) => {
        console.log("run hoo gya");
        if (firstStartIndex !== 0) {
          setFollowingListDetails([
            ...followingListDetails,
            ...res?.data?.data,
          ]);
          setStartIndex((prev) => prev + viewSize);
        } else {
          setFollowingListDetails(res?.data?.data);
          setStartIndex((prev) => prev + viewSize);
        }
        firstStartIndex = firstStartIndex + 10;
        setTotalFollowingCount(res?.data?.total);
        setFetchFollowerLoading(false);
      });
    }

    return () => {
      setStartIndex(0);
      setFollowingListDetails([]);
      setTotalFollowingCount(0);
      dataFetchedRef.current = false;
    };
  }, []);
  const getFollowing = () => {
    getFollowingList({
      pathParams: { userId },
      query: {
        viewSize,
        startIndex,
        isFilterChangedOrStartIndexZero: startIndex === 0,
      },
    }).then((res: any) => {
      if (startIndex) {
        setFollowingListDetails([...followingListDetails, ...res?.data?.data]);
      } else {
        setFollowingListDetails(res?.data?.data);
      }
      setStartIndex((prev) => prev + viewSize);
      setTotalFollowingCount(res?.data?.total);
    });
  };

  return (
    <div className="h-full">
      <div className=" mt-5 w-full">
        <div className="relative h-full overflow-auto rounded-md bg-white px-2 py-2 pt-2.5 shadow-md">
          <div className="mb-2  flex justify-center rounded-md bg-primary-200">
            <p className="py-2 text-center text-lg  text-primary-600">
              FOLLOWING {totalFollowingCount}
            </p>
          </div>

          {/* <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"> */}

          {fetchFollowerLoading ? (
            <div className="flex h-[450px] items-center justify-center">
              <DotsLoading />
            </div>
          ) : followingListDetails?.length > 0 ? (
            <div
              id="scrollableDiv"
              style={{
                overflow: "auto",
                // minHeight: "360px",
                height: "430px",
                background: "white",
                borderRadius: "10px",
              }}
            >
              <InfiniteScroll
                className="grid grid-cols-1 gap-3 overflow-auto  md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2"
                dataLength={followingListDetails?.length}
                next={getFollowing}
                hasMore={followingListDetails?.length < totalFollowingCount}
                loader={
                  <h4
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      bottom: 5,
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
                {followingListDetails?.map((item: any) => (
                  <div
                    key={item?._id}
                    className="flex  w-full justify-start gap-4 rounded-md  border p-2"
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
                          <div className="h-[60px] w-[60px] text-sm ">
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
                      {item?._id !== currentUser?.data?._id && (
                        <div>
                          {item?.is_following === true ? (
                            <button
                              onClick={() => {
                                setFollowingListDetails(
                                  followingListDetails?.map((val) => {
                                    return val?._id === item?._id
                                      ? {
                                          ...val,
                                          is_following: false,
                                        }
                                      : { ...val };
                                  })
                                );
                                // setIsLoadingId([...isLoadingId, item?._id]);
                                // if (
                                //   !(
                                //     unfollowUser.isLoading &&
                                //     isLoadingId.includes(item?._id)
                                //   )
                                // ) {
                                unfollowUser
                                  .mutateAsync({
                                    pathParams: { userId: item?._id },
                                  })
                                  .then((res) => {
                                    getSingleUser.refetch();
                                    // usersFollowingList.refetch();
                                    // setFollowingListDetails(
                                    //   followingListDetails?.map((val) => {
                                    //     return val?._id === item?._id
                                    //       ? {
                                    //           ...val,
                                    //           is_following: false,
                                    //         }
                                    //       : { ...val };
                                    //   })
                                    // );
                                    // setFollowingListDetails(
                                    //   followingListDetails?.filter(
                                    //     (val) => val?._id !== item?._id
                                    //   )
                                    // );
                                    // setFollowingListDetails(
                                    //   followingListDetails?.map((val) => {
                                    //     return val?._id === item?._id
                                    //       ? {
                                    //           ...val,
                                    //           is_following: false,
                                    //         }
                                    //       : { ...val };
                                    //   })
                                    // );
                                  })
                                  .catch((er) => {
                                    notifyError({
                                      message:
                                        "OPPS someting went wrong. while unfollow user try again!",
                                    });
                                  });
                                // }
                              }}
                              className="mt-2 h-8 w-24 rounded border border-primary-600  px-2  py-1.5 text-sm font-medium  text-primary-600  2xl:px-10"
                            >
                              <div className="flex justify-center gap-1">
                                {/* {unfollowUser.isLoading &&
                                isLoadingId.includes(item?._id) ? (
                                  <Spin />
                                ) : ( */}

                                <div className="mt-1">
                                  <RemoveUser />
                                </div>
                                <span>Unfollow</span>

                                {/* )} */}
                              </div>
                            </button>
                          ) : (
                            <Button
                              className=" mt-2 flex h-8 w-24 justify-center py-0.5 "
                              onClick={() => {
                                setFollowingListDetails(
                                  followingListDetails?.map((val) => {
                                    return val?._id === item?._id
                                      ? {
                                          ...val,
                                          is_following: true,
                                        }
                                      : { ...val };
                                  })
                                );
                                // if (!followUser.isLoading) {
                                followUser
                                  .mutateAsync({
                                    pathParams: { userId: item?._id },
                                  })
                                  .then((res) => {
                                    getSingleUser.refetch();

                                    // setFollowingListDetails(
                                    //   followingListDetails?.map((val) => {
                                    //     return val?._id === item?._id
                                    //       ? {
                                    //           ...val,
                                    //           is_following: true,
                                    //         }
                                    //       : { ...val };
                                    //   })
                                    // );
                                  })
                                  .catch((err) => {
                                    notifyError({
                                      message:
                                        "OPPS someting went wrong. while follow user!",
                                    });
                                  });
                                // }
                              }}
                            >
                              {/* {followUser.isLoading &&
                              isLoadingId === item?._id ? (
                                <Spin color={"white"} />
                              ) : ( */}
                              <div className="flex w-full items-center justify-center ">
                                <div>
                                  <AddUserIcon fill={"white"} size={14} />
                                </div>
                                <span className="text-sm">Follow</span>
                              </div>
                              {/* )} */}
                            </Button>
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
              No following found yet!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingList;
