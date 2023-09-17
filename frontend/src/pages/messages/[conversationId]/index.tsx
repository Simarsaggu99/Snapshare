import {
  CrossIcon,
  FolderIcon,
  GalleryIcon,
  MediaIcon,
  MyCollectionOutlined,
  ThreeDotsIcon,
} from "@/utils/AppIcons";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import {
  allPostsData,
  conversationCount,
  conversation_Id,
  loggedInUser,
  socket,
} from "@/store";
import ConversationList from "@/components/message/conversationList";
import UserData from "@/components/message/userData";
import {
  getConversation,
  getMessages,
  uploadAttachments,
} from "@/services/message";
import dayjs from "dayjs";
import style from "./style.module.css";
import ClosePopUp from "@/components/closePopUp";
import InfiniteScroll from "react-infinite-scroll-component";
import { getFirstLetter, getFormattedDate } from "@/utils/common";
import MyCollectionModal from "@/components/message/MyCollectionModal";
import Link from "next/link";
import Popover from "@/components/UIComponents/Popover";
import {
  useArchiveConversation,
  useDeleteConversation,
  useUnArchiveConversation,
} from "@/hooks/message/mutation";
import Avatar from "@/components/UIComponents/Avatar";
import { useGetSingleUser } from "@/hooks/user/query";
import { BackIcon } from "@/components/Icons";
import { notifyWarning } from "@/components/UIComponents/Notification";
import Modal from "@/components/Modal";

