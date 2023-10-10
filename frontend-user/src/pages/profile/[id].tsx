import Advertisement from "@/components/advertisement";
import Button from "@/components/buttons/Button";
import FollowerList from "@/components/profile/followerList";
import IntroCard from "@/components/profile/introCard";
import SinglePostCard from "@/components/singlePostCard";
import { useGetAllPost, useGetSingleUserPost } from "@/hooks/post/query";
import { useDeleteCover, useUpdateProfile } from "@/hooks/user/mutation";
import { useGetSingleUser } from "@/hooks/user/query";
import { RiAlarmWarningFill } from "react-icons/ri";

import ArrowLink from "@/components/links/ArrowLink";
import {
  useBlockUser,
  useFollowUser,
  useUnblockUser,
  useUnfollowUser,
} from "@/hooks/users/mutation";
import { allPostsData, loggedInUser } from "@/store";

import { ThreeDotsIcon } from "@/utils/AppIcons";
import { useAtom } from "jotai";
import Router, { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import FollowingList from "@/components/profile/followingList";

import {
  checkIfConversationExists,
  createConversation,
} from "@/services/message";
import { EditProfileIcon } from "@/components/Icons";
import Popover from "@/components/UIComponents/Popover";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileAndCoverImage from "@/components/profile/CoverImage";
import ProfileImage from "@/components/profile/profileImage";
import { useGetSuggestedFollowersList } from "@/hooks/users/query";
import { currentUser as getCurrentUser } from "@/services/user/index";
import DotsLoading from "@/components/DotsLoading";
import { notifyError } from "@/components/UIComponents/Notification";
import Spin from "@/components/UIComponents/Spin";
import { flatten } from "lodash";

const Profile = () => {
  const [profilePic, setProfilePic] = useState<any>();
  const [coverImage, setCoverImage] = useState<any>();
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [isUserModal, setIsUserModal] = useState(false);
  const updateProfile = useUpdateProfile();
  const [isFollow, setIsFollow] = useState("");
  const [isBlock, setIsBlock] = useState("");
  const [menuPopUp, setMenuPopUp] = useState<boolean>(false);
  const [tabs, setTabs] = useState<string>("Timeline");
  const unfollowUser = useUnfollowUser();
  const unBlockUser = useUnblockUser();
  const blockUser = useBlockUser();
  const userRef = React.useRef<HTMLButtonElement>(null);
  const openCover = React.useRef<HTMLButtonElement | any>(undefined);
  const router = useRouter();
  const [isUserFound, setIsUserFound] = useState(false);
  const userId = router.query.id;
  const deleteCover = useDeleteCover();
  const [calculateAge, setcalculateAge] = useState<number>();
  const [currentPage, setCurrentPage] = useState(0);
  const [Posts, setPosts] = useState<any>([]);
  const [allPosts, setAllPosts] = useAtom(allPostsData);

  const [startIndex, setStartIndex] = useState(0);
  const getSingleUser: any = useGetSingleUser({
    pathParams: {
      id: userId,
    },
    error: isUserFound,
  });
  const getPosts: any = useGetSingleUserPost({
    user: userId,
    filterBy: "Latest",
    startIndex,
  });
  const [hasMorePost, setHasMorePost] = useState(true);
  const { data: getSuggestedFollowersList, refetch }: any =
    useGetSuggestedFollowersList({
      query: { user: userId },
    });
  useEffect(() => {
    setPosts([]);
    setTabs("Timeline");
    setHasMorePost(true);
    setCurrentPage(0);
  }, [userId]);

  const followUser = useFollowUser();
  useEffect(() => {
    setCoverImage({
      url:
        currentUser?.data?._id === userId ? currentUser?.data?.cover_url : "",
    });
    setProfilePic({
      url:
        currentUser?.data?._id === userId ? currentUser?.data?.avatar_url : "",
    });
    setHasMorePost(true);
    setCurrentPage(0);
  }, [currentUser, userId]);

  const onUploadProfile = (e: any) => {
    const file = e?.target?.files?.[0];
    if (e?.target?.files?.[0]) {
      const url = { url: URL.createObjectURL(file || "") };
      const contentData = Object.assign(file, url);
      setProfilePic(contentData || {});

      const formData = new FormData();
      formData.append("file", contentData || {});

      updateProfile
        .mutateAsync({
          body: formData,
        })
        .then((res) => {
          getCurrentUser()
            .then((res: any) => {
              setCurrentUser(res);
              window.localStorage.setItem(
                "currentUser",
                JSON.stringify(res?.data)
              );
            })
            .catch((err) => {
              if (err?.response?.data?.error?.message?.includes("expired")) {
                window.localStorage.clear();
              }
            });
        });
    }
  };

  if (getSingleUser.isError) {
    setIsUserFound(getSingleUser.isError);
    notifyError({
      message: "!opps something went wrong please try again",
    });
  }
  useEffect(() => {
    setIsFollow(getSingleUser?.data?.data?.isfollowing ? "follow" : "unfollow");
    setIsBlock(getSingleUser?.data?.data?.isblocked ? "unblock" : "block");
  }, [getSingleUser]);
  const handleConversation = (user: any) => {
    checkIfConversationExists({
      sender: user._id,
      receiver: currentUser?.data?._id,
    }).then((res: any) => {
      if (res?.data?.exists) {
        router.push(`/messages/${res?.data?.conversation_id}?tab=All`);
      } else if (!res?.data?.exists) {
        createConversation({
          body: {
            usersList: [user._id, currentUser?.data?._id],
            type: "single",
          },
        }).then((res: any) => {
          router.push(`/messages/${res.data._id}?tab=All`);
        });
      }
    });
  };
  const introProps = {
    getSingleUser,
    getSuggestedFollowersList,
  };
  const postProps = {
    getPosts,
    isProfileOpen: true,
    // setStartIndex,
    currentPage,
    setCurrentPage,
    // startIndex,
    setPosts,
    Posts,
    user: userId,
    hasMorePost,
    getSingleUser,
  };
  const modalProps = {
    setIsUserModal: setIsUserModal,
    isUserModal: isUserModal,
    getSingleUser,
    profilePic,
    onUploadProfile,
    getPosts,
  };
  const coverImageProps = {
    coverImage,
    getSingleUser,
    openCover,
    deleteCover,
    setCoverImage,
  };
  const profileImageProps = {
    getSingleUser,
    profilePic,
    currentUser,
    setProfilePic,
    onUploadProfile,
  };

  useEffect(() => {
    if (getSingleUser?.data?.data?.dob) {
      let dateOfBirth = getSingleUser?.data?.data?.dob;
      let dt = new Date();
      let diff = dt.getTime() - new Date(dateOfBirth).getTime();
      let calculation = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      if (Number.isNaN(calculation)) {
        setcalculateAge(0);
      } else {
        setcalculateAge(calculation);
      }
    }
  }, [getSingleUser]);
  useEffect(() => {
    const allPosts: any = flatten(
      getPosts?.data?.pages?.map((page: any, pageNumber: any) =>
        page?.data?.Posts?.map((data: any) => ({ ...data, pageNumber }))
      )
    );

    // const totalPostLength = getPosts?.data?.pages?.[
    //   currentPage
    // ]?.data?.Posts?.filter((fil: any) => fil?.ad !== true).length;
    if (allPosts?.length) {
      setStartIndex(6);
    }
    setHasMorePost(
      getPosts?.data?.pages?.[currentPage]?.data?.total_count > Posts?.length
    );
    setPosts(allPosts);
  }, [getPosts?.data?.pages]);
  return getSingleUser?.isLoading && !getSingleUser.isError ? (
    <div className="">
      {isUserFound ? (
        <main>
          <section className="bg-white">
            <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-black">
              <RiAlarmWarningFill
                size={60}
                className="drop-shadow-glow animate-flicker text-red-500"
              />
              <h1 className="mt-8 text-4xl md:text-6xl">Page Not Found</h1>
              <ArrowLink className="mt-4 md:text-lg" href="/">
                Back to Home
              </ArrowLink>
            </div>
          </section>
        </main>
      ) : (
        <DotsLoading />
      )}
    </div>
  ) : (
    <div className=" relative -mt-3 w-[100%] md:mt-0">
      <div className=" w-full">
        <div className=" w-full bg-white ">
          <div className="relative ">
            <ProfileAndCoverImage coverImageProps={coverImageProps} />

            <div className=" flex  flex-wrap items-center justify-between  ">
              <div className="flex  w-[93%] md:w-[70%] lg:w-[80%]  ">
                <div className=" w-[36%]  xs:w-[25%] sm:w-[30%] md:w-[39%] lg:w-[30%] xl:w-[38%]"></div>
                <ProfileImage profileProps={profileImageProps} />
                <div className=" xxl:right-12  relative right-2 w-max items-center space-y-1  py-2  xs:right-1 md:right-2 2xl:right-12">
                  <p className="text-[500] mt-1  font-semibold text-gray-500 sm:text-lg md:text-xl ">
                    {getSingleUser?.data?.data?.user_handle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {calculateAge !== 0 && (
                      <p className=" text-xs text-gray-500 ">{calculateAge}</p>
                    )}
                    <p className=" text-xs text-gray-500 ">
                      {getSingleUser?.data?.data?.gender || ""}
                    </p>

                    <p className=" text-xs   text-gray-500   ">
                      {getSingleUser?.data?.data?.country || ""}
                    </p>
                  </div>
                </div>
              </div>
              {currentUser?.data?._id === getSingleUser?.data?.data?._id && (
                <div className="mr-3 md:hidden ">
                  <button
                    ref={userRef}
                    onClick={() => {
                      setMenuPopUp(!menuPopUp);
                    }}
                  >
                    {" "}
                    <ThreeDotsIcon />
                  </button>
                  <Popover
                    isVisible={menuPopUp}
                    userRef={userRef}
                    onclose={setMenuPopUp}
                    className={"z-20"}
                  >
                    {" "}
                    <div className="menu">
                      <div className="h-full  py-2">
                        <ul>
                          <li className="border-b px-5 pb-2 text-primary-600">
                            <a
                              onClick={() => {
                                setMenuPopUp(false);
                                setIsUserModal(true);
                              }}
                              className="link"
                            >
                              Edit Profile
                            </a>
                          </li>
                          <li className="mt-1 border-b px-5 pb-2 text-primary-600">
                            <a
                              onClick={() => {
                                deleteCover.mutateAsync().then(() => {
                                  setMenuPopUp(false);
                                });
                              }}
                              className="link"
                            >
                              Remove cover image
                            </a>
                          </li>
                          <li className="mt-1 border-b px-5 pb-2 text-primary-600">
                            <a
                              onClick={() => {
                                openCover.current?.click();
                                setMenuPopUp(false);
                              }}
                              className="link"
                            >
                              <label htmlFor="cover_img">
                                Edit cover image
                              </label>
                            </a>
                          </li>
                          {currentUser?.data?._id !==
                            getSingleUser?.data?.data?._id && (
                            <li>
                              <div className=" mt-1 px-5 text-primary-600">
                                {isBlock === "unblock" ? (
                                  <button
                                    onClick={() => {
                                      unBlockUser
                                        .mutateAsync({
                                          pathParams: { userId },
                                        })
                                        .then((res: any) => {
                                          setIsBlock("block");
                                          getSingleUser.refetch();
                                        });
                                    }}
                                  >
                                    UnBlock{" "}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      blockUser
                                        .mutateAsync({
                                          pathParams: {
                                            userId,
                                          },
                                        })
                                        .then((res: any) => {
                                          setIsBlock("unblock");
                                          getSingleUser.refetch();
                                        });
                                    }}
                                  >
                                    Block{" "}
                                  </button>
                                )}
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Popover>
                </div>
              )}
              {/* new three dots */}
              {/* {currentUser?.data?._id !== getSingleUser?.data?.data?._id && (
                <div className=" md:hidden">
                  <button
                    ref={userRef}
                    onClick={() => {
                      setMenuPopUp(!menuPopUp);
                    }}
                  >
                    {" "}
                    <ThreeDotsIcon />
                  </button>
                  <Popover
                    isVisible={menuPopUp}
                    userRef={userRef}
                    onclose={setMenuPopUp}
                    className={"z-20"}
                  >
                    {" "}
                    <div className="menu">
                      <div className="h-full  py-2">
                        <ul>
                          <li className=" border-b px-5 pb-2 text-primary-600">
                            {isFollow === "unfollow" ? (
                              <a
                                className=" flex justify-center"
                                onClick={() => {
                                  if (!followUser.isLoading) {
                                    followUser
                                      .mutateAsync({ pathParams: { userId } })
                                      .then((res: any) => {
                                        if (res?.message === "success") {
                                          getSingleUser.refetch();
                                          setIsFollow("unfollow");
                                          refetch();
                                        }
                                      });
                                  }
                                }}
                              >
                                {followUser.isLoading ||
                                getSingleUser.isLoading ? (
                                  <div className="flex justify-center">
                                    <Spin color={"primary-600"} />
                                  </div>
                                ) : (
                                  <div>Follow</div>
                                )}
                              </a>
                            ) : (
                              <a
                                onClick={() => {
                                  unfollowUser
                                    .mutateAsync({ pathParams: { userId } })
                                    .then((res: any) => {
                                      if (res?.message === "success") {
                                        getSingleUser.refetch();
                                        setIsFollow("follow");
                                      }
                                    });
                                }}
                                className=" h relative bottom-[3px] flex justify-center  bg-white  p-1 text-primary-600 hover:bg-white hover:text-primary-600 "
                              >
                                {unfollowUser.isLoading ||
                                getSingleUser.isLoading ? (
                                  <Spin color={"primary-600"} />
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <span className="relative   text-[14px]">
                                      Unfollow
                                    </span>
                                  </div>
                                )}
                              </a>
                            )}
                          </li>
                          <li className="mt-1 flex justify-center border-b px-5 pb-2 text-primary-600">
                            <button
                              onClick={() => {
                                handleConversation(getSingleUser?.data?.data);
                              }}
                            >
                              <div>Message</div>
                            </button>
                          </li>

                          <li>
                            <div className=" mt-1 px-5 text-primary-600">
                              {isBlock === "unblock" ? (
                                <a
                                  onClick={() => {
                                    setIsBlock("block");
                                    unBlockUser
                                      .mutateAsync({
                                        pathParams: { userId },
                                      })
                                      .then((res: any) => {
                                        getSingleUser.refetch();
                                        setMenuPopUp(false);
                                      });
                                  }}
                                >
                                  UnBlock <span></span>
                                </a>
                              ) : (
                                <a
                                  onClick={() => {
                                    setIsBlock("unblock");
                                    blockUser
                                      .mutateAsync({
                                        pathParams: {
                                          userId,
                                        },
                                      })
                                      .then((res: any) => {
                                        getSingleUser.refetch();
                                        router.push("/");
                                      });
                                  }}
                                >
                                  Block{" "}
                                </a>
                              )}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Popover>
                </div>
              )} */}
            </div>
            <div
              className={`mx-auto flex  items-center ${"justify-end py-4"} border-t  md:w-[75%] xl:w-[75%]`}
            >
              {!getSingleUser?.data?.data?.isblocked &&
                !getSingleUser?.data?.data?.isDeleted &&
                currentUser?.data?._id !== getSingleUser?.data?.data?._id && (
                  <div className="md:justify- relative mx-auto   flex items-center justify-between  py-5">
                    <div className="mx-1 flex items-center">
                      {isFollow === "unfollow" ? (
                        <Button
                          isLoading={
                            followUser.isLoading || getSingleUser.isLoading
                          }
                          onClick={() => {
                            if (!followUser.isLoading) {
                              followUser
                                .mutateAsync({ pathParams: { userId } })
                                .then((res: any) => {
                                  if (res?.message === "success") {
                                    getSingleUser.refetch();
                                    setPosts(
                                      Posts?.map((item: any) => {
                                        return item?.user?._id === userId
                                          ? {
                                              ...item,
                                              user: {
                                                ...item?.user,
                                                is_following: true,
                                              },
                                            }
                                          : { ...item };
                                      })
                                    );
                                    setAllPosts(
                                      allPosts?.map((item: any) => {
                                        return item?.user?._id === userId
                                          ? {
                                              ...item,
                                              user: {
                                                ...item?.user,
                                                is_following: true,
                                              },
                                            }
                                          : { ...item };
                                      })
                                    );
                                    setIsFollow("unfollow");
                                    refetch();
                                  }
                                });
                            }
                          }}
                          className="border border-primary-600 bg-white py-[6px] px-[17px] text-xs text-primary-600 sm:border-2 sm:px-[29px]"
                        >
                          <div className="flex items-center justify-center">
                            {/* {followUser.isLoading || getSingleUser.isLoading ? (
                              <Spin color={"primary-600"} />
                            ) : (
                              <> */}
                            <span className=" px-2 text-[13px] font-[600]">
                              Follow
                            </span>
                            {/* <UserCircleIcon /> */}
                            {/* <MessagebtnIcon /> */}
                            {/* </>
                            )} */}
                          </div>
                        </Button>
                      ) : (
                        <Button
                          isLoading={
                            unfollowUser.isLoading || getSingleUser.isLoading
                          }
                          onClick={() => {
                            unfollowUser
                              .mutateAsync({ pathParams: { userId } })
                              .then((res: any) => {
                                if (res?.message === "success") {
                                  getSingleUser.refetch();
                                  setIsFollow("follow");
                                  setPosts(
                                    Posts?.map((item: any) => {
                                      return item?.user?._id === userId
                                        ? {
                                            ...item,
                                            user: {
                                              ...item?.user,
                                              is_following: false,
                                            },
                                          }
                                        : { ...item };
                                    })
                                  );
                                  setAllPosts(
                                    allPosts?.map((item: any) => {
                                      return item?.user?._id === userId
                                        ? {
                                            ...item,
                                            user: {
                                              ...item?.user,
                                              is_following: false,
                                            },
                                          }
                                        : { ...item };
                                    })
                                  );
                                }
                              });
                          }}
                          className=" relative   flex  justify-center rounded border border-primary-600 bg-white py-[4px]  text-sm text-primary-600 xms:px-[24px]   sm:border-2 sm:px-[28px]"
                        >
                          {/* {unfollowUser.isLoading ||
                            getSingleUser.isLoading ? (
                              <div className="mt-2">
                                <Spin color={"primary-600"} />
                              </div>
                            ) : (
                              <> */}
                          <span className="  ">Unfollow</span>
                          {/* <div className="relative">
                              <AddUserIcon fill={"#EA4115"} />
                            </div> */}
                          {/* </>
                            )} */}
                        </Button>
                      )}
                    </div>

                    <Button
                      className="xxxs: border border-primary-600 py-[6px] px-[20px] text-center text-xs sm:px-7 sm:text-[14px] md:py-[7px]"
                      onClick={() => {
                        handleConversation(getSingleUser?.data?.data);
                      }}
                    >
                      <span className=" ">Message</span>
                      {/* <HeaderMessageIcon /> */}
                      {/* <MessagebtnIcon /> */}
                    </Button>

                    <div className="relative  ml-1 flex  justify-center rounded border border-primary-600 py-[4px] px-5 text-sm text-primary-600 xms:px-7   sm:border-2 sm:px-10">
                      {isBlock === "unblock" ? (
                        <button
                          onClick={() => {
                            setIsBlock("block");
                            unBlockUser
                              .mutateAsync({
                                pathParams: { userId },
                              })
                              .then((res: any) => {
                                getSingleUser.refetch();
                              });
                          }}
                        >
                          UnBlock{" "}
                          {/* <span>{getSingleUser?.data?.data?.user_handle}</span> */}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsBlock("unblock");
                            blockUser
                              .mutateAsync({
                                pathParams: {
                                  userId,
                                },
                              })
                              .then((res: any) => {
                                getSingleUser.refetch();
                                router.push("/");
                              });
                          }}
                        >
                          Block{" "}
                          {/* <span>{getSingleUser?.data?.data?.user_handle}</span> */}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              {getSingleUser?.data?.data?.isblocked && (
                <button
                  onClick={() => {
                    setIsBlock("block");
                    unBlockUser
                      .mutateAsync({
                        pathParams: { userId },
                      })
                      .then((res: any) => {
                        getSingleUser.refetch();
                      });
                  }}
                  className="flex w-full justify-end  text-primary-600 "
                >
                  <span className="mb-1 rounded-md border border-primary-600 px-2 py-[2px] sm:border-2 sm:px-4">
                    UnBlock
                  </span>
                  {/* <span>{getSingleUser?.data?.data?.user_handle}</span> */}
                </button>
              )}
              {currentUser?.data?._id === getSingleUser?.data?.data?._id && (
                <div className="hidden md:block 2xl:mx-4">
                  <button
                    onClick={() => {
                      setIsUserModal(true);
                    }}
                  >
                    <EditProfileIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-2 border-emerald-700">
        {!getSingleUser?.data?.data?.isblocked &&
          !getSingleUser?.data?.data?.isDeleted && (
            <div className=" w-full bg-gray-100 lg:flex  lg:gap-5">
              <div className="relative mt-6 w-full  text-xs  md:text-base lg:w-[29%]  lg:text-xs">
                <IntroCard introProps={introProps} />
              </div>
              <div className=" mt-4 mb-16 lg:mt-6 lg:w-[42%]">
                {!getSingleUser?.data?.data?.isblocked &&
                  !getSingleUser?.data?.data?.isDeleted && (
                    <div
                      style={{ zIndex: 9 }}
                      className=" sticky top-11 mb-0   flex w-[100%] justify-center rounded-md bg-white py-3 px-5 pb-0 md:top-16 "
                    >
                      <div className="   mx-0 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setTabs("Timeline");
                          }}
                          className={`py-3 px-2.5 ${
                            tabs === "Timeline"
                              ? "border-b-2 border-primary-600  text-primary-600"
                              : "pb-3"
                          }`}
                        >
                          Timeline ({getSingleUser?.data?.data?.totalPosts})
                        </button>
                        <button
                          onClick={() => {
                            setTabs("Followers");
                          }}
                          className={`py-3 px-2.5 ${
                            tabs === "Followers"
                              ? "border-b-2 border-primary-600  text-primary-600"
                              : "pb-3"
                          } `}
                        >
                          Followers ({getSingleUser?.data?.data?.followerCount})
                        </button>
                        <button
                          onClick={() => {
                            setTabs("Following");
                          }}
                          className={`py-3 px-2.5  ${
                            tabs === "Following"
                              ? "border-b-2 border-primary-600  text-primary-600"
                              : "pb-3"
                          }`}
                        >
                          Following ({getSingleUser?.data?.data?.followingCount}
                          )
                        </button>
                      </div>
                    </div>
                  )}
                <div className="">
                  {tabs === "Followers" && (
                    <div>
                      <FollowerList
                        type="Followers"
                        getSingleUser={getSingleUser}
                      />
                    </div>
                  )}
                  {tabs === "Following" && (
                    <div className="h-full">
                      <FollowingList getSingleUser={getSingleUser} />
                    </div>
                  )}
                  {tabs === "Timeline" && (
                    <div className=" my-2 ml-0 flex w-full justify-center   md:w-[100%]  ">
                      <SinglePostCard postProps={postProps} />
                    </div>
                  )}
                </div>
              </div>
              {/* <div className=" static hidden h-full text-center lg:sticky lg:top-16 lg:ml-2 lg:mt-6 lg:block  lg:w-[29%]">
                <Advertisement isProfileOpen={true} />
              </div> */}
            </div>
          )}
      </div>
      <EditProfileModal modalProps={modalProps} />
    </div>
  );
};

export default Profile;
