import React, { useState } from "react";
import {
  FaceBookIcon,
  Twitter,
  RepostIcon,
  InstagramIcon,
  WhatsAppIcon,
  CrossIcon,
} from "@/utils/AppIcons";
import { FaRegCopy } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";

import copy from "copy-to-clipboard";
import { useCreatePost } from "@/hooks/post/mutation";
import Modal from "@/components/Modal";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "@/components/UIComponents/Notification";
import { useAtom } from "jotai";
import { isLoginModal, loggedInUser } from "@/store";
import Link from "next/link";
import { useCheckTodayPostCount } from "@/hooks/post/query";
import Spin from "@/components/UIComponents/Spin";

const SharePostModel = ({ sharePostProps }: any) => {
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [currentUser] = useAtom(loggedInUser);
  const [__, setIsModel] = useAtom(isLoginModal);
  const checkTodayPostCount: any = useCheckTodayPostCount({
    currentUser,
  });

  const {
    isShareModal,
    setIsShareModal,
    singlePostDetails,
    getPosts,
    scrollToBottom,
    isOpenPost,
    inviteUser,
    link,
  } = sharePostProps;
  const createPost = useCreatePost();
  const user_handle = singlePostDetails?._id;
  const copyToClipboard = () => {
    setIsTextCopied(true);
    setTimeout(() => {
      setIsTextCopied(false);
    }, 3000);
    // toast.success('link copied successfully')
  };
  const onHandleRepost = async () => {
    if (checkTodayPostCount?.data?.postCount <= 0) {
      return notifyError({
        message: "You already posted 10 posts!",
      });
    }
    const formData = new FormData();
    const repost = "true";

    formData.append("repost", new Boolean(repost).toString());
    formData.append(
      "rePostedID",
      singlePostDetails?.isRePosted
        ? singlePostDetails?.post?._id
        : singlePostDetails?._id
    );

    createPost
      .mutateAsync({
        body: formData,
      })
      .then((res) => {
        setIsShareModal(false);
        // getPosts.refetch();
        !isOpenPost && scrollToBottom();
        checkTodayPostCount.refetch();
        notifySuccess({ message: "Post reposted successfully!" });
      })
      .catch((err) => {
        notifyWarning({ message: "You have already posted 10 Posts!" });
      });
  };
  return (
    <div>
      <Modal
        isVisiable={isShareModal}
        onClose={setIsShareModal}
        className=" mt-20 w-[90%] sm:w-[70%] lg:w-[55%] xl:w-[60%]"
      >
        <div className=" gap-2 p-2">
          <div className="m-2 flex justify-end ">
            <button
              className="rounded bg-gray-100 px-4 py-2"
              onClick={() => {
                setIsShareModal(false);
              }}
            >
              <CrossIcon />
            </button>
          </div>
          <div className="mb-0 mt-5 text-center xl:mt-10 xl:mb-6">
            <p className="text-[20px] font-medium xl:text-[35px] ">
              {inviteUser ? "Invite User" : "Share this post"}
            </p>
          </div>
          <div className=" flex justify-center ">
            <div className=" mt-5 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:mt-10 xl:grid-cols-3">
              <button className="w-max rounded-md border  border-[#D9D9D9] bg-white py-2.5 px-4 text-[#858585] lg:px-10">
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${
                    link
                      ? link
                      : singlePostDetails?.post
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex justify-center gap-2">
                    <FaceBookIcon />
                    <span className="">FaceBook</span>
                  </div>
                  {/* <div
                  className="fb-share-button"
                  data-href={singlePostDetails?.media?.url}
                  data-layout="button_count"
                  data-size="small"
                >
                  <a
                    target="_blank"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${singlePostDetails?.media?.url}%2F&amp;src=${singlePostDetails?.media?.url}`}
                    className="fb-xfbml-parse-ignore"
                    rel="noreferrer"
                  >
                    Share
                  </a>
                  <iframe
                    src={`https://www.facebook.com/plugins/share_button.php?href=${singlePostDetails?.media?.url}%2F&layout=button&size=small&width=67&height=20&appId`}
                    width="67"
                    height="20"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder={0}
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                </div> */}
                </Link>
              </button>
              <button className=" rounded-md border border-[#D9D9D9] bg-white py-2.5 text-[#858585] lg:px-10">
                <a
                  href={
                    link ||
                    `https://twitter.com/intent/tweet?url=${
                      singlePostDetails?.post
                        ? singlePostDetails?.post?.media?.url
                        : singlePostDetails?.media?.url
                    }`
                  }
                  data-action="share/twitter/share"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex justify-center gap-2">
                    <Twitter />
                    <span className="">twitter</span>
                  </div>
                </a>
              </button>

              <button className="item-center rounded-md border border-[#D9D9D9] bg-white py-2.5 text-[#858585] lg:px-10">
                <a
                  href={
                    link
                      `https://api.whatsapp.com/send?text=${link}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex justify-center gap-2">
                    <WhatsAppIcon />
                    <span className="">WhatsApp</span>
                  </div>
                </a>
              </button>
              {!inviteUser && (
                <>
                  {currentUser?.data?._id && (
                    <button
                      onClick={() => {
                        if (!createPost?.isLoading) {
                          if (currentUser?.data?._id) {
                            onHandleRepost();
                          } else {
                            setIsModel(true);
                          }
                        }
                      }}
                      className={` hidden w-max rounded-md  border border-[#D9D9D9] bg-white ${
                        createPost?.isLoading ? "pb-0 pt-2" : "py-2.5"
                      }  text-[#858585] lg:px-10 xl:block`}
                    >
                      {createPost?.isLoading ? (
                        <div className="-pb-2 mb-0 w-20">
                          <Spin />
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2 ">
                          <RepostIcon />
                          <span className="">Repost</span>
                        </div>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {!inviteUser && (
            <>
              {currentUser?.data?._id && (
                <div className="mb-5 mt-0 flex justify-center md:mt-10">
                  <button
                    onClick={() => {
                      if (!createPost?.isLoading) {
                        if (currentUser?.data?._id) {
                          onHandleRepost();
                        } else {
                          setIsModel(true);
                        }
                      }
                      // onHandleRepost();
                    }}
                    className={` hidden w-max rounded-md  border border-[#D9D9D9] bg-white ${
                      createPost?.isLoading ? "pb-0 pt-2" : "py-2.5"
                    }  text-[#858585] lg:px-10 xl:block`}
                  >
                    {createPost?.isLoading ? (
                      <div className="-pb-2 mb-0 w-20">
                        <Spin />
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2 ">
                        <RepostIcon />
                        <span className="">Repost</span>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
          <div className="my-5 mt-10">
            <p className="text-center text-xl">copy link </p>

            <div className=" flex justify-center">
              <div className="flex  w-[70%] cursor-pointer justify-center gap-4">
                <input
                  value={
                    link 
                  }
                  className="mt-5  w-[15rem]  rounded-md border border-gray-400 py-1 px-1 text-lg outline-none  xl:ml-[8rem] xl:w-[74%]"
                />

                {isTextCopied ? (
                  <div className="text-end text-xs">
                    <p
                      className={` mt-7  ${
                        isTextCopied
                          ? "opacity-100  transition delay-300 "
                          : "opacity-0 duration-1000"
                      }  text-[#858585] `}
                    >
                      <AiOutlineCheck color="#00D100" />
                    </p>
                  </div>
                ) : (
                  <span
                    // onClick={copyToClipboard}
                    className="mt-7 "
                  >
                    <FaRegCopy onClick={copyToClipboard} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SharePostModel;
