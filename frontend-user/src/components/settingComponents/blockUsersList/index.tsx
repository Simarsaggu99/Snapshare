import { useGetBlockedUserList } from "@/hooks/users/query";
import { getFirstLetter } from "@/utils/common";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import newImage from "~/images/trees.jpg";
import relativeTime from "dayjs/plugin/relativeTime";
import { useBlockUser, useUnblockUser } from "@/hooks/users/mutation";
import { getBlockedUserList } from "@/services/users";
dayjs.extend(relativeTime);
const BlockUserList = () => {
  const unblockUser = useUnblockUser();
  const blockUser = useBlockUser();
  const [blockUserList, setBlockUserList] = useState<any[]>([]);
  useEffect(() => {
    getBlockedUserList().then((res: any) => {
      setBlockUserList(res?.message);
    });
  }, []);
  return (
    <div className="  text-black ">
      <div className="flex gap-2 py-2  ">
        <svg
          className="rounded-full border fill-[#564C4C] p-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          height={35}
          width={35}
        >
          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z" />
        </svg>
        <p className="flex items-center pl-3 text-lg font-semibold text-gray-700">
          Blocked Users
        </p>
      </div>
      <div className="w-30%  my-6 border-b"></div>
      {blockUserList?.length > 0 ? (
        blockUserList?.map((fil: any) => (
          <div
            key={fil?._id}
            className="  rounded-md border px-4 py-4 "
            style={{
              display: "flex",
              justifyContent: "space-between",
              
              flexWrap: "wrap",
              gap: "5px",
            }}
          >
            <div className="flex ">
              {fil?.blockedUser?.avatar_url ? (
                <Image
                  width={78}
                  height={78}
                  className=" rounded-full object-cover "
                  src={fil?.blockedUser?.avatar_url}
                  alt="profile"
                  objectFit="cover"
                />
              ) : (
                <div className="flex h-[64px] w-[64px] items-center  justify-center rounded-full bg-gray-400 text-white">
                  {getFirstLetter(fil?.blockedUser?.user_handle)}
                </div>
              )}
              <div className="ml-4 mt-4">
                <div className="w-[110px] overflow-hidden text-ellipsis text-xl font-medium sm:w-full">
                  {fil?.blockedUser?.user_handle}
                </div>
                <div className="text-sm text-[#564C4C]">
                  {fil.blockedUser?.user_handle}
                </div>
              </div>
            </div>
            <div className="w-full text-xs  xl:w-auto">
              <div className="flex justify-end">
                {dayjs(fil?.created_at).fromNow()}
              </div>

              <div
                onClick={() => {
                  unblockUser
                    .mutateAsync({
                      pathParams: { userId: fil?.blockedUser?._id },
                    })
                    .then((res: any) => {
                      if (res?.message === "success") {
                        setBlockUserList(
                          blockUserList?.filter((val) => {
                            return (
                              val?.blockedUser?._id !== fil?.blockedUser?._id
                            );
                          })
                        );
                      }
                    });
                }}
                className="mt-2 flex w-full cursor-pointer justify-center gap-2 rounded-lg bg-[#FF5E34] px-1 py-2 md:px-[1rem]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  height={20}
                  width={20}
                  className="fill-white"
                >
                  <path d="M256 112c-48.6 0-88 39.4-88 88C168 248.6 207.4 288 256 288s88-39.4 88-88C344 151.4 304.6 112 256 112zM256 240c-22.06 0-40-17.95-40-40C216 177.9 233.9 160 256 160s40 17.94 40 40C296 222.1 278.1 240 256 240zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zM416.2 388.5C389.2 346.3 343.2 320 291.8 320H220.2c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208C464 306.3 446 352.5 416.2 388.5z" />
                </svg>
                <div className="mt-1  text-[16px] text-white">Unblock</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-6 text-center  text-xl text-gray-600">
          {" "}
          You have not blocked anyone yet
        </div>
      )}
    </div>
  );
};
export default BlockUserList;
