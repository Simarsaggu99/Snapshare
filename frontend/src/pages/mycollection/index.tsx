import Advertisement from "@/components/advertisement";
import Button from "@/components/buttons/Button";
import { BackIcon } from "@/components/Icons";
import Spin from "@/components/UIComponents/Spin";
import {
  useAddPostInCollection,
  useCreateMyCollection,
  useRemovePostFromCollection,
} from "@/hooks/mycollection/mutation";
import {
  useGetCollectionFolders,
  useGetCollectionPosts,
} from "@/hooks/mycollection/query";
import Popover from "@/components/UIComponents/Popover";

import { loggedInUser } from "@/store";
import { FolderIcon, PlusIcon } from "@/utils/AppIcons";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "@/components/UIComponents/Notification";

const MyCollectiom = () => {
  const router = useRouter();
  const folderId = router.query.id;
  const [isInputShow, setIsInputShow] = useState<boolean>(false);
  const [FolderName, setFolderName] = useState<string>("");
  const createMyCollection = useCreateMyCollection();
  const getCollectionFolders: any = useGetCollectionFolders({});
  const [popupMenu, setPopupMenu] = useState("");
  const userRef = React.useRef<HTMLButtonElement>(null);

  const getCollectionPosts: any = useGetCollectionPosts({
    pathParams: { folderId },
  });

  const removePostFromCollection: any = useRemovePostFromCollection();

  const addMyCollection = () => {
    createMyCollection
      .mutateAsync({
        body: { folder_name: FolderName },
      })
      .then((res: any) => {
        if (res?.message === "success") {
          setIsInputShow(false);
          getCollectionFolders.refetch();
        }
      });
  };

  const removePost = (postId: any) => {
    removePostFromCollection
      .mutateAsync({
        pathParams: {
          postId: postId,
          folderId: folderId,
        },
      })
      .then((res: any) => {
        if (res?.message === "Success") {
          notifySuccess({ message: "Post Removed successfully!" });
          setPopupMenu("");
          getCollectionPosts.refetch();
        }
      })
      .catch((err: any) => {
        notifyError({ message: err?.response?.data?.error?.message });
      });
  };
  const firstRender = useRef(false);
  const firstFolderId = getCollectionFolders?.data?.data?.[0]?._id;
  useEffect(() => {
    if (firstRender.current) return;
    firstRender.current = true;

    if (!folderId) {
      if (firstFolderId && !window.location.href?.includes("?")) {
        router.push({
          pathname: "/mycollection",
          query: { id: firstFolderId },
        });
      }
    }
  }, [firstFolderId, getCollectionFolders]);

  return (
    <div className="mt-5 w-full">
      <div
        className="md:hidden"
        onClick={() =>
          folderId ? router.push("/mycollection") : router.push("/")
        }
      >
        <BackIcon />
      </div>
      <div className="flex gap-2 xxxs:pt-2 md:pt-5">
        <div
          className={` w-full justify-center sm:w-[40%] sm:justify-end md:w-[40%] lg:w-[30%] xl:w-[30%]  ${
            folderId ? "hidden sm:flex" : "flex "
          }`}
        >
          <div className="w-[80%] lg:w-[74%]  ">
            <div
              style={{ boxShadow: " 0px 0px 10px rgba(104, 104, 104, 0.1)" }}
              className="rounded-lg bg-white py-7 text-center text-[20px] font-medium md:text-[24px]"
            >
              My Collections&apos;s
            </div>
            <div
              className="my-4 h-[670px] max-h-full overflow-auto rounded-lg bg-white  p-3 py-4 pb-10  "
              style={{ boxShadow: "0px 0px 10px rgba(104, 104, 104, 0.1)" }}
            >
              <div className="mt-5 grid grid-cols-1 gap-5 xxxs:grid-cols-2 ">
                {getCollectionFolders?.data?.data?.map((item: any) => (
                  // <Link href={`mycollection/${item?._id}`} key={item?._id}>
                  <button
                    key={item?._id}
                    onClick={() => {
                      // setFolderId(item?._id);
                      router.push(
                        {
                          pathname: "/mycollection",
                          query: { id: item?._id },
                        }
                        // as,
                        // options
                      );
                    }}
                    className={`flex justify-center rounded-md border  p-5 ${
                      folderId === item?._id ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex justify-center ">
                        <div className="w-max rounded-full bg-gray-300 p-4">
                          <FolderIcon />
                        </div>
                      </div>
                      <div className="mt-2 break-words  ">
                        {item?.folder_name}
                      </div>
                    </div>
                  </button>
                  // </Link>
                ))}

                <div className="flex  justify-center rounded-md border p-5">
                  {isInputShow ? (
                    <div>
                      <div>
                        <input
                          className="mb-5 w-full border px-1 py-0.5 outline-none ring-0"
                          onChange={(e) => {
                            setFolderName(e.target.value);
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          addMyCollection();
                        }}
                        className="mx-auto flex justify-center px-1 py-0.5 text-sm  "
                      >
                        {/* {setFolderName.length ? <p> Add folder</p> : <Spin />} */}
                        {createMyCollection.isLoading ? (
                          <div className=" xxs:h-9 xxs:w-10  xxs:py-2  lg:h-[20px]  lg:w-20 lg:py-0 ">
                            <Spin color="white" />
                          </div>
                        ) : (
                          <p> Add folder</p>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsInputShow(true);
                      }}
                    >
                      <div>
                        <div className="flex justify-center ">
                          <div className="w-max rounded-full bg-primary-200 p-4">
                            <PlusIcon />
                          </div>
                        </div>
                        <div className="mt-2 text-primary-600">Add folder</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${
            folderId ? "block" : "hidden sm:block "
          } ml-5 mr-5 w-full sm:w-[45%] lg:w-[35%]`}
        >
          <div
            style={{ boxShadow: " 0px 0px 10px rgba(104, 104, 104, 0.1)" }}
            className={`break-words rounded-lg bg-white px-3 py-7 text-center text-[20px] text-sm font-medium md:text-[24px] ${
              folderId ? "block" : "hidden"
            } `}
          >
            {
              getCollectionFolders?.data?.data?.find(
                (item: any) => item?._id === folderId
              )?.folder_name
            }
          </div>
          <div
            className=" mt-4 flex  justify-center rounded-lg bg-white "
            style={{ boxShadow: "0px 0px 10px rgba(104, 104, 104, 0.1)" }}
          >
            {folderId ? (
              <div>
                {getCollectionPosts?.data?.data?.Posts?.length > 0 ? (
                  <div className="grid  grid-cols-1 gap-10 p-5  xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2   ">
                    {getCollectionPosts?.data?.data?.Posts?.map((item: any) => (
                      <div
                        key={item?._id}
                        // onClick={() => {
                        // router.push(`/open-post?id=${item?._id}`);
                        //   setPopupMenu(true);
                        // }}
                        className="cursor-pointer"
                      >
                        <Image
                          src={item?.media?.url}
                          alt="post"
                          className="rounded-[10px]"
                          width={284}
                          height={203}
                          objectFit="cover"
                          onClick={() =>
                            popupMenu === ""
                              ? setPopupMenu(item?._id)
                              : setPopupMenu("")
                          }
                        />
                        <Popover
                          isVisible={popupMenu === item?._id}
                          userRef={userRef}
                          onclose={setPopupMenu}
                          className={"z-20"}
                        >
                          {" "}
                          <div className="menu">
                            <div className="h-full  py-2">
                              <ul>
                                <li
                                  className=" border-b px-5 pb-2 text-primary-600"
                                  onClick={() => {
                                    router.push(`/open-post?id=${item?._id}`);
                                    setPopupMenu("");
                                  }}
                                >
                                  <a href="">Open</a>
                                </li>
                                <li
                                  className="mt-1 flex justify-center  px-5 pb-1 text-primary-600"
                                  onClick={() => {
                                    removePost(item?._id);
                                  }}
                                >
                                  <a href="">Remove</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </Popover>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-10 text-center text-xl text-primary-600">
                    You haven&apos;t added any posts yet
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="py-5 text-center text-xl text-primary-600">
                  You haven&apos;t added any posts yet
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hidden bg-green-400 lg:block">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default MyCollectiom;
