import Button from "@/components/buttons/Button";
import Input from "@/components/form/inputField";
import { useUpdateUserDetails } from "@/hooks/user/mutation";
import { loggedInUser } from "@/store";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGetCountry } from "@/hooks/user/query";
import Spin from "@/components/UIComponents/Spin";
import CustomDatePicker from "@/components/UIComponents/DatePicker";
import { notifyError } from "@/components/UIComponents/Notification";

interface userDataInterface {
  dob: any;
  gender: string;
  country: string;
}
const BasicInfo = () => {
  const userData = {
    dob: "",
    gender: "male",
    country: "India",
  };

  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [userDataDetials, setUserDataDetials] =
    useState<userDataInterface>(userData);
  const updateUserDetails = useUpdateUserDetails();
  const getCountry: any = useGetCountry();
  const [dobError, setDobError] = useState({
    message: "",
    status: false,
  });
  useEffect(() => {
    setUserDataDetials({
      dob: currentUser?.data?.dob
        ? dayjs(currentUser?.data?.dob).format("YYYY-MM-DD")
        : "",
      gender: currentUser?.data?.gender,
      country: currentUser?.data?.country,
    });
  }, [currentUser]);
  const successToast = () => {
    toast.success("Basic setting changed successfully");
  };
  const errorToast = () => {
    toast.success("!OPPS something went wrong");
  };
  const onHandleSubmit = () => {
    const data = {
      ...userDataDetials,
      dob:
        userDataDetials?.dob !== "Invalid Date"
          ? dayjs(userDataDetials?.dob)?.toISOString()
          : "",
    };
    updateUserDetails
      .mutateAsync({
        body: data,
      })
      .then((res: any) => {
        if (res?.success) {
          successToast();
        }
      })
      .catch((err) => {
        if (!err?.success) {
          errorToast();
        }
      });
  };
  // console.log('newdate', newdate)

  const currentDate = dayjs().format("YYYY-MM-DD");
  const matchDate = dayjs(currentDate)
    .subtract(13, "year")
    .format("YYYY-MM-DD");
  // const handleDateChange=(e:any)=>{
  //   const validDob=dayjs().subtract(13, 'year').format("YYYY-MM-DD")
  //   console.log('validDob', validDob,e.target.value)
  //   if(validDob>e.target.value){
  //     console.log("yes")
  //   }else{
  //     notifyError({ message: "Age should be greater than 13" });
  //   }
  // }
  return (
    <div>
      {/* <Toaster /> */}

      <div className="my-2 px-4">
        <div className="border-b-2 pb-5 ">
          <p className="pl-3 text-lg font-semibold text-gray-700">Basic Info</p>
        </div>

        <div className="mt-4 space-y-6 ">
          <div>
            <p>Date of Birth</p>
            <Input
              onchange={(e: any) => {
                const { name, value } = e.target;
                const validDob = dayjs()
                  .subtract(13, "year")
                  .format("YYYY-MM-DD");
                if (validDob > e.target.value) {
                  setUserDataDetials({
                    ...userDataDetials,
                    [name]: value,
                  });
                  setDobError({
                    message: "",
                    status: false,
                  });
                } else {
                  setDobError({
                    message: "Age should be greater than 13 years",
                    status: true,
                  });
                  // // return "Age should be greater than 13";
                  // notifyError({ message: "Age should be greater than 13" });
                }
              }}
              value={userDataDetials?.dob}
              className="mt-3 w-full rounded-lg border border-gray-300  focus:outline-none focus:ring-0"
              type="date"
              max={dayjs().subtract(13, "year").format("YYYY-MM-DD")}
              name="dob"
            />
            <p className="text-sm text-red-600">
              {dobError?.status && dobError?.message}
            </p>
            {/* <CustomDatePicker /> */}
          </div>
          <div>
            <p>Gender</p>
            <select
              onChange={(e: any) => {
                const { name, value } = e.target;

                setUserDataDetials({
                  ...userDataDetials,
                  [name]: value,
                });
              }}
              value={userDataDetials?.gender}
              name="gender"
              className="mt-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-0"
            >
              <option className="hidden">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <p>country</p>
            {/* <input
              onChange={(e) => {
                const { name, value } = e.target;
                setUserDataDetials({
                  ...userDataDetials,
                  [name]: value,
                });
              }}
              value={userDataDetials?.country}
              className="mt-3 w-full  rounded-lg border border-gray-300 focus:outline-none focus:ring-0"
              type="text"
              name="country"
            /> */}
            <select
              className="w-full rounded-[10px] border border-gray-300"
              name="country"
              value={userDataDetials?.country}
              defaultValue={userDataDetials?.country}
              onChange={(e: any) => {
                const { name, value } = e.target;
                setUserDataDetials({
                  ...userDataDetials,
                  [name]: value,
                });
              }}
              // className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option className="hidden">Select country</option>
              {getCountry?.data?.result?.map((item: any, id: any) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            onClick={() => {
              if (!updateUserDetails.isLoading) onHandleSubmit();
            }}
            className="h-10 w-16"
          >
            {updateUserDetails.isLoading ? (
              <div className="px-1">
                <Spin color="white" size={4} />
              </div>
            ) : (
              <p>Save</p>
            )}
          </Button>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <Toaster
          containerClassName="mt-[55px]"
          // containerStyle={{ position: "absolute", top: "-400px" }}
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              zIndex: 1000,
            },
          }}
        />
      </div>
    </div>
  );
};

export default BasicInfo;
