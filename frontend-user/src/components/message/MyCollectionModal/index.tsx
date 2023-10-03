import { BackIcon } from "@/components/Icons";
import Modal from "@/components/Modal";
import {
  useGetCollectionFolders,
  useGetCollectionPosts,
} from "@/hooks/mycollection/query";
import { getCollectionPosts } from "@/services/mycollection";
import { Cross2, CrossIcon, FolderIcon } from "@/utils/AppIcons";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
type mycollection = {
  isMyCollection: boolean;
  setIsMyCollection: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: any;
  socketIO: any;
  conversationId: any;
  setMessageList: React.Dispatch<React.SetStateAction<any[]>>;
  scrollToBottom?: any;
  currentConversation: any;
};
const MyCollectionModal: FC<mycollection> = ({
  isMyCollection,
  setIsMyCollection,
  currentUser,
  socketIO,
  conversationId,
  setMessageList,
  scrollToBottom,
  currentConversation,
}) => {
  const getCollectionFolders: any = useGetCollectionFolders({});
  const [isMyCollectionPost, setIsMyCollectionPost] = useState();
  const [mycollectionList, setMycollectionList] = useState([]);
  
  useEffect(() => {
    if (isMyCollectionPost) {
      getCollectionPosts({
        pathParams: { folderId: isMyCollectionPost },
      }).then((res: any) => {
        setMycollectionList(res?.data?.Posts);
      });
    }
  }, [isMyCollectionPost]);
  const addNewMessage = (message: any, item: any) => {
    const postData = {
      description: item?.description,
      userDetail: item?.user,
      media: [item?.media],
      tags: item?.tags,
      id: item?._id,
    };
    setMessageList((prev: any[]) => {
      return [
        {
          type: "post",
          sender: message?.sender,
          message: message?.message,
          postData: postData,
          _id: message?._id,
          reference_id: message?.reference_id,
          read_by: message?.read_by,
        },
        ...prev,
      ];
    });
    
  };

  return (
    <div>
      <Modal isVisiable={isMyCollection} onClose={setIsMyCollection}>
        <div>
          <div className="h-full w-full overflow-auto">
            <div
              className="mt-4 mr-3 flex justify-end"
              onClick={() => setIsMyCollection(false)}
            >
              <CrossIcon />
            </div>
            <div
              style={{ boxShadow: " 0px 0px 10px rgba(104, 104, 104, 0.1)" }}
              className="rounded-lg bg-white py-7 px-3  text-center text-[30px]"
            >
              My Collections
            </div>
            <div
              className="my-4 h-[700px] max-h-full overflow-auto rounded-lg bg-white  p-3 py-4 pb-10  "
              style={{ boxShadow: "0px 0px 10px rgba(104, 104, 104, 0.1)" }}
            >
              <div className="mt-5 grid grid-cols-2 gap-5 ">
                {getCollectionFolders?.data?.data?.map((item: any) => (
                  
                  <button
                    key={item?._id}
                    onClick={() => {
                      setIsMyCollectionPost(item?._id);
                    }}
                    className="flex justify-center rounded-md border p-5"
                  >
                    <div>
                      <div className="flex justify-center ">
                        <div
                          

                          
                          className="w-max rounded-full bg-gray-300 p-4"
                        >
                          <FolderIcon />
                        </div>
                      </div>
                      <div className="mt-2">{item?.folder_name}</div>
                    </div>
                  </button>
                  
                ))}
              </div>
              <div className="grid  grid-cols-2 gap-10 p-5  ">
                {mycollectionList?.length > 0 ? (
                  mycollectionList?.map((item: any) => (
                    <div
                      key={item?._id}
                      onClick={() => {
                        socketIO?.emit(
                          "send-message",
                          {
                            conversationId,
                            type: "post",
                            postMessage: item?._id,
                            message: item?._id,
                            sender: currentUser?.data?._id,
                            receiver: [
                              ...currentConversation.members.map(
                                (e: any) => e._id
                              ),
                            ],
                          },
                          (data: any) => {
                            
                            addNewMessage(data, item);
                            setIsMyCollection(false);
                          }
                        );
                      }}
                    >
                      <Image
                        src={item?.media?.url}
                        alt="media collection"
                        className="rounded-[10px] "
                        width={284}
                        height={203}
                        objectFit="cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="py-5 text-center text-xl text-primary-600">
                    {" "}
                    You haven&apos;t added any posts yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyCollectionModal;
