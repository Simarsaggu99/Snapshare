import Button from "@/components/buttons/Button";
import {
  notifyError,
  notifySuccess,
} from "@/components/UIComponents/Notification";
import Popover from "@/components/UIComponents/Popover";

import { useDeltePost } from "@/hooks/post/mutation";
import { useCheckTodayPostCount } from "@/hooks/post/query";

import {
  useBlockUser,
  useUnblockUser,
  useFollowUser,
  useUnfollowUser,
} from "@/hooks/users/mutation";

import { allPostsData, isLoginModal, loggedInUser } from "@/store";
import {
  BlockIcon,
  DeleteFillIcon,
  EditIcon,
  MyCollection,
  MyCollectionAction,
  ReportIcon,
  UnblockIcon,
  UnfollowUser,
} from "@/utils/AppIcons";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
interface reportModelInterface {
  id: any;
  isModal: boolean;
}
interface collectionModelInterface {
  id: any;
  isModal: boolean;
}
interface popupInterface {
  id: string;
  isVisible: boolean;
}
interface actionProps {
  popUpMenu: popupInterface;
  item: any;
  getPosts: any;
  setIsReportModal: React.Dispatch<React.SetStateAction<reportModelInterface>>;
  setIsCollectionModal: React.Dispatch<
    React.SetStateAction<collectionModelInterface>
  >;

  setIsAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPostEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setSinglePostDetails: React.Dispatch<React.SetStateAction<any>>;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  setpopUpMenu: React.Dispatch<React.SetStateAction<popupInterface>>;
  userCardRef: React.Ref<HTMLDivElement>;

  Posts: any[];
  getSingleUser: any;
}
interface postActionProps {
  actionProps: actionProps;
}

