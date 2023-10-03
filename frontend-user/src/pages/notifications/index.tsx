import React, { useEffect, useState } from "react";
import Image from "next/image";
import Advertisement from "@/components/advertisement";
import { getNotification } from "@/services/notification";
import {
  loggedInUser,
  socket,
  notificationCount as notifyCount,
} from "@/store";
import { useAtom } from "jotai";
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "@/components/UIComponents/Avatar";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { useNotificationMarkRead } from "@/hooks/notification/mutation";
import { checkIfConversationExists } from "@/services/message";
import {
  CashIcon,
  CheckMark,
  CrossMark,
  ExclamationMark,
} from "@/utils/AppIcons";
interface resInterface {
  message: string;
}
const Notification = () => {
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [socketIO, setSocketIO] = useAtom(socket);
  const [startIndex, setStartIndex] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const notificationMarkRead = useNotificationMarkRead();
  const [notificationsCounts, setNotificationsCounts] = useAtom(notifyCount);

  const viewSize = 50;
  let firstStartIndex = 0;
  const router = useRouter();
  useEffect(() => {
    getNotification({
      query: {
        _start: firstStartIndex,
        _limit: viewSize,
        isFilterChangedOrStartIndexZero: firstStartIndex === 0,
      },
    }).then((res: any) => {
      if (startIndex !== 0) {
        setNotificationsList([
          ...notificationsList,
          ...res?.data?.notifications,
        ]);
      } else {
        setNotificationsList(res?.data?.notifications || []);
      }
      setStartIndex((prev) => prev + viewSize);
      setNotificationCount(res?.data?.total_count);
    });
  }, []);
  const fetchNotification = () => {
    getNotification({
      query: {
        _start: startIndex,
        _limit: viewSize,
        isFilterChangedOrStartIndexZero: startIndex === 0,
      },
    }).then((res: any) => {
      setNotificationsList([...notificationsList, ...res?.data?.notifications]);
      setStartIndex(viewSize + startIndex);
      setNotificationCount(res?.data?.total_count);
    });
  };
  const handleNewNotification = (data: any) => {
    setNotificationsList((prevState) => [data, ...prevState]);
  };
  useEffect(() => {
    notificationMarkRead.mutateAsync().then((res: any) => {
      if (res?.message === "success") {
        // setCurrentUser({
        //   data: {
        //     ...currentUser?.data,
        //     notificationCount: 0,
        //   },
        // });
        setNotificationsCounts(0);
      }
    });
  }, []);

  useEffect(() => {
    if (socketIO) {
      socketIO?.on("new-notification", handleNewNotification);
    }
    return () => {
      if (socketIO) {
        socketIO?.off("new-notification", handleNewNotification);
      }
    };
  }, [socketIO]);
  // const handleOnNotification = (item: any) => {
  //   if (item?.verb === "Like" || item?.verb === "comment") {
  //     router.push(`/open-post?id=${item?.subject}`);
  //   } else {
  //     router.push(`profile/${item?.actor}`);
  //   }
  // };
  const routing = (data: any) => {
    let url = "/";
    if (["Like", "comment", "restore-post"].includes(data?.verb)) {
      url = `/open-post?id=${data?.subject}`;
    } else if (
      ["warning", "spankee", "coin-deducted", "report-post", "bounty"].includes(
        data?.verb
      )
    ) {
      url = `/profile/${currentUser?.data?._id}`;
    } else {
      url = `/profile/${data?.actor}`;
    }

    router.push(url);
  };
  const getNotificationIcon = (value: any) => {
    switch (value) {
      case "warning":
        return (
          <ExclamationMark
            className={"h-[25px] w-[25px] sm:h-[40px] sm:w-[40px]"}
          />
        );
      case "bounty":
        return (
          <CashIcon className={"h-[25px] w-[25px] md:w-[40px] lg:h-[40px]"} />
        );
      case "transaction":
        return (
          <CheckMark className={"h-[25px] w-[25px] md:h-[40px] md:w-[40px]"} />
        );
      case "transaction-reject":
        return (
          <CrossMark className={"h-[20px] w-[20px] md:h-[40px] md:w-[40px]"} />
        );
      default:
        break;
    }
  };
  return (
    <div className="">
      {/* <div className="top flex">
        <div className="left w-[10%]"><Avatar className='w-[50px] h-[50px]'/></div>
        <div className="mid w-[80%]">mid</div>
        <div className="right ">right</div>
      </div> */}
      <div className=" flex h-[80vh]  w-[100%]   text-black   ">
        <div className="flex h-full w-[100%]  justify-center md:w-[66%] md:justify-end ">
          <div className="mt-5 flex h-full w-[85%] justify-end xl:w-[80%] ">
            <div className="  w-[100%]   rounded-[10px] border bg-white shadow-md">
              <p className="mx-6 w-full rounded-md p-3 text-start text-xl font-[600]">
                Notification
              </p>
              <div className="border"></div>
              {notificationsList?.length > 0 ? (
                <>
                  <div
                    id="scrollableDiv"
                    style={{
                      overflowY: "auto",
                      height: "100%",
                      background: "white",
                      borderRadius: "10px",
                    }}
                  >
                    <InfiniteScroll
                      dataLength={notificationsList?.length}
                      next={fetchNotification}
                      hasMore={notificationsList?.length < notificationCount}
                      loader={
                        <h4
                          className="flex justify-center"
                          style={{
                            zIndex: 1000,
                          }}
                        >
                          <p>Loading...</p>
                        </h4>
                      }
                      scrollableTarget="scrollableDiv"
                    >
                      {notificationsList?.map((item, idx) => (
                        <>
                          <div
                            // className="  flex  justify-between border-b p-3 px-3  text-base text-gray-700"
                            className="flex  items-center justify-start  p-3 px-3 text-base text-gray-700  xxs:px-0 xs:px-2 "
                            key={item?._id}
                          >
                            <div className="mx-0 ml-1 cursor-pointer px-0">
                              <Link
                                href={
                                  [
                                    "warning",
                                    "spankee",
                                    "coin-deducted",
                                    "restore-post",
                                    "bounty",
                                  ].includes(item?.verb)
                                    ? `/profile/${currentUser?.data?._id}`
                                    : `/profile/${item?.actor}`
                                }
                              >
                                {["warning", "bounty", "transaction"]?.includes(
                                  item?.verb
                                ) ? (
                                  <div className="relative my-auto ml-0 h-[50px]  w-[50px] rounded-full border-2 border-white lg:ml-5 lg:h-[85px] lg:w-[85px]  ">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                                      {/* <ExclamationMark /> */}
                                      {getNotificationIcon(item?.verb)}
                                    </div>
                                  </div>
                                ) : item?.avatar ? (
                                  <div
                                    className="relative my-auto ml-0 h-[50px]  w-[50px] rounded-full border-2 border-white lg:ml-5 lg:h-[85px] lg:w-[85px]  "
                                    // className="relative my-auto ml-5  h-[85px] w-[85px] rounded-full border-2 border-white "
                                  >
                                    <Image
                                      src={item?.avatar}
                                      className="rounded-full"
                                      // style={{ borderRadius: "10px" }}
                                      alt={"img"}
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="ml-0 h-[50px] w-[50px]  lg:ml-5 lg:h-[85px] lg:w-[85px]">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                                      {item?.name?.charAt(0).toUpperCase()}
                                    </div>{" "}
                                  </div>
                                )}
                              </Link>
                            </div>
                            {/* <Link
                              href={`${
                               
                                // item?.verb === "Like" ||
                                // item?.verb === "comment" ||
                                // item?.verb === "restore-post" ||
                                // item?.verb === "warning"
                                //   ? `/open-post?id=${item?.subject}`
                                //   : item?.verb === "new-message"
                                //   ? `/messages/${item?.receiver}?tab=All`
                                //   : `/profile/${item?.actor}`
                              }`}
                            > */}
                            <div
                              onClick={() => {
                                if (item?.verb === "new-message") {
                                  checkIfConversationExists({
                                    sender: item?.actor,
                                    receiver: item?.receiver,
                                  }).then((res: any) => {
                                    if (res?.data?.exists) {
                                      router.push(
                                        `/messages/${res?.data?.conversation_id}?tab=All`
                                      );
                                    }
                                    // else if (!res?.data?.exists) {
                                    //   createConversation({
                                    //     body: {
                                    //       usersList: [user?._id, currentUser?.data?._id],
                                    //       type: "single",
                                    //     },
                                    //   }).then((res: any) => {
                                    //     router.push(`/messages/${res?.data?._id}`);
                                    //   });
                                    // }
                                  });
                                } else {
                                  routing(item);
                                }
                                // handleOnNotification(item);
                              }}
                              className="my-auto  w-[700px] cursor-pointer p-2  text-center  text-sm lg:text-lg"
                            >
                              <p className="text-left text-xs leading-none text-gray-900 sm:text-base">
                                <span className="font-semibold">
                                  {item.name}{" "}
                                </span>
                              </p>
                              <p className="w-[85%] pt-3 text-left text-xs leading-none text-gray-900 xxs:break-words sm:text-base lg:w-full">
                                {item.message}
                              </p>
                            </div>
                            {/* </Link> */}
                            <div>
                              {" "}
                              <p className="mr-5 mt-0 w-max text-[10px]  text-primary-600 sm:mt-3 ">
                                {dayjs(item.created_at).fromNow()}
                              </p>
                            </div>
                          </div>
                          <div className="border"></div>
                        </>
                      ))}
                    </InfiniteScroll>
                  </div>
                </>
              ) : (
                <div className="item-center mt-20 flex justify-center text-xl font-medium text-primary-600">
                  No notification found yet
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className=" relative  mt-5  flex w-full justify-end xxs:justify-center md:w-[100%] md:justify-center lg:w-[70%] lg:justify-end xl:relative xl:left-[55px] xl:justify-center "> */}
        {/* <div className=" w-[95%]  md:w-[80%] lg:w-[80%] xl:ml-16 "> */}

        {/* </div> */}
        {/* </div> */}
        {/* <div className="mt-5  hidden w-[30%] md:block">
          <Advertisement />
        </div> */}
      </div>
    </div>
  );
};
export default Notification;