const Conversation = () => {
  const router = useRouter();
  const conversationId = router.query.conversationId;
  const tabName = router.query.tab;
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [socketIO, setSocketIO] = useAtom(socket);
  const [messageText, setMessageText] = useState<any>();
  const [currentConversation, setCurrentConversation] = useState<any>([]);
  const [messageList, setMessageList] = useState<any>([]);
  const [uploadFilePopUp, setUploadFilePopUp] = useState<boolean>(false);
  const [conversation_id, setConversation_id] = useAtom(conversation_Id);
  const [startIndex, setStartIndex] = useState(0);
  const uploadCardRef = useRef<any>(null);
  const uploadRef = useRef<any>(null);
  const popoverRef = useRef<any>(null);
  const messagesEndRef = useRef<null | any>(null);
  const [messagesTotalCount, setMessagesTotalCount] = useState(0);
  const [isMyCollection, setIsMyCollection] = useState(false);
  const [isChatAction, setIsChatAction] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const limit = 50;
  let firstStartIndex = 0;
  const deleteConversation = useDeleteConversation();
  const archiveConversation = useArchiveConversation();
  const unArchiveConversation = useUnArchiveConversation();

  useEffect(() => {
    if (conversationId) {
      setConversation_id(conversationId);
      getMessages({
        conversationId,
        _start: firstStartIndex,
        _limit: limit,
        isFilterChangedOrStartIndexZero: firstStartIndex === 0,
      }).then((res: any) => {
        if (firstStartIndex !== 0) {
          setMessageList([...messageList, ...res?.data?.messages]);
        } else {
          setMessageList(res?.data?.messages);
        }
        setMessagesTotalCount(res.data.total_count);
        setStartIndex(50);
        firstStartIndex += 10;
      });
      getConversation({ pathParams: { id: conversationId } })
        .then((res: any) => {
          setCurrentConversation(res?.data?.conversation?.[0]);
        })
        .catch((err) => {});
    }
    return () => {
      setConversation_id("");
      setMessageList([]);
      setStartIndex(0);
    };
  }, [conversationId]);
  const fetchMessages = () => {
    getMessages({
      conversationId,
      _start: startIndex,
      _limit: limit,
      isFilterChangedOrStartIndexZero: startIndex === 0,
    }).then((res: any) => {
      if (startIndex) {
        setMessageList([...messageList, ...res?.data?.messages]);
      } else {
        setMessageList(res?.data?.messages);
      }
      setMessagesTotalCount(res.data.total_count);
      setStartIndex((prev) => prev + limit);
    });
  };
  const scrollTo = (val: any, direction: any) => {
    val?.current?.addEventListener("DOMNodeInserted", (event: any) => {
      const { currentTarget: target } = event;
      if (direction === "TOP") {
        target.scroll({ top: target.scrollHeight });
      } else {
        target.scroll({ bottom: target.scrollHeight });
      }
    });
  };
  const updateConversationReadStatus = (data: any) => {
    setMessageList((prevState: any[]) => {
      return prevState?.map((item: any) => {
        // if (_.includes(data.messages, item?._id)) {
        return {
          ...item,
          read_by: [
            item?.read_by && { ...item?.read_by },
            { user: data?.userId },
            // { user: data.userId, read_at: dayjs().toISOString() },
          ],
        };
        // }
        // return item
      });
    });
  };
  const markConRead = (data: any) => {
    updateConversationReadStatus(data);
  };
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      top: 0,
    });
  };

  const addNewMessage = (message: any) => {
    if (message?.type !== "post") {
      setMessageList((prev: any[]) => {
        return [
          {
            type: message?.type,
            sender: message?.sender,
            message: message?.message,
            _id: message?._id,
            reference_id: message?.reference_id,
            read_by: message?.read_by,
          },
          ...prev,
        ];
      });
    } else {
      console.log("message.sender", message.sender);
      if (currentUser?.data?._id !== message.sender?._id) {
        setMessageList((prev: any[]) => {
          return [
            {
              type: message?.type,
              sender: message?.sender,
              message: message?.message,
              _id: message?._id,
              reference_id: message?.reference_id,
              read_by: message?.read_by,
              postData: message?.postData,
            },
            ...prev,
          ];
        });
      }
    }
  };
  const member = currentConversation?.members?.filter(
    (member: any) => member?._id !== currentUser?.data?._id
  );
  const handle = member?.[0];
  const user: any = useGetSingleUser({
    pathParams: {
      id: handle?._id,
    },
  });

  const handleMessageSend = () => {
    if (user?.data?.data?.isblocked) {
      return notifyWarning({
        message: "Please unblock user for converstion",
      });
    }
    if (messageText?.length > 0) {
      socketIO?.emit(
        "send-message",
        {
          conversationId,
          type: "text",
          message: messageText,
          sender: currentUser?.data?._id,
          receiver: [...currentConversation.members.map((e: any) => e._id)],
        },
        (data: any) => {}
      );
      setMessageText("");
    }
  };
  const messageEventHandler = (data: any) => {
    addNewMessage(data);
    if (currentUser?.data?._id !== data.sender._id) {
      socketIO.emit("read-message", {
        userId: currentUser?._id,
        messageId: data?.message_id,
        conversationId,
        referenceId: data?.reference_id,
      });
    }
  };
  const arrOfEvents = [
    { name: "message", eventHandler: messageEventHandler },
    { name: "mark-conversation-read", eventHandler: markConRead },
  ];
  useEffect(() => {
    if (socketIO?.connected) {
      setConversation_id(conversationId);
      // arrOfEvents?.forEach((event) =>
      //   socketIO.on(event.name, event.eventHandler)
      // );
      socketIO.on("message", messageEventHandler);
      socketIO.on("mark-conversation-read", markConRead);
      socketIO.emit(
        "read-conversation",
        {
          userId: currentUser?.data?._id,
          conversationId,
        },
        () => {
          console.log("read conversation");
        }
      );
    }
    return () => {
      if (socketIO) {
        // arrOfEvents?.forEach((event) => {
        //   socketIO.off(event.name, event.eventHandler);
        // });
        socketIO.off("message", messageEventHandler);
        socketIO.off("mark-conversation-read", markConRead);
        socketIO.emit(
          "read-conversation",
          {
            userId: currentUser?.data?._id,
            conversationId: conversationId,
          },
          () => {
            console.log("read conversation");
          }
        );
      }
    };
  }, [socketIO, conversationId, currentUser?.data?._id]);

  useEffect(() => {
    if (socketIO?.connected) {
      socketIO?.emit(
        "join-conversation",
        {
          userId: currentUser?.data?._id,
          conversationId,
        },
        () => {
          console.log(`'connected'`, "connected");
        }
      );
    }
    return () => {
      if (socketIO?.connected) {
        socketIO?.emit(
          "leave-conversation",
          {
            userId: currentUser?.data?._id,
            conversationId,
          },
          () => {
            console.log(`'disconnected'`, "disconnected");
          }
        );
      }
    };
  }, [conversationId, socketIO]);

  const popUpProps = {
    menuPopUp: uploadFilePopUp,
    userCardRef: uploadCardRef,
    userRef: uploadRef,
    setMenuPopUp: setUploadFilePopUp,
  };

  ClosePopUp(popUpProps);
  return (
    <div className="">
      <div className="flex ">
        {/* <div className="grid grid-cols-3 2xl:mx-56 "> */}
        <div className="flex  justify-end xxxs:w-0 md:w-[45%] lg:w-[88%] xl:w-[33%] 2xl:w-[32%]">
          <div
            className={`  xxxs:${conversationId ? "hidden" : "block"} md:${
              conversationId ? "block" : ""
            }  w-full md:w-[88%] lg:w-[71%] xl:w-[67%] 2xl:w-[65%] `}
          >
            <ConversationList />
          </div>
        </div>
        <div className="flex xxxs:w-full xxxs:px-2  md:w-[60%] md:justify-start md:px-0 lg:w-[90%] xl:w-[40%] 2xl:w-[38%] ">
          <div
            className={`relative  flex w-full flex-col border  bg-gray-100 xxxs:h-[84vh] md:w-[90%]  lg:h-[89vh] lg:w-full  ${
              conversationId ? "" : ""
            }`}
          >
            <div className="sticky top-0   bg-white px-4  pt-4 pb-2">
              <div
                className={` flex cursor-pointer justify-between gap-2 bg-white`}
              >
                <Link href={`/profile/${handle?._id}`}>
                  <div className="">
                    {handle?.avatar_url ? (
                      <Image
                        className="rounded-full"
                        src={handle?.avatar_url}
                        alt="profile"
                        height={64}
                        width={64}
                        objectFit="cover"
                      />
                    ) : (
                      <div className="h-[68px] w-[68px]">
                        <Avatar name={handle?.user_handle} />
                      </div>
                    )}
                  </div>
                </Link>
                <a className="mt-1 flex-grow">
                  <Link href={`/profile/${handle?._id}`}>
                    <div className="font-medium">{handle?.user_handle}</div>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {user?.data?.data?.status}
                  </p>
                </a>
              </div>
            </div>
            <div className="absolute right-5 top-5">
              <div className="mt-2.5 text-xs">
                <button
                  onClick={() => {
                    setIsChatAction(!isChatAction);
                  }}
                >
                  <ThreeDotsIcon />
                </button>
              </div>
              <Popover
                isVisible={isChatAction}
                onclose={setIsChatAction}
                userRef={popoverRef}
                className={"z-50"}
              >
                {isChatAction && (
                  <div className="z-50 flex flex-1 flex-col px-2 py-1 text-sm">
                    <button
                      onClick={() => {
                        if (tabName !== "Archived") {
                          archiveConversation
                            .mutateAsync({
                              body: {
                                conversationId,
                                archvieUser: handle?._id,
                              },
                            })
                            .then(() => {
                              router.push(
                                `/messages/${conversationId}?tab=Archived`
                              );
                            });
                        } else {
                          //TODO user it for unArchive conversation
                          unArchiveConversation
                            .mutateAsync({
                              pathParams: {
                                conversationId,
                              },
                            })
                            .then(() => {
                              router.push(
                                `/messages/${conversationId}?tab=All`
                              );
                            });
                        }
                      }}
                      className="my-1 rounded-md  py-1   px-2 hover:bg-gray-100"
                    >
                      {tabName !== "Archived" ? "Archive" : "Unarchive"}
                    </button>
                    <button
                      onClick={() => {
                        deleteConversation
                          .mutateAsync({
                            pathParams: {
                              conversationId,
                            },
                          })
                          .then(() => {
                            router.push("/messages?tab=All");
                          });
                        // useDeleteConversation({
                        //   pahtParams: conversationId,
                        // });
                      }}
                      className="my-1 rounded-md px-2 py-1 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Popover>
            </div>

            <div
              id="scrollableDiv"
              style={{
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "auto",
                height: "100%",
                position: "relative",
              }}
              ref={messagesEndRef}
            >
              <InfiniteScroll
                dataLength={messageList?.length}
                next={fetchMessages}
                hasMore={messageList?.length < messagesTotalCount}
                loader={
                  <h4
                    style={{
                      // position: "absolute",
                      // zIndex: 1000,
                      // top: 170,
                      // right: "44%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <p>Loading...</p>
                  </h4>
                }
                inverse={true}
                scrollableTarget="scrollableDiv"
                style={{ display: "flex", flexDirection: "column-reverse" }}
              >
                {messageList?.length
                  ? messageList.map((chat: any, idx: number, array: any) => (
                      <div
                        key={chat?._id}
                        ref={messagesEndRef}
                        className="px-4"
                      >
                        {dayjs(chat?.created_at).format("DD/MM/YYYY") >
                          dayjs(array[idx + 1]?.created_at).format(
                            "DD/MM/YYYY"
                          ) && (
                          <div className="flex justify-center ">
                            <div className={""}>
                              {getFormattedDate(chat?.created_at)}
                            </div>
                          </div>
                        )}
                        <div
                          className={`my-4 mt-1 flex ${
                            chat?.sender?._id === currentUser?.data?._id
                              ? `${style["current_user"]}`
                              : `${style["other_user"]}`
                          } `}
                        >
                          <div style={{ maxWidth: "20rem" }}>
                            {chat?.type === "post" ? (
                              <div>
                                <div className="rounded-lg bg-white px-4 pt-4 pb-1 ">
                                  <div className=" relative flex justify-between ">
                                    <div className="flex cursor-pointer items-center ">
                                      <Link
                                        href={`/profile/${chat?.postData?.userDetail?._id}`}
                                      >
                                        {chat?.postData?.userDetail
                                          ?.avatar_url ? (
                                          <Image
                                            src={
                                              chat?.postData?.userDetail
                                                ?.avatar_url
                                            }
                                            alt="profile"
                                            height={"64px"}
                                            width={"64px"}
                                            style={{ borderRadius: "50%" }}
                                            objectFit="cover"
                                          />
                                        ) : (
                                          <div className="  flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gray-400 text-white">
                                            {getFirstLetter(
                                              chat?.postData?.userDetail
                                                ?.user_handle
                                            )}
                                          </div>
                                        )}
                                      </Link>
                                      <Link
                                        href={`/profile/${chat?.postData?.userDetail?._id}`}
                                      >
                                        <div className="mx-3 flex flex-col pl-2">
                                          <span className="text-lg  font-medium">
                                            {
                                              chat?.postData?.userDetail
                                                ?.user_handle
                                            }
                                          </span>
                                          <span className="text-xs font-[400] text-[#858585]">
                                            {dayjs(
                                              chat?.postData?.created_at
                                            ).fromNow()}
                                          </span>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    {chat?.postData?.tags?.map(
                                      (ite: string, idx: string) => (
                                        <div
                                          key={idx}
                                          className="my-2  w-max rounded-full bg-secondary-100 px-4 py-2  text-sm text-[#858585]"
                                        >
                                          #{ite}
                                        </div>
                                      )
                                    )}
                                  </div>
                                  <div className=" my-3 w-[full]">
                                    <div className="my- relative mt-4 h-[31.25] w-full ">
                                      <Link
                                        href={`/open-post?id=${chat?.postData?._id}`}
                                      >
                                        <Image
                                          src={chat?.postData?.media?.[0]?.url}
                                          alt="image"
                                          height={"400"}
                                          width={"400"}
                                          style={{
                                            borderRadius: "10px",
                                            // objectFit: "cover",
                                            zIndex: 0,
                                          }}
                                          objectFit="cover"
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="">
                                {chat?.type === "image" ? (
                                  <div
                                    className="xxxs:w-44 md:w-[350px]"
                                    onClick={() => {
                                      setIsOpenImage(true);
                                      setImageUrl(chat.message);
                                    }}
                                  >
                                    <Image
                                      className={`z-10 ${style["message_image"]}`}
                                      src={chat.message}
                                      alt="image"
                                      height={300}
                                      width={400}
                                      objectFit="cover"
                                    />
                                  </div>
                                ) : (
                                  <p
                                    className={`mt-1   ${
                                      chat?.sender?._id ===
                                      currentUser?.data?._id
                                        ? "break-words rounded-t-xl rounded-bl-xl bg-primary-500 p-4 text-justify text-white shadow-md"
                                        : "break-words rounded-t-xl rounded-br-xl bg-white p-4 text-justify shadow-md"
                                    } `}
                                  >
                                    {chat.message}
                                  </p>
                                )}
                              </div>
                            )}
                            <p
                              className={` mt-4 flex ${
                                chat?.sender?._id === currentUser?.data?._id
                                  ? "justify-end"
                                  : "justify-start"
                              } text-xs font-medium text-gray-600`}
                            >
                              {dayjs(chat?.created_at).format("hh:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </InfiniteScroll>
            </div>
            {!user?.data?.data?.isUserBlocked && !user?.data?.data?.isDeleted && (
              <div className="sticky bottom-0  flex h-20 w-full	 items-center justify-center bg-gray-100  p-4">
                <div className="flex h-full  flex-1 flex-row divide-x divide-gray-200 overflow-hidden rounded-full bg-white shadow-md">
                  <div className="flex-1 pr-2">
                    <input
                      value={messageText}
                      onChange={(e: any) => {
                        setMessageText(e.target.value);
                      }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          handleMessageSend();
                        }
                      }}
                      type="text"
                      placeholder={"Write a message..."}
                      className=" h-full w-full border-none  py-3 px-2 pl-4  "
                    />
                  </div>
                  {uploadFilePopUp && (
                    <div
                      ref={uploadCardRef}
                      className="absolute bottom-20 right-4  flex gap-4 rounded-lg bg-white p-2  shadow-lg"
                    >
                      <div className=" rounded-md p-2 hover:bg-gray-200">
                        <div className="flex w-24 justify-center ">
                          <div className="rounded-full bg-gray-300 p-2">
                            <FolderIcon />
                          </div>
                        </div>
                        <p>File manager</p>
                      </div>
                      <label htmlFor="upload-media">
                        <div className=" cursor-pointer rounded-md p-2 hover:bg-gray-200">
                          <div className="flex w-24 justify-center ">
                            <div className="rounded-full bg-gray-300 p-2">
                              <GalleryIcon />
                            </div>
                          </div>
                          <p className="select-none text-center">Gallery</p>
                        </div>
                      </label>
                    </div>
                  )}
                  <input
                    type="file"
                    id="upload-media"
                    hidden
                    accept=".png,.jpg,.jpeg,.raw,.tiff"
                    onChange={async (e: any) => {
                      const type = "image";
                      const bodyFormData = new FormData();
                      bodyFormData.append("file", e?.target?.files?.[0]);
                      const res: any = await uploadAttachments({
                        body: bodyFormData,
                        pathParams: { id: conversationId },
                      });
                      socketIO?.emit(
                        "send-message",
                        {
                          conversationId,
                          type,
                          message: res?.data?.url,
                          sender: currentUser?.data?._id,
                          receiver: [],
                        },
                        (data: any) => {
                          // sendMessageAcknowledgement(data);
                        }
                      );
                    }}
                  />
                  <div className="mx-3 mt-3">
                    <button
                      onClick={() => {
                        setIsMyCollection(!isMyCollection);
                      }}
                    >
                      <MyCollectionOutlined />
                    </button>
                  </div>
                  <div
                    ref={uploadRef}
                    onClick={() => {
                      setUploadFilePopUp(!uploadFilePopUp);
                    }}
                    className="my-3 mr-5 cursor-pointer pl-2"
                  >
                    <MediaIcon />
                  </div>
                </div>
                {/* </div> */}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start xxxs:w-0 lg:w-[30%] ">
          <div className=" h-[89vh]   w-[95%] xxxs:hidden xl:block xl:w-[100%] 2xl:w-[70%]">
            <UserData handle={handle} user={user} />
          </div>
        </div>
        <Modal
          isVisiable={isOpenImage}
          onClose={setIsOpenImage}
          className=" top-[20%] z-50 w-[100%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[60%]"
          zIndex={1000}
        >
          <div className="absolute right-2 top-2 z-50 rounded-full bg-white px-2 pt-1.5 pb-0.5">
            <button
              onClick={() => {
                setIsOpenImage(false);
              }}
            >
              <CrossIcon />
            </button>
          </div>
          <div className="relative z-40 h-[25rem] w-full sm:h-[25.2rem] md:h-[40rem] ">
            <Image
              src={imageUrl}
              alt="profile"
              layout="fill"
              // height={"100%"}
              objectFit="contain"
              className="z-50"
            />
          </div>
        </Modal>
        {/* here select image from my collection  modal start */}
        <MyCollectionModal
          isMyCollection={isMyCollection}
          setIsMyCollection={setIsMyCollection}
          currentUser={currentUser}
          socketIO={socketIO}
          conversationId={conversationId}
          setMessageList={setMessageList}
          scrollToBottom={scrollToBottom}
          currentConversation={currentConversation}
        />
        {/* here modal start */}
      </div>
    </div>
  );
};

export default Conversation;
