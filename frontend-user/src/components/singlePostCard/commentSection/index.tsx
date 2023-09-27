import GetShortTimeString from "@/components/timeShort";
import Avatar from "@/components/UIComponents/Avatar";
import { notifyError } from "@/components/UIComponents/Notification";
import Spin from "@/components/UIComponents/Spin";
import {
  useAddComments,
  useDeleteComment,
  useEditComment,
} from "@/hooks/post/mutation";
import { getComments } from "@/services/post";
import { allPostsData, loggedInUser } from "@/store";
import { DeleteFillIcon, EditIcon, ThreeDotsIcon } from "@/utils/AppIcons";
import { getInitials } from "@/utils/common";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const CommentSection = ({ commentProps }: any) => {
  const { isCommentOpen, getPosts, setPosts, Posts } = commentProps;
  const [actionPopUp, setActionPopUp] = useState({ isVisible: false, id: "" });
  const [comment, setComment] = useState("");
  const [totalCommentCount, setTotalCommentCount] = useState<any>();
  const [startIndex, setStartIndex] = useState(0);
  const [currentUser] = useAtom(loggedInUser);
  const [editComment, setEditComment] = useState<any>(undefined);
  const [allPosts, setAllPosts] = useAtom(allPostsData);

  const [allComments, setAllComments] = useState<any[]>([]);
  const addComment = useAddComments();
  const deleteComment = useDeleteComment();
  const commentEdit = useEditComment();
  const [loading, setLoading] = useState(false);
  const fieldRef = React.useRef<any>(null);
  const viewSize = 4;
  const userCardRef = React.useRef<HTMLDivElement>(null);
  const actionRef = React.useRef<HTMLButtonElement | any>(null);
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
  let firstStartIndex = 0;
  const getCommentList = () => {
    setLoading(true);
    getComments({
      pathParams: { id: isCommentOpen },
      query: {
        viewSize,
        startIndex,
        isFilterChangedOrStartIndexZero: startIndex === 0,
      },
    })
      .then((res: any) => {
        if (startIndex) {
          setAllComments([...allComments, ...res?.data?.comments]);
        } else {
          setAllComments(res?.data?.comments);
        }
        setStartIndex((prev) => prev + viewSize);
        setLoading(false);
        setTotalCommentCount(res?.data?.total_count);
      })
      .catch((er) => {
        setLoading(false);
      });
  };

  const handleKey = (event: { key: string }) => {
    if (event.key === "Enter") {
      if (editComment) {
        onEditComment();
      } else {
        onAddComment();
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    if (isCommentOpen) {
      getComments({
        pathParams: { id: isCommentOpen },
        query: {
          startIndex: firstStartIndex,
          viewSize,
          isFilterChangedOrStartIndexZero: firstStartIndex === 0,
        },
      })
        .then((res: any) => {
          setStartIndex(4);
          if (firstStartIndex !== 0) {
            setAllComments([...allComments, ...res?.data?.comments]);
          } else {
            setAllComments(res?.data?.comments);
          }
          firstStartIndex += 10;
          setTotalCommentCount(res?.data?.total_count);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })
        .catch((err) => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    }
    return () => {
      setStartIndex(0);
      setAllComments([]);
      setTotalCommentCount(0);
    };
  }, [isCommentOpen]);

  const onAddComment = () => {
    if (comment) {
      const body = {
        comment,
      };
      addComment
        .mutateAsync({
          body: body,
          pathParams: { id: isCommentOpen },
        })
        .then((res: any) => {
          if (res?.message === "success") {
            setAllComments([
              { ...res?.data, user: { ...currentUser?.data } },
              ...allComments,
            ]);
            setAllPosts(
              allPosts?.map((item: any) => {
                return item?._id === isCommentOpen
                  ? {
                      ...item,
                      comment_count:
                        item?.comment_count === 0 ? 0 : item?.comment_count + 1,
                    }
                  : item?.post?._id === isCommentOpen
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
            setPosts(
              Posts?.map((item: any) => {
                return item?._id === isCommentOpen
                  ? { ...item, comment_count: item?.comment_count + 1 }
                  : item?.post?._id === isCommentOpen
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
          }

          setComment("");
        })
        .catch((err) => {
          notifyError({
            message: "!opps something went wrong. please try again",
          });
        });
    }
  };
  const onDeleteComment = (postId: string, commentId: string) => {
    deleteComment
      .mutateAsync({
        pathParams: {
          id: postId,
          commentId,
        },
      })
      .then((res: any) => {
        // getComments.refetch();
        if (res?.message === "success") {
          setAllComments(allComments?.filter((fil) => fil?._id !== commentId));
          setPosts(
            Posts?.map((item: any) => {
              return item?._id === isCommentOpen
                ? {
                    ...item,
                    comment_count:
                      item?.comment_count <= 0 ? 0 : item?.comment_count - 1,
                  }
                : item?.post?._id === isCommentOpen
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
          setAllPosts(
            allPosts?.map((item: any) => {
              return item?._id === isCommentOpen
                ? {
                    ...item,
                    comment_count:
                      item?.comment_count <= 0 ? 0 : item?.comment_count - 1,
                  }
                : item?.post?._id === isCommentOpen
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
        }
        setActionPopUp({
          isVisible: false,
          id: "",
        });
      })
      .catch((err) => {
        notifyError({
          message: "!opps something went wrong. please try again",
        });
      });
  };
  const onEditComment = () => {
    commentEdit
      .mutateAsync({
        pathParams: {
          commentId: editComment?._id,
        },
        body: { comment },
      })

      .then((res: any) => {
        const comments = allComments?.map((item) => {
          return item?._id === res?.data?._id
            ? { ...res?.data, user: { ...currentUser?.data } }
            : item;
        });
        setAllComments(comments);
        setEditComment(null);
        setComment("");
      })
      .catch((err) => {
        notifyError({
          message: "!opps something went wrong. please try again",
        });
      });
  };

  return (
    <div className="relative my-2 mx-1 w-full">
      <div
        className=" my-4 flex gap-1 "
        onBlur={() => {
          setActionPopUp({
            isVisible: false,
            id: "",
          });
        }}
      >
        <input
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          placeholder="Add comment "
          className="h-[2.5rem] w-full rounded-md border py-0.5 px-1 text-[15px] outline-none"
          onKeyDown={handleKey}
        />

        <button
          onClick={() => {
            if (editComment?._id) {
              if (!editComment?.isLoading) onEditComment();
            } else {
              if (!addComment?.isLoading) onAddComment();
            }
          }}
          className="ml-2 rounded-md border bg-primary-500 px-2 text-white shadow-md"
        >
          {addComment?.isLoading || editComment?.isLoading ? (
            <div className="my-auto mt-2">
              <Spin color={"white"} />
            </div>
          ) : editComment?._id ? (
            "update"
          ) : (
            "send"
          )}
        </button>
      </div>
      <div
        style={{ maxHeight: "280px", minHeight: "150px", minWidth: "100px" }}
        className=" overflow-x-auto overflow-y-auto"
      >
        {loading ? (
          <div className="flex justify-center pt-10">
            <Spin />
          </div>
        ) : allComments?.length > 0 ? (
          allComments?.map((item: any) => (
            <div className="flex w-full gap-2 border-b py-2" key={item?._id}>
              <Link href={`/profile/${item?.user?._id}`}>
                <div className="cursor-pointer">
                  {item?.user?.avatar_url ? (
                    <div className="">
                      <Image
                        src={item?.user?.avatar_url}
                        alt="profile "
                        height={50}
                        width={50}
                        // layout="fill"
                        objectFit="cover"
                        style={{ borderRadius: "50%" }}
                      />
                    </div>
                  ) : (
                    // </div>
                    // <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-400 text-white md:h-[50px] md:w-[50px] ">
                    //   {getInitials(item?.user?.name)}
                    // </div>
                    <div className="h-[40px] w-[40px]">
                      <Avatar name={item?.user?.user_handle} />
                    </div>
                  )}
                </div>
              </Link>
              <div className="w-full">
                <div className="relative flex justify-between">
                  <div className="mt-1 flex space-x-2">
                    <Link href={`/profile/${item?.user?._id}`}>
                      <p className="cursor-pointer text-[14px] font-medium text-black sm:text-[16px]">
                        {item?.user?.user_handle}
                      </p>
                    </Link>
                    <p className=" text-[8px] text-[#858585] sm:text-[14px]">
                      {/* {dayjs(item?.created_at).fromNow()} */}
                      <GetShortTimeString time={item?.created_at} />
                    </p>
                  </div>
                  <div className="">
                    {(currentUser?.data?._id === item?.user?._id ||
                      currentUser?.data?._id === item?.post?.user) && (
                      <div
                        ref={actionRef}
                        className=" px-4"
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
                    )}
                    {actionPopUp?.id === item?._id && (
                      <div
                        ref={userCardRef}
                        className=" absolute top-1 right-6  rounded-[8px] bg-white px-2 py-2 "
                        style={{
                          boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.25)",
                          zIndex: 10,
                        }}
                      >
                        {currentUser?.data?._id === item?.user?._id && (
                          <div className="rounded-[5px] px-2.5 py-1.5 hover:bg-[#EDEDED]">
                            <button
                              onClick={() => {
                                // setCommentEdit(item);
                                setEditComment(item);
                                setComment(item.comment);
                                setActionPopUp({
                                  id: "",
                                  isVisible: false,
                                });
                              }}
                              className="flex gap-3 "
                            >
                              <div className="rounded-full bg-[#D1D0D0] p-2">
                                <EditIcon />
                              </div>
                              <span className="mt-1 text-sm">Edit</span>
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            onDeleteComment(item?.post_id, item?._id);
                          }}
                          className="rounded-[5px]  hover:bg-[#EDEDED]"
                        >
                          <div className="flex gap-3 px-2.5 py-1.5">
                            <div className="rounded-full bg-[#D1D0D0] p-2">
                              <DeleteFillIcon />
                            </div>
                            <span className="mt-1 text-sm"> Delete</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className="my-2.5 mt-3">
                  {editComment?._id === item?._id ? (
                    <div className="flex w-full gap-3 ">
                      <input
                        value={editComment?.comment}
                        onChange={(e) => {
                          setEditComment({
                            ...editComment,
                            comment: e.target.value,
                          });
                        }}
                        type="text"
                        className=" h-8 rounded xxxs:w-32   lg:w-80 "
                      />
                      <button
                        onClick={() => {
                          onEditComment(item?._id);
                        }}
                        className="rounded-md border bg-primary-500 px-2 text-sm text-white shadow-md"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <p className="text-[16px] font-medium text-[#858585]">
                      {item?.comment}
                    </p>
                  )}
                </div> */}
                {/* <div className="md:w-[300px] lg:w-[250px] "> */}
                <p
                  // style={{ maxWidth: "300px", whiteSpace: "pre-line" }}
                  className=" w-[90%] break-all  text-[16px]  font-medium text-[#858585]"
                >
                  {item?.comment}
                </p>
              </div>
            </div>
            // </div>
          ))
        ) : (
          <div className="item-center mt-6 text-center text-gray-500">
            No comment add yet
          </div>
        )}
      </div>
      {totalCommentCount > 4 && startIndex < totalCommentCount && (
        <button
          onClick={() => {
            getCommentList();

            fieldRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-1 right-5 text-sm text-primary-600"
        >
          See more
        </button>
      )}
    </div>
  );
};

export default CommentSection;
