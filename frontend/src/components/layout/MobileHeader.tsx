import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import logo from "~/images/logo.png";

import Image from "next/image";
import { useRouter } from "next/router";
import smallLogo from "../../../public/images/logo_icon.png";
import AddPost from "../addPost";
import {
  CreatePost,
  NotificationIcon,
  HeaderMessageIcon,
  MessageMenuIcon,
} from "../Icons/index";
import { useAtom } from "jotai";
import {
  isLoginModal,
  loggedInUser,
  globalSearch,
  isGlobalSearchOpen,
  isSearchBar,
  currentUserDataState,
  notificationCount,
  SearchBarOpen,
} from "../../store/index";
import {
  BountyIcon,
  CollectionIcon,
  CrossIcon2,
  LogoutIcon,
  MyEarningIcon,
  SettingIcon,
  SignInIcon,
} from "@/utils/AppIcons";
import Notificationcard from "../Notificationcard/index";
import { getFirstLetter } from "@/utils/common";
import { MdOutlineHelp } from "react-icons/md";
import ClosePopUp from "../closePopUp";
import ConversaionPopUp from "../message/conversationPopUp";
import Popover from "../UIComponents/Popover";
import { logOutUser } from "@/services/user/index";
import Avatar from "../UIComponents/Avatar";
import { currentUser as getCurrentUser } from "@/services/user/index";
import { useCheckTodayPostCount } from "@/hooks/post/query";
import { notifyError } from "../UIComponents/Notification";
interface menyArrayInterface {
  name: string;
  id: number;
  link: string;
  svg: any;
}

