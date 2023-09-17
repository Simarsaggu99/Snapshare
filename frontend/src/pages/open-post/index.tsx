import Sidecard, { reportModalInterface } from "@/components/sidecard";
import React, { useEffect, useRef } from "react";
import IMG from "next/image";
import PopularFeed from "@/components/popularFeed";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  useDeleteComment,
  useDislikePost,
  useLikePost,
} from "@/hooks/post/mutation";
import SharePostModel from "@/components/singlePostCard/sharePostModel";
import { getSinglePostData as singlePost } from "@/services/post";
import { useViewPost } from "@/hooks/post/mutation";
import advertisement from "~/images/logo_icon.png";
import CollectionModal from "@/components/singlePostCard/collectionModal";
import { useAtom } from "jotai";
import { allPostsData, isLoginModal, loggedInUser } from "@/store";

import { notifyError } from "@/components/UIComponents/Notification";
import GetShortTimeString from "@/components/timeShort";
import { ThreeDotsIcon } from "@/utils/AppIcons";
import PostAction from "@/components/singlePostCard/postActions";
import { getFirstLetter } from "@/utils/common";
import AddPost from "@/components/addPost";
import { RiAlarmWarningFill } from "react-icons/ri";
import ArrowLink from "@/components/links/ArrowLink";
import PostPageSeo from "@/components/PostPageSeo";

