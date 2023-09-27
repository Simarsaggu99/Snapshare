import DotsLoading from "@/components/DotsLoading";
import { useGetUserTransaction } from "@/hooks/wallet/query";
import { loggedInUser } from "@/store";
import { useAtom } from "jotai";
import React from "react";

const Alltransition = () => {
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const { data: getUserTransaction, isLoading }: any = useGetUserTransaction({
    query: { userId: currentUser?.data?._id },
  });
  return (
    <div className=" mt-20  flex  justify-center xxxs:px-2 md:px-10 lg:px-10 2xl:px-48">
      <div className=" overflow-x-scroll ">
        <div className="mt-10 w-[680px] border text-center lg:w-[940px] xl:w-[1180px] 2xl:w-[1150px]">
          <div className=" border ">
            <div className="flex items-center justify-between text-lg  font-semibold xxxs:px-1 md:px-10 ">
              <p>Sr no.</p>
              <p>Transaction id</p>
              <p>Method</p>
              <p>Amount</p>
              <p>Status</p>
            </div>
          </div>
          <div className="w-full border  "></div>
          {getUserTransaction?.transaction?.length ? (
            <div className="">
              {isLoading ? (
                <div className="mt-5 h-28">
                  <DotsLoading />
                </div>
              ) : (
                getUserTransaction?.transaction?.map((item: any, idx: any) => (
                  <div className="space-y-3 overflow-y-auto" key={item?._id}>
                    <div className="mt-2 flex  justify-between  xxxs:px-1 md:px-10 ">
                      <p>{idx + 1}</p>
                      <p>{item?._id}</p>
                      <p>{item?.paymentMethod}</p>
                      <p>{item?.paymentId}</p>
                      <p
                        className={`${
                          item?.status === "Accepted" && "text-green-600"
                        }
                        ${
                          item?.status === "Reject" && "text-red-600"
                        } font-medium`}
                      >
                        {item?.status}
                      </p>
                    </div>
                    <div className="w-full border  "></div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="py-10 text-gray-600">data not found yet!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alltransition;
