import AddPost from "@/components/addPost";
import { BackIcon } from "@/components/Icons";
import Modal from "@/components/Modal";
import SharePostModel from "@/components/singlePostCard/sharePostModel";
import Avatar from "@/components/UIComponents/Avatar";
import { notifyError } from "@/components/UIComponents/Notification";
import { usePerformBounty } from "@/hooks/bounty/mutation";
import {
  useBounyHistory,
  useContestWinnerList,
  useGetBounty,
} from "@/hooks/bounty/query";
import { checkBountyPerform } from "@/services/bounty";
import { currentUserDataState, loggedInUser } from "@/store";
import { CrossIcon } from "@/utils/AppIcons";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
// import advertisement from "~/images/advertisement.png";

const Bounty = () => {
  const screenWidth = typeof window !== "undefined" ? window.screen.width : 768;
  const [isSurveyModal, setIsSurveyModal] = useState(false);
  const [singleBounty, setSingleBounty] = useState<any>({});
  const [answerMCQ, setAnswerMCQ] = useState("");
  const [isBountyPerform, setIsBountyPerform] = useState(false);
  const { data: getData }: any = useGetBounty();
  const [totalCoins, setTotalCoins] = useState(0);
  const [isAddPost, setIsAddPost] = useState<boolean>(false);
  const [isModel, setIsModel] = useState(false);
  const { data: contestWinnerList }: any = useContestWinnerList();
  const [currentUser] = useAtom(loggedInUser);
  const [isShareModal, setIsShareModal] = useState(false);

  const router = useRouter();

  const bountyData = getData?.data?.filter((fil: any) => {
    return fil?.status === "not_completed";
  });
  const { data: bountyHistory, refetch }: any = useBounyHistory();
  const performBounty = usePerformBounty();
  const onHandleSubmit = () => {
    performBounty
      .mutateAsync({
        body: { bountyProgramId: singleBounty?._id, userAnswer: answerMCQ },
      })
      .then((res: any) => {
        setIsSurveyModal(false);
        setAnswerMCQ("");
        refetch();
      });
  };
  const notifySuccess = (message: any) => {
    toast(<p style={{ fontSize: 16 }}>{message?.message}</p>, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      type: "success",
    });
  };
  const checkUserBounty = (bountyId: string, type: string) => [
    checkBountyPerform({ pathParams: { id: bountyId } })
      .then((res: any) => {
        setIsBountyPerform(res?.isCompleted === false ? false : true);
        type === "Meme_contest" ? setIsModel(true) : setIsSurveyModal(true);
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          notifyError({ message: err?.response?.data?.error?.message });
        }
      }),
  ];
  useEffect(() => {
    let totalMemeCoins = 0;
    const totalMeme = bountyHistory?.data?.map((item: any) => {
      totalMemeCoins = item?.bounty?.meme_coins + totalMemeCoins;
    });
    setTotalCoins(totalMemeCoins);
  }, [bountyHistory]);
  let isMemeContest = true;
  const addPostProps = {
    isAddPost,
    setIsAddPost,
    isMemeContest,
    bounty: singleBounty?._id,
  };
  const shareModalProps = {
    isShareModal,
    setIsShareModal,
    inviteUser: true,
    singlePostDetails: currentUser?.data,
  };
  return (
    <div className="">
      <div className="sm:hidden" onClick={() => router.push("/")}>
        <BackIcon />
      </div>
      <div className=" block xxxs:mb-8 xxxs:mt-2 md:mt-10 lg:mb-0 lg:flex lg:w-full  ">
        {/* <div className=" flex w-[100%]  justify-start  lg:w-[80%] lg:justify-end ">
        <div className=" mt-5 w-full rounded bg-[#FFFFFF] shadow-md xs:p-2 sm:p-5 md:w-[93%] lg:w-[77%] "> */}
        <div className="mx-0 block xxs:mx-2 md:mx-12 lg:mx-0 lg:mt-11 lg:flex lg:w-[66%] lg:justify-end xl:w-[70%]">
          <div className="  w-full rounded bg-[#FFFFFF]  shadow-md lg:w-[83%] xl:w-[83%]">
            <div className="mb-2 mt-2 flex items-center justify-between px-5 py-5 font-semibold text-[#564C4C] sm:mt-0 ">
              <div className="text-xs sm:text-base">
                Invite a Friend & earm 3 MC
              </div>
              <button
                className=" h-[46px] w-[180px] rounded-md bg-[#FF5E34] p-2"
                onClick={() => {
                  setIsShareModal(true);
                }}
              >
                <span className="text-xs text-white sm:text-base">
                  + Invite a Friend
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between px-5 font-semibold text-[#564C4C]">
              <div className="text-xs sm:text-base">
                Download App & earn 5 MC
              </div>
              <button className="h-[46px] w-[180px] rounded-md border border-[#FF5E34] p-2">
                <span className=" relative bottom-2 text-xs text-[#FF5E34] sm:text-base">
                  Download App <br />
                  <span className="relative  bottom-1 text-[12px]">
                    {" "}
                    (Coming Soon)
                  </span>
                </span>
              </button>
            </div>
            <div className="mt-4 mr-5 overflow-x-auto">
              <div
                style={{
                  minWidth: "350px",
                  overflowX: "scroll",
                }}
              >
                {bountyData?.map((item: any) => (
                  <div
                    key={item?._id}
                    className="my-2 flex w-full justify-between space-y-2 rounded-md  border p-2 pb-3 shadow "
                  >
                    <div className=" my-auto w-1/3">
                      <p className="text-sm text-gray-600">Bounty</p>
                      <p className="text-base">{item?.description}</p>
                    </div>
                    <div>
                      <p className="w-1/3 text-sm text-gray-600">Reward</p>
                      <p className="text-center">{item?.meme_coins} MC</p>
                    </div>
                    <button
                      disabled={item?.isComplete}
                      onClick={() => {
                        setSingleBounty(item);
                        // item?.type === "Meme_contest"
                        //   ? setIsModel(true)
                        //   :
                        checkUserBounty(item?._id, item?.type);
                      }}
                      className="my-2 h-[46px] w-[100px] rounded-md border border-[#FF5E34] p-2 text-[#FF5E34] disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-500 sm:w-[180px]"
                    >
                      <span className="text-xs  ">Take {item?.type}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex w-full items-center justify-between rounded-md bg-[#EBEBEB] py-3 px-2 sm:px-7 ">
              <div className="mr-5 w-1/3">
                <div className="text-xs sm:text-base">Bounty</div>
              </div>
              <div className=" w-1/3">
                <div className="text-xs sm:text-base">Date and Time </div>
              </div>
              <div className=" w-1/3">
                <div className="text-center text-xs sm:text-base">
                  Rewards Earned
                </div>
              </div>
            </div>
            {bountyHistory?.data?.map((item: any) => (
              <div
                className="flex w-full items-center justify-between px-2 py-2 sm:px-7 "
                key={item?._id}
              >
                <div
                  className={`${
                    item?.bounty?.type === "Meme_contest" ? "mr-3" : "mr-5"
                  }  w-1/3`}
                >
                  <div>{item?.bounty?.type}</div>
                </div>
                <div className="w-1/3">
                  <div>
                    {dayjs(item?.bounty?.created_at).format("DD MM YYYY hh:mm")}
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="text-center">{item?.bounty?.meme_coins}</div>
                </div>
              </div>
            ))}

            <div className="mt-8  flex items-center justify-between rounded-md bg-[#EBEBEB] p-3">
              <div>Total Bounty</div>

              <div>{totalCoins} MC</div>
            </div>
          </div>
        </div>
        <div className="  mt-10  hidden lg:block lg:w-[30%] xl:m-10 ">
          {/* <Advertisement /> */}
          <div className={`right-50 ${"fixed mx-8 w-[29%] 2xl:w-[20%]"} `}>
            <div
              className="roudned-lg overflow-hidden bg-white px-4 py-3 shadow-md"
              style={{ borderRadius: "10px" }}
            ></div>
          </div>
        </div>
        <Modal
          isVisiable={isSurveyModal}
          onClose={setIsSurveyModal}
          className="w-[90%] sm:w-[70%] lg:w-[55%] xl:w-[60%]"
        >
          <div className="p-5">
            {isBountyPerform ? (
              <div className="">
                <div className="flex justify-between  border-b-2 pb-5">
                  <div>
                    <p className="text-lg">{singleBounty?.type}</p>
                  </div>
                </div>
                <p className="py-10 text-center">
                  Your have already complete this bounty{" "}
                </p>
                <div className="mt-5 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setIsSurveyModal(false);
                    }}
                    className="rounded-lg border px-8 py-2 text-black "
                  >
                    close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between  border-b-2 pb-5">
                  <div>
                    <p className="text-lg">{singleBounty?.type}</p>
                  </div>
                  <div className="">
                    <p>Coin to reward</p>
                    <p className="mt-2 text-end">
                      {singleBounty?.meme_coins} MC
                    </p>
                  </div>
                </div>
                <p className="mt-7 font-semibold">{singleBounty?.question}</p>
                {singleBounty?.answerType === "MCQ" ? (
                  <div className="my-3 space-y-3">
                    {singleBounty?.options?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setAnswerMCQ(item?.option);
                        }}
                        className={`cursor-pointer rounded-md border ${
                          answerMCQ === item?.option ? "border-primary-600" : ""
                        } p-4 `}
                      >
                        <label className="container ">
                          <span
                            className={`label cursor-pointer ${
                              answerMCQ === item?.option
                                ? "text-primary-600 "
                                : ""
                            }`}
                          >
                            {item?.option}: <span>{item?.value}</span>
                          </span>
                          <input
                            checked={answerMCQ === item?.option}
                            onChange={(e) => {
                              e.stopPropagation();
                              setAnswerMCQ(item?.option);
                            }}
                            type="radio"
                            name="isPopular"
                            value="Latest"
                          />
                          <span className="radio"></span>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={answerMCQ}
                      onChange={(e) => {
                        setAnswerMCQ(e.target.value);
                      }}
                      className="mt-2 w-full rounded border border-gray-400"
                      rows={4}
                    />
                  </div>
                )}
                <div className="mt-5 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setIsSurveyModal(false);
                    }}
                    className="rounded-lg border px-8 py-2 text-black "
                  >
                    close
                  </button>
                  <button
                    onClick={() => {
                      onHandleSubmit();
                    }}
                    className="rounded-lg bg-primary-600 px-8 py-2 text-white "
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
        <Modal
          isVisiable={isModel}
          onClose={setIsModel}
          className="top-[22%] w-[95%] overflow-y-auto overflow-x-hidden rounded  p-3 pb-10 sm:w-[97%] md:w-[97%] lg:w-[70%] xl:w-[70%]"
          Memecontest={true}
          // zIndex={1000}
        >
          <div className="flex justify-between px-2 py-4">
            <div className="text-xl  font-semibold text-gray-500">
              <p>Meme_contest</p>
            </div>
            <button
              className=" cursor-pointer "
              onClick={() => {
                setIsModel(false);
              }}
            >
              <CrossIcon />
            </button>
          </div>
          <div className="border"></div>
          <div className="mt-4">
            <div className="">
              {isBountyPerform ? (
                <div className="text-center font-medium ">
                  You already participate
                </div>
              ) : (
                <div className=" flex justify-end gap-3">
                  <button
                    className=" cursor-pointer rounded-lg bg-primary-600 px-8 py-2 text-white"
                    onClick={() => {
                      setIsAddPost(true);
                    }}
                  >
                    Participate
                  </button>
                </div>
              )}
            </div>
            <div className="mt-20 flex gap-2 overflow-x-auto">
              {contestWinnerList?.data?.map((winner: any) => (
                <div
                  key={winner?._id}
                  className="w-[300px] rounded-md bg-gray-100 p-5"
                >
                  <Link href={`/open-post?id=${winner?.postDetails?._id}`}>
                    <div className="relative h-52 w-full cursor-pointer p-10 ">
                      <Image
                        src={winner?.postDetails?.media?.url}
                        layout="fill"
                        alt={"post image "}
                      />
                    </div>
                  </Link>
                  <div className=" mt-5 flex cursor-pointer items-center gap-2">
                    <Link href={`/profile/${winner?.userDetails?._id}`}>
                      {winner?.userDetails?.avatar_url ? (
                        <div className=" relative h-[40px] w-[40px] rounded-full border bg-gray-400 px-6  py-3">
                          <Image
                            src={winner?.userDetails?.avatar_url}
                            alt={"profile"}
                            layout="fill"
                          />
                        </div>
                      ) : (
                        <div className=" h-[40px] w-[40px]">
                          <Avatar name={winner?.userDetails?.user_handle} />
                        </div>
                      )}
                    </Link>
                    <Link href={`/profile/${winner?.userDetails?._id}`}>
                      <div className="  text-justify">
                        <p>{winner?.userDetails?.user_handle}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        <ToastContainer />
        <SharePostModel sharePostProps={shareModalProps} />
        <AddPost postProps={addPostProps} />
      </div>
    </div>
  );
};

export default Bounty;
