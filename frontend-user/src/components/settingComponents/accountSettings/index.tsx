import Button from "@/components/buttons/Button";
import Input from "@/components/form/inputField";
import { isUserDetailsModel, loggedInUser } from "@/store";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosSave } from "@react-icons/all-files/io/IoIosSave";
import { useDeleteUser, useUpdateUserDetails } from "@/hooks/user/mutation";
import { checkUserNameExist } from "@/services/user";
import Popover from "@/components/UIComponents/Popover";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Spin from "@/components/UIComponents/Spin";

const AccountSettings = () => {
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [userAccountData, setUserAccountData] = useState({
    user_handle: "",
    email: "",
  });
  const [isUserHandleAvaible, setIsUserHandleAvaible] = useState({
    status: false,
    message: "",
  });

  const [isPopUp, setIsPopUp] = useState(false);
  const userRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  let mustHaveNum = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  let spaceRemove = /\s/g;
  let removespecialChar = /[`~!#$%^&*@()|+=?;:'",<>\{\}\[\]\\\/]/gi;
  const successToast = () => {
    toast.success("Account setting changed successfully");
  };

  useEffect(() => {
    setUserAccountData({
      user_handle: currentUser?.data?.user_handle,
      email: currentUser?.data?.email,
    });
  }, [currentUser]);
  const updatUser = useUpdateUserDetails();
  const deleteUser = useDeleteUser();
  const onHandleSave = () => {
    if (!mustHaveNum?.test(userAccountData?.user_handle)) {
      return setIsUserHandleAvaible({
        message: "Username must have one numeric value",
        status: true,
      });
    }
    if (userAccountData?.user_handle) {
      if (!mustHaveNum?.test(userAccountData?.user_handle)) {
        return setIsUserHandleAvaible({
          message: "Username must have one numeric value and one alphabet",
          status: true,
        });
      }
      if (
        userAccountData?.user_handle?.length < 6 ||
        userAccountData?.user_handle?.length > 23
      ) {
        return setIsUserHandleAvaible({
          message: "Username must be between 6 to 23 characters",
          status: true,
        });
      }
    }
    checkUserNameExist({
      user_handle: userAccountData?.user_handle,
    })
      .then((res: any) => {
        if (res?.status === "true") {
          updatUser
            .mutateAsync({
              body: userAccountData,
            })
            .then((res: any) => {
              if (res?.success) {
                setCurrentUser({
                  ...currentUser,
                  data: {
                    ...currentUser.data,
                    user_handle: userAccountData?.user_handle,
                  },
                });
                window.location.reload();
                successToast();
              }
            });
          setIsUserHandleAvaible({ status: false, message: "" });
        } else {
          setIsUserHandleAvaible({
            message: "This user name is taken ",
            status: true,
          });
        }
      })
      .catch((err) => {
        if (err?.status === "true") {
          updatUser
            .mutateAsync({
              body: userAccountData,
            })
            .then((res) => {
              setCurrentUser({
                data: {
                  ...currentUser,
                  user_handle: userAccountData?.user_handle,
                },
              });
            });
          setIsUserHandleAvaible({ status: false, message: "" });
          successToast();
        } else {
          setIsUserHandleAvaible({
            message: "This user name is taken ",
            status: true,
          });
        }
      });
  };
  const onChangeFields = (e: any) => {
    const { name, value } = e.target;

    const finalVal = value?.replace(spaceRemove, "");
    const removespecial = finalVal?.replace(removespecialChar, "");
    setUserAccountData({
      ...userAccountData,
      user_handle: removespecial,
    });
  };
  const username = (UserDetails: any) => {
    if (UserDetails)
      if (UserDetails.length < 6 && UserDetails.length > 23) {
        return "Username must be between 6 to 23 characters";
      }
  };

  return (
    <div className="my-2 px-2">
      <div className="border-b pb-4">
        <p className="pl-3 text-lg font-semibold text-gray-700">
          Account Settings
        </p>
      </div>
      <div className="relative mt-2">
        <div className="my-4">
          <p className="my-2">User name</p>
          <Input
            onchange={(e: any) => {
              onChangeFields(e);
              setIsUserHandleAvaible({ status: false, message: "" });
              if (e.target.value === "") {
                setIsUserHandleAvaible({
                  message: "",
                  status: false,
                });
              } else if (currentUser?.data?.user_handle === e.target.value) {
                setIsUserHandleAvaible({
                  message: "",
                  status: false,
                });
              } else {
                checkUserNameExist({
                  user_handle: e.target.value,
                })
                  .then((res: any) => {})
                  .catch((err: any) => {
                    setIsUserHandleAvaible({
                      message: "This user handle is already taken ",
                      status: true,
                    });
                  });
              }
            }}
            value={userAccountData?.user_handle}
            className="mt-2 w-full rounded-md  border border-gray-300"
            type="text"
            name=""
            id=""
          />
          <p className="text-sm font-medium text-red-500">
            
            {isUserHandleAvaible?.status && isUserHandleAvaible?.message}
          </p>
        </div>
        <div className="my-4">
          <p>Primary Email</p>
          <div className="block w-full  gap-4 sm:flex">
            <div className="w-full">
              <input
                onChange={(e: { target: { value: any } }) => {
                  setUserAccountData({
                    ...userAccountData,
                    email: e.target.value,
                  });
                }}
                disabled
                value={userAccountData?.email}
                className="mt-2 w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-200"
                type="text"
                name=""
                id=""
              />
            </div>
            
          </div>
        </div>
        <div className="relative  my-3 flex justify-between pt-2">
          <button
            onClick={() => {
              
              setIsPopUp(true);
            }}
            className="pl-1 text-sm text-primary-600"
          >
            Delete Account
          </button>
          <Button
            className="h-10 w-24 text-sm disabled:border-gray-300 disabled:bg-gray-300 disabled:hover:bg-gray-300"
            onClick={() => {
              if (!updatUser.isLoading) onHandleSave();
            }}
            disabled={
              userAccountData?.user_handle === currentUser?.data?.user_handle
            }
          >
            {updatUser?.isLoading ? (
              <div className="px-5  ">
                <Spin size={2} color="white" />
              </div>
            ) : (
              <div className="flex items-center">
                <IoIosSave className="mr-3" /> <p>Save</p>
              </div>
            )}
          </Button>
        </div>
        <Popover
          className="-top-1 left-1  w-[90%] bg-white"
          userRef={userRef}
          onclose={setIsPopUp}
          isVisible={isPopUp}
        >
          
          <div
            className="p-4 "
           
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="mt-2 pb-5 text-gray-800 ">
              <p className="">
                {" "}
                Are your sure you want to delete your account ?{" "}
              </p>
              <p>This action is irreversible</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsPopUp(false);
                }}
                className="rounded border px-3"
              >
                Cancel{" "}
              </button>
              <Button
                onClick={() => {
                  if (!deleteUser.isLoading)
                    deleteUser.mutateAsync().then((res) => {
                      router.push("/");
                      setCurrentUser({});
                      localStorage.clear();
                      setIsPopUp(false);
                    });
                }}
                className="h-10 w-20"
              >
                {deleteUser.isLoading ? (
                  <div className="px-3">
                    <Spin color="white" size={2} />
                  </div>
                ) : (
                  <p>Delete</p>
                )}
              </Button>
            </div>
          </div>
         
        </Popover>
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
    </div>
  );
};

export default AccountSettings;
