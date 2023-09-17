import React, { useState } from "react";
import Image from "next/image";
import { useGetReportedPost } from "@/hooks/post/query";
import { useRouter } from "next/router";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import LocalizedFormat from "dayjs/plugin/LocalizedFormat";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { loggedInUser } from "@/store";
import {
  useGetSingleUserSpankee,
  useGetSingleUserWarning,
} from "@/hooks/user/query";
const ReportPosts = () => {
  const router = useRouter();
  const reported = router.query.id;
  const [tabs, setTabs] = useState("UserReported");
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [showWarning, setShowWarning] = useState("");
  const [showSpankee, setShowSpankee] = useState(false);

  const reportedPost: any = useGetReportedPost({
    query: { status: "UserReported" },
  });

  console.log("router :>> ", router);

  const singleUserWarning: any = useGetSingleUserWarning({
    query: { userId: currentUser?.data?._id },
  });

  const singleUserSpankee: any = useGetSingleUserSpankee({
    query: { userId: currentUser?.data?._id },
  });

  // console.log(
  //   "singleUserWarning :>> ",
  //   singleUserWarning?.data?.data?.getWarningsList
  // );
  console.log(
    "singleUserSpankee :>> ",
    singleUserSpankee?.data?.data?.getSpankeeList
  );

  dayjs.extend(relativeTime);
  // dayjs.extend(LocalizedFormat);

  console.log("currentUser", currentUser);
  const obj = {
    countOfSpankees: `(${currentUser?.data?.spankeeCount}/3)`,
    note: "Your account will be permanently banned after 3 Spankees",
  };
  return (
    <div className=" my-2 px-2 text-black">
      <div className="flex gap-2  ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          className="bi bi-file-earmark-text-fill mt-0.5 fill-[#564C4C]"
          viewBox="0 0 16 16"
        >
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z" />
        </svg>
        <p className="flex items-center  pl-3 text-lg font-semibold text-gray-700">
          Reports and Warnings
        </p>
      </div>
      <div className="w-30%  my-4 border-b"></div>
      <div className="">
        <div
          className="rounded-lg py-1 hover:bg-gray-100 "
          onClick={() => {
            setShowSpankee(!showSpankee);
          }}
        >
          <div className="ml-2 flex cursor-pointer justify-between text-lg font-semibold ">
            <div className="">Spankees</div>
            <div className="flex ">
              <div className="rounded-md border bg-[#FFCFC2] px-4 text-[#FF5E34]">
                {obj.countOfSpankees}
              </div>

              <div className="ml-1 flex items-center">
                {" "}
                {showSpankee ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </div>
            </div>
          </div>
          <div className=" ml-2 flex justify-start text-sm text-[#564C4C]">
            NOTE: {obj.note}
          </div>
        </div>
        {/* have to show spankees here */}
        {showSpankee ? (
          singleUserSpankee?.data?.data?.getSpankeeList?.[0] ? (
            <div className="mx-2 mt-4">
              {singleUserSpankee?.data?.data?.getSpankeeList?.map(
                (val: any, idx: any) => (
                  <div key={val?._id} className="my-2  flex justify-between">
                    {/* <div className="">{idx + 1}</div> */}
                    <div className="text md:text-lg">
                      <span className="mr-1 rounded-md border bg-[#FFCFC2] px-2 text-[#FF5E34]">
                        {idx + 1}
                      </span>
                      <span>{val?.notificationText}</span>
                    </div>
                    <div className="date md:text- text-xs">
                      {dayjs(val?.created_at).format("DD/MM/YYYY")}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="m-4 flex justify-center">No spankees yet!</div>
          )
        ) : null}
        <div
          className="ml-2 mt-4 flex cursor-pointer justify-between rounded-lg py-1 text-lg font-semibold hover:bg-gray-100"
          onClick={() => {
            showWarning === "" ? setShowWarning("less") : setShowWarning("");
          }}
        >
          <div className="">Warnings</div>
          <div className="flex">
            <div className="rounded-md border bg-[#FFCFC2] px-4 text-[#FF5E34]">
              {currentUser?.data?.warningCount}
            </div>
            <span className="ml-1 flex items-center">
              {showWarning === "" ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </span>
          </div>
        </div>
        {showWarning ? (
          singleUserWarning?.data?.data?.getWarningsList?.[0] ? (
            <div className="mx-2 mt-4">
              {showWarning === "less"
                ? singleUserWarning?.data?.data?.getWarningsList
                    ?.filter((e: any, index: any) => index < 3)
                    ?.map((value: any, idx: any) => (
                      <div
                        key={value?._id}
                        className="my-2  flex justify-between"
                      >
                        {/* <div className="">{idx + 1}</div> */}
                        <div className="text md:text-lg">
                          <span className="mr-1 rounded-md border bg-[#FFCFC2] px-2 text-[#FF5E34]">
                            {idx + 1}
                          </span>
                          <span>{value?.notificationText}</span>
                        </div>
                        <div className="date md:text- text-xs">
                          {dayjs(value?.created_at).format("DD/MM/YYYY")}
                        </div>
                      </div>
                    ))
                : singleUserWarning?.data?.data?.getWarningsList?.map(
                    (val: any, idx: any) => (
                      <div
                        key={val?._id}
                        className="my-2  flex justify-between"
                      >
                        {/* <div className="">{idx + 1}</div> */}
                        <div className="text md:text-lg">
                          <span className="mr-1 rounded-md border bg-[#FFCFC2] px-2 text-[#FF5E34]">
                            {idx + 1}
                          </span>
                          <span>{val?.notificationText}</span>
                        </div>
                        <div className="date md:text- text-xs">
                          {dayjs(val?.created_at).format("DD/MM/YYYY")}
                        </div>
                      </div>
                    )
                  )}
              {showWarning === "less" && (
                <div
                  className="flex cursor-pointer justify-end text-primary-600"
                  onClick={() => setShowWarning("more")}
                >
                  See more
                </div>
              )}
              {showWarning === "more" && (
                <div
                  className="flex cursor-pointer justify-end text-primary-600"
                  onClick={() => setShowWarning("less")}
                >
                  See less
                </div>
              )}
            </div>
          ) : (
            <div className="m-4 flex justify-center">No warnings yet!</div>
          )
        ) : null}
        <div className=" mt-5 flex gap-16 text-sm font-[400]">
          <button
            onClick={() => {
              setTabs("UserReported");
            }}
            className={`my-3 px-2.5 ${
              tabs === "UserReported"
                ? "border-b-2 border-primary-600  text-primary-600"
                : "pb-0.5"
            }`}
          >
            Reports and Warnings
          </button>
          {/* <button
            onClick={() => {
              setTabs("Followers");
            }}
            className={`my-3 px-2.5 ${
              tabs === "Followers"
                ? "border-b-2 border-primary-600  text-primary-600"
                : "pb-0.5"
            }`}
          >
            My reported post
          </button> */}
        </div>
        <div className=" my-4 mt-6 rounded-md border px-4 pt-4">
          {" "}
          {reportedPost?.data?.data?.RePosts?.length > 0 ? (
            reportedPost?.data?.data?.RePosts?.map((item: any) => (
              <div key={item?._id} className="px-2 text-sm">
                <div className="flex  justify-between">
                  <div className=" mr-4 w-full">
                    <div className="flex  w-full justify-between   border-gray-800 font-semibold ">
                      <div className="">Reason</div>
                    </div>
                    <div className="flex  w-[95%] pt-2 text-left text-[#564C4C]">
                      <div>
                        {item?.description}
                        {item?.reason}
                      </div>
                      {item?.media?.type}
                    </div>
                  </div>
                  <div className="">
                    <p className="w-full text-[10px] ">
                      {dayjs(item?.created_at).format("DD,MMMM YYYY  HH:MM")}
                    </p>
                    <Image
                      className="rounded-lg"
                      src={item?.postDetail?.media?.[0]?.url}
                      alt="img"
                      width={124}
                      height={88}
                      objectFit="cover"
                      unoptimized={true}
                    />
                  </div>
                </div>
                <div className="my-8 border-b"></div>
              </div>
            ))
          ) : (
            <div className="py-5 pb-7 text-center text-lg text-gray-700">
              No reported post found yet!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReportPosts;