const PostAction = ({
  actionProps: {
    popUpMenu,
    item,
    getPosts,
    setIsReportModal,
    setIsCollectionModal,
    
    setIsAddPost,
    setIsPostEdit,
    setSinglePostDetails,
    
    setpopUpMenu,
    userCardRef,
    isProfileOpen,
    profilePosts,
    setProfilePosts,
    getSingleUser,
  },
}: any) => {
  const deletePost = useDeltePost();
  const blockUser = useBlockUser();
  const [isPopUp, setIsPopUp] = useState(false);
  const userRef = React.useRef<HTMLButtonElement>(null);
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const unblockUser = useUnblockUser();
  const [Posts, setPosts] = useAtom(allPostsData);
  const followUser = useFollowUser();
  const [currentUser] = useAtom(loggedInUser);
  const [userStatus, setUserStatus] = useState("");
  const [isFollow, setIsFollow] = useState("");
  const unfollowUser = useUnfollowUser();
  const checkTodayPostCount: any = useCheckTodayPostCount({
    currentUser,
  });
  useEffect(() => {
    setIsFollow(
      item?.user?.isfollowing || item?.user?.is_following
        ? "Follow"
        : "unfollow"
    );
    setUserStatus(item?.user?.is_blocked ? "unblock" : "Block");
  }, [item]);
  useEffect(() => {
    setIsPopUp(false);
  }, [popUpMenu]);
  const router = useRouter();
  return (
    <div>
      {popUpMenu?.id === item?._id && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          ref={userCardRef}
          style={{
            background: "#FFFFFF",
            boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.25)",
            borderRadius: "8px",
          }}
          className={`${`absolute right-1   z-10 flex ${
            currentUser?.data?._id === item?.user?._id
              ? "h-[100px]"
              : "h-[195px]"
          } w-[205px] cursor-pointer flex-col bg-white px-2 pt-2 text-[#666]`}  `}
        >
          {currentUser?.data?._id === item?.user?._id ? (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setIsAddPost(true);
                  setIsPostEdit(true);
                  setSinglePostDetails(item);
                }}
                className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
              >
                <div className="rounded-full bg-[#D1D0D0] p-2">
                  <EditIcon />
                </div>
                <span className="mt-1 text-sm"> Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPopUp(true);
                  
                }}
                className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
              >
                <div className="rounded-full bg-[#D1D0D0] p-2">
                  <DeleteFillIcon />
                </div>
                <span className="mt-1 text-sm">Delete</span>
              </button>
              <Popover
                className="-top-1 -right-2  z-50 w-44 bg-white"
                userRef={userRef}
                onclose={setIsPopUp}
                isVisible={isPopUp}
              >
                <div
                  className="p-4 text-sm"
                  
                  style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                >
                  <div className="mt-2 pb-5 text-gray-800 ">
                    <p className="">
                      {" "}
                      Are your sure you want to delete this post ?
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsPopUp(false);
                      }}
                      className="rounded border px-1"
                    >
                      Cancel{" "}
                    </button>
                    <Button
                      isLoading={deletePost?.isLoading}
                      className="px-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost
                          .mutateAsync({
                            pathParams: { id: item?._id },
                          })
                          .then((res: any) => {
                            if (res?.message?.includes("success")) {
                              setPosts(
                                Posts?.filter(
                                  (fil: any) => fil?._id !== item?._id
                                )
                              );
                              notifySuccess({
                                message:
                                  "Your post has been deleted successfully",
                              });
                              if (isProfileOpen) {
                                setProfilePosts(
                                  profilePosts?.filter(
                                    (fil: any) => fil?._id !== item?._id
                                  )
                                );
                                getPosts.refetch();
                              }
                              if (router?.pathname?.includes("open-post")) {
                                router.push("/");
                              }
                            }
                          })
                          .catch((err) => {
                            notifyError({
                              message:
                                "!Opps something went wrong while delete you post. Please try again.",
                            });
                          });
                      }}
                    >
                      Delete{" "}
                    </Button>
                  </div>
                </div>
                {/* )} */}
              </Popover>
            </div>
          ) : (
            <div>
              <div
                className="rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
                onClick={(e) => {
                  e.stopPropagation();
                  currentUser?.data?._id
                    ? setIsCollectionModal({
                        id: item?._id,
                        isModal: true,
                      })
                    : setIsModel(true);
                  setpopUpMenu({
                    id: "",
                    isVisible: false,
                  });
                }}
              >
                <button className="flex gap-3 ">
                  <div className="rounded-full bg-[#D1D0D0] p-2">
                    <MyCollectionAction fill="#564C4C" />
                  </div>
                  <span className="mt-1 text-sm"> Add to collections</span>
                </button>
              </div>
              <div className="">
                {isFollow === "Follow" ? (
                  <button
                    onClick={() => {
                      if (currentUser?.data?._id) {
                        setIsFollow("Unfollow");
                        unfollowUser
                          .mutateAsync({
                            pathParams: { userId: item?.user?._id },
                          })
                          .then(() => {
                            setpopUpMenu({
                              isVisible: false,
                              id: "",
                            });
                            getSingleUser.refetch();
                            setPosts(
                              Posts?.map((post: any) => {
                                return post?.user?._id === item?.user?._id
                                  ? {
                                      ...post,
                                      user: {
                                        ...post?.user,
                                        is_following: false,
                                      },
                                    }
                                  : { ...post };
                              })
                            );
                            if (isProfileOpen) {
                              setProfilePosts(
                                profilePosts?.map((post: any) => {
                                  return post?.user?._id === item?.user?._id
                                    ? {
                                        ...post,
                                        user: {
                                          ...post?.user,
                                          is_following: false,
                                        },
                                      }
                                    : { ...post };
                                })
                              );
                            }
                            
                          });
                      } else {
                        setIsModel(true);
                      }
                    }}
                    className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
                  >
                    <div className="rounded-full bg-[#D1D0D0] p-2">
                      <UnfollowUser />
                    </div>
                    <span className="mt-1 text-sm"> Unfollow</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentUser?.data?._id) {
                        setIsFollow("Follow");
                        followUser
                          .mutateAsync({
                            pathParams: { userId: item?.user?._id },
                          })
                          .then((res: any) => {
                            setpopUpMenu({
                              isVisible: false,
                              id: "",
                            });
                            getSingleUser?.refetch();
                            setPosts(
                              Posts?.map((post: any) => {
                                return post?.user?._id === item?.user?._id
                                  ? {
                                      ...post,
                                      user: {
                                        ...post?.user,
                                        is_following: true,
                                      },
                                    }
                                  : { ...post };
                              })
                            );
                            if (isProfileOpen) {
                              setProfilePosts(
                                profilePosts?.map((post: any) => {
                                  return post?.user?._id === item?.user?._id
                                    ? {
                                        ...post,
                                        user: {
                                          ...post?.user,
                                          is_following: true,
                                        },
                                      }
                                    : { ...post };
                                })
                              );
                            }
                          });
                      } else {
                        setIsModel(true);
                      }
                    }}
                    className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
                  >
                    <div className="rounded-full bg-[#D1D0D0] p-2">
                      <EditIcon />
                    </div>
                    <span className="mt-1 text-sm"> Follow</span>
                  </button>
                )}
              </div>
              <div className="">
                {userStatus === "Block" ? (
                  <button
                    onClick={() => {
                      setpopUpMenu({
                        isVisible: false,
                        id: "",
                      });
                      if (currentUser?.data?._id) {
                        setUserStatus("Unblock");
                        blockUser
                          .mutateAsync({
                            pathParams: { userId: item?.user?._id },
                          })
                          .then((res: any) => {
                            if (res?.message === "success") {
                              router.push("/");
                              notifySuccess({ message: "User blocked!" });
                              setPosts((prev) =>
                                prev?.filter((fil) => {
                                  return fil?.user?._id !== item?.user?._id;
                                })
                              );
                            }
                          });
                      } else {
                        setIsModel(true);
                      }
                    }}
                    className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
                  >
                    <div className="rounded-full bg-[#D1D0D0] p-2">
                      <BlockIcon />
                    </div>
                    <span className="mt-1 text-sm"> Block User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setpopUpMenu({
                        isVisible: false,
                        id: "",
                      });
                      if (currentUser?.data?._id) {
                        setUserStatus("Block");
                        unblockUser
                          .mutateAsync({
                            pathParams: { userId: item?.user?._id },
                          })
                          .then((res: any) => {
                            notifySuccess({ message: "User unblocked!" });
                          });
                      } else {
                        setIsModel(true);
                      }
                    }}
                    className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
                  >
                    <div className="rounded-full bg-[#D1D0D0] p-2">
                      <UnblockIcon fill={"#564C4C"} />
                    </div>
                    <span className="mt-1 text-sm"> Unblock User</span>
                  </button>
                )}
              </div>
              <div
                
                className=""
              >
                <button
                  onClick={() => {
                    currentUser?.data?._id
                      ? setIsReportModal({ id: item?._id, isModal: true })
                      : setIsModel(true);
                    setpopUpMenu({
                      id: "",
                      isVisible: false,
                    });
                  }}
                  className="flex w-full gap-3 rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]"
                >
                  <div className="rounded-full bg-[#D1D0D0] p-2">
                    <ReportIcon />
                  </div>
                  <span className="mt-1 text-sm"> Report Content</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostAction;
