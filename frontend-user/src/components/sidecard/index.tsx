import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { useAtom } from "jotai";
import { CommentIcon, ShareIcon } from "../Icons";
import {
  AfterLikePostIcon,
  DeleteFillIcon,
  EditIcon,
  LikePostIcon,
  MydriveIcon,
  MyPhotoIcon,
  ThreeDotsIcon,
} from "@/utils/AppIcons";
import { getFirstLetter } from "@/utils/common";
import { allPostsData, isLoginModal, loggedInUser } from "@/store";
import {
  useAddComments,
  useDeleteComment,
  useDislikePost,
  useEditComment,
  useLikePost,
  useReportPost,
} from "@/hooks/post/mutation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getComments } from "@/services/post";
import Avatar from "../UIComponents/Avatar";
import GetShortTimeString from "@/components/timeShort";
import Link from "next/link";
import { useRouter } from "next/router";
import SharePostModel from "../singlePostCard/sharePostModel";
import PostAction from "../singlePostCard/postActions";
import PostReportModal from "../singlePostCard/postActions/postReportModal";
import CollectionModal from "../singlePostCard/collectionModal";
import { notifyError } from "../UIComponents/Notification";
import Button from "../buttons/Button";
import AddPost from "../addPost";
import { useGetSingleForPost } from "@/hooks/user/query";
export interface reportModalInterface {
  id: any;
  isModal: boolean;
}
interface collectionModal {
  id: string;
  isModal: boolean;
}
const Sidecard = ({ cardprops }: any) => {
  const {
    singlePostData,
    getSinglePostData,
    setSinglePostData,
    setIsReportModal,
    isReportModal,
  } = cardprops;
  const [actionPopUp, setActionPopUp] = useState({
    id: "",
    isVisible: false,
  });

  const [gallary, setGallary] = useState(false);
  const [currentUser] = useAtom(loggedInUser);
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const addComment = useAddComments();
  const commentEdit = useEditComment();
  const [isCommentEdit, setIsCommentEdit] = useState();
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(true);
  const [postComments, setPostComments] = useState([]);
  const [isShareModal, setIsShareModal] = useState<Boolean>(false);
  const [singlePostDetails, setSinglePostDetails] = useState<object>({});

  const [isCollectionModal, setIsCollectionModal] = useState<collectionModal>({
    id: "",
    isModal: false,
  });
  const [popUpMenu, setpopUpMenu] = useState({
    id: "",
    isVisible: false,
  });
  const [isAddPost, setIsAddPost] = useState(false);
  const [isPostEdit, setIsPostEdit] = useState(false);
  const [reportContentValue, setReportContentValue] = useState<string>();
  const [Posts, setPosts] = useAtom(allPostsData);

  const [option, setoption] = useState("spam");
  const postProps = React.useRef<HTMLDivElement>(null);
  const postRef = React.useRef<HTMLButtonElement | any>(null);
  const userCardRef = React.useRef<HTMLDivElement>(null);
  const actionRef = React.useRef<HTMLButtonElement | any>(null);
  const likePost = useLikePost();
  const dislikePost = useDislikePost();
  const deleteComment = useDeleteComment();
  const reportContent = useReportPost();

  const router = useRouter();
  const getSinglePostComments = () => {
    if (singlePostData?._id) {
      getComments({
        pathParams: { id: singlePostData?._id },
        query: {
          viewSize: 10000,
        },
      }).then((res: any) => {
        setPostComments(res?.data?.comments);
      });
    }
  };
  useEffect(() => {
    if (currentUser?.data && singlePostData?._id) {
      getSinglePostComments();
    }
    return () => {};
  }, [singlePostData?._id, currentUser?.data]);

  const handleKey = (event: { key: string }) => {
    if (event.key === "Enter") {
      if (isCommentEdit) {
        onEditComment(isCommentEdit);
      } else {
        onAddComment();
        setVisible(true);
      }
    }
  };

  const handleSendComment = () => {
    if (isCommentEdit) {
      onEditComment(isCommentEdit);
    } else {
      onAddComment();
      setVisible(true);
    }
  };
 
  const onAddComment = () => {
    const body = {
      comment,
    };
    addComment
      .mutateAsync({
        body: body,
        pathParams: { id: singlePostData?._id },
      })
      .then(() => {
        getSinglePostComments();
        setPosts(
          Posts?.map((item: any) => {
            return item?._id === singlePostData?._id
              ? {
                  ...item,
                  comment_count:
                    item?.comment_count === 0 ? 0 : item?.comment_count + 1,
                }
              : item?.post?._id === singlePostData?._id
              ? {
                  ...item,
                  post: {
                    ...item?.post,
                    comment_count:
                      item?.post?.comment_count === 0
                        ? 1
                        : item?.post?.comment_count + 1,
                  },
                }
              : { ...item };
          })
        );
        setSinglePostData({
          ...singlePostData,
          comment_count: Number(singlePostData?.comment_count) + 1,
        });
        
        setComment("");
      });
  };
  const onDeleteComment = (postId: string, commentId: string) => {
    deleteComment
      .mutateAsync({
        pathParams: {
          id: postId,
          commentId,
        },
      })
      .then((res) => {
        
        setSinglePostData({
          ...singlePostData,
          comment_count: Number(singlePostData?.comment_count) - 1,
        });
        setPosts(
          Posts?.map((item: any) => {
            return item?._id === singlePostData?._id
              ? {
                  ...item,
                  comment_count:
                    item?.comment_count <= 0 ? 0 : item?.comment_count - 1,
                }
              : item?.post?._id === singlePostData?._id
              ? {
                  ...item,
                  post: {
                    ...item?.post,
                    comment_count:
                      item?.post?.comment_count === 0
                        ? 1
                        : item?.post?.comment_count - 1,
                  },
                }
              : { ...item };
          })
        );
        getSinglePostComments();
        setActionPopUp({
          id: "",
          isVisible: false,
        });
      });
  };
  const onEditComment = (commentId: string) => {
    commentEdit
      .mutateAsync({
        pathParams: {
          commentId,
        },
        body: { comment },
      })
      .then((res) => {
        setActionPopUp({
          id: "",
          isVisible: false,
        });

        setIsCommentEdit(undefined);
        // getComments.refetch();
        setComment("");
        getSinglePostComments();
      });
  };

  const handleLikePost = (id: string) => {
    setPosts(
      Posts?.map((item: any) => {
        return item?._id === id
          ? {
              ...item,
              like_count: item?.like_count <= 0 ? 0 : +item?.like_count + 1,
              isLiked: true,
            }
          : item?.post?._id === id
          ? {
              ...item,
              post: {
                ...item?.post,
                like_count:
                  item?.post?.like_count <= 0 ? 0 : +item?.post?.like_count + 1,
                isLiked: true,
              },
            }
          : { ...item };
      })
    );
    likePost
      .mutateAsync({
        pathParams: {
          id,
        },
      })
      .then((res) => {
        getSinglePostData();
      })
      .catch((err) => {});
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
      .then((res) => {
        getSinglePostData();
      })
      .catch((err) => {});
  };
  dayjs.extend(relativeTime);
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      if (
        actionPopUp?.isVisible &&
        userCardRef.current &&
        !userCardRef.current.contains(e.target) &&
        !actionRef?.current?.contains(e.target)
      ) {
        setActionPopUp({
          id: "",
          isVisible: false,
        });
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [actionPopUp]);
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      if (
        popUpMenu?.isVisible &&
        postProps.current &&
        !postProps.current.contains(e.target) &&
        !postRef?.current?.contains(e.target)
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
  const sharePostProps = {
    isShareModal,
    setIsShareModal,
    singlePostDetails: singlePostData,
    isOpenPost: true,
  };
  const actionProps = {
    setpopUpMenu,
    popUpMenu,
    // getPosts,
    setIsReportModal,
    setIsCollectionModal,
    setIsAddPost,
    setIsPostEdit,
    setSinglePostDetails,
    setPosts,
    Posts,
    userCardRef: postProps,
  };
  const collectionProps = {
    isCollectionModal,
    setIsCollectionModal,
  };
  const addPostProps = {
    isAddPost,
    setIsAddPost,
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
  return (
    <div className="Sidecard-MainContainer h-full w-full rounded-lg bg-white pb-4 md:w-[90%] lg:m-0  lg:w-[100%] ">
     
      <div className="Top-Container hidden  h-[65px] px-2 py-2 lg:block">
      

        <div className="flex justify-between ">
          <div className="flex">
            {singlePostData?.user?.avatar_url ? (
             
              <div
                className=" relative w-[65px] cursor-pointer xxs:h-[45px] xxs:w-[45px] md:h-[45px] lg:h-[45px] lg:w-[45px]  "
                onClick={() => {
                  if (currentUser?.data?._id) {
                    router.push(`/profile/${singlePostData?.user?._id}`);
                  } else {
                    setIsModel(true);
                  }
                }}
              >
                <Image
                  src={singlePostData?.user?.avatar_url}
                  alt={
                    singlePostData?.tags?.length
                      ? singlePostData?.tags
                      : singlePostData?.description
                      ? singlePostData?.description
                      : `meme by ${singlePostData?.user?.user_handle}`
                  }
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: "50px" }}
                />
              </div>
            ) : (
              <div
                onClick={() => {
                  if (currentUser?.data?._id) {
                    router.push(`/profile/${singlePostData?.user?._id}`);
                  } else {
                    setIsModel(true);
                  }
                }}
                className="flex  h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full bg-gray-400 text-sm text-white"
              >
                {getFirstLetter(singlePostData?.user?.user_handle)}
              </div>
              
            )}
            <div>
              <div
                onClick={() => {
                  if (currentUser?.data?._id) {
                    router.push(`/profile/${singlePostData?.user?._id}`);
                  } else {
                    setIsModel(true);
                  }
                }}
                className=" xxs: ml-2 flex items-center justify-center  text-[14px] text-sm  "
              >
                <p className="cursor-pointer font-semibold text-gray-500 ">
                  {singlePostData?.user?.user_handle}
                </p>
              </div>
              <p className="ml-2 text-xs text-gray-600 ">
                <GetShortTimeString time={singlePostData?.created_at} />
              </p>
            </div>
          </div>
          <div className="xxs:text-[12px]  md:text-sm ">
            <div className=" relative flex justify-end">
              <div
                className="cursor-pointer pl-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setpopUpMenu({
                    isVisible: !popUpMenu?.isVisible,
                    id:
                      popUpMenu?.id === singlePostData?._id
                        ? ""
                        : singlePostData?._id,
                  });
                }}
                ref={postRef}
              >
                <ThreeDotsIcon />
              </div>

              <PostAction
                actionProps={{
                  ...actionProps,
                  item: singlePostData,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {singlePostData?.description && (
        <div className="description hidden h-fit lg:block">
          {/* Description */}
          <div
            style={{
              whiteSpace: "pre-line",
            }}
            className="text mt-2 flex gap-2 overflow-hidden break-all  p-2 text-justify font-medium text-gray-600"
          >
            {singlePostData?.description}
          </div>
        </div>
      )}
      <div className="Section1  flex h-fit flex-col">
        <div className="CommentSection1 hiddden  h-fit lg:block ">
          {/* number of comments and likes */}
          <div className="hidden lg:block">
            {singlePostData?.tags?.length > 0 && (
              <div className="px-6 pt-2 pb-2">
                {singlePostData?.tags?.map((item: any, idx: number) => (
                  <button key={idx}>
                    <span
                      onClick={() =>
                        router.push(`/search?tab=all&&search_query=${item}`)
                      }
                      className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      #{item}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="  lg: flex justify-between px-10   pl-3 pr-3 text-sm  font-semibold text-gray-600 xxs:w-full">
              <p>
                <span>
                  {singlePostData?.like_count > 0
                    ? singlePostData?.like_count
                    : ""}
                </span>{" "}
                Likes
              </p>
              <p>
                <span>
                  {singlePostData?.comment_count > 0
                    ? singlePostData?.comment_count
                    : ""}
                </span>{" "}
                Comments
              </p>
            </div>
          </div>
        </div>
        <div className="CommentSection2 h-fit ">
          
          <div className=" flex    w-full justify-between border-b border-t p-2 md:items-center">
            <div className=" xxs: md:px-1">
              <div className="ml-0 flex cursor-pointer gap-1">
                {singlePostData?.isLiked ? (
                  <button
                    className="flex gap-2  "
                    onClick={() => {
                      {
                        currentUser?.data?._id
                          ? handleDislikePost(singlePostData?._id)
                          : setIsModel(true);
                      }
                    }}
                  >
                    <AfterLikePostIcon />
                    <span className="mx-1.5  mt-1 text-[16px] font-medium text-[#FF5E34] ">
                      Like
                    </span>
                  </button>
                ) : (
                  <button
                    className="flex gap-2"
                    onClick={() => {
                      currentUser?.data?._id
                        ? handleLikePost(singlePostData?._id)
                        : setIsModel(true);
                    }}
                  >
                    <LikePostIcon />
                    <span className=" xxs:  mt-1 text-[16px] font-medium text-[#FF5E34] md:mx-1.5">
                      Like
                    </span>
                  </button>
                )}
              </div>
            </div>
            <button
              className="xxs: md:mr- flex cursor-pointer items-center gap-1 pl-0 "
              onClick={() => !currentUser?.data?._id && setIsModel(true)}
            >
              <CommentIcon />
              <span className="xxs: mt-1 pl-0 text-[16px] font-medium text-[#FF5E34] md:ml-1.5 ">
                Comment
              </span>
            </button>
            <div>
              <button
                className="flex cursor-pointer items-center gap-1"
                onClick={() => {
                  if (currentUser?.data?._id) {
                    // handleLikePost(item?._id);
                    setSinglePostDetails(singlePostData);
                    setIsShareModal(true);
                  } else {
                    setIsShareModal(true);
                    // setIsModel(true);
                  }
                }}
              >
                <ShareIcon />
                <span className="mx-1.5  text-[16px] font-medium text-[#FF5E34] ">
                  Share
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="section2   lg:h-[580px] ">
        <div className="inputfield  b sticky mb-0 ">
         
          {currentUser?.data?._id && (
            <div className="main ml-2 flex justify-start  ">
              <div className="image h-[55px] w-[50px] cursor-pointer px-2 py-1 ">
                <Link href={`/profile/${currentUser?.data?._id}`}>
                  {currentUser?.data?.avatar_url ? (
                    <div className="relative top-1 mb-5 h-[40px] w-[40px]  rounded-full drop-shadow-md  ">
                      <Image
                        src={currentUser?.data?.avatar_url}
                        style={{ borderRadius: "40px" }}
                        alt="profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ) : (
                    <div className="flex  h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-400 text-sm text-white">
                      {getFirstLetter(currentUser?.data?.user_handle)}
                    </div>
                  )}
                </Link>
              </div>
              <div className="input  h-[55px] w-full py-2 px-3 ">
                <div className="flex ">
                  <input
                    value={comment}
                    placeholder="Add comment"
                    className="xxs: md:text-md mr-3 rounded-md  border  p-2 outline-none  	placeholder:text-sm"
                    style={{ height: "35px", width: "100%" }}
                    onFocus={() => setVisible(false)}
                    onBlur={() => setVisible(true)}
                    onChange={(event) => {
                      setComment(event.target.value);
                    }}
                    onKeyDown={handleKey}
                  />
                  <button
                    className="rounded-md bg-primary-500 px-2 py-0 text-white drop-shadow-md"
                    onClick={handleSendComment}
                  >
                    send
                  </button>
                </div>
                {visible && (
                  <div className="absolute  right-8 bottom-3.5 flex justify-between text-justify text-xl text-[#FF5E34] ">
                    <button
                    
                    >
                      
                  </div>
                )}
                {gallary && (
                  <div className="absolute bottom-14 left-1 flex items-center justify-center rounded-md bg-white text-center shadow-md">
                    <div className="  flex flex-row  rounded-md ">
                      <button className="flex w-[100px] flex-col  justify-center p-2 hover:bg-gray-400">
                        <div className=" mx-auto ">
                          <MydriveIcon />
                        </div>
                        <p> My Device</p>
                      </button>
                      <button className="flex w-[100px] flex-col  items-center justify-center p-2 hover:bg-gray-400">
                        <div className=" mx-auto">
                          <MyPhotoIcon />
                        </div>
                        <p className=" ">Photos</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* section where mapped comments come */}

        <div
          className={` w-full overflow-y-auto bg-white ${
            postComments?.length
              ? `${postComments?.length === 1 ? "h-[200px]" : ""} lg:h-[600px]`
              : "h-[200px] lg:h-[600px]"
          }`}
          style={{ maxHeight: "600px" }}
        >
          {postComments?.length > 0 ? (
            <>
              {postComments?.map((item: any, idk: any) => (
                <div className=" " key={idk}>
                  <div className=" ">
                    <div className=" relative flex  w-full  p-3  text-center text-base text-gray-700   ">
                      <div className="flex w-full">
                        <div className="">
                          <Link href={`/profile/${item?.user?._id}`}>
                            {item?.user?.avatar_url ? (
                              <div className="relative h-[50px] w-[50px] cursor-pointer rounded-full">
                                <Image
                                  src={item?.user?.avatar_url}
                                  style={{ borderRadius: "40px" }}
                                  alt="userProfile"
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            ) : (
                              <div className="h-[50px] w-[50px] cursor-pointer ">
                                <Link href={`/profile/${item?.user?._id}`}>
                                  <Avatar name={item?.user.user_handle} />
                                </Link>
                              </div>
                            )}
                          </Link>
                        </div>

                        <div className="   px-2 text-left text-sm ">
                          <div className="flex cursor-pointer flex-col">
                            <Link href={`/profile/${item?.user?._id}`}>
                              <p className="p-1 text-left leading-none text-gray-900 ">
                                <span className=" font-semibold ">
                                  {item?.user?.user_handle}
                                </span>
                              </p>
                            </Link>
                            
                            <div
                              className="
                         break-all px-1  pb-1 pt-1 text-left leading-6 text-gray-600 "
                            >
                              <p>{item?.comment}</p>
                            </div>
                            

                            <p className="pl-1 text-[14px] text-[#858585] ">
                              {dayjs(item?.created_at).fromNow()}
                            </p>
                          </div>
                        </div>
                        
                      </div>
                      <div className="">
                        {currentUser?.data?._id === item?.user?._id ||
                        currentUser?.data?._id === item?.post?.user ? (
                          <div
                            ref={actionRef}
                            className=" mr-5"
                            onClick={() => {
                              setActionPopUp({
                                id: actionPopUp?.id !== "" ? "" : item?._id,
                                isVisible: !actionPopUp?.isVisible,
                              });
                            }}
                          >
                            <button>
                              <ThreeDotsIcon />
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                        {actionPopUp.id === item?._id && (
                          <div
                            ref={userCardRef}
                            className=" absolute top-9 right-6 z-10  rounded-[8px] bg-white px-2 py-2  "
                            style={{
                              boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            {currentUser?.data?._id === item?.user?._id && (
                              <div className="rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]">
                                <button
                                  onClick={(e) => {
                                    setActionPopUp({
                                      isVisible: false,
                                      id: "",
                                    });

                                    setIsCommentEdit(item?._id);

                                    setComment(item?.comment);
                                  }}
                                  className="  flex gap-3 "
                                >
                                  <div className="rounded-full bg-[#D1D0D0] p-2">
                                    <EditIcon />
                                  </div>
                                  <span className="mt-1 text-sm">Edit</span>
                                </button>
                              </div>
                            )}

                            <div className="rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]  ">
                              <button
                                onClick={() => {
                                  onDeleteComment(item?.post_id, item?._id);
                                }}
                                className="flex gap-3"
                              >
                                <div className="rounded-full bg-[#D1D0D0] p-2">
                                  <DeleteFillIcon />
                                </div>
                                <span className="mt-1 text-sm">Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-20 w-full"></div>
            </>
          ) : (
            <div className="mt-[20%] flex justify-center text-lg text-gray-600">
              No comment added yet!
            </div>
          )}
        </div>
      </div>
      <AddPost postProps={editProps} />
      <PostReportModal reportModal={reportModal} />
      {isCollectionModal?.isModal && (
        <CollectionModal collectionProps={collectionProps} />
      )}
      {isShareModal && <SharePostModel sharePostProps={sharePostProps} />}
    </div>
  );{
};

export default Sidecard;
