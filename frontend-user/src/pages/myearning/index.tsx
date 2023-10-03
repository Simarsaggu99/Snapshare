// import Advertisement from "@/components/advertisement";
import ClosePopUp from "@/components/closePopUp";
import { StatisticsGraph } from "@/components/myEarning/StatisticsGraph";
import {
  useGetEarningStatics,
  useGetEarningSummary,
} from "@/hooks/earning/query";
import { useGetUserTransaction, useGetWallet } from "@/hooks/wallet/query";
import { loggedInUser } from "@/store";
import { useAtom } from "jotai";
import Image from "next/image";
// import advertisement from "~/images/advertisement.png";
import React, { useEffect, useRef, useState } from "react";
import Chart from "react-google-charts";
import Button from "@/components/buttons/Button";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
import { useRedeemRequest } from "@/hooks/wallet/mutation";
import { Toaster } from "react-hot-toast";
import { toast } from "react-toastify";
import { useGetPaymentDetails } from "@/hooks/users/query";
import dayjs from "dayjs";
import { CrossIcon, LockIcon, UnlockIcon } from "@/utils/AppIcons";
import DotsLoading from "@/components/DotsLoading";
import { BackIcon } from "@/components/Icons";
interface conversationPopupProps {
  staticPopUp: boolean;
  earningCardRef: React.MutableRefObject<any>;
  earningRef: React.MutableRefObject<any>;
  setStaticPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}
