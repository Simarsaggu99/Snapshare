import { notifyError } from "@/components/UIComponents/Notification";
import Spin from "@/components/UIComponents/Spin";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/inputField";
import {
  usePaymentMethod,
  useUpdatePaymentDetails,
} from "@/hooks/users/mutation";
import { useGetPaymentDetails } from "@/hooks/users/query";
import { loggedInUser } from "@/store";
import { IoIosSave } from "@react-icons/all-files/io/IoIosSave";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const RedeemSettings = () => {
  const [currentUser] = useAtom(loggedInUser);
  const [accountDetails, setAccountDetails] = useState({
    fullName: "",
    mode: "googlepay",
    paymentId: "",
  });
  const [isPayment, setIsPayment] = useState(false);
  const updatePaymentDetails = useUpdatePaymentDetails();
  const paymentMethod = usePaymentMethod();
  const { data: getPayment, refetch }: any = useGetPaymentDetails({});

  console.log("cur", currentUser);

  useEffect(() => {
    setAccountDetails({
      fullName: getPayment?.details?.fullName,
      paymentId: getPayment?.details?.paymentId,
      mode: getPayment?.details?.paymentMethod
        ? getPayment?.details?.paymentMethod
        : "googlepay",
    });
  }, [getPayment]);
  const successToast = () => {
    toast.success("Redeem setting changed successfully");
  };
  const errorToast = () => {
    toast.error("!OPPS something went wrong. please try again");
  };

  return (
    <div className="my-2 px-2">
      <div style={{ position: "relative" }}>
        <Toaster
          containerClassName="mt-[56px]"
          // containerStyle={{ position: "absolute", top: 0 }}
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              zIndex: 1000,
            },
          }}
        />
      </div>

      <div className="border-b pb-4">
        <p className="pl-3 text-lg font-semibold text-gray-700">
          Redeem Settings
        </p>
      </div>

      <div className="mt-2">
        <div className="my-3 text-base">
          <p className="text-sm">Full Name</p>
          <p className="text-gray-600">{currentUser?.data?.name}</p>
          <Input
            value={accountDetails?.fullName}
            onchange={(e: any) => {
              setAccountDetails({
                ...accountDetails,
                fullName: e.target.value,
              });
            }}
            className="mt-2 w-full rounded-md  border border-gray-300"
            type="text"
            default=""
            name=""
            id=""
          />
        </div>
        <div className="my-3">
          <p className="text-sm ">Mode of Payment</p>
          {/* <Input
            onchange={(e: any) => {
              console.log("e", e);
              setAccountDetails({
                ...accountDetails,
                mode: e.target.value,
              });
            }}
            className="mt-2 w-full rounded-md  border border-gray-300"
            type="text"
            name=""
            id=""
          /> */}
          <select
            value={accountDetails?.mode}
            onChange={(e) => {
              setAccountDetails({
                ...accountDetails,
                mode: e.target.value,
              });
            }}
            className="ring-none mt-2 w-full   rounded-md  border border-gray-300 outline-none ring-0"
          >
            {/* <option value="">Select payment mode</option> */}

            <option value="googlepay">UPI ID</option>
            <option value="paypal">Pay pal</option>
          </select>
          {(!accountDetails?.mode || accountDetails?.mode === "") &&
            isPayment && (
              <p className="text-sm text-red-500">Please slect payment mode</p>
            )}
        </div>
        <div className="my-3">
          <p className="text-sm ">
            {accountDetails?.mode === "googlepay" ? "UPI ID" : "Paypal ID"}
          </p>
          <Input
            value={accountDetails?.paymentId}
            onchange={(e: any) => {
              setAccountDetails({
                ...accountDetails,
                paymentId: e.target.value,
              });
            }}
            className="mt-2 w-full rounded-md  border border-gray-300"
            type="text"
            name=""
            id=""
          />
          {!accountDetails?.paymentId && isPayment && (
            <p className="text-sm text-red-500">Please slect payment id</p>
          )}
        </div>
        <div className="my-3 flex justify-end pt-2">
          <Button
            disabled={updatePaymentDetails.isLoading}
            onClick={() => {
              if (
                !updatePaymentDetails.isLoading &&
                accountDetails?.mode &&
                accountDetails?.paymentId &&
                accountDetails?.fullName
              ) {
                setIsPayment(true);
                if (!getPayment?.details?._id) {
                  paymentMethod
                    .mutateAsync({
                      body: {
                        paymentMethod: accountDetails?.mode,
                        paymentId: accountDetails?.paymentId,
                        fullName: accountDetails?.fullName,
                      },
                    })
                    .then((res: any) => {
                      if (res?.success) {
                        successToast();
                        refetch();
                      }
                    })
                    .catch((er) => {
                      if (!er?.success) {
                        errorToast();
                      }
                    });
                } else {
                  updatePaymentDetails
                    .mutateAsync({
                      body: {
                        paymentMethod: accountDetails?.mode,
                        paymentId: accountDetails?.paymentId,
                        fullName: accountDetails?.fullName,
                      },
                      pathParams: {
                        paymentId: getPayment?.details?._id,
                      },
                    })
                    .then((res: any) => {
                      if (res?.success) {
                        successToast();
                      }
                    });
                }
              } else {
                notifyError({ message: "Enter full details" });
              }
            }}
            className="flex h-10 w-28 justify-center text-sm"
          >
            {updatePaymentDetails.isLoading ? (
              <div className="px-7  ">
                <Spin size={2} color="white" />
              </div>
            ) : (
              <div className="flex items-center">
                <IoIosSave className="mr-3" />
                {getPayment?.details?._id ? "Update" : "Save"}
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RedeemSettings;
