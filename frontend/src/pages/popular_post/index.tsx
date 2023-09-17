import Advertisement from "@/components/advertisement";
import DotsLoading from "@/components/DotsLoading";
import SinglePostCard from "@/components/singlePostCard";
import Sidebar from "@/components/Tag/components/Sidebar";
import { useGetPopularPost } from "@/hooks/post/query";
import { flatten } from "lodash";
import React, { useEffect, useState } from "react";

const PopularPosts = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [Posts, setPosts] = useState([]);
  const [hasMorePost, setHasMorePost] = useState(true);

  const getPosts: any = useGetPopularPost({
    filterBy: "popular",
    pageSize: startIndex,
  });
  useEffect(() => {
    const allPosts: any = flatten(
      getPosts?.data?.pages?.map((page: any, pageNumber: any) =>
        page?.data?.Posts?.map((data: any) => ({ ...data, pageNumber }))
      )
    );

    setHasMorePost(
      getPosts?.data?.pages?.[currentPage]?.data?.count < 15 ? false : true
    );
    setPosts(allPosts);
  }, [getPosts?.data?.pages]);
  const postProps = {
    getPosts,
    startIndex,
    currentPage,
    setCurrentPage,
    setStartIndex,
    setPosts,
    Posts,
    hasMorePost,
  };
  return (
    <div>
      <div className="h-full ">
        <div>
          <div className=" relative   h-[100%] gap-4 text-black md:grid md:grid-cols-3   lg:grid-cols-3 ">
            <div className="mx-6 flex justify-center   lg:justify-end">
              <Sidebar />
            </div>

            <div className="mx-6  md:mx-0 ">
              {getPosts?.isLoading ? (
                <div className="h-[70vh]">
                  <DotsLoading />
                </div>
              ) : (
                <div className="mb-8  flex justify-center ">
                  <SinglePostCard postProps={postProps} />
                </div>
              )}
            </div>

            <div className="mt-8  hidden md:block">
              <Advertisement />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularPosts;