const SideCard = ({ postDetail }: any) => {
  const [sharePage, setSharePage] = useState(false);
  const [singlePostDetails, setSinglePostDetails] = useState({});
  const [currentUser] = useAtom(loggedInUser);
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const router = useRouter();
  const [Posts, setPosts] = useAtom(allPostsData);
  const [isAddPost, setIsAddPost] = useState(false);
  const [isPostEdit, setIsPostEdit] = useState(false);
  const [isPostFound, setIsPostFound] = useState(false);
  const [popUpMenu, setpopUpMenu] = useState({
    id: "",
    isVisible: false,
  });
  const [isReportModal, setIsReportModal] = useState<reportModalInterface>({
    id: "",
    isModal: false,
  });
  const postId = router.query.id;
  const viewPost = useViewPost();
  const dataFetchedRef = useRef(false);
  const postRef = React.useRef<HTMLButtonElement | any>(null);
  const [singlePostData, setSinglePostData] = useState<any>(postDetail);
  const [isCollectionModal, setIsCollectionModal] = useState<any>({
    isModal: false,
    id: "",
  });
  const likePost = useLikePost();
  const dislikePost = useDislikePost();
  const deleteComment = useDeleteComment();
  const sharePostProps = {
    isShareModal: sharePage,
    setIsShareModal: setSharePage,
    singlePostDetails: singlePostData,
    isOpenPost: true,
  };

  const getSinglePostData = () => {
    singlePost({ pathParams: { postId } })
      .then((res: any) => {
        setSinglePostData(res?.data);
        if (currentUser?.data?._id) {
          viewPost.mutateAsync({
            pathParams: { id: postId },
          });
        }
      })
      .catch((er) => {
        console.log("er", er);
        if (er?.response?.status === 404) {
          setIsPostFound(true);
        } else {
          notifyError({
            message: "opps something went wrong while fetching post data",
          });
        }
      });
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    if (postId) {
      getSinglePostData();
      setSinglePostData(postDetail);
    }
    return () => {
      dataFetchedRef.current = false;
      setSinglePostData({});
    };
  }, [router.query.id]);

  const cardprops = {
    singlePostData,
    getSinglePostData,
    setSinglePostData,
    isReportModal,
    setIsReportModal,
  };
  const collectionProps = {
    isCollectionModal,
    setIsCollectionModal,
  };

  const [dynamicHeightImage, setDynamic]: any = useState({});
  function getImageDimensions(url: any) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = function () {
        reject("Failed to load image");
      };
      img.src = url;
    });
  }

  useEffect(() => {
    getImageDimensions(singlePostData?.media?.url)
      .then((dimensions: any) => {
        if (typeof window !== "undefined") {
          setDynamic({
            xlScreen: (
              dimensions.height *
              ((window.screen.width * 0.57) / dimensions.width)
            ).toFixed(0),
            lgScreen: (
              dimensions.height *
              ((window.screen.width * 0.5) / dimensions.width)
            ).toFixed(0),
            MobileScreen: (
              dimensions.height *
              (window.screen.width / dimensions.width)
            ).toFixed(0),
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      setDynamic({});
    };
  }, [
    singlePostData?.media?.url,
    typeof window !== "undefined" && window.screen.width,
  ]);
  const actionProps = {
    setpopUpMenu,
    popUpMenu,
    // getPosts,
    isReportModal,
    setIsReportModal,
    setIsCollectionModal,
    setIsAddPost,
    isAddPost,
    isPostEdit,
    setIsPostEdit,
    setSinglePostDetails,
    // setPosts,
    // Posts,
    // userCardRef: postProps,
  };
  const editProps = {
    isAddPost,
    setIsAddPost,
    setIsPostEdit,
    isPostEdit,
    singlePostDetails,
    setSinglePostDetails,
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
  return isPostFound ? (
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
    <>
      <PostPageSeo singlePostData={postDetail} />
      <div className="parentcontainer">
        {/* parent div */}

        <div className="Main_Container lg:flex-cols-3 xxxs:flex-col-1 relative  flex w-full  gap-2  ">
          {/* container having ad post and comment  */}

          <div className="advertisement sticky top-20 mt-5  hidden h-[550px] w-[20%] lg:block">
            {/* container having ad */}
            <div className={` ${" mx-4 "} `}>
              <div
                className="roudned-lg overflow-hidden bg-white px-4 py-3 shadow-md "
                style={{ borderRadius: "10px" }}
              >
                <span className="flex  justify-start text-xl font-bold text-gray-600 ">
                  Ad
                </span>

                {/* notifications */}
                <div className="relative mt-5 w-[100%] ">
                  <IMG
                    src={advertisement}
                    style={{ borderRadius: "10px" }}
                    alt="advertisment"
                    height={300}
                  />
                </div>
                <div className="mt-3 "></div>
              </div>
            </div>
          </div>

          <div className="centralpart  flex   w-[100%] flex-col xxxs:justify-start lg:w-[50%]   lg:gap-10  xl:w-[57%]">
            {/* container containing post and popular slab */}
            <div className="post w-[100%] bg-white   md:my-5   lg:px-0 ">
              <div className="mb-2  border-b  pb-1 lg:hidden">
                <div className="mx-2 flex justify-between pt-3 lg:hidden ">
                  <div className="flex">
                    {singlePostData?.user?.avatar_url ? (
                      // <Link href={`/profile/${singlePostData?.user?._id}`}>
                      <div
                        className=" relative bottom-2 w-[65px] cursor-pointer  xxs:h-[45px] xxs:w-[45px] md:h-[45px] lg:h-[45px] lg:w-[45px] "
                        onClick={() => {
                          if (currentUser?.data?._id) {
                            router.push(
                              `/profile/${singlePostData?.user?._id}`
                            );
                          } else {
                            setIsModel(true);
                          }
                        }}
                      >
                        <IMG
                          src={singlePostData?.user?.avatar_url}
                          alt="profile"
                          layout="fill"
                          objectFit="cover"
                          style={{ borderRadius: "50px" }}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          if (currentUser?.data?._id) {
                            router.push(
                              `/profile/${singlePostData?.user?._id}`
                            );
                          } else {
                            setIsModel(true);
                          }
                        }}
                        className="relative bottom-2 flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full bg-gray-400 text-sm text-white"
                      >
                        {getFirstLetter(singlePostData?.user?.user_handle)}
                      </div>
                      // </Link>
                    )}
                    <div
                      onClick={() => {
                        if (currentUser?.data?._id) {
                          router.push(`/profile/${singlePostData?.user?._id}`);
                        } else {
                          setIsModel(true);
                        }
                      }}
                      className="bottom-4 ml-2 flex items-center justify-center text-[14px]  text-sm xxs:relative  "
                    >
                      <p className="cursor-pointer font-semibold text-gray-500 ">
                        {singlePostData?.user?.user_handle}
                      </p>
                    </div>
                  </div>
                  <div className="mx-5  xxs:text-[12px] md:text-sm lg:hidden">
                    <p className="md:pt- left-[60px] mt-4 mr-1.5  mb-8  pt-0 text-gray-600 xxs:absolute md:right-4 lg:right-2 lg:pt-1">
                      <GetShortTimeString time={singlePostData?.created_at} />
                    </p>
                    <div className="relative flex justify-end">
                      <div
                        className="cursor-pointer  pl-2"
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
                        actionProps={{ ...actionProps, item: singlePostData }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  height:
                    typeof window !== "undefined"
                      ? window.screen.width > 1270
                        ? `${dynamicHeightImage?.xlScreen}px`
                        : window.screen.width > 1023
                        ? `${dynamicHeightImage?.lgScreen}px`
                        : `${dynamicHeightImage?.MobileScreen}px`
                      : "100%",
                }}
                className={`relative  flex   w-full  rounded-md bg-white xxxs:justify-start  xxs:mt-2   md:rounded-none  lg:m-0  lg:w-[100%]  lg:items-center lg:justify-center lg:rounded-[20px] `}
              >
                <IMG
                  src={singlePostData?.media?.url}
                  alt={
                    singlePostData?.description
                      ? singlePostData?.description
                      : singlePostData?.tags?.length
                      ? singlePostData?.tags
                      : `meme by ${singlePostData?.user?.user_handle}`
                  }
                  objectFit="contain"
                  unoptimized={true}
                  layout="fill"
                  // style={{
                  //   borderRadius: "10px",
                  // }}
                />
              </div>
              {singlePostData?.description && (
                <div className="  mt-2 border-t border-b lg:hidden">
                  {/* Description */}
                  <div
                    style={{
                      whiteSpace: "pre-line",
                    }}
                    className="text mt-2 flex gap-2 overflow-hidden break-all   p-2  text-justify font-medium text-gray-600"
                  >
                    {singlePostData?.description}
                  </div>
                </div>
              )}
              <div className="Section1  flex h-fit flex-col lg:hidden">
                <div className="CommentSection1 h-fit  ">
                  {/* number of comments and likes */}

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
                  <div className="md: flex justify-between rounded-[20px] px-10 pb-4  pl-3 pr-3 text-sm  font-semibold text-gray-600 xxs:w-full">
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
            </div>

            <div className="sidecard block h-fit w-full  lg:hidden">
              {/* comment small  screen card parent */}

              <div className="mt-0 flex w-full justify-center  lg:hidden  ">
                <Sidecard cardprops={cardprops} />
              </div>
            </div>

            <div className="">
              {/* <div className="flex w-full justify-center"> */}
              <div className=" w-[100%] xxxs:mb-20 sm:w-[100%] md:w-full    lg:mb-4 lg:w-full">
                <PopularFeed />{" "}
              </div>
            </div>
          </div>

          <div className="  mr-3 hidden  md:w-[50%] lg:block lg:w-[30%] xl:w-[30%] ">
            {/* comment card parent */}
            <div className="sticky  top-20 mt-5 block w-full ">
              <Sidecard cardprops={cardprops} />
            </div>
          </div>
        </div>
        <AddPost postProps={editProps} />
        {isCollectionModal.isModal && (
          <CollectionModal collectionProps={collectionProps} />
        )}
        {sharePage && <SharePostModel sharePostProps={sharePostProps} />}
      </div>
    </>
  );
};

export default SideCard;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  let error;
  const res: any =
    (await singlePost({
      pathParams: { postId: id },
    }).catch((err) => {
      error = err?.response?.data?.error?.status;
    })) || null;

  return {
    props: {
      // props for your component
      postDetail: res?.data || {},
    },
  };
}
