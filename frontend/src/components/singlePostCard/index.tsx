import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  useDislikePost,
  useLikePost,
  useReportPost,
} from "@/hooks/post/mutation";
import {
  LikePostIcon,
  ShareIcon,
  CommentIcon,
  AfterLikePostIcon,
  ThreeDotsIcon,
} from "@/utils/AppIcons";
import { useAtom } from "jotai";
import { allPostsData, isLoginModal, loggedInUser } from "@/store";
import CommentSection from "./commentSection";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SharePostModel from "./sharePostModel";
import { getFirstLetter, NumberFormatter } from "@/utils/common";
import PostAction from "./postActions";
import Link from "next/link";
import Button from "../buttons/Button";
import CollectionModal from "./collectionModal";
import AddPost from "@/components/addPost";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
import { notifyError, notifySuccess } from "../UIComponents/Notification";
import PostReportModal from "./postActions/postReportModal";
import ReadMore from "../UIComponents/ReadMore";

interface reportModalInterface {
  id: any;
  isModal: boolean;
}
interface collectionModal {
  id: string;
  isModal: boolean;
}
interface popupInterface {
  id: string;
  isVisible: boolean;
}

const SinglePostCard = ({ postProps }: any) => {
  dayjs.extend(relativeTime);
  const {
    getPosts,
    currentPage,
    setCurrentPage,
    startIndex,
    setStartIndex,
    setPosts,
    Posts,
    isProfileOpen,
    user,
    hasMorePost,
    postCounts,
    setIsPostFetched,
    getSingleUser,
  } = postProps;
  const [popUpMenu, setpopUpMenu] = useState<popupInterface>({
    id: "",
    isVisible: false,
  });
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const [isShareModal, setIsShareModal] = useState<Boolean>(false);
  const [singlePostDetails, setSinglePostDetails] = useState<object>({});
  const [isCommentOpen, setIsCommentOpen] = useState();
  const [isReportModal, setIsReportModal] = useState<reportModalInterface>({
    id: "",
    isModal: false,
  });
  const [isCollectionModal, setIsCollectionModal] = useState<collectionModal>({
    id: "",
    isModal: false,
  });
  const [reportContentValue, setReportContentValue] = useState<string>();
  const [currentUser] = useAtom(loggedInUser);
  const [allPosts, setAllPosts] = useAtom(allPostsData);
  const [isAddPost, setIsAddPost] = useState(false);
  const [isPostEdit, setIsPostEdit] = useState(false);
  const [isPostOpenLoading, setIsPostOpenLoading] = useState(false);

  const likePost = useLikePost();
  const dislikePost = useDislikePost();
  const reportContent = useReportPost();
  const router = useRouter();
  const actionRef = React.useRef<HTMLButtonElement | any>(null);
  const [option, setoption] = useState("spam");
  const scrollTOPRef = useRef<null | any>(null);

  const userCardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCollectionModal.isModal || isReportModal.isModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isCollectionModal.isModal, isReportModal.isModal]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      if (
        popUpMenu?.isVisible &&
        userCardRef.current &&
        !userCardRef.current.contains(e.target) &&
        !actionRef?.current?.contains(e.target)
      ) {
        setpopUpMenu({
          id: "",
          isVisible: false,
        });
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [popUpMenu?.isVisible]);

  const scrollToBottom = () => {
    window.scrollTo({
      top: scrollTOPRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleLikePost = (id: string) => {
    const postData = Posts?.map((item: any) => {
      return item?._id === id
        ? {
            ...item,
            like_count: item?.like_count === 0 ? 1 : item?.like_count + 1,
            isLiked: true,
          }
        : item?.post?._id === id
        ? {
            ...item,
            post: {
              ...item?.post,
              like_count:
                item?.post?.like_count === 0 ? 1 : item?.post?.like_count + 1,
              isLiked: true,
            },
          }
        : { ...item };
    });
    setPosts(postData);
    setAllPosts(
      allPosts?.map((fil) => {
        return fil?._id === id
          ? {
              ...fil,
              like_count: fil?.like_count === 0 ? 1 : fil?.like_count + 1,
              isLiked: true,
            }
          : fil?.post?._id === id
          ? {
              ...fil,
              post: {
                ...fil?.post,
                like_count:
                  fil?.post?.like_count === 0 ? 1 : fil?.post?.like_count + 1,
                isLiked: true,
              },
            }
          : { ...fil };
      })
    );
    likePost
      .mutateAsync({
        pathParams: {
          id,
        },
      })
      .then((res: any) => {})
      .catch((err) => {
        notifyError({
          message: "OPPS something went wrong. while like post",
        });
      });
  };
  const handleDislikePost = (id: any) => {
    setPosts(
      Posts?.map((item: any) => {
        return item?._id === id
          ? {
              ...item,
              like_count: item?.like_count <= 0 ? 0 : +item?.like_count - 1,
              isLiked: false,
            }
          : item?.post?._id === id
          ? {
              ...item,
              post: {
                ...item?.post,
                like_count:
                  item?.post?.like_count <= 0 ? 0 : +item?.post?.like_count - 1,
                isLiked: false,
              },
            }
          : { ...item };
      })
    );
    dislikePost
      .mutateAsync({
        pathParams: {
          id,
        },
      })
      .then((res) => {})
      .catch((err) => {
        notifyError({
          message: "OPPS something went wrong. while like post",
        });
      });
    setAllPosts(
      allPosts?.map((item: any) => {
        return item?._id === id
          ? {
              ...item,
              like_count: item?.like_count <= 0 ? 0 : +item?.like_count - 1,
              isLiked: false,
            }
          : item?.post?._id === id
          ? {
              ...item,
              post: {
                ...item?.post,
                like_count:
                  item?.post?.like_count <= 0 ? 0 : +item?.post?.like_count - 1,
                isLiked: false,
              },
            }
          : { ...item };
      })
    );
  };

  const onReportPost = () => {
    reportContent
      .mutateAsync({
        body: { description: reportContentValue, reason: option },
        pathParams: { id: isReportModal?.id },
      })
      .then((res: any) => {
        if (res?.message === "success") {
          setIsReportModal({
            id: "",
            isModal: false,
          });
          setoption("spam");
          notifySuccess({
            message: "Post reported successfully!",
          });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          notifyError({
            message: err?.response?.data?.message,
          });
        } else {
          notifyError({
            message: "opps somethig went wrong. please try again !",
          });
        }
      });
  };

  const commentProps = {
    isCommentOpen,
    getPosts,
    setPosts,
    Posts,
  };
  const sharePostProps = {
    isShareModal,
    setIsShareModal,
    singlePostDetails,
    getPosts,
    scrollToBottom,
  };
  const actionProps = {
    setpopUpMenu,
    popUpMenu,
    getPosts,
    setIsReportModal,
    setIsCollectionModal,
    setIsAddPost,
    setIsPostEdit,
    setSinglePostDetails,
    setPosts,
    Posts,
    userCardRef,
    isReportModal,
    isProfileOpen,
    setProfilePosts: setPosts,
    profilePosts: Posts,
    getSingleUser,
  };
  const collectionProps = {
    isCollectionModal,
    setIsCollectionModal,
  };
  const editProps = {
    isAddPost,
    setIsAddPost,
    setIsPostEdit,
    isPostEdit,
    singlePostDetails,
    setSinglePostDetails,
  };
  const reportModal = {
    isReportModal,
    setIsReportModal,
    setoption,
    option,
    onReportPost,
    setReportContentValue,
  };

  const { fetchNextPage } = getPosts;
  return (
    <div className="relative">
      {isPostOpenLoading && (
        <div className="modal backdrop-blur-xs flex justify-center bg-black/60">
          <div className="absolute top-[50%] left-[50%] z-50 h-full">
            <div className={`   flex h-14 justify-center `}>
              <span className="circle circle-1"></span>
              <span className="circle circle-2"></span>
              <span className="circle circle-3"></span>
              <span className="circle circle-4"></span>
            </div>
          </div>
        </div>
      )}
      {Posts?.length > 0 ? (
        <div ref={scrollTOPRef} className="">
          <InfiniteScroll
            dataLength={Posts?.filter((fil: any) => fil?.ad !== true)?.length}
            next={() => {
              // if (currentPage) {
              // setCurrentPage(currentPage + 1);
              // // }
              // if (!isProfileOpen) {
              //   setStartIndex(startIndex + 6);
              //   // setIsPostFetched(true);
              // }
              // fetchNextPage({ pageParam: getPosts?.data?.pages?.length });
              // if (isProfileOpen) {
              // }
            }}
            hasMore={hasMorePost}
            loader={
              <div className={`flex h-14 justify-center `}>
                <span className="circle circle-1"></span>
                <span className="circle circle-2"></span>
                <span className="circle circle-3"></span>
                <span className="circle circle-4"></span>
              </div>
            }
            style={{
              overflow: "hidden",
            }}
            scrollableTarget="scrollableDiv"
          >
            {Posts?.map((item: any, idx: number) => (
              <>
                {idx !== 0 && idx % 3 === 0 && (
                  <div
                    key={`ad-${idx}`}
                    className="my-4 mt-4 w-[100%] overflow-hidden rounded-lg    bg-white px-2 py-2"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                    }}
                  >
                    <div className="h-[500px] w-full">Ad</div>
                  </div>
                )}
                {/* {isProfileOpen && item?.ad ? (
                  <div
                    key={item?._id}
                    className="my-4 mt-4 w-[100%] overflow-hidden rounded-lg    bg-white px-2 py-2"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                    }}
                  >
                    <div className="h-[500px] w-full">Ad</div>
                  </div>
                ) : ( */}
                <div
                  key={item?._id}
                  className="my-4 mt-4 w-[100%] overflow-hidden rounded-lg    bg-white px-2 py-2"
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  }}
                >
                  {item?.isRePosted ? (
                    <div>
                      <div className=" relative flex justify-between ">
                        <div className="flex cursor-pointer items-center">
                          <button
                            onClick={() => {
                              // if (currentUser?.data?._id) {
                              //   if (!item?.user?.is_blocked) {
                              //     // router.push(`/profile/${item?.user?._id}`);
                              //   }
                              // } else {
                              //   setIsModel(true);
                              // }
                            }}
                          >
                            {item?.user?.avatar_url ? (
                              <Image
                                // onClick={() =>
                                //   router.push(`/profile/${item?.user?._id}`)
                                // }
                                src={item?.user?.avatar_url}
                                alt={
                                  item?.tags?.length
                                    ? item?.tags
                                    : item?.description
                                    ? item?.description
                                    : `meme by ${item?.user?.user_handle}`
                                }
                                height={"45px"}
                                width={"45px"}
                                style={{ borderRadius: "50%" }}
                                objectFit="cover"
                              />
                            ) : (
                              <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-400 text-white">
                                {getFirstLetter(item?.user?.user_handle)}
                              </div>
                            )}
                          </button>
                          <div className="ml-1 mb-2 flex w-full flex-col pl-2">
                            <span
                              className="flex justify-start text-lg font-medium"
                              onClick={() => {
                                // if (currentUser?.data?._id) {
                                //   if (!item?.user?.is_blocked) {
                                //     router.push(`/profile/${item?.user?._id}`);
                                //   }
                                // } else {
                                //   setIsModel(true);
                                // }
                              }}
                            >
                              {" "}
                              <span className="w-[100px] overflow-hidden text-ellipsis xms:w-[185px] xs:w-[200px] sm:w-[250px] lg:w-[150px] xl:w-[100%] ">
                                {item?.user?.user_handle}
                              </span>
                              <span className="ml-2 mt-1  flex text-sm text-gray-600">
                                <span className="mr-1">Repost</span>
                                <span>this</span>
                              </span>
                            </span>
                            <span className="text-xs font-[400] text-[#858585]">
                              {dayjs(item?.created_at).fromNow()}
                            </span>
                          </div>
                        </div>

                        <div className=" relative top-2">
                          <div
                            className="cursor-pointer pl-2 pr-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // setpopUpMenu({
                              //   isVisible: !popUpMenu?.isVisible,
                              //   id: popUpMenu === item?._id ? "" : item?._id,
                              // });
                            }}
                            ref={actionRef}
                          >
                            <ThreeDotsIcon />
                          </div>

                          <PostAction actionProps={{ ...actionProps, item }} />
                        </div>
                      </div>
                      <div className="mt-1 flex justify-between border-t">
                        <div className="mt-1 flex items-center pt-1 ">
                          <Link
                            href={`/profile/${item?.post?.user?._id}`}
                            className="cursor-pointer"
                          >
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                if (currentUser?.data?._id) {
                                  // router.push(
                                  //   `/profile/${item?.post?.user?._id}`
                                  // );
                                } else {
                                  // setIsModel(true);
                                }
                              }}
                            >
                              {item?.post?.user?.avatar_url ? (
                                <Image
                                  src={item?.post?.user?.avatar_url}
                                  alt="profile"
                                  height={"45px"}
                                  width={"45px"}
                                  style={{ borderRadius: "50%" }}
                                  objectFit="cover"
                                />
                              ) : (
                                <div className="flex h-[45px] w-[45px] cursor-pointer items-center  justify-center rounded-full bg-gray-400 text-white">
                                  {getFirstLetter(
                                    item?.post?.user?.user_handle
                                  )}
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="mx-1.5 flex flex-col pl-2">
                            <span
                              className="flex cursor-pointer justify-start text-lg font-medium"
                              onClick={() => {
                                // if (currentUser?.data?._id) {
                                //   if (!item?.user?.is_blocked) {
                                //     router.push(
                                //       `/profile/${item?.post?.user?._id}`
                                //     );
                                //   }
                                // } else {
                                //   setIsModel(true);
                                // }
                              }}
                            >
                              {" "}
                              {item?.post?.user?.user_handle}
                            </span>
                            <span className="text-xs font-[400] text-[#858585]">
                              {dayjs(item?.post?.created_at).fromNow()}
                            </span>
                          </div>
                        </div>
                        <div className=" relative mt-2"></div>
                      </div>
                      {item?.post?.description && (
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            maxWidth: "500px",
                          }}
                          className="text mt-2 flex gap-2 overflow-hidden break-all   p-2  text-justify font-medium text-gray-600"
                        >
                          <ReadMore text={item?.post?.description} />
                        </div>
                      )}
                      <div className=" my-3 w-full">
                        <div className=" relative mt-4 flex h-[31.25] w-full cursor-pointer justify-center">
                          <button
                            onClick={() => {
                              // setIsPostOpenLoading(true);
                            }}
                          >
                            <Link href={`/open-post?id=${item?.post?._id}`}>
                              <Image
                                src={item?.post?.media?.url}
                                alt={
                                  item?.tags?.length
                                    ? item?.tags
                                    : item?.description
                                    ? item?.description
                                    : `meme by ${item?.user?.user_handle}`
                                }
                                height={"500px"}
                                width={"550px"}
                                unoptimized={true}
                                style={{
                                  borderRadius: "10px",
                                }}
                                objectFit="cover"
                                objectPosition="top left"
                              />
                            </Link>
                          </button>
                        </div>
                        <div>
                          <div className="w-full border-t"></div>
                          <div className=" flex  w-full justify-between border-b  py-2 px-2">
                            <div className="flex  w-full cursor-pointer gap-1">
                              {item?.post?.isLiked ? (
                                <button
                                  className="flex"
                                  // onClick={() => {
                                  //   {
                                  //     currentUser?.data?._id
                                  //       ? handleDislikePost(item?.post?._id)
                                  //       : setIsModel(true);
                                  //   }
                                  // }}
                                >
                                  <AfterLikePostIcon />
                                  {item?.post?.like_count > 0 && (
                                    <div className="item-center align-center mt-1.5 text-sm font-bold text-gray-500">
                                      <div className="ml-2 ">
                                        {item?.post?.like_count > 0
                                          ? NumberFormatter(
                                              item?.post?.like_count
                                            )
                                          : ""}
                                      </div>
                                    </div>
                                  )}
                                  <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                    Likes
                                  </span>
                                </button>
                              ) : (
                                <button
                                  className="flex w-full"
                                  // onClick={() => {
                                  //   currentUser?.data?._id
                                  //     ? handleLikePost(item?.post?._id)
                                  //     : setIsModel(true);
                                  // }}
                                >
                                  <LikePostIcon />
                                  {item?.post?.like_count > 0 && (
                                    <div className="item-center align-center mt-1.5 text-sm font-bold text-gray-500">
                                      <div className="ml-2 ">
                                        {item?.post?.like_count > 0
                                          ? NumberFormatter(
                                              item?.post?.like_count
                                            )
                                          : ""}
                                      </div>
                                    </div>
                                  )}
                                  <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                    Likes
                                  </span>
                                </button>
                              )}
                            </div>
                            <button
                              className="flex  w-full cursor-pointer gap-1"
                              onClick={() => {
                                // currentUser?.data?._id
                                //   ? setIsCommentOpen(
                                //       isCommentOpen === item?._id
                                //         ? undefined
                                //         : item?._id
                                //     )
                                //   : setIsModel(true);
                              }}
                            >
                              <CommentIcon />
                              {item?.post?.comment_count > 0 && (
                                <div className="item-center align-center mt-1.5 text-sm font-bold text-gray-500">
                                  <div className="ml-2">
                                    {item?.post?.comment_count > 0
                                      ? NumberFormatter(
                                          item?.post?.comment_count
                                        )
                                      : ""}
                                  </div>
                                </div>
                              )}
                              <span className="mx-1.5 mt-1.5 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                Comments
                              </span>
                            </button>

                            <button
                              className="flex cursor-pointer gap-1"
                              onClick={() => {
                                // setIsShareModal(true);
                                // setSinglePostDetails(item);
                              }}
                            >
                              <ShareIcon />
                              <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                share
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      {isCommentOpen === item?._id && (
                        <CommentSection commentProps={commentProps} />
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="relative flex w-full justify-between  border-b   px-2 py-2 pb-1">
                        <div className="flex w-full items-center">
                          <button
                            onClick={() => {
                              // if (currentUser?.data?._id) {
                              //   if (!item?.user?.is_blocked) {
                              //     router.push(`/profile/${item?.user?._id}`);
                              //   }
                              // } else {
                              //   setIsModel(true);
                              // }
                            }}
                          >
                            <div className="cursor-pointer">
                              {item?.user?.avatar_url ? (
                                <Image
                                  src={item?.user?.avatar_url}
                                  alt="profile"
                                  height={"45px"}
                                  width={"45px"}
                                  style={{ borderRadius: "50%" }}
                                  objectFit="cover"
                                />
                              ) : (
                                <div className="  flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-400 text-sm text-white">
                                  {getFirstLetter(item?.user?.user_handle)}
                                </div>
                              )}
                            </div>
                          </button>
                          <div className="mx-1.5 flex flex-col ">
                            <button
                              onClick={() => {
                                // if (currentUser?.data?._id) {
                                //   router.push(`/profile/${item?.user?._id}`);
                                // } else {
                                //   setIsModel(true);
                                // }
                              }}
                            >
                              <span
                                className={` relative bottom-1  flex w-[150px] cursor-pointer justify-start overflow-hidden text-ellipsis text-lg font-medium  xms:w-[250px] lg:w-[200px] xl:w-[100%]`}
                              >
                                {item?.user?.user_handle}
                              </span>
                            </button>

                            <span className="relative bottom-1 text-xs font-[400] text-[#858585]">
                              {dayjs(item?.created_at).fromNow()}
                            </span>
                          </div>
                        </div>

                        <div className=" relative top-[5px] cursor-pointer">
                          <div
                            className="  pr-1 pl-4"
                            onClick={(e) => {
                              e.stopPropagation();

                              // setpopUpMenu({
                              //   id: item?._id,
                              //   isVisible: !popUpMenu?.isVisible,
                              // });
                            }}
                            ref={actionRef}
                          >
                            <ThreeDotsIcon />
                          </div>

                          <PostAction actionProps={{ ...actionProps, item }} />
                        </div>
                      </div>
                      {item?.description && (
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            maxWidth: "500px",
                          }}
                          className="text mt-2 flex gap-2 overflow-hidden break-all   p-2  text-justify font-medium text-gray-600"
                        >
                          <ReadMore text={item?.description} />
                        </div>
                      )}
                      <div className=" my-3 w-full">
                        <div
                          className="relative mt-4 flex w-full cursor-pointer justify-center"
                          onClick={() => {
                            // setIsPostOpenLoading(true);
                          }}
                        >
                         
                            <button>
                              <Image
                                src={item?.media?.url}
                                alt={
                                  item?.tags?.length
                                    ? item?.tags
                                    : item?.description
                                    ? item?.description
                                    : `meme by ${item?.user?.user_handle}`
                                }
                                height={"500px"}
                                unoptimized={true}
                                width={"550px"}
                                objectFit="cover"
                                objectPosition="top left"
                              />
                            </button>
                    
                        </div>

                        <div className="p-2">
                          <div className="w-full border-t"></div>

                          <div className=" flex justify-between border-b   py-2">
                            <div>
                              <div className="flex w-full cursor-pointer gap-1">
                                {item?.isLiked ? (
                                  <button
                                    className="flex"
                                    // onClick={() => {
                                    //   {
                                    //     currentUser?.data?._id
                                    //       ? handleDislikePost(item?._id)
                                    //       : setIsModel(true);
                                    //   }
                                    // }}
                                  >
                                    <AfterLikePostIcon />
                                    {item?.like_count > 0 && (
                                      <div className="item-center align-center  mt-1.5 text-sm font-bold text-gray-500">
                                        <div className="ml-2 ">
                                          {item?.like_count > 0
                                            ? NumberFormatter(item?.like_count)
                                            : ""}
                                        </div>
                                      </div>
                                    )}
                                    <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                      Likes
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    className="flex"
                                    // onClick={() => {
                                    //   if (currentUser?.data?._id) {
                                    //     handleLikePost(item?._id);
                                    //   } else {
                                    //     setIsModel(true);
                                    //   }
                                    // }}
                                  >
                                    <LikePostIcon />
                                    {item?.like_count > 0 && (
                                      <div className="item-center align-center mt-1.5 text-sm font-bold text-gray-500">
                                        <div className="ml-2">
                                          {item?.like_count > 0
                                            ? NumberFormatter(item?.like_count)
                                            : ""}
                                        </div>
                                      </div>
                                    )}
                                    <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                      Likes
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                className="flex w-full cursor-pointer gap-1"
                                // onClick={() => {
                                //   currentUser?.data?._id
                                //     ? setIsCommentOpen(
                                //         isCommentOpen === item?._id
                                //           ? undefined
                                //           : item?._id
                                //       )
                                //     : setIsModel(true);
                                // }}
                              >
                                <CommentIcon />
                                {item?.comment_count > 0 && (
                                  <div className="item-center align-center mt-1.5 text-sm font-bold text-gray-500">
                                    <div className="ml-2">
                                      {item?.comment_count > 0
                                        ? NumberFormatter(item?.comment_count)
                                        : ""}{" "}
                                    </div>
                                  </div>
                                )}

                                <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                  Comments
                                </span>
                              </button>
                            </div>
                            <div>
                              <button
                                className="flex  cursor-pointer gap-1"
                                onClick={() => {
                                  // if (currentUser?.data?._id) {
                                  // handleLikePost(item?._id);
                                  // setIsShareModal(true);
                                  // setSinglePostDetails(item);
                                  // } else {
                                  //   setIsModel(true);
                                  // }
                                }}
                              >
                                <ShareIcon />
                                <span className="mx-1.5 mt-1 hidden text-[16px] font-medium text-[#FF5E34] xs:block">
                                  share
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isCommentOpen === item?._id && (
                        <CommentSection commentProps={commentProps} />
                      )}
                    </div>
                  )}
                </div>
                {/* )} */}
              </>
            ))}
          </InfiniteScroll>

          <SharePostModel sharePostProps={sharePostProps} />
          <PostReportModal reportModal={reportModal} />
          {isCollectionModal?.isModal && (
            <CollectionModal collectionProps={collectionProps} />
          )}
          <AddPost postProps={editProps} />
        </div>
      ) : (
        <div className="py-16 text-center text-gray-500">
          No post found yet!
        </div>
      )}
    </div>
  );
};

export default SinglePostCard;
