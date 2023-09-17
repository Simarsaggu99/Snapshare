import Modal from "@/components/Modal";
import Popover from "@/components/UIComponents/Popover";
import { useDeleteProfile } from "@/hooks/user/mutation";
import { CameraIcon, CrossIcon } from "@/utils/AppIcons";
import Image from "next/image";
import smallLogo from "../../../../public/images/logo_icon.png";
import React, { useState } from "react";
import { loggedInUser } from "@/store";
import { useAtom } from "jotai";
interface profileInterface {
  getSingleUser: any;
  profilePic: any;
  currentUser: any;
  setProfilePic: React.Dispatch<any>;
  onUploadProfile: (e: any) => void;
}
interface profilePropsInterface {
  profileProps: profileInterface;
}

const ProfileImage = ({
  profileProps: {
    getSingleUser,
    profilePic,
    currentUser,
    setProfilePic,
    onUploadProfile,
  },
}: profilePropsInterface) => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const openProfile = React.useRef<HTMLButtonElement | any>(undefined);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const editProfileRef = React.useRef<HTMLButtonElement>(null);
  const [_, setCurrentUser] = useAtom(loggedInUser);

  const deleteProfile = useDeleteProfile();

  return (
    <div className="">
      <div className="w-full ">
        {currentUser?.data?._id === getSingleUser?.data?.data?._id ? (
          // <label htmlFor="profile_img">
          <div className="absolute left-[5%] cursor-pointer xxxs:top-[47%]  xxs:top-[50.5%] xs:top-[55%]  md:top-[54%] md:left-[10%]  lg:top-[48%]  lg:left-[8%]  xl:top-[53%]  ">
            <div className="">
              {getSingleUser?.data?.data?.avatar_url || profilePic?.url ? (
                <div
                  className="h-full w-full"
                  // className="absolute  top-[30%] left-[4%] h-[80px]  w-[80px] rounded-full border-[5px] border-white  md:top-[48%] md:left-[10%]  md:h-[125px]  md:w-[125px] xl:top-[50%]  xl:h-[230px] xl:w-[230px]  xl:border-[10px] 2xl:h-[230px] 2xl:w-[230px]  2xl:border-[10px] "
                  // className="absolute top-[40%] left-[4%] md:top-[48%] md:left-[10%] xl:top-[52%]   "
                >
                  <div
                    onClick={() => {
                      setIsOpenProfile(true);
                    }}
                    className="relative   h-[77px]   w-[77px] rounded-full border-[5px] sm:h-[117px] sm:w-[117px] xl:h-[242px] xl:w-[242px]"
                  >
                    <Image
                      src={
                        profilePic?.url || getSingleUser?.data?.data?.avatar_url
                      }
                      // height={77}
                      // width={77}
                      className="rounded-full  "
                      alt="profile"
                      objectFit="cover"
                      layout="fill"
                      onClick={() => {
                        setIsOpenProfile(true);
                      }}
                    />
                  </div>
                  <div
                    // className="absolute top-[2.9rem] left-[2.7rem] rounded-full bg-white py-2 px-2 md:left-[5rem]  md:top-[4.9rem]  xl:left-[9rem] xl:top-[10rem]"
                    className="lg: absolute top-[2.9rem]  left-[2.7rem] rounded-full bg-white py-2  px-2  sm:left-[5rem] sm:top-[4.9rem]  md:left-[5rem] md:top-[4.9rem] xl:left-[11rem] xl:top-[11.9rem] 2xl:top-[12rem] 2xl:left-[10.8rem]"
                  >
                    <div>
                      <div
                        onClick={() => {
                          setIsEditProfile(true);
                        }}
                        className="cursor-pointer  "
                      >
                        <CameraIcon />
                      </div>
                      <Popover
                        userRef={editProfileRef}
                        isVisible={isEditProfile}
                        onclose={setIsEditProfile}
                        className="left-1 z-20"
                      >
                        <div className="w-full py-4  text-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("profile_img");
                              openProfile.current?.click();
                            }}
                            className=" border-b px-4"
                          >
                            <p>Edit</p>
                          </button>

                          <div>
                            <button
                              className="px-4"
                              onClick={() => {
                                deleteProfile.mutateAsync().then(() => {
                                  setIsEditProfile(false);
                                  setProfilePic("");
                                  setCurrentUser({
                                    ...currentUser,
                                    data: {
                                      ...currentUser.data,
                                      avatar_url: undefined,
                                    },
                                  });
                                  getSingleUser.refetch();
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </Popover>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute top-[35%] left-[4%] h-[80px] w-[80px]  rounded-full border-[5px] border-white bg-black sm:h-[125px] sm:w-[125px] md:top-[48%]  md:left-[10%] md:h-[125px]  md:w-[125px] xl:top-[55%]  xl:h-[230px] xl:w-[230px]  xl:border-[10px] 2xl:h-[230px] 2xl:w-[230px]  2xl:border-[10px]  ">
                  <div className=" relative  h-full w-full">
                    <Image
                      src={smallLogo}
                      alt="Snapshare logo image"
                      // height={150}
                      // width={150}

                      layout="fill"
                      // objectFit="fill"
                    />
                  </div>
                  {/* <div className="ml-2 mt-5 flex h-10 w-10 justify-center rounded-full md:mt-10 lg:mt-10 xl:mt-20">
                      <svg
                        width="40"
                        height="40"
                        viewBox="image/*0 0 42 42"
                        fill="none"
                        className=input""
                        xmlns="http://www.w3.org/2000/svg"
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
                          fill="#3input03030"
                        />
                        <path
                          d="M17.0159 9.70545C17.0159 11.7209 15.3669 13.3699 13.3515 13.3607C11.3544 13.3515 9.72376 11.7117 9.7146 9.71461C9.7146 7.69919 11.3636 6.0502 13.379 6.05936C15.3853 6.06853 17.0159 7.70835 17.0159 9.70545Z"
                          fill="#303030"
                        />
                      </svg>
                    </div> */}

                  <div className="absolute top-[2.9rem] left-[2.7rem] cursor-pointer rounded-full bg-white py-2 px-2 sm:left-[5.2rem]  sm:top-[4.9rem] md:left-[5rem]  md:top-[4.9rem]  xl:left-[9rem] xl:top-[10rem]">
                    <label htmlFor="profile_img">
                      <div className="cursor-pointer">
                        <CameraIcon />
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute top-[39%] left-[4%] cursor-pointer xs:top-[43%] sm:top-[48%] md:top-[50%] md:left-[10%] lg:top-[45%] xl:top-[52%]   ">
            {(!getSingleUser?.data?.data?.isblocked &&
              getSingleUser?.data?.data?.avatar_url) ||
            profilePic?.url ? (
              <div>
                <div
                  onClick={() => {
                    setIsOpenProfile(true);
                  }}
                  className="relative  h-[77px] w-[77px] rounded-full border-[5px] md:h-[117px] md:w-[117px] xl:h-[242px] xl:w-[242px]"
                >
                  <Image
                    src={
                      profilePic?.url || getSingleUser?.data?.data?.avatar_url
                    }
                    // height={212}
                    // width={212}
                    className="rounded-full"
                    alt="profile"
                    objectFit="cover"
                    layout="fill"
                    onClick={() => {
                      setIsOpenProfile(true);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className=" h-[80px] w-[80px] rounded-full border-[5px] border-white bg-black sm:h-[100px] sm:w-[100px] md:top-2  md:h-[125px] md:w-[125px] xl:h-[230px] xl:w-[230px] xl:border-[10px] 2xl:h-[230px] 2xl:w-[230px]  2xl:border-[10px]">
                  <div className=" flex h-full w-full items-center justify-center  xl:mt-7">
                    <Image
                      src={smallLogo}
                      alt="Snapshare logo image"
                      // height={150}
                      // width={150}
                      className=""
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          onChange={(e) => {
            e.stopPropagation();
            onUploadProfile(e);
          }}
          id="profile_img"
          className="hidden"
          accept=".png,.jpg,.jpeg,.raw,.tiff"
          type="file"
          ref={openProfile}
        />
      </div>
      <Modal
        isVisiable={isOpenProfile}
        onClose={setIsOpenProfile}
        className=" top-[20%] z-50 w-[100%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[60%]"
        zIndex={1000}
      >
        <div className="absolute right-2 top-2 z-50 rounded-full bg-white px-2 pt-1.5 pb-0.5">
          <button
            onClick={() => {
              setIsOpenProfile(false);
            }}
          >
            <CrossIcon />
          </button>
        </div>
        <div className="relative z-40 h-[25rem] w-full sm:h-[25.2rem] md:h-[40rem] ">
          <Image
            src={getSingleUser?.data?.data?.avatar_url || profilePic?.url}
            alt="profile"
            layout="fill"
            objectFit="contain"
            className="z-50"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProfileImage;
