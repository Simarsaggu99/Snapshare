import { useAtom } from "jotai";
import Image from "next/image";
import React, { FC, useEffect, useState, useCallback } from "react";
import {
  addedPost,
  allPosts,
  allPostsData,
  loggedInUser,
  postType,
} from "../../store/index";
import { useCreatePost, useEditPost } from "@/hooks/post/mutation";
import { useCheckTodayPostCount, useGetAllPost } from "@/hooks/post/query";
import Compressor from "compressorjs";
import { CrossIcon } from "@/utils/AppIcons";
import { getFirstLetter } from "@/utils/common";
import MultipleSelect from "@/components/UIComponents/multipleSelect";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from "./imageCrop.js";
import axios from "axios";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../UIComponents/Notification";
import useAutosizeTextArea from "./AutoResize";
import { Router, useRouter } from "next/router";
import { usePerformBounty } from "@/hooks/bounty/mutation";

interface addPostinterface {
  isAddPost: boolean;
  setIsAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  isPostEdit?: boolean;
  singlePostDetails?: any;
  isMemeContest?: boolean;
  bounty?: string;
  checkTodayPostCount?: any;
}
interface postPropsinterface {
  postProps: addPostinterface;
}

const AddPost: FC<postPropsinterface> = ({
  postProps: {
    isAddPost,
    setIsAddPost,
    isPostEdit,
    singlePostDetails,
    isMemeContest,
    bounty,
  },
}) => {
  const [uploadData, setUploadData] = useState<any>();
  const [description, setDescription] = useState<string>("");
  const [getAllPost, setGetAllPost] = useAtom(allPosts);
  const [currentUser] = useAtom(loggedInUser);
  const [finalTags, setFinalTags] = useState([]);
  const [upImg, setUpImg] = useState<any>();
  const [uploadDetails, setUploadDetails] = useState<any>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Posts, setPosts] = useAtom(allPostsData);
  const [postTypes] = useAtom(postType);
  const [userAddedPost, setUserAddedPost] = useAtom(addedPost);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const checkTodayPostCount: any = useCheckTodayPostCount({ currentUser });
  const performBounty = usePerformBounty();

  useAutosizeTextArea(textAreaRef.current, description);
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const route = useRouter();
  useEffect(() => {
    if (isAddPost === true) {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "unset";
      }
    }
  }, [isAddPost]);

  useEffect(() => {
    
    setDescription(singlePostDetails?.description || "");
    setFinalTags(singlePostDetails?.tags || []);
    if (singlePostDetails?.media?.url || singlePostDetails?.post?.media?.url) {
      setUploadData({
        url: singlePostDetails?.media?.url
          ? singlePostDetails?.media?.url
          : singlePostDetails?.post?.media?.url,
      });
    }
    
  }, [singlePostDetails, isAddPost]);

  const createpost = useCreatePost();
  
  const updatePost = useEditPost();
  
  
  
  
  const addPost = (contentData: any, des: string, tags: any[]) => {
    const data = uploadData;

    if (isPostEdit) {
      const formData = new FormData();
      if (description) {
        formData.append("description", description);
      }
      formData.append("tag", JSON.stringify(finalTags));
      updatePost
        .mutateAsync({
          body: formData,
          pathParams: { id: singlePostDetails?._id },
        })
        .then((res: any) => {
          if (res?.message === "success") {
            notifySuccess({ message: "Post Updated Successfully" });
            setIsAddPost(false);
            setUploadData(undefined);
            setDescription("");
            setFinalTags([]);
            setUploadDetails(undefined);
            setPosts(
              Posts?.map((item: any) => {
                return item?._id === singlePostDetails?._id
                  ? {
                      ...item,
                      description: description,
                      tags: finalTags?.length ? finalTags : [],
                    }
                  : item?.post?._id === singlePostDetails?._id
                  ? {
                      ...item,
                      post: {
                        ...item?.post,
                        description: description,
                        tags: finalTags?.length ? finalTags : [],
                      },
                    }
                  : { ...item };
              })
            );
          }

          setLoading(false);
        });
    } else {
      const formData = new FormData();
      formData.append("file", contentData);
      if (des) {
        formData.append("description", des);
      }
      if (isMemeContest) {
        formData.append("isMemeContest", new Boolean(isMemeContest).toString());
        formData.append("bounty", bounty || "");
      }
      formData.append("tag", JSON.stringify(tags));
      createpost
        .mutateAsync({
          body: formData,
        })
        .then((res: any) => {
          if (res?.success) {
            notifySuccess({ message: "Post Created Successfully" });
            if (Posts?.length <= 0 && route.asPath !== "/") {
              
            }
            setUserAddedPost([
              {
                ...res?.data,
                media: res?.data?.media[0]?.url && res?.data?.media[0],
                user: currentUser?.data,
              },
            ]);
            
            
            
            
            
            
            
            
            

            setIsAddPost(false);
            setUploadData(undefined);
            setDescription("");
            setFinalTags([]);
            setUploadDetails(undefined);
            setLoading(false);
            checkTodayPostCount.refetch();
            route.push("/");
            if (isMemeContest) {
              performBounty
                .mutateAsync({
                  body: {
                    bountyProgramId: bounty,
                    userAnswer: "",
                  },
                })
                .then(() => {});
            }
          } else {
            notifyError;
            notifyWarning({ message: "You have already posted 10 Posts!" });
            setLoading(false);
          }
        })
        .catch((err: any) => {
          if (err?.message === "success") {
            setIsAddPost(false);
            setUploadData(undefined);
            setDescription("");
            setFinalTags([]);
            
            setLoading(false);
            setUploadDetails(undefined);
            checkTodayPostCount.refetch();
          } else if (err?.response?.status === 400) {
            notifyWarning({ message: "You have already posted 10 Posts!" });
            setLoading(false);
            setUploadDetails(undefined);
          } else {
            notifyError({ message: "opps something went wrong" });
            setLoading(false);
            setUploadDetails(undefined);
          }
        });
    }
  };
  const onUploadFile = async (file: any, des: string, tags: any[]) => {
    if (!file) {
      return;
    }
    if (!file?.name?.includes(".gif")) {
      new Compressor(file, {
        quality: 0.2,
        
        success: (compressedResult) => {
          const myFile = new File([compressedResult], file.name, {
            type: file.type,
          });
          const url = { url: URL.createObjectURL(myFile || "") };
          const contentData = Object.assign(myFile, url);
          setUploadData(contentData || {});
          setUpImg(undefined);
          
        },
      });
    } else {
      
      
      
      
      const url = { url: URL.createObjectURL(file || "") };
      const contentData = Object.assign(file, url);
      setUploadData(contentData || {});
      setUpImg(undefined);
      
      
      
      
      
      
    }
  };
  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadDetails(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showCroppedImage = useCallback(
    async (des: string, tags: any[]) => {
      try {
        const croppedImage = await getCroppedImg(upImg, croppedAreaPixels);

        let file = await fetch(croppedImage)
          .then((r) => r.blob())
          .then(
            (blobFile) =>
              new File([blobFile], uploadDetails?.name, { type: "image/png" })
          );
        
        const newFile = await onUploadFile(file, des, tags);

        return newFile;
      } catch (e) {
        notifyError({ message: "opps something went wrong" });
      }
    },
    [croppedAreaPixels]
  );
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = event.target?.value;
    setDescription(val);
  }

  return (
    <div>
      {isAddPost && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsAddPost(false);
            setUploadData(undefined);
            setFinalTags([]);
            setDescription("");
            setUpImg(undefined);
            setUploadDetails(undefined);
          }}
          className="backdrop-blur-xs  fixed top-0 left-0 z-20 h-full w-full overflow-hidden  bg-black/50"
        >
          <div
            style={{ zIndex: 1000 }}
            className=" sticky left-0 right-0 top-28 mx-auto mt-20 h-fit max-h-[80vh] w-[95%] overflow-y-auto rounded-lg bg-white md:w-[50%] lg:mb-4 lg:max-h-[90vh]  lg:w-[40%]  xl:max-h-[80vh]  xl:w-[30%] "
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="mx-3 "
            >
              <div className="mx-4 flex justify-end gap-[36%] border-b">
                <p className="my-5 text-xl font-bold ">
                  {isPostEdit || singlePostDetails?._id ? "Update" : "Create"}{" "}
                  Post{" "}
                </p>
                <div className="relative">
                <button

                  onClick={() => {
                    setIsAddPost(false);
                    setUploadData(undefined);
                    setFinalTags([]);
                    setDescription("");
                    setUpImg(undefined);
                    setUploadDetails(undefined);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http:
                  >
                    <g clipPath="url(#clip0_76_1341)">
                      <path
                        d="M0.813292 16.0001C0.72075 15.9611 0.628209 15.9319 0.540537 15.8831C-0.0390669 15.5712 -0.180315 14.8012 0.2483 14.3041C0.297006 14.2505 0.350583 14.1969 0.399289 14.1481C2.39625 12.1451 4.39807 10.1469 6.3999 8.14389C6.43886 8.1049 6.48757 8.07078 6.54115 8.02205C6.48757 7.96356 6.44373 7.9197 6.40477 7.87584C4.38833 5.85817 2.36702 3.83563 0.350583 1.81796C-0.116997 1.3501 -0.116997 0.682418 0.345712 0.268162C0.735362 -0.0827362 1.31497 -0.0876098 1.71436 0.253542C1.77768 0.307151 1.83612 0.370508 1.89457 0.428991C3.88666 2.42229 5.87874 4.41559 7.87083 6.40889C7.90979 6.44788 7.95363 6.48687 8.00233 6.53073C8.05104 6.48199 8.09975 6.443 8.13871 6.39914C10.1551 4.38147 12.1716 2.35893 14.1929 0.341266C14.7579 -0.22407 15.6492 -0.0583683 15.9268 0.65805C15.9512 0.72628 15.9755 0.79451 15.9999 0.862741C15.9999 0.979707 15.9999 1.0918 15.9999 1.20877C15.922 1.52555 15.7174 1.75461 15.4934 1.97879C13.5256 3.94285 11.5628 5.91178 9.59503 7.87584C9.55119 7.9197 9.49274 7.9392 9.42456 7.98306C9.5171 8.06591 9.56093 8.10002 9.5999 8.14389C11.5676 10.1128 13.5354 12.0866 15.508 14.0556C15.7271 14.2749 15.9268 14.5039 15.9999 14.8158C15.9999 14.9328 15.9999 15.0449 15.9999 15.1619C15.883 15.5907 15.6151 15.8783 15.1865 16.005C15.0306 16.005 14.8748 16.005 14.7189 16.005C14.4169 15.9026 14.2026 15.6882 13.9835 15.4738C12.0352 13.5195 10.0821 11.57 8.13384 9.61571C8.09 9.57185 8.04617 9.53286 7.97798 9.4695C7.92927 9.53286 7.89518 9.58647 7.85134 9.63033C5.89822 11.5798 3.93536 13.539 1.98224 15.4981C1.77768 15.7077 1.56337 15.9026 1.28087 15.9952C1.12501 16.0001 0.969152 16.0001 0.813292 16.0001Z"
                        fill="#303030"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_76_1341">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                {/* </div> */}
              </div>
              {/* <div className="mx-4  flex gap-3 lg:my-4 ">
                {currentUser?.data?.avatar_url ? (
                  <Image
                    src={currentUser?.data?.avatar_url}
                    height={70}
                    width={70}
                    style={{ borderRadius: "50%" }}
                    alt="profile"
                    objectFit="cover"
                    
                  />
                ) : (
                  <div className="  flex h-[64px] w-[64px] cursor-pointer  items-center justify-center rounded-full bg-gray-400 text-white                                                                                                                                                                                                                                                    ">
                    {getFirstLetter(currentUser?.data?.user_handle)}
                  </div>
                )}
                <p className="mt-5 text-lg ">
                  {currentUser?.data?.user_handle}{" "}
                </p>
              </div> */}
              <div className=" my-2 lg:my-5">
                <textarea
                  className="w-full  overflow-hidden rounded-md border px-2 py-1.5 ring-0 focus:ring-0 focus:ring-primary-500 "
                  id="description-text"
                  onChange={handleChange}
                  placeholder="Add description here"
                  ref={textAreaRef}
                  style={{ minHeight: "25px" }}
                  rows={1}
                  value={description}
                  maxLength={500}
                />
              </div>
              <div className="relative">
                {(uploadDetails?.name || uploadData?.name) && (
                  <div className="absolute top-2 right-2 z-[10000]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadData(undefined);
                        setUploadDetails(undefined);
                        setUpImg(undefined);
                      }}
                    >
                      <CrossIcon />
                    </button>
                  </div>
                )}

                {uploadData?.name || singlePostDetails?.media?.url ? (
                  <div className="z-96 relative">
                    {singlePostDetails?.media?.url ? (
                      <Image
                        style={{
                          borderRadius: "10px",
                          zIndex: 1000,
                        }}
                        objectFit="contain"
                        
                        
                        src={singlePostDetails?.media?.url}
                        height={410}
                        width={600}
                        alt="file"
                        unoptimized={true}
                      />
                    ) : (
                      <Image
                        style={{
                          borderRadius: "10px",
                          zIndex: 1000,
                        }}
                        objectFit="contain"
                        
                        
                        src={uploadData?.url}
                        height={410}
                        width={600}
                        alt="file"
                        unoptimized={true}
                      />
                    )}
                  </div>
                ) : (
                  <label
                    className="item-center flex h-[380px] justify-center  rounded-xl bg-gray-200 md:h-[380px]"
                    htmlFor="upload_post"
                  >
                    <div className="cursor-pointer">
                      <div className="mt-24 rounded-xl  border md:mt-24 ">
                        <div className="ml-2  mt-2 flex  justify-center rounded-full">
                          <div className=" rounded-full bg-white px-7 py-7">
                            <svg
                              width="40"
                              height="40"
                              viewBox="image/*0 0 42 42"
                              fill="none"
                              className=""
                              xmlns="http:
                            >
                              <path
                                d="M0.205566 17.7396C0.205566 13.4614 0.205566 9.17408 0.205566 4.89588C0.205566 2.05597 2.05609 0.205444 4.89601 0.205444C13.4799 0.205444 22.0638 0.205444 30.6385 0.205444C33.4509 0.205444 35.3106 2.05597 35.3106 4.8684C35.3106 10.5666 35.3106 16.2647 35.3106 21.972C35.3106 23.1446 34.3578 23.8867 33.3593 23.5111C32.773 23.2912 32.4065 22.769 32.4065 22.0911C32.3974 20.9643 32.4065 19.8375 32.4065 18.7107C32.4065 14.0935 32.4065 9.47639 32.4065 4.85924C32.4065 3.68663 31.8477 3.12781 30.6751 3.12781C22.0638 3.12781 13.4524 3.12781 4.84104 3.12781C3.68675 3.12781 3.12793 3.68663 3.12793 4.83176C3.12793 13.4614 3.12793 22.0819 3.12793 30.7116C3.12793 31.8293 3.70507 32.3973 4.81356 32.3973C10.4659 32.3973 16.1274 32.3973 21.7798 32.3973C21.9355 32.3973 22.0821 32.3881 22.2378 32.3973C23.0073 32.4522 23.612 33.0843 23.612 33.8355C23.6211 34.5959 23.0257 35.2372 22.2561 35.2921C22.1187 35.3013 21.9813 35.3013 21.8439 35.3013C16.2007 35.3013 10.5667 35.3013 4.92349 35.3013C2.04693 35.3105 0.205566 33.4691 0.205566 30.5925C0.205566 26.3052 0.205566 22.027 0.205566 17.7396Z"
                                fill="#303030"
                              />
                              <path
                                d="M29.4567 29.4383C21.624 29.4383 13.8738 29.4383 6.07774 29.4383C6.06858 29.2826 6.05942 29.136 6.05942 28.9894C6.05942 26.1587 6.05026 23.3187 6.06858 20.488C6.06858 20.259 6.18767 19.9933 6.34341 19.8284C6.83811 19.2879 7.36028 18.7749 7.88246 18.2619C8.56038 17.5931 9.38487 17.5839 10.0628 18.2527C11.1621 19.3337 12.2431 20.4239 13.3699 21.5415C13.489 21.4316 13.6081 21.3216 13.718 21.2025C16.1091 18.8115 18.5001 16.4113 20.8911 14.0203C21.7614 13.15 22.5034 13.1408 23.3646 14.002C25.2976 15.935 27.2214 17.8679 29.1543 19.7917C29.365 20.0024 29.4567 20.204 29.4567 20.5063C29.4475 23.3279 29.4475 26.1495 29.4475 28.9619C29.4567 29.1085 29.4567 29.2551 29.4567 29.4383Z"
                                fill="#303030"
                              />
                              <path
                                d="M32.3973 32.3972C32.3973 30.9039 32.3882 29.4748 32.3973 28.0457C32.4065 26.9647 33.4234 26.2593 34.3944 26.6624C34.9991 26.9189 35.3105 27.4044 35.3105 28.064C35.3197 29.3283 35.3105 30.5925 35.3105 31.8567C35.3105 32.0216 35.3105 32.1865 35.3105 32.4064C35.7136 32.4064 36.0709 32.4064 36.4282 32.4064C37.4909 32.4064 38.5627 32.3972 39.6254 32.4064C40.514 32.4155 41.1644 33.0476 41.1553 33.8813C41.1461 34.6966 40.4957 35.3104 39.6345 35.3196C38.2146 35.3287 36.8038 35.3196 35.3105 35.3196C35.3105 35.4936 35.3105 35.6494 35.3105 35.8143C35.3105 37.0602 35.3105 38.3152 35.3105 39.5611C35.3105 40.5047 34.7151 41.1643 33.8723 41.1735C33.0111 41.1826 32.4065 40.5047 32.4065 39.5428C32.4065 38.1595 32.4065 36.7762 32.4065 35.3196C32.2233 35.3196 32.0584 35.3196 31.9026 35.3196C30.6567 35.3196 29.4017 35.3196 28.1558 35.3196C27.2214 35.3196 26.5618 34.7058 26.5618 33.863C26.5618 33.0201 27.2214 32.4064 28.1558 32.4064C29.5391 32.388 30.9407 32.3972 32.3973 32.3972Z"
                                fill="#303030"
                              />
                              <path
                                d="M17.0159 9.70545C17.0159 11.7209 15.3669 13.3699 13.3515 13.3607C11.3544 13.3515 9.72376 11.7117 9.7146 9.71461C9.7146 7.69919 11.3636 6.0502 13.379 6.05936C15.3853 6.06853 17.0159 7.70835 17.0159 9.70545Z"
                                fill="#303030"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 py-4 text-xs leading-5">
                        <div className="">
                          <p className="cursor-pointer text-center text-lg font-medium ">
                            Upload a jpeg, png or gif
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                )}

                <input
                  id="upload_post"
                  type="file"
                  className="hidden"
                  accept="image/x-png,image/gif,image/jpeg,image/*"
                  onChange={(e: any) => {
                    
                    onUploadFile(e.target.files[0], "", []);
                    
                    
                    
                  }}
                />


                <div className="relative my-4 flex">
                  <MultipleSelect
                    setFinalTags={setFinalTags}
                    finalTags={finalTags}
                  />
                  <div className="absolute top-0 right-1 flex justify-end">
                    <p className="text-xs">{finalTags.length}/3</p>
                  </div>
                </div>

                <div className="lg:my-3">
                  <button
                    disabled={loading}
                    onClick={() => {
                      if (!loading) {
                        if (!isPostEdit) {
                          if (uploadData || uploadDetails) {
                            addPost(uploadData, description, finalTags);
                            setLoading(true);
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                          } else {
                            notifyError({
                              message: "Please upload image first",
                            });
                            setLoading(false);
                          }
                        } else {
                          addPost(uploadData, description, finalTags);
                        }
                      }
                    }}
                    className="mb-2 flex h-12 w-full justify-center rounded-md bg-[#FF5E34] py-3 font-medium text-white shadow lg:mb-6"
                  >
                    {loading ? (
                      <div className="wrapper  ml-16 mt-5 h-14">
                        <span className="circle circle-1"></span>
                        <span className="circle circle-2"></span>
                        <span className="circle circle-3"></span>
                        <span className="circle circle-4"></span>
                      </div>
                    ) : (
                      <p> {isPostEdit ? "Update" : "Publish"}</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddPost;
