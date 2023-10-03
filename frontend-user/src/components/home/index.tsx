import React, { useEffect, useState } from "react";
import Sidebar from "../Tag/components/Sidebar";
import Advertisement from "../advertisement";
import { useAtom } from "jotai";
import {
  addedPost,
  allPostsData,
  isFirstPostIndex,
  postStartIndex,
  postType,
  totalPostCounts,
} from "../../store/index";
import PopularFeed from "@/components/popularFeed";
import SinglePostCard from "../singlePostCard";
import { useGetAllPost } from "@/hooks/post/query";
import { notifyError } from "../UIComponents/Notification";
import DotsLoading from "../DotsLoading";
import Popover from "../UIComponents/Popover";
import { flatten } from "lodash";

const Home = () => {
  const [Posts, setPosts] = useAtom(allPostsData);
  const filterPost = Posts?.filter((fil) => fil?.ad !== true);
  const [popularModal, setPopularModal] = useState<boolean>(false);
  const [postTypes, setPostTypes] = useAtom(postType);
  const [currentPage, setCurrentPage] = useState(0);
  const actionRef = React.useRef<HTMLButtonElement | any>(null);
  const [startIndex, setStartIndex] = useAtom(postStartIndex);
  const [totalPostCount, setTotalPostCount] = useAtom(totalPostCounts);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [isFirstStartindex, setIsFirstStartindex] = useAtom(isFirstPostIndex);
  const [postCounts, setPostCounts] = useState(0);
  const [isPostFetched, setIsPostFetched] = useState(false);
  const [userAddedPost, setUserAddedPost] = useAtom(addedPost);
  const getPosts: any = useGetAllPost({
    filterBy: postTypes,
    pageSize: isFirstStartindex ? 0 : startIndex,
  });

  if (getPosts?.isError) {
    getPosts?.isError &&
      notifyError({
        message:
          "!Opps something went wrong while fetching post .please try again",
      });
  }

  const postProps = {
    getPosts,
    currentPage,
    setCurrentPage,
    setStartIndex,
    startIndex,
    setPosts,
    Posts,
    hasMorePost,
    postCounts,
    setIsPostFetched,
  };
  useEffect(() => {
    if (Posts?.length < 0) {
      setIsFirstStartindex(true);
    }
  }, [postType]);

  useEffect(() => {
    if (userAddedPost?.length && Posts?.length) {
      setPosts([...userAddedPost, ...Posts]);
      setUserAddedPost([]);
    }
  }, [userAddedPost, Posts?.length]);

  useEffect(() => {
    let allPosts = [];
    allPosts =
      getPosts?.data?.pages?.[currentPage]?.data?.Posts?.map((data: any) => ({
        ...data,
        currentPage,
      })) || [];

    const count = allPosts?.filter((fil: any) => fil?.ad !== true)?.length;
    const total_count = getPosts?.data?.pages?.[currentPage]?.data?.total_count;
    if (isFirstStartindex && Posts?.length <= 0) {
      if (getPosts?.data?.pages?.[currentPage]?.data?.total_count) {
        setTotalPostCount(
          getPosts?.data?.pages?.[currentPage]?.data?.total_count
        );
      }
      setPosts([...Posts, ...allPosts]);

      setHasMorePost(filterPost?.length < total_count ? true : false);
      if (count) {
        setPostCounts(count);
        setStartIndex(6);
      }
    } else if (isPostFetched) {
      if (allPosts?.length) {
        setPostCounts(count);
        setIsPostFetched(!isPostFetched);
      }
      setHasMorePost(filterPost?.length < totalPostCount ? true : false);
      if (filterPost?.length < totalPostCount) {
        setPosts([...Posts, ...allPosts]);
      }
    }
    if (Posts?.length > 0) {
      setIsFirstStartindex(false);
    }
  }, [getPosts?.data, startIndex, currentPage]);

  return (
    <div className="h-full">
      <div className="">
        <div className=" relative   h-[100%] justify-center gap-2 text-black lg:grid   lg:grid-cols-3  xl:grid-cols-3">
          <div className="mx-2  flex justify-center lg:justify-end ">
            <Sidebar />
          </div>
          <div className="mx-2  md:mx-0  ">
            <div className="mx-0 -mb-7 flex justify-center sm:mx-4 md:mx-0  ">
              <div className=" mt-4  w-[100%]   sm:w-[100%] md:mx-6 md:w-[80%] lg:w-full">
                <PopularFeed />
                <div className="relative my-4  flex justify-end ">
                  <p
                    className="cursor-pointer text-sm text-gray-400"
                    ref={actionRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopularModal(!popularModal);
                    }}
                  >
                    Sort by:
                    <span className="text-secondary-700">{postTypes}</span>
                  </p>
                  <div>
                    <svg
                      ref={actionRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopularModal(!popularModal);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      viewBox="0 0 320 512"
                      className="cursor-pointer select-none"
                      fill="#858585"
                    >
                      <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                    </svg>
                  </div>
                  <Popover
                    isVisible={popularModal}
                    onclose={() => {
                      setPopularModal(false);
                    }}
                    userRef={actionRef}
                  >
                    <div className="absolute right-2 top-5 z-10 block rounded-[10px]  bg-white  py-2 px-4 shadow">
                      <div className="my-2 pb-0.5">
                        <label
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem("postTypes", "popular");
                            if (postTypes === "Latest") {
                              setPosts([]);
                              setStartIndex(0);
                              setCurrentPage(0);
                              setIsFirstStartindex(true);
                            }
                            setPostTypes("popular");
                            setPopularModal(false);
                          }}
                          className="container"
                        >
                          <span
                            className={`label cursor-pointer ${
                              postTypes === "popular" && "text-primary-600"
                            }`}
                          >
                            Popular
                          </span>
                          <input
                            checked={postTypes === "popular"}
                            onChange={(e) => {
                              e.stopPropagation();
                              localStorage.setItem("postTypes", "popular");
                              if (postTypes === "Latest") {
                                setPosts([]);
                                setStartIndex(0);
                                setCurrentPage(0);
                                setIsFirstStartindex(true);
                              }
                              setPostTypes("popular");
                              setPopularModal(false);
                            }}
                            type="radio"
                            name="isPopular"
                            value="popular"
                          />
                          <span className="radio"></span>
                        </label>
                      </div>
                      <div className="my-2">
                        <label
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem("postTypes", "Latest");
                            if (postTypes === "popular") {
                              setPosts([]);
                              setStartIndex(0);
                              setCurrentPage(0);
                              setIsFirstStartindex(true);
                            }
                            setPostTypes("Latest");
                            setPopularModal(false);
                          }}
                          className="container"
                        >
                          <span
                            className={`label cursor-pointer ${
                              postTypes === "Latest" ? "text-primary-600" : ""
                            }`}
                          >
                            Latest
                          </span>
                          <input
                            checked={postTypes === "Latest"}
                            onChange={(e) => {
                              e.stopPropagation();
                              localStorage.setItem("postTypes", "Latest");
                              if (postTypes === "popular") {
                                setPosts([]);
                                setStartIndex(0);
                                setCurrentPage(0);
                                setIsFirstStartindex(true);
                              }
                              setPostTypes("Latest");
                              setPopularModal(false);
                            }}
                            type="radio"
                            name="isPopular"
                            value="Latest"
                          />
                          <span className="radio"></span>
                        </label>
                      </div>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
            {getPosts?.isLoading ? (
              <div className="h-[70vh]">
                <DotsLoading />
              </div>
            ) : (
              <div className=" my-2 ml-0 flex w-full justify-center   md:w-[100%]  ">
                <SinglePostCard postProps={postProps} />
              </div>
            )}
          </div>
          <div className="mt-4 hidden lg:block">
            <Advertisement />
          </div>
        </div>
        <div className="mt-8  hidden md:block lg:hidden">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Home;
