import Image from "next/image";
import React, { useEffect, useState } from "react";
import tree from "~/images/trees.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import Button from "@/components/buttons/Button";
import { AddUserIcon } from "@/utils/AppIcons";
import { useFollowUser, useUnfollowUser } from "@/hooks/users/mutation";
import { useRouter } from "next/router";
import { useGetSingleUser } from "@/hooks/user/query";
import { getFirstLetter } from "@/utils/common";
import Link from "next/link";
const SuggestFollowList = ({
  getSuggestedFollowersList,
  getSingleUser,
}: any) => {
  const router = useRouter();

  const followUser = useFollowUser();
  const userId = router.query.id;
  const [suggestedUserList, setSuggestedUserList] = useState([]);
  useEffect(() => {
    if (getSuggestedFollowersList?.data?.length > 0) {
      setSuggestedUserList(getSuggestedFollowersList?.data);
    }
  }, [getSuggestedFollowersList]);

  const [isFollow, setIsFollow] = useState<string[]>([]);
  const unfollowUser = useUnfollowUser();
  // const getSingleUser: any = useGetSingleUser({
  //   pathParams: {
  //     id: userId,
  //   },
  // });

  const feedCollection = [
    { id: 0, img: tree },
    { id: 1, img: tree },
    { id: 2, img: tree },
    { id: 3, img: tree },
    { id: 4, img: tree },
    { id: 5, img: tree },
    { id: 6, img: tree },
  ];

  return (
    <div className="">
      {suggestedUserList?.length > 0 ? (
        <div className="sticky top-16  my-5 w-full ">
          <div className=" rounded-[10px] bg-white px-4 py-2  pt-2.5 shadow-md ">
            <div className="mb-2 flex justify-between">
              <p className="cursor-pointer text-lg font-medium text-gray-500">
                Suggestions
              </p>
              <Link href={"/suggestion"}>
                <button className="cursor-pointer text-primary-600">
                  See all
                </button>
              </Link>
            </div>

            <Swiper
              slidesPerView={2}
              spaceBetween={5}
              //   autoplay={{
              //     delay: 2500,
              //     disableOnInteraction: false,
              //   }}
              slidesPerGroupSkip={4}
              grabCursor={true}
              //   keyboard={{
              //     enabled: true,
              //   }}
              //   modules={[Autoplay]}
              autoplay={false}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 3,
                },
                412: {
                  slidesPerView: 3,
                  spaceBetween: 5,
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 5,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 5,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 2,
                },
                1270: {
                  slidesPerView: 2,
                  spaceBetween: 2,
                },
                1536: {
                  slidesPerView: 3,
                  spaceBetween: 2,
                },
              }}
            >
              {suggestedUserList?.map((item: any, idx: number) => {
                return (
                  <SwiperSlide
                    key={item?._id}
                    className="flex justify-center gap-5  "
                  >
                    <div className="relative gap-5 space-y-2 bg-white shadow-lg">
                      <button className="flex cursor-pointer justify-center ">
                        <Link href={`/profile/${item?._id}`}>
                          {item?.avatar_url ? (
                            <div className="relative h-[120px] w-[110px] sm:h-[125px] sm:w-[125px]">
                              <Image
                                src={item?.avatar_url}
                                style={{ borderRadius: "10px" }}
                                alt="profile"
                                layout="fill"
                                objectFit="cover"
                                // height={"125px"}
                                // width={"125px"}
                              />
                            </div>
                          ) : (
                            <div className="flex  h-[120px] w-[110px] items-center justify-center rounded-md bg-gray-200 sm:h-[125px] sm:w-[125px]">
                              {getFirstLetter(item?.user_handle)}
                            </div>
                          )}
                        </Link>
                      </button>
                      <Link href={`/profile/${item?._id}`}>
                        <div
                          // style={{
                          //   whiteSpace: "nowrap",
                          //   width: "110px",
                          //   overflow: "hidden",
                          //   textOverflow: "ellipsis",
                          // }}
                          className=" w-[105px] cursor-pointer overflow-hidden text-ellipsis text-center text-[14px] font-semibold sm:w-[120px]"
                        >
                          {item?.user_handle}
                        </div>
                      </Link>
                      <div className="mx-1 flex justify-center">
                        {!isFollow?.includes(item?._id) ? (
                          <Button
                            className=" my-2 flex w-full justify-center gap-1 py-0.5 "
                            onClick={() => {
                              setIsFollow([...isFollow, item?._id]);
                              setSuggestedUserList(
                                suggestedUserList?.filter(
                                  (fil: any) => fil?._id !== item?._id
                                )
                              );
                              followUser
                                .mutateAsync({
                                  pathParams: { userId: item?._id },
                                })
                                .then((res: any) => {
                                  getSingleUser.refetch();
                                });
                            }}
                          >
                            <AddUserIcon fill={"white"} />
                            Follow
                          </Button>
                        ) : (
                          <button
                            onClick={() => {
                              getSingleUser.refetch();
                              setIsFollow(
                                isFollow.filter((fil) => fil !== item?._id)
                              );
                              unfollowUser
                                .mutateAsync({ pathParams: { userId } })
                                .then((res: any) => {});
                            }}
                            className="my-2 flex w-full items-center justify-center rounded-md border border-primary-700 bg-primary-600 px-2  py-1 text-sm text-white  hover:shadow-lg"
                          >
                            <div className="mx-1 text-primary-600">
                              <AddUserIcon fill={"white"} />
                            </div>
                            <span>Unfollow</span>
                          </button>
                        )}
                      </div>
                      {/* <Button
                          onClick={() => {}}
                          className=" my-2 flex w-full justify-center gap-1 py-0.5 "
                        >
                          <AddUserIcon fill={"white"} />
                          Follow
                        </Button> */}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestFollowList;
