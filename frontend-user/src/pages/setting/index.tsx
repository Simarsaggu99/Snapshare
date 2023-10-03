import Advertisement from "@/components/advertisement";
import { BlockIcon, ReportIcon, UserIcon } from "@/utils/AppIcons";
import React, { useEffect, useState } from "react";
import BasicInfo from "@/components/settingComponents/basicInfo/index";
import BlockUserList from "@/components/settingComponents/blockUsersList";
import AccountSettings from "@/components/settingComponents/accountSettings";
import RedeemSettings from "@/components/settingComponents/redeemSettings";
import ReportPosts from "@/components/settingComponents/reportPosts";
import NotificationSetting from "@/components/settingComponents/notificationSetting";
import { useRouter } from "next/router";
import { BackIcon } from "@/components/Icons";

const Settings = () => {
  const router = useRouter();
  const tab = router.query.tab;
  const [activeLink, setActiveLink] = useState(tab);
  const settingArray = [
    { name: "Basic info", tab: "Basic-info", icon: <UserIcon />, id: 1 },
    { name: "Account Settings", tab: "Account-Settings", icon: "", id: 2 },
   
    {
      name: "Notification Settings",
      tab: "Notification-Settings",
      icon: "",
      id: 4,
    },
    { name: "Blocked Users", tab: "Blocked-Users", icon: <BlockIcon />, id: 5 },
    {
      name: "Reports and Warnings",
      tab: "Reports-and-Warnings",
      icon: <ReportIcon />,
      id: 6,
    },
  ];
  useEffect(() => {
    setActiveLink(tab);
    // router.push("?tab=Basic-info");
  }, [tab]);
  return (
    <div>
      <div
        className="sm:hidden"
        onClick={() => {
          tab ? router.push("/setting") : router.push("/");
        }}
      >
        <BackIcon />
      </div>
      <div className="mt-4 w-full">
        <div className="relative  pt-3 sm:grid sm:grid-cols-2  sm:gap-5 lg:grid-cols-3">
          <div
            className={`mx-5 w-[100%]   lg:mx-0  lg:justify-end     ${
              tab ? "hidden sm:flex" : "flex "
            }`}
          >
            <div className="w-[96%] lg:w-[64%] ">
              <div
                style={{ boxShadow: "0px 0px 10px rgba(104, 104, 104, 0.1)" }}
                className="overflow-hidden rounded-lg bg-white py-7 text-center  text-[30px] font-medium"
              >
                Settings
              </div>
              <div
                style={{ boxShadow: "0px 0px 10px rgba(104, 104, 104, 0.1)" }}
                className="mt-3 rounded-md bg-white  p-4"
              >
                {settingArray?.map((item: any) => (
                  <div
                    key={item?.id}
                    className="border-b py-1.5 last:border-none"
                  >
                    <button
                      onClick={() => {
                        setActiveLink(item?.tab);
                        router.push(`?tab=${item?.tab}`);
                      }}
                      className={`mb-1 flex w-full space-y-2 px-4 text-base last:mb-0 lg:text-sm lg:text-base  ${
                        activeLink === item?.tab
                          ? "w-full rounded-md bg-primary-200 text-primary-600"
                          : ""
                      }`}
                    >
                      {/* <div>{item?.icon}</div> */}
                      <div className=" py-2.5"> {item?.name}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={` sticky  
            ${tab ? "block" : "hidden sm:block "} 
            w-full  sm:w-[100%] lg:w-[100%]`}
          >
            <div
              className=" mx-2 rounded-lg bg-white p-5 xxs:mx-2 sm:mx-5 lg:mx-0"
              style={{ boxShadow: " 0px 0px 10px rgba(104, 104, 104, 0.1)" }}
            >
              {(activeLink || tab) === "Basic-info" && <BasicInfo />}
              {(activeLink || tab) === "Blocked-Users" && <BlockUserList />}
              {(activeLink || tab) === "Account-Settings" && (
                <AccountSettings />
              )}
              {(activeLink || tab) === "Notification-Settings" && (
                <NotificationSetting />
              )}
              {(activeLink || tab) === "Redeem-Settings" && <RedeemSettings />}
              {(activeLink || tab) === "Reports-and-Warnings" && (
                <ReportPosts />
              )}
            </div>
          </div>
          <div className=" hidden     justify-start  lg:flex">
            {/* <div className="w-[80%]"> */}
            <Advertisement />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
