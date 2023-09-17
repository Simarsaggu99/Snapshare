import Button from "@/components/buttons/Button";
import { useGetSingleUser } from "@/hooks/user/query";
import { useFollowUser, useUnfollowUser } from "@/hooks/users/mutation";
import { useGetSuggestedFollowersList } from "@/hooks/users/query";
import { AddUserIcon } from "@/utils/AppIcons";
import { getFirstLetter } from "@/utils/common";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import advertisement from "~/images/advertisement.png";

interface suggestionFolowerList {
  data: any;
}

const Suggestion = () => {
  const router = useRouter();
  const { data: getSuggestedFollowersList }: suggestionFolowerList =
    useGetSuggestedFollowersList({});
  const followUser = useFollowUser();
  const userId = router.query.id;

  const [isFollow, setIsFollow] = useState<string[]>([]);
  const unfollowUser = useUnfollowUser();
  const getSingleUser: any = useGetSingleUser({
    pathParams: {
      id: userId,
    },
  });

  return (
    <div className="  block lg:flex lg:w-full">
      {/* <div className=" mx-0 mt-5 flex w-full justify-start xxxs:mx-2 xxs:mx-0  lg:w-[66%] lg:justify-end 2xl:w-[67%] "> */}
      {/* <div className="w-full rounded-md  bg-[#FFFFFF] p-5 shadow-md lg:w-[82%] 2xl:w-[80%]"> */}
      <div className="mx-2 mt-5 block  xs:mr-7 xs:ml-7 md:ml-12 md:mr-12 lg:mx-0 lg:flex lg:w-[66%]  lg:justify-end">
        <div className="w-full rounded-md  bg-[#FFFFFF] p-5 shadow-md lg:w-[83%]">
          <div className="">
            {getSuggestedFollowersList?.data?.length > 0 ? (
              <div className="">
                <div className="">
                  <div className="mb-2 flex justify-center bg-[#FFCFC2] text-xl">
                    <p className="cursor-pointer py-2 px-2  text-center	 font-medium text-[#FF5E34]">
                      Suggestions
                    </p>
                  </div>
                  <div className="mt-5 grid gap-10 xxxs:grid-cols-1  xxs:grid-cols-2   md:grid-cols-3 2xl:grid-cols-4">
                    {getSuggestedFollowersList?.data?.map(
                      (item: any, idx: number) => {
                        return (
                          <div
                            key={idx}
                            className="flex justify-center gap-5 xxs:m-[3px] xs:m-0 "
                          >
                            <div className="relative    mx-2 gap-5 space-y-2 bg-white shadow-lg">
                              <div className="flex justify-center ">
                                <Link href={`/profile/${item?._id}`}>
                                  {item?.avatar_url ? (
                                    <Image
                                      src={item?.avatar_url}
                                      style={{ borderRadius: "10px" }}
                                      alt="profile"
                                      // layout="fill"
                                      objectFit="cover"
                                      height={"152px"}
                                      width={"152px"}
                                    />
                                  ) : (
                                    <div className="flex  h-[150px] w-[150px] items-center  justify-center rounded-md bg-gray-200">
                                      {getFirstLetter(item?.user_handle)}
                                    </div>
                                  )}
                                </Link>
                              </div>
                              <Link href={`/profile/${item?._id}`}>
                                <div className="cursor-pointer text-center">
                                  {item?.user_handle}
                                </div>
                              </Link>
                              <div className="mx-1 flex justify-center">
                                {!isFollow?.includes(item?._id) ? (
                                  <Button
                                    className=" my-2 flex w-full justify-center gap-1 py-0.5 "
                                    onClick={() => {
                                      followUser
                                        .mutateAsync({
                                          pathParams: { userId: item?._id },
                                        })
                                        .then((res: any) => {
                                          // if (res?.message === "success") {
                                          //   getSingleUser.refetch();

                                          setIsFollow([...isFollow, item?._id]);
                                          // }
                                        });
                                    }}
                                  >
                                    <AddUserIcon fill={"white"} />
                                    Follow
                                  </Button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      unfollowUser
                                        .mutateAsync({
                                          pathParams: { userId },
                                        })
                                        .then((res: any) => {
                                          if (res?.message === "success") {
                                            getSingleUser.refetch();
                                            setIsFollow(
                                              isFollow.filter(
                                                (fil) => fil !== item?._id
                                              )
                                            );
                                          }
                                        });
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
                          </div>
                          // </SwiperSlide>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="  mt-5 hidden lg:block  lg:w-[30%] xl:m-10 ">
        <div className={`right-50 ${"fixed mx-8 w-[29%] 2xl:w-[20%]"} `}>
          <div
            className="roudned-lg overflow-hidden bg-white px-4 py-3 shadow-md "
            style={{ borderRadius: "10px" }}
          ></div>
        </div>
        {/* <Advertisement /> */}
      </div>
    </div>
  );
};

export default Suggestion;
