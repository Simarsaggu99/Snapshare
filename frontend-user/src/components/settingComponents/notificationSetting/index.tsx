import React, { useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import { BellIcon } from "@/utils/AppIcons";
import {
  changeNotification,
  getNotification,
  getNotificationStatus,
} from "@/services/notification";
import { useAtom } from "jotai";
import { loggedInUser } from "@/store";
import toast, { Toaster } from "react-hot-toast";

const NotificationSetting = () => {
  const [notificationStatus, setNotificationStatus] = useState({
    post_like: true,
    post_comment: true,
    post_reshare: true,
    follower: true,
    crux_unlocked: true,
    coin_reedemed: true,
    bounty_coins: true,
    warning: true,
    spanke: true,
    message: true,
  });
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const notify = () => {
    toast.success("Notification Setting update successfully");
  };
  const errorNotify = () => {
    toast.success("!OPPS something went wrong. please try again ");
  };

  const onHandleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const notificationData = {
      ...notificationStatus,
      [name]: checked,
    };

    changeNotification({ body: { notifications: notificationData } })
      .then((res) => {
        notify();
      })
      .catch((err) => {
        if (err) {
          errorNotify();
        }
      });
  };
  useEffect(() => {
    getNotificationStatus({
      pathParams: { id: currentUser?.data?._id },
    }).then((res: any) => {
      setNotificationStatus(res?.data?.notifications);
    });
  }, [currentUser?.data]);

  return (
    <>
      <div className="relative my-2 px-2">
        <div className="flex flex-row border-b pb-4 ">
          <BellIcon />
          <p className="pl-3 text-lg font-semibold text-gray-700">
            Notification Settings
          </p>
        </div>
        <div className="mt-2">
          <div className="mb-5 mt-5 text-base">
            <div className=" flex  justify-between">
              <p className="text-md text-gray-800">Post Like</p>
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  onChange={(e) => {
                    setNotificationStatus({
                      ...notificationStatus,
                      post_like: e.target.checked,
                    });
                    onHandleSubmit(e);
                  }}
                  name="post_like"
                  type="checkbox"
                  checked={notificationStatus?.post_like}
                  id="small-toggle"
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-200"></div>
              </label>
            </div>
            <div className="flex  justify-between ">
              <p className="text-md text-gray-800">Post Comment </p>
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={notificationStatus?.post_comment}
                  id="small-toggle"
                  className="peer sr-only"
                  name="post_comment"
                  onChange={(e) => {
                    setNotificationStatus({
                      ...notificationStatus,
                      post_comment: e.target.checked,
                    });
                    onHandleSubmit(e);
                  }}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-200"></div>
              </label>
            </div>
            <div className="flex  justify-between ">
              <p className="text-md text-gray-800">Post Reshare</p>
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={notificationStatus?.post_reshare}
                  id="small-toggle"
                  className="peer sr-only"
                  name="post_reshare"
                  onChange={(e) => {
                    setNotificationStatus({
                      ...notificationStatus,
                      post_reshare: e.target.checked,
                    });
                    onHandleSubmit(e);
                  }}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-200"></div>
              </label>
            </div>
            <div className="flex  justify-between">
              <p className="text-md text-gray-800">New Message</p>
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setNotificationStatus({
                      ...notificationStatus,
                      message: e.target.checked,
                    });

                    onHandleSubmit(e);
                  }}
                  checked={notificationStatus?.message}
                  id="small-toggle"
                  className="peer sr-only"
                  name="message"
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-200"></div>
              </label>
            </div>
            <div className=" flex  justify-between ">
              <p className="text-md text-gray-800">New Follower</p>
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={notificationStatus?.follower}
                  id="small-toggle"
                  className="peer sr-only"
                  name="follower"
                  onChange={(e) => {
                    setNotificationStatus({
                      ...notificationStatus,
                      follower: e.target.checked,
                    });
                    onHandleSubmit(e);
                  }}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-200"></div>
              </label>
            </div>
          </div>
        </div>
        <div style={{ position: "relative" }} className="w-full">
          <Toaster
            containerClassName="mt-[50px] md:mt-[53px] xl:mt-[60px]"
           
            position="top-center"
            toastOptions={{
              duration: 1000,
              style: {
                zIndex: 1000,
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NotificationSetting;
