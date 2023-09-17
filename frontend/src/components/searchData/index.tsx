import { useGetAllPost } from "@/hooks/post/query";
import { getPost } from "@/services/post";
import {
  globalSearch,
  isGlobalSearchOpen,
  isLoginModal,
  loggedInUser,
  postType,
  socket,
  tagSearchLoading,
} from "@/store";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { globalSearch as globalSearchData } from "@/services/common/index";
import { getFirstLetter } from "@/utils/common";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import DotsLoading from "../DotsLoading";
import Popover from "../UIComponents/Popover";

const SearchData = () => {
  const [searchInput, setSearchInput] = useAtom(globalSearch);
  const [tabs, setTabs] = useState("All");
  const [allSearchData, setAllSearchData] = useState<any>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [loading, setLoading] = useAtom(tagSearchLoading);
  const [isSearchOpen, setIsSearchOpen] = useAtom(isGlobalSearchOpen);
  const [currentUser] = useAtom(loggedInUser);
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const [popularModal, setPopularModal] = useState<boolean>(false);
  const [postTypes, setPostTypes] = useState("popular");
  const actionRef = React.useRef<HTMLButtonElement | any>(null);
  const [isPostOpenLoading, setIsPostOpenLoading] = useState(false);

  const viewSize = 5;
  const router = useRouter();
  const { tab, search_query } = router.query;
  const searchTab = [
    {
      name: "All",
      value: "all",
      id: 1,
    },
    {
      name: "Memes",
      id: 2,
      value: "meme",
    },
    {
      name: "Gifs",
      id: 3,
      value: "gif",
    },
    {
      name: "Users",
      value: "user",
      id: 4,
    },
  ];
  const searchData = (data: any) => {
    setLoading(true);
    globalSearchData({
      query: {
        startIndex: startIndex,
        viewSize: viewSize,
        keyword: data,
        postType: tab,
        filterBy: postTypes,
      },
    }).then((res: any) => {
      setAllSearchData(res);
      setLoading(false);
    });
  };
  useEffect(() => {
    setIsSearchOpen(true);
    return () => {
      setIsSearchOpen(false);
      setIsPostOpenLoading(false);
    };
  }, []);

  const action = debounce(searchData, 1000);
  useEffect(() => {
    if (searchInput) {
      action(searchInput);
    }

    return () => {
      setAllSearchData([]);
      setStartIndex(0);
    };
  }, [searchInput, tab]);

  const getSearchData = () => {
    getPost({
      startIndex,
      viewSize,
      tags: searchInput,
    }).then((res: any) => {
      setAllSearchData([...allSearchData, res?.data?.Posts]);
      setStartIndex(startIndex + viewSize);
    });
  };
  return (
    <div className="ml-3">
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
      <div>
        <div className="flex justify-between">
          <div className="flex gap-3">
            {searchTab?.map((item) => (
              <div
                key={item?.id}
                onClick={() => {
                  setLoading(true);

                  router.push(
                    `/search?tab=${item?.value}&&search_query=${
                      searchInput || search_query
                    }`
                  );
                }}
              >
                <button
                  onClick={() => {
                    setTabs(item?.name);
                  }}
                  className={`rounded-full bg-[#D9D9D9] px-2 py-1.5 text-sm`}
                >
                  <p
                    className={`${
                      item?.value === tab
                        ? "text-primary-600"
                        : "text-[#585555]"
                    } `}
                  >
                    {item?.name}
                  </p>
                </button>
              </div>
            ))}
          </div>
          {/* <div className="relative flex justify-end">
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
              <div className="absolute right-2 top-5 z-10 block rounded-[10px] bg-white  py-2 px-4 shadow">
                <div className="my-2 pb-0.5">
                  <label
                    onClick={(e) => {
                      e.stopPropagation();
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
                        setPostTypes("popular");
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
                        setPostTypes("Latest");
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
          </div> */}
        </div>
        {loading ? (
          <div className="mt-32">
            <DotsLoading />
          </div>
        ) : (
          <div>
            <div>
              <div className="mt-1  border-t">
                {tab === "all" || tab === "user" ? (
                  allSearchData?.user?.length > 0 ? (
                    <div>
                      {allSearchData?.user
                        ?.filter((_: any, index: any) => {
                          if (tab === "all") {
                            return index <= 2;
                          }
                          return true;
                        })
                        ?.map((item: any) => (
                          <div
                            onClick={() => {
                              if (currentUser?.data?._id) {
                                if (!item?.is_blocked) {
                                  router.push(`/profile/${item?._id}`);
                                  setSearchInput("");
                                }
                              } else {
                                setIsModel(true);
                              }
                            }}
                            className="mt-1 flex cursor-pointer items-center rounded-md border bg-gray-50 p-2 shadow "
                            key={item?._id}
                          >
                            <div className="flex items-center">
                              {/* <Link href={`/profile/${item?._id}`}> */}
                              {item?.avatar_url ? (
                                <Image
                                  src={item?.avatar_url}
                                  alt="profile"
                                  height={"45px"}
                                  width={"45px"}
                                  style={{ borderRadius: "50%" }}
                                  objectFit="cover"
                                />
                              ) : (
                                <div className="flex h-[45px] w-[45px] items-center  justify-center rounded-full bg-gray-400 text-sm text-white">
                                  {getFirstLetter(item?.user_handle)}
                                </div>
                              )}
                              {/* </Link> */}
                            </div>
                            <div className="mx-3 flex flex-col ">
                              <span className="text-lg  font-medium">
                                {" "}
                                {item?.user_handle}
                              </span>
                              {/* <p className="font-mediun text-base text-gray-500">
                              {item?.name}
                            </p> */}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : tab !== "all" ? (
                    <div className=" mt-5 text-center text-xl font-medium text-primary-600">
                      No data found yet{" "}
                    </div>
                  ) : null
                ) : null}
              </div>
            </div>

            <div className="" id="scrollableDiv">
              {tab === "all" || tab === "meme" || tab === "gif" ? (
                allSearchData?.post?.length > 0 ? (
                  <div className="mt-5 grid grid-cols-2 gap-5 rounded xs:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    {allSearchData?.post?.map((item: any) => (
                      <div
                        key={item?.id}
                        className="my-5 flex cursor-pointer  justify-center rounded-[10px] bg-white px-2.5 pt-2 pb-1"
                        style={{
                          boxShadow: " 0px 0px 10px rgba(104, 104, 104, 0.1)",
                        }}
                        onClick={() => {
                          setIsPostOpenLoading(true);
                        }}
                      >
                        <Link href={`/open-post?id=${item?._id}`}>
                          <Image
                            src={item?.media?.url}
                            alt={
                              item?.tags?.length
                                ? item?.tags
                                : item?.description
                                ? item?.description
                                : `meme by ${item?.user?.user_handle}`
                            }
                            className="rounded-[10px]"
                            height="203px"
                            width="284px"
                            objectFit="cover"
                            objectPosition="top left"
                            unoptimized={true}
                          />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  tab !== "all" && (
                    <div className="item-center mt-5 flex justify-center text-center text-xl font-medium text-primary-600">
                      No data found yet{" "}
                    </div>
                  )
                )
              ) : null}
              {/* </InfiniteScroll> */}
            </div>
            {tab === "all" &&
              !allSearchData?.post?.length &&
              !allSearchData?.user?.length && (
                <div className="item-center mt-5 flex justify-center text-center text-xl font-medium text-primary-600">
                  No data found yet{" "}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchData;