interface paymentDetials {
  paymentMethod: string;
  paymentId: string;
  memeCoins: number;
  fullName: string;
}
const userData = {
  paymentMethod: "",
  paymentId: "",
  memeCoins: 0,
  fullName: "",
};
const Myearning = () => {
  const [staticPopUp, setStaticPopUp] = useState(false);
  const [currentUser] = useAtom(loggedInUser);
  const [paymentDetials, setPaymentDetials] =
    useState<paymentDetials>(userData);
  const [isModel, setIsModel] = useState(false);
  const [statisticsTabs, setStatisticsTabs] = useState("weekly");
  const [summaryTabs, setSummaryTabs] = useState("weekly");
  const staticRef = useRef(null);
  const staticRefCardRef = useRef(null);
  const [earningPopUp, setEarningPopUp] = useState(false);
  const earningRef = useRef(null);
  const earningCardRef = useRef(null);
  const getWallet: any = useGetWallet();
  const redeemRequest = useRedeemRequest();
  const getEarningStatics: any = useGetEarningStatics({
    query: {
      stats: statisticsTabs,
    },
  });
  const { data: getPayment, isLoading: paymentLoading }: any =
    useGetPaymentDetails({});

  const { data: getEarningSummary, isLoading: isloading }: any =
    useGetEarningSummary({
      query: {
        stats: summaryTabs,
      },
    });
  const { data: getUserTransaction, transactionLoading }: any =
    useGetUserTransaction({
      query: { userId: currentUser?.data?._id, viewSize: 3 },
    });

  const sumOfLikes = getEarningStatics?.data?.data.reduce(
    (total: any, item: any) => total + item.likes,
    0
  );
  const sumOfView = getEarningStatics?.data?.data.reduce(
    (total: any, item: any) => total + item.views,
    0
  );
  const sumOfFollowers = getEarningStatics?.data?.data.reduce(
    (total: any, item: any) => total + item.follows,
    0
  );
  const sumOfShares = getEarningStatics?.data?.data.reduce(
    (total: any, item: any) => total + item.share,
    0
  );
  const sumOfInvite = getEarningStatics?.data?.data.reduce(
    (total: any, item: any) => total + item.totalInvite,
    0
  );
  let totalEarnings =
    Number(getEarningSummary?.UserLike || 0) +
    Number(getEarningSummary?.UserViews || 0) +
    Number(getEarningSummary?.totalCruxEarnings || 0) +
    Number(getEarningSummary?.UserBounty?.coins || 0) +
    Number(getEarningSummary?.totalInvitesEarning || 0);
  // Number(getEarningSummary?.totalInvite || 0);

  const popUpProps = {
    menuPopUp: staticPopUp ? staticPopUp : earningPopUp,
    setMenuPopUp: staticPopUp ? setStaticPopUp : setEarningPopUp,
    userRef: staticPopUp ? staticRef : earningRef,
    userCardRef: staticPopUp ? staticRefCardRef : earningCardRef,
  };

  ClosePopUp(popUpProps);

  const router = useRouter();
  const tableData = [
    {
      id: 1,
      activites: "Total Likes  ",
      numberOf: getEarningSummary?.UserLikeCount || 0,
      earning: getEarningSummary?.UserLike || 0,
    },
    {
      id: 2,
      activites: "Total Views ",
      numberOf: getEarningSummary?.UserViewsCount || 0,
      earning: getEarningSummary?.UserViews || 0,
    },
    {
      id: 3,
      activites: "Crux achieved ",
      numberOf: getEarningSummary?.cruxLevelAchieved || 0,
      earning: getEarningSummary?.totalCruxEarnings || 0,
    },
    {
      id: 4,
      activites: "Bounties earned",
      numberOf: getEarningSummary?.UserBounty?.count || 0,
      earning: getEarningSummary?.UserBounty?.coins || 0,
    },
    {
      id: 5,
      activites: "Successful invites",
      numberOf: getEarningSummary?.totalInvite || 0,
      earning: getEarningSummary?.totalInvitesEarning || 0,
    },
  ];

  const filterOptions = (stats: any) => {
    switch (stats) {
      case "":
        return "Today";
      case "weekly":
        return "Last Week";
      case "monthly":
        return "Last Month";
      case "yearly":
        return "Last Year";
    }
  };

  const data = [
    ["Task", "Hours per Day"],
    ["Total likes posts earning", getEarningSummary?.UserLike],
    ["Total views posts earning", getEarningSummary?.UserViews],
    ["Total bounties earning", getEarningSummary?.UserBounty?.coins],
    ["Total sucessful invites", getEarningSummary?.totalInvitesEarning],
    ["Total total crux earnings ", getEarningSummary?.totalCruxEarnings],
  ];
  const options = {
    title: `My ${filterOptions(summaryTabs)} Activities`,
    titlePosition: "none",
    legend: "none",
  };
  const route = useRouter();
  const paymentAction = (e: any) => {
    const { name, value } = e.target;
    setPaymentDetials({
      ...paymentDetials,
      [name]: value,
    });
  };
  const enoughBalanceMessage = () => {
    toast.error("Insufficient balance");
  };
  const errorMessage = (message: string) => {
    toast.error(message);
  };
  const successToast = () => {
    toast.success("Redeem request created successfully");
  };
  const paymentRequest = () => {
    if (paymentDetials?.memeCoins >= 1000) {
      redeemRequest
        .mutateAsync({
          body: paymentDetials,
        })
        .then((res: any) => {
          if (res?.success) {
            successToast();
            setIsModel(false);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 409) {
            enoughBalanceMessage();
          } else if (err?.response?.status === 400) {
            errorMessage(err?.response?.data?.message);
          } else {
            errorMessage("Something went wrong. Please try again .");
          }
        });
    }
  };
  useEffect(() => {
    setPaymentDetials({
      fullName: getPayment?.details?.fullName,
      paymentId: getPayment?.details?.paymentId,
      paymentMethod: getPayment?.details?.paymentMethod,
      memeCoins: 0,
    });
  }, [getPayment?.details]);

  return (
    <div className="">
      <div className="sm:hidden" onClick={() => router.push("/")}>
        <BackIcon />
      </div>
      <div className="  block lg:flex lg:w-full">
        {/* <div className=" mx-0 mt-5 flex w-full justify-start xxxs:mx-2 xxs:mx-0  lg:w-[66%] lg:justify-end 2xl:w-[67%] "> */}
        {/* <div className="w-full rounded-md  bg-[#FFFFFF] p-5 shadow-md lg:w-[82%] 2xl:w-[80%]"> */}

        <div className="mx-2 mt-5 block xs:mr-7 xs:ml-7 md:ml-12 md:mr-12 lg:mx-0 lg:flex lg:w-[66%] lg:justify-end">
          <div className="w-full rounded-md  bg-[#FFFFFF] p-2 shadow-md sm:p-5 lg:w-[83%]">
            <div className="mb-2 flex items-center justify-between px-1 py-3 font-semibold text-[#564C4C]">
              <div>
                Total Balance :{" "}
                <span>{getWallet.data?.walletData?.meme_coins} Meme Coins</span>
              </div>
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-[#FF5E34] bg-[#FF5E34] px-4 py-2 text-sm font-medium text-white shadow-sm  "
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => {
                      if (currentUser?.data?.cruxLevel >= 10) {
                        setIsModel(!isModel);
                      } else {
                        errorMessage(
                          "Redeem request will open after crux level 10"
                        );
                      }
                    }}
                  >
                    {currentUser?.data?.cruxLevel >= 10 ? (
                      <UnlockIcon height={20} width={20} color={`#eee`} />
                    ) : (
                      <LockIcon height={20} width={20} color={`#eee`} />
                    )}
                    <span className="px-2">
                      {" "}
                      Redeem{" "}
                      {dayjs().diff(
                        currentUser?.data?.lastTransaction,
                        "day"
                      ) === 7
                        ? ` ${
                            7 -
                            dayjs().diff(
                              currentUser?.data?.lastTransaction,
                              "day"
                            )
                          } /7`
                        : null}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="py-2 px-1 font-semibold text-[#564C4C]">
                Statistics
              </div>
              <div className="relative inline-block px-5 text-left">
                <div className="">
                  <button
                    ref={staticRef}
                    onClick={() => {
                      setStaticPopUp(!staticPopUp);
                    }}
                    //   type="button"
                    className="w-42  inline-flex justify-center border-b border-[#FF5E34] bg-white px-2 py-2 text-sm font-medium text-[#FF5E34] shadow-sm hover:bg-gray-50  "
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    {filterOptions(statisticsTabs)}
                    <svg
                      className="mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {staticPopUp && (
                  <div
                    ref={staticRefCardRef}
                    className="absolute  top-10 z-20 w-36 space-y-2 rounded-md bg-white py-4 px-2  text-black shadow-lg"
                  >
                    <div className=" border-b px-4 pb-1">
                      <button
                        onClick={() => {
                          setStatisticsTabs("");
                          setStaticPopUp(false);
                        }}
                        className=""
                      >
                        Today
                      </button>
                    </div>
                    <div className="border-b px-4 pb-1">
                      <button
                        onClick={() => {
                          setStatisticsTabs("weekly");
                          setStaticPopUp(false);
                        }}
                      >
                        Last week
                      </button>
                    </div>
                    <div className="border-b px-4 pb-1">
                      <button
                        onClick={() => {
                          setStatisticsTabs("monthly");
                          setStaticPopUp(false);
                        }}
                      >
                        {" "}
                        Last month
                      </button>
                    </div>
                    <div className="px-4">
                      <button
                        onClick={() => {
                          setStatisticsTabs("yearly");
                          setStaticPopUp(false);
                        }}
                      >
                        Last year
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[500px]">
              {getEarningStatics?.isLoading ? (
                <div className="my-auto items-center">
                  <DotsLoading />
                </div>
              ) : (
                <div>
                  <StatisticsGraph
                    getEarningStatics={getEarningStatics}
                    statisticsTabs={statisticsTabs}
                  />
                  <div className="flex justify-center xs:justify-end">
                    <div className="grid  grid-cols-3 text-[10px]  xxs:grid-cols-4 xs:text-sm  ">
                      <div className="flex items-center gap-2 ">
                        <p className="h-3 w-3 rounded bg-[#157EE0] xs:mt-1 xs:h-4 xs:w-4">
                          {" "}
                        </p>
                        <p>Likes:{sumOfLikes || 0}</p>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <p className="h-3 w-3 rounded bg-[#E80000] xs:mt-1 xs:h-4 xs:w-4">
                          {" "}
                        </p>
                        <p>Views:{sumOfView || 0}</p>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <p className="h-3 w-3 rounded bg-[#04B100] xs:mt-1 xs:h-4 xs:w-4">
                          {" "}
                        </p>
                        <p>Invites:{sumOfInvite || 0}</p>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <p className="h-3 w-3 rounded bg-[#ff9900] xs:mt-1 xs:h-4  xs:w-4">
                          {" "}
                        </p>
                        <p>Followers:{sumOfFollowers || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border "></div>
            <div className="mt-5 flex items-center justify-between">
              <div className=" py-2 px-1 font-semibold text-[#564C4C]">
                Earning Summary
              </div>
              <div className="relative inline-block px-5 text-left">
                <div>
                  <button
                    ref={earningRef}
                    onClick={() => {
                      setEarningPopUp(!earningPopUp);
                    }}
                    type="button"
                    className="inline-flex  w-32 justify-center  border-b border-[#FF5E34] bg-white px-2  py-2 text-sm font-medium text-[#FF5E34] shadow-sm hover:bg-gray-50  "
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    {filterOptions(summaryTabs)}
                    <svg
                      className="mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {earningPopUp && (
                  <div
                    ref={earningCardRef}
                    className="absolute top-10 z-20 space-y-2 rounded-md bg-white py-4 px-2  text-black shadow-lg"
                  >
                    <div className="border-b px-4 pb-1 ">
                      <button
                        onClick={() => {
                          setSummaryTabs("");
                          setEarningPopUp(false);
                        }}
                      >
                        Today
                      </button>
                    </div>
                    <div className="border-b px-4 pb-1">
                      <button
                        onClick={() => {
                          setSummaryTabs("weekly");
                          setEarningPopUp(false);
                        }}
                      >
                        Last week
                      </button>
                    </div>
                    <div className="border-b px-4 pb-1">
                      <button
                        onClick={() => {
                          setSummaryTabs("monthly");
                          setEarningPopUp(false);
                        }}
                      >
                        {" "}
                        Last month
                      </button>
                    </div>
                    <div className="px-4">
                      <button
                        onClick={() => {
                          setSummaryTabs("yearly");
                          setEarningPopUp(false);
                        }}
                      >
                        Last year
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="">
              {isloading ? (
                <div className="my-auto  items-center">
                  <DotsLoading />
                </div>
              ) : (
                <div className=" mt-5 grid w-full  grid-cols-1 md:mt-5 md:mt-0 md:grid-cols-2">
                  <div>
                    {/* <p className="text-center text-sm">
                      My {filterOptions(summaryTabs)} Summary
                    </p> */}
                    <div className=" flex h-full w-full items-center ">
                      <div className="w-full ">
                        <div className=" w-full  border ">
                          <div className="flex w-full justify-between  overflow-auto font-medium ">
                            <div className="w-[40%] border-r-2 bg-orange-300 p-1">
                              Activities{" "}
                            </div>
                            <div className="w-[30%] border-r-2 bg-orange-300 p-1">
                              No.s{" "}
                            </div>
                            <div className="w-[30%] bg-orange-300 p-1">
                              Earnings
                            </div>
                          </div>
                        </div>
                        {tableData?.map((item) => (
                          <div className="border" key={item?.id}>
                            <div className=" flex  justify-between">
                              <div className="h-full w-[40%] border-r-2 p-1">
                                {item?.activites}
                              </div>
                              <div className="h-auto w-[30%] border-r-2 p-1">
                                {item?.numberOf}
                              </div>
                              <div className="h-full w-[30%] p-1">
                                {Number(item?.earning).toFixed(3)}
                              </div>
                            </div>
                            <div className="w-full border last:border-none "></div>
                          </div>
                        ))}

                        <div className="flex justify-between border bg-green-300 ">
                          <div className="w-[40%] border-r-2">Total</div>
                          <div className="w-[30%] border-r-2"></div>
                          <div className="w-[30%]">
                            {Number(totalEarnings).toFixed(3)} MC
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 w-full md:mt-0">
                    {/* <p className="z-auto   text-center text-sm">
                      My {filterOptions(summaryTabs)} Activities
                    </p> */}
                    <Chart
                      chartType="PieChart"
                      data={data}
                      options={options}
                      width={"100%"}
                      height={"400px"}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border "></div>
            <div className="relative mb-16">
              <div className="   overflow-x-auto">
                <div className=" mt-10 w-[48rem]  border text-center">
                  <div className=" w-full border ">
                    <div className="flex justify-between overflow-x-auto  font-semibold  xxxs:px-1 md:px-5 ">
                      <p className="w-[5rem]">Sr no.</p>
                      <p className="w-[18rem]">Transaction id</p>
                      <p className="w-[10rem]">Method</p>
                      <p className="w-[10rem]">Amount</p>
                      <p className="w-[10rem]">Status</p>
                    </div>
                  </div>
                  <div className="w-full border  "></div>
                  {getUserTransaction?.transaction?.length ? (
                    <div className="">
                      {transactionLoading ? (
                        <div className="mt-5 h-28">
                          <DotsLoading />
                        </div>
                      ) : (
                        getUserTransaction?.transaction?.map(
                          (item: any, idx: any) => (
                            <div
                              className=" space-y-3 overflow-y-auto"
                              key={item?._id}
                            >
                              <div className="mt-2 flex  w-full justify-between  xxxs:px-1 md:px-5 ">
                                <p className="w-[5rem]">{idx + 1}</p>
                                <p className="w-[18rem] break-words">
                                  {item?._id}
                                </p>
                                <p className="w-[10rem] break-words">
                                  {item?.paymentMethod}
                                </p>
                                <p className="w-[10rem]">{item?.memeCoins}</p>
                                <p
                                  className={`${
                                    item?.status === "Accepted" &&
                                    "text-green-600"
                                  }
                                   ${
                                     item?.status === "Reject" && "text-red-600"
                                   }  w-[10rem] font-medium`}
                                >
                                  {item?.status}
                                </p>
                              </div>
                              <div className="w-full border  "></div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-gray-600">
                      No transactions happened yet!
                    </div>
                  )}
                </div>

                <div className="absolute  mt-4 flex justify-end p-2 xxxs:right-0 md:right-10">
                  <Button
                    className="h-8"
                    onClick={() => route.push("/allTransition")}
                  >
                    see more
                  </Button>
                </div>
              </div>
            </div>

            {/* <div className="  px-5">
            <div className="relative inline-block text-left">
            <div>
            <button
            ref={earningRef}
            onClick={() => {
              setEarningPopUp(!earningPopUp);
            }}
            type="button"
            className="inline-flex w-[9rem]  justify-center rounded-md border border-[#FF5E34] bg-white px-4 py-2 text-sm font-medium text-[#FF5E34] shadow-sm hover:bg-gray-50  "
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            >
            {filterOptions(summaryTabs)}
            <svg
            className="mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            >
            <path
            fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {earningPopUp && (
                <div
                  ref={earningCardRef}
                  className="absolute top-10 z-20 space-y-2 rounded-md bg-white py-4 px-2  text-black shadow-lg"
                >
                  <div className="border-b px-4 pb-1 ">
                    <button
                      onClick={() => {
                        setSummaryTabs("");
                        setEarningPopUp(false);
                      }}
                    >
                      Today
                    </button>
                  </div>
                  <div className="border-b px-4 pb-1">
                    <button
                      onClick={() => {
                        setSummaryTabs("weekly");
                        setEarningPopUp(false);
                      }}
                    >
                      Last week
                    </button>
                  </div>
                  <div className="border-b px-4 pb-1">
                    <button
                      onClick={() => {
                        setSummaryTabs("monthly");
                        setEarningPopUp(false);
                      }}
                    >
                      {" "}
                      Last month
                    </button>
                  </div>
                  <div className="px-4">
                    <button
                      onClick={() => {
                        setSummaryTabs("yearly");
                        setEarningPopUp(false);
                      }}
                    >
                      Last year
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-md bg-[#E0F0FF] p-3 text-[#157EE0]">
              <div>Total Likes on Post&apos;s</div>

              <div>{getEarningSummary?.data?.UserLike}</div>
            </div>
            <div className="mt-3 flex items-center justify-between  rounded-md bg-[#FFE3E3] p-3 text-[#E80000]">
              <div>Total Views on Post&apos;s</div>

              <div>{getEarningSummary?.data?.UserViews}</div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md bg-[#F7E7FF] p-3 text-[#7800B1]">
              <div>Total Bounties</div>

              <div>{getEarningSummary?.data?.UserBounty}</div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md bg-[#CFEDCE] p-3 text-[#04B100]">
              <div>Total Successful Invites</div>

              <div>230</div>
            </div>
            <div className="mt-8 flex items-center justify-between rounded-md bg-[#D9D9D9] p-3">
              <div>Total </div>

              <div>230</div>
            </div>
          </div> */}
          </div>
        </div>
        <div className="  mt-5 hidden lg:block  lg:w-[30%] xl:m-10 ">
          <div className={`right-50 ${"fixed mx-8 w-[29%] 2xl:w-[20%]"} `}>
            <div
              className="roudned-lg overflow-hidden bg-white px-4 py-3 shadow-md "
              style={{ borderRadius: "10px" }}
            ></div>
          </div>
          {/* <Advertisement /> */}
        </div>
        <div style={{ position: "relative" }}>
          <Toaster
            containerStyle={{ position: "absolute", top: "-340px" }}
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                zIndex: 1000,
              },
            }}
          />
        </div>
        <Modal
          isVisiable={isModel}
          onClose={setIsModel}
          className="top-[25%]  h-auto w-[90%]  sm:w-[50%] md:w-[50%] lg:w-[30%]"
        >
          <div className="mx-3 mt-5 flex justify-end">
            <button
              onClick={(e) => {
                setIsModel(false);
              }}
            >
              <CrossIcon />
            </button>
          </div>
          <div className="my-5 mx-8 space-y-3">
            <div className="my-3 text-base">
              <p className="text-sm">Full Name</p>
              {/* <p className="text-gray-600">{currentUser?.data?.name}</p> */}
              <input
                className="mt-2 w-full rounded border-none bg-gray-200 p-2 "
                id="standard-select "
                onChange={(e) => paymentAction(e)}
                name="paymentMethod"
                disabled
                value={getPayment?.details?.fullName}
              />
            </div>
            <div className="select ">
              <label htmlFor="paymentID" className=" mb-2 text-[#555]">
                Payment method
              </label>
              <input
                className="mt-2 w-full rounded border-none bg-gray-200 p-2 "
                id="standard-select "
                onChange={(e) => paymentAction(e)}
                name="paymentMethod"
                disabled
                value={getPayment?.details?.paymentMethod}
              />

              {/* <p>Payment method</p>
          {getPayment?.details?.paymentMethod} */}
              <span className="focus"></span>
            </div>
            <div>
              <label htmlFor="paymentID" className=" text-[#555]">
                Your payment id
              </label>
              <div className="mx-auto  rounded  ">
                <input
                  disabled
                  value={getPayment?.details?.paymentId}
                  onChange={(e) => paymentAction(e)}
                  name="paymentId"
                  type="text"
                  id="paymentID"
                  className="mt-2 w-full cursor-text rounded border-none bg-gray-200 "
                />
              </div>
            </div>
            <div className="mt-8">
              <label htmlFor="paymentID" className=" text-[#555]">
                Meme coins
              </label>
              <div className=" mt-2 rounded border border-[#222] ">
                <input
                  onChange={(e) => paymentAction(e)}
                  name="memeCoins"
                  placeholder="enter meme coins "
                  type="number"
                  id="coins"
                  className="w-full  rounded border-none focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <p className="px-1 text-sm font-medium text-red-600">
                {paymentDetials.memeCoins !== 0 &&
                  paymentDetials.memeCoins <= 1000 &&
                  "You can redeem 1000 coins or more"}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (
                    getPayment?.details?.paymentId &&
                    getPayment?.details?.paymentMethod &&
                    getPayment?.details?.fullName
                  ) {
                    paymentRequest();
                  } else {
                    errorMessage(
                      "Please fill payment details for redeem coins."
                    );
                    router.push(`/setting?tab=Redeem-Settings`);
                  }
                }}
                className=" mt-4 justify-end rounded bg-primary-500 px-3 py-2 text-center text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Myearning;