const MobileHeader = () => {
  const router = useRouter();
  const { query }: any = router;
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const [open, setOpen] = useState({ notify: false });
  const [isAddPost, setIsAddPost] = useState(false);
  const [isSearch, setIsSearch] = useAtom(isSearchBar);
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [isMessagePopUp, setIsMessagePopUp] = useState<boolean>(false);
  const [menuPopUp, setMenuPopUp] = useState<boolean>(false);
  const userCardRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);
  const messageCardRef = React.useRef<HTMLDivElement>(null);
  const messageRef = React.useRef<HTMLButtonElement | null>(null);
  const [searchInput, setSearchInput] = useAtom(globalSearch);
  const reportModalRef = useRef<any>(null);
  const reportCardRef = useRef<any>(null);
  const inputReference = useRef<HTMLInputElement | null>(null);
  const checkTodayPostCount: any = useCheckTodayPostCount({
    currentUser,
  });
  const [notificationsCounts, setNotificationsCounts] =
    useAtom(notificationCount);
  const [currentUserData, setCurrentUserData] = useAtom(currentUserDataState);
  const [isActive, setIsActive] = useAtom(SearchBarOpen);
  useEffect(() => {}, []);
  const ref = useRef<any>();

  React.useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        setCurrentUser(res);
        setNotificationsCounts(res?.data?.notificationCount);
        window.localStorage.setItem("currentUser", JSON.stringify(res?.data));
      })
      .catch((err) => {
        if (
          err?.response?.data?.error?.message?.includes(
            "Please login again" || "expired"
          )
        ) {
          window.localStorage.clear();
          setCurrentUserData({});

          window.location.replace("/");
          setSearchInput("");
        }
      });

    return () => {
      setMenuPopUp(false);
    };
  }, []);

  useEffect(() => {
    if (isMessagePopUp || open.notify || isAddPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMessagePopUp, open.notify, isAddPost]);

  React.useEffect(() => {
    if (query?.search_query) {
      setSearchInput(query?.search_query);
    } else {
      setSearchInput("");
      setShowInput(false);
    }
  }, [query?.search_query]);
  const menuArray = [
    {
      name: "My collection",
      icon: <CollectionIcon />,
      id: 1,
      link: "/mycollection",
      className: "",
    },
    {
      name: "My earnings",
      icon: <MyEarningIcon />,
      id: 2,
      link: "/myearning",
      className: "",
    },
    {
      name: "Message",
      icon: <MessageMenuIcon />,
      id: 4,
      link: "/messages?tab=All",
      className: "block md:hidden",
    },
    {
      name: "Bounty",
      icon: <BountyIcon />,
      id: 3,
      link: "/bounty",
      className: "",
    },
    {
      name: "Settings",
      icon: <SettingIcon />,
      id: 4,
      link: `${
        typeof window !== "undefined" && window.screen.width > 640
          ? "/setting?tab=Basic-info"
          : "/setting"
      }`,
      className: "",
    },
    {
      name: "Help center",
      icon: <MdOutlineHelp className="text-2xl text-gray-700" />,
      id: 6,
      link: "/help-center",
      className: "",
    },
    {
      name: "Log out",
      icon: <LogoutIcon />,
      id: 5,

      className: "",
    },
  ];
  const addPostProps = {
    isAddPost,
    setIsAddPost,
  };

  ClosePopUp({ menuPopUp, userCardRef, userRef, setMenuPopUp });

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      // setIsActive(false);
      if (
        open &&
        reportCardRef.current &&
        !reportCardRef.current.contains(e.target) &&
        !reportModalRef?.current?.contains(e.target)
      ) {
        setOpen({ notify: false });
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [open]);

  const logoutUser = async () => {
    await logOutUser().then(() => {
      setCurrentUser();
      // location.reload();
      // router.push("/");
    });
  };

  React.useEffect(() => {
    const getCurrentUserData = () => {
      try {
        if (typeof window !== "undefined")
          if (process.browser)
            return JSON.parse(
              window.localStorage.getItem("currentUser") || "{}"
            );
      } catch (e) {
        return {};
      }
    };
    if (!currentUserData?._id) setCurrentUserData({ ...getCurrentUserData() });
    if (currentUser?.data?.avatar_url !== currentUserData?.avatar_url) {
      setCurrentUserData({ ...getCurrentUserData(), ...currentUser?.data });
      window.localStorage.setItem("currentUser", currentUser?.data);
    }
    if (currentUser?.data?.name !== currentUserData?.name) {
      setCurrentUserData({ ...getCurrentUserData(), ...currentUser?.data });
      window.localStorage.setItem("currentUser", currentUser?.data);
    }
  }, [currentUser?.data]);

  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<any>(null);

  const handleOutsideClick = (event: any) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      if (!router.pathname.includes("/search")) {
        setShowInput(false);
      }
    }
  };
  useEffect(() => {
    if (router.pathname.includes("/search") && query.search_query) {
      setShowInput(true);
    }
    return () => {
      if (!router.pathname.includes("/search") && !query.search_query) {
        setShowInput(false);
      }
    };
  }, [query]);
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    if (showInput) {
      if (inputReference.current) {
        inputReference.current.focus();
      }
    }
  }, [showInput]);

  const handleKey = (event: { key: string }) => {
    if (event.key === "Enter") {
      if (searchInput) {
        router.push(`/search?tab=all&&search_query=${searchInput}`);
      } else {
        router.push("/");
      }
    }
  };
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  console.log("searchInput", searchInput);
  return (
    <div>
      {currentUserData?._id ? (
        <>
          <div className="fixed top-0 z-40  mb-5   w-[100%]  gap-4 bg-[#332d2b] py-1  ">
            <div className="mx-2 flex items-center justify-between xs:mx-6 sm:mx-8 ">
              <div
                className={` ${
                  showInput && "mr-3"
                } block  h-[50px] w-[45px] cursor-pointer  pt-1    md:h-[57px] md:w-[45px]  lg:ml-[6.5rem] lg:hidden xl:ml-[8.7rem] 2xl:ml-[13rem]`}
              >
                <button
                  onClick={() => {
                    setSearchInput("");
                    setShowInput(false);
                  }}
                >
                  <Link href={"/"}>
                    <div className="h-[45px] w-[45px]">
                      <Image
                        src={smallLogo}
                        alt="Snapshare logo image"
                        // height={45}
                        // width={45}
                        objectFit="contain"
                        className=""
                      />
                    </div>
                  </Link>
                </button>
              </div>
              <div className="   hidden  cursor-pointer justify-center   md:ml-10 lg:ml-[6.5rem] lg:block xl:ml-[8.7rem] 2xl:ml-[13rem]">
                <button
                  onClick={() => {
                    setSearchInput("");
                    setShowInput(false);
                  }}
                >
                  <Link href={"/"}>
                    <Image
                      src={logo}
                      alt="Snapshare logo image"
                      height={60}
                      width={250}
                    />
                  </Link>
                </button>
              </div>

              {/* <div className=" relative mx-1 flex items-center justify-end md:mx-5 lg:mx-0 lg:justify-center 2xl:mr-28"> */}
              {showInput && (
                <div className="relative block  ">
                  <div
                    ref={ref}
                    // className={`search-wrapper  ${
                    //   showInput ? "active  " : ""
                    // } `}
                    // style={{
                    //   position: showInput ? "absolute" : "relative",
                    //   top: showInput ? "50%" : "",
                    //   left: showInput ? "50%" : "",
                    // }}
                  >
                    <div className=" w-full">
                      <div
                        ref={inputRef}
                        className="relative mx-auto flex  h-[36px] md:w-[100%]"
                      >
                        <input
                          placeholder="Search here..."
                          className="w-full rounded-md pl-2  text-xl outline-none placeholder:text-base "
                          style={{ height: "100%", width: "100%" }}
                          ref={inputReference}
                          value={searchInput}
                          onKeyDown={handleKey}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            setIsActive(true);
                          }}
                        />
                        {searchInput ? (
                          <button
                            onClick={(event) => {
                              setShowInput(true);
                              if (searchInput && showInput) {
                                router.push(
                                  `/search?tab=all&&search_query=${searchInput}`
                                );
                              }
                            }}
                            className={` ${
                              showInput
                                ? " absolute right-0 z-50 rounded-tr-md rounded-br-md bg-white px-4 py-1.5 "
                                : "bg-[#564c4c]"
                            }`}
                          >
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 22 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.9827 14.8532C17.4958 15.3663 18.0089 15.8717 18.5142 16.3848C19.3383 17.2089 20.1702 18.033 20.9865 18.8572C21.3364 19.207 21.4608 19.6346 21.313 20.1167C21.1731 20.5832 20.8466 20.8708 20.3723 20.9719C19.8903 21.073 19.5016 20.8941 19.1595 20.5521C17.9234 19.3159 16.6872 18.0797 15.4511 16.8357C15.3734 16.758 15.3112 16.6725 15.2412 16.5869C12.87 18.3052 10.2967 18.8883 7.48231 18.2352C5.25882 17.7221 3.46293 16.5092 2.12572 14.6588C-0.603106 10.8881 -0.0899932 5.67897 3.29189 2.50687C6.70487 -0.688549 11.9215 -0.844044 15.5211 2.12591C19.2139 5.18139 20.0614 10.7248 16.9827 14.8532ZM9.62028 16.0038C13.3598 16.0038 16.3607 13.0106 16.3763 9.2709C16.384 5.52347 13.3753 2.50687 9.62806 2.50687C5.89632 2.50687 2.88762 5.50015 2.87984 9.2398C2.86429 12.9795 5.873 15.9961 9.62028 16.0038Z"
                                fill={showInput ? "#FF5E34" : "white"}
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={(event) => {
                              setShowInput(false);
                            }}
                            className={` ${
                              showInput
                                ? "absolute right-0 z-50 rounded-tr-md rounded-br-md bg-white px-4 py-1.5 "
                                : "bg-[#564c4c]"
                            }`}
                          >
                            <CrossIcon2 />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!showInput && (
                <button
                  onClick={(event) => {
                    setShowInput(true);
                  }}
                  className={`search-icon  rounded-full p-2.5 ${"bg-[#564c4c]"}`}
                >
                  <svg
                    width="22"
                    height="21"
                    viewBox="0 0 22 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.9827 14.8532C17.4958 15.3663 18.0089 15.8717 18.5142 16.3848C19.3383 17.2089 20.1702 18.033 20.9865 18.8572C21.3364 19.207 21.4608 19.6346 21.313 20.1167C21.1731 20.5832 20.8466 20.8708 20.3723 20.9719C19.8903 21.073 19.5016 20.8941 19.1595 20.5521C17.9234 19.3159 16.6872 18.0797 15.4511 16.8357C15.3734 16.758 15.3112 16.6725 15.2412 16.5869C12.87 18.3052 10.2967 18.8883 7.48231 18.2352C5.25882 17.7221 3.46293 16.5092 2.12572 14.6588C-0.603106 10.8881 -0.0899932 5.67897 3.29189 2.50687C6.70487 -0.688549 11.9215 -0.844044 15.5211 2.12591C19.2139 5.18139 20.0614 10.7248 16.9827 14.8532ZM9.62028 16.0038C13.3598 16.0038 16.3607 13.0106 16.3763 9.2709C16.384 5.52347 13.3753 2.50687 9.62806 2.50687C5.89632 2.50687 2.88762 5.50015 2.87984 9.2398C2.86429 12.9795 5.873 15.9961 9.62028 16.0038Z"
                      fill={"white"}
                    />
                  </svg>
                </button>
              )}

              {!showInput && (
                <div>
                  <button
                    onClick={() => {
                      // if (checkTodayPostCount?.data?.postCount === 0) {
                      //   return notifyError({
                      //     message: "You already posted 10 posts!",
                      //   });
                      // }
                      // setIsAddPost(true);
                    }}
                    className="relative  flex items-center gap-3 rounded-full bg-primary-600 py-1 pl-1 pr-3 sm:pl-1 sm:pr-5  "
                  >
                    <div className=" rounded-full bg-primary-400 px-2 py-2 pb-1 pl-3 ">
                      <CreatePost />
                    </div>
                    <p className="text-white ">{`${
                      checkTodayPostCount?.data?.postCount || 0
                    }/10`}</p>
                  </button>
                </div>
              )}
              {!showInput && (
                <div ref={reportModalRef} className="relative ">
                  <div ref={reportCardRef}>
                    <button
                      className=" rounded-full bg-[#564C4C] px-2.5  py-2.5    "
                      onClick={() => {
                        // router.push("/notifications");
                      }}
                    >
                      <NotificationIcon />
                    </button>
                    {notificationsCounts > 0 && (
                      <p className="item-center absolute -top-1 -right-2 z-50   w-7 rounded-full bg-red-500 py-0.5 text-center text-xs font-medium text-white lg:block">
                        {notificationsCounts < 99 ? notificationsCounts : "+99"}
                      </p>
                    )}
                  </div>
                  {open.notify && (
                    <div className="absolute hidden w-[23rem] lg:-right-28  lg:block  xl:-right-40 ">
                      <Notificationcard setOpen={setOpen} />
                    </div>
                  )}
                </div>
              )}
              {!showInput && (
                <div className={`relative hidden md:block `}>
                  <button
                    ref={messageRef}
                    onClick={() => {
                      // setIsMessagePopUp(!isMessagePopUp);
                      // router.push("/messages?tab=All");
                    }}
                    className={`relative mx-2  rounded-full bg-[#564C4C] px-3  py-3    `}
                  >
                    <HeaderMessageIcon />
                  </button>
                  {isMessagePopUp && (
                    <div ref={messageCardRef} className="hidden lg:block">
                      <ConversaionPopUp
                        messageCardRef={messageCardRef}
                        messageRef={messageRef}
                        isMessagePopUp={isMessagePopUp}
                        setIsMessagePopUp={setIsMessagePopUp}
                      />
                    </div>
                  )}
                  {currentUser?.data?.messageCount > 0 && (
                    <p className="item-center absolute top-0 right-0  w-6 rounded-full   bg-red-500 py-0.5 text-center text-xs font-medium text-white ">
                      {currentUser?.data?.messageCount}
                    </p>
                  )}
                </div>
              )}

              <div className={`${showInput && "ml-3"}  relative lg:mx-2`}>
                <div
                  ref={userRef}
                  onClick={() => {
                    setMenuPopUp(!menuPopUp);
                  }}
                  // className="relative  mx-4 rounded-full sm:mx-10 md:mx-0 lg:h-[46px] lg:w-[46px]"/
                  className={` cursor-pointer    lg:mx-0 `}
                >
                  {currentUserData?.avatar_url ? (
                    <div className="relative h-[42px] w-[42px] pt-2">
                      <Image
                        src={currentUserData?.avatar_url}
                        // height={45}
                        // width={45}
                        layout="fill"
                        className="shadow-md "
                        style={{ borderRadius: "50%" }}
                        alt="profile"
                        objectFit="cover"
                      />
                    </div>
                  ) : (
                    <div className="  flex h-[42px] w-[42px] items-center  justify-center rounded-full bg-primary-600 text-white">
                      {getFirstLetter(currentUserData?.name)}
                    </div>
                  )}
                </div>

                <Popover
                  isVisible={menuPopUp}
                  userRef={userRef}
                  onclose={setMenuPopUp}
                  className={
                    " right-0 xxs:right-0 xs:right-4 sm:right-4 md:right-0 lg:right-0"
                  }
                >
                  <div
                    style={{
                      height: containerHeight < 611 ? "85vh" : "",
                    }}
                    className=" w-[20rem] overflow-x-auto overflow-y-auto px-6 py-3"
                  >
                    <p className="mt-2 text-xl font-bold"></p>
                    <Link href={`/profile/${currentUserData?._id}`}>
                      <div
                        className="flex cursor-pointer gap-4 border-b py-2"
                        onClick={() => {
                          setMenuPopUp(false);
                        }}
                      >
                        {currentUserData?.avatar_url ? (
                          <Image
                            src={currentUserData?.avatar_url}
                            alt="profile"
                            height={72}
                            width={72}
                            className="rounded-full "
                            objectFit="cover"
                          />
                        ) : (
                          <div className="h-[72px] w-[72px]">
                            <Avatar name={currentUserData?.user_handle} />
                          </div>
                        )}
                        <div className="mt-2">
                          <Link href={`/profile/${currentUserData?._id}`}>
                            <p className="w-44 overflow-hidden text-ellipsis text-lg font-medium ">
                              {currentUserData?.user_handle}
                            </p>
                          </Link>
                          <label htmlFor="upload_profile">
                            <p className="cursor-pointer text-sm text-primary-600 ">
                              {/* {currentUserData?.cruxAwardedMemeCoins} MC */}
                              View profile
                            </p>
                          </label>
                          <input
                            id="upload_profile"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e: any) => {
                              // onUploadFile(e);
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                    <div>
                      {/* {menuArray?.map((item: any) => (
                        <div key={item?.id} className={`${item?.className} `}>
                          {item?.id === 5 ? (
                            <button
                              onClick={async () => {
                                window.location.replace("/");
                                window.localStorage.clear();
                                setTimeout(() => {
                                  setCurrentUserData({});
                                  setSearchInput("");
                                  logoutUser();
                                }, 500);
                              }}
                              className="my-2 flex w-full gap-3 rounded-md px-2 py-1.5 text-[#564C4C] hover:bg-[#EDEDED]"
                            >
                              <div className="rounded-full bg-gray-300 p-4">
                                {item?.icon}
                              </div>
                              <p className="mt-3">{item?.name}</p>
                            </button>
                          ) : (
                            <Link href={item?.link}>
                              <button
                                onClick={async () => {
                                  setTimeout(() => {
                                    setMenuPopUp(false);
                                  }, 300);
                                }}
                                className="my-2 flex w-full gap-3 rounded-md px-2 py-1.5 text-[#564C4C] hover:bg-[#EDEDED]"
                              >
                                <div className="rounded-full bg-gray-300 p-4">
                                  {item?.icon}
                                </div>
                                <p className="mt-3">{item?.name}</p>
                              </button>
                            </Link>
                          )}
                        </div>
                      ))} */}
                    </div>
                  </div>
                </Popover>
              </div>
            </div>
            {/* </div> */}
          </div>
        </>
      ) : null}
      <AddPost postProps={addPostProps} />
    </div>
  );
};

export default MobileHeader;
