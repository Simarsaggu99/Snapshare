import React, { useEffect, useState } from "react";
import Image from "next/image";
import userProfile from "~/images/userProfile.png";
import Link from "next/link";
import { getNotification } from "@/services/notification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import Avatar from "../UIComponents/Avatar";
import { useMarkSingleNotificationRead } from "@/hooks/notification/mutation";
import { useAtom } from "jotai";
import { loggedInUser, notificationCount as notifyCount } from "@/store";
import { checkIfConversationExists } from "@/services/message";
import {
  CashIcon,
  CheckMark,
  CrossMark,
  ExclamationMark,
} from "@/utils/AppIcons";
dayjs.extend(relativeTime);
interface notificationResponse {
  data: any;
  message: string;
}
type notificationProps = {
  setOpen: React.Dispatch<React.SetStateAction<{ notify: boolean }>>;
};
const Notificationcard = ({ setOpen }: notificationProps) => {
  const markSingleNotificationRead = useMarkSingleNotificationRead();
  const router = useRouter();
  const [notification, setNotification] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [notificationsCounts, setNotificationsCounts] = useAtom(notifyCount);

  useEffect(() => {
    getNotification({ query: {} }).then((res: any) => {
      setNotification(res?.data?.notifications || []);
    });
  }, []);

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
        return <ExclamationMark className={"h-[25px] w-[25px] "} />;
      case "bounty":
        return <CashIcon className={"h-[25px] w-[25px] "} />;
      case "transaction":
        return <CheckMark className={"h-[25px] w-[25px] "} />;
      case "transaction-reject":
        <CrossMark className={"h-[20px] w-[20px]"} />;
        return;
      default:
        break;
    }
  };
  return (
    <div className="">
      <div className="mt-5 h-[35.5rem] overflow-hidden rounded-[10px]  bg-white py-2 pt-2.5 shadow-md ">
        <div className="flex justify-between border-b py-2 px-4">
          <p className=" rounded-md py-2  text-xl font-[400] ">Notifications</p>
          <div className=" mt-2 text-primary-600">
            <Link href={"/notifications"}>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setTimeout(() => {
                    setOpen({ notify: false });
                  }, 500);
                }}
              >
                <a>See all</a>
              </div>
            </Link>
          </div>
        </div>
        {notification?.length > 0 ? (
          notification?.map(
            (item: any, idx: number) =>
              item?.verb !== "close-conversation-request" && (
                <div
                  className={`flex justify-between  border-b py-4 px-2 text-base ${
                    item?.isRead ? "" : "bg-gray-100"
                  } text-gray-700 last:border-none`}
                  key={idx}
                >
                  {/* <div className={``}> */}
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
                    className=" "
                  >
                    {["warning", "bounty", "transaction"]?.includes(
                      item?.verb
                    ) ? (
                      <div className="mr-2 h-[45px] w-[50px] ">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                          {/* <ExclamationMark /> */}
                          {getNotificationIcon(item?.verb)}
                        </div>
                      </div>
                    ) : item?.avatar ? (
                      <div className="relative mr-2 mt-1 cursor-pointer rounded-full ">
                        <Image
                          src={item?.avatar}
                          width={50}
                          height={50}
                          style={{ borderRadius: "100%" }}
                          alt={"profile"}
                          // layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="mr-2 h-[45px] w-[50px] cursor-pointer">
                        <Avatar name={item?.user_handle} />
                      </div>
                    )}
                  </Link>
                  {/* <Link
                href={`${
                  item?.verb === "Like" || item?.verb === "comment"
                    ? `/open-post?id=${item?.subject}`
                    : item?.verb === "new-message"
                    ? `/messages/${item?.receiver}?tab=All`
                    : `/profile/${item?.actor}`
                }`}
              > */}
                  <div
                    className="flex w-full cursor-pointer justify-between gap-4 pt-2 text-sm"
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
                        // router.push(
                        //   `${
                        //     item?.verb === "Like" ||
                        //     item?.verb === "comment" ||
                        //     item?.verb === "restore-post"
                        //       ? `/open-post?id=${item?.subject}`
                        //       : item?.verb === "new-message"
                        //       ? `/messages/${item?.receiver}?tab=All`
                        //       : `/profile/${item?.actor}`
                        //   }`
                        // );
                      }
                      setOpen({ notify: false });
                      markSingleNotificationRead
                        .mutateAsync({
                          pathParams: { id: item?._id },
                        })
                        .then((res) => {
                          setNotificationsCounts(
                            notificationsCounts > 0
                              ? Number(notificationsCounts) - 1
                              : 0
                          );
                          // setCurrentUser({
                          //   ...currentUser,
                          //   data: {
                          //     ...currentUser.data,
                          //     notificationCount:
                          //       currentUser?.data?.notificationCount > 0 &&
                          //       currentUser?.data?.notificationCount - 1,
                          //   },
                          // });
                        });
                    }}
                  >
                    <p className=" w-[67%]  leading-none text-gray-900">
                      <span className="text-sm font-medium">
                        {" "}
                        {item.message}
                      </span>
                    </p>
                    <p className=" w-[28%] text-xs text-primary-600">
                      {dayjs(item.created_at).fromNow()}
                    </p>
                  </div>
                  {/* </Link> */}
                  {/* </div> */}
                </div>
              )
          )
        ) : (
          <div className="py-10 text-center text-primary-600">
            <p>No notification found yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificationcard;
