import React, { useState } from "react";
import Tag from "./Tag";
import { useGetTags } from "@/hooks/user/query";
import { useAtom } from "jotai";
import { isLoginModal, loggedInUser } from "@/store";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import Link from "next/link";
import { Trending } from "@/utils/AppIcons";

const Sidebar = ({ search }: any) => {
  const [viewSize, setViewSize] = useState(10);
  // const [isModel, setIsModel] = useAtom(isLoginModal);
  const [currentUser] = useAtom(loggedInUser);

  const { data: getTags }: any = useGetTags({
    query: { startIndex: 0, viewSize },
  });
  const router = useRouter();

  return (
    <div
      className={`top-20 mt-1  w-[100%] ${
        search === true ? "lg:fixed lg:w-[20%]" : "lg:fixed  lg:w-[20%]"
      } justify-center sm:w-[95%]  md:w-[85%]  lg:mx-0 `}
    >
      <div className="hidden md:block">
        <div className=" overflow-hidden  rounded-lg bg-[#fff] p-1.5 pb-3 shadow-md  ">
          <div className="flex items-center justify-center gap-3 rounded-lg  bg-[#FFCFC2] py-[1px]  px-2 text-lg	 font-medium text-[#FF5E34] ">
            <p className="">TRENDING</p>
            <Trending />
          </div>

          <Tag getTags={getTags} tagPage={false} />
        </div>
        <div className="mt-1 flex justify-end">
          
            <button className="cursor-pointer">
              <p className="items-center text-center text-[16px] text-[#FF5E34]  ">
                See all tags
              </p>
            </button>
         
        </div>
      </div>
      {/* </div> */}
      <div className="flex  md:hidden">
        <div className=" flex  w-full overflow-hidden rounded-lg  bg-[#fff]  shadow-md">
          <p className="  flex items-center   bg-primary-200 px-1.5 py-0.5 font-medium  text-primary-600 ">
            <Trending />
          </p>
          <div className=" w-full overflow-hidden py-1.5">
            <Tag getTags={getTags} tagPage={false} />
          </div>
        </div>

        {/* <div className=" flex  overflow-hidden rounded-lg bg-[#fff]  shadow-md  ">
          <p className="  flex items-center   bg-primary-200 px-2 py-0.5 font-medium  text-primary-600 ">
            <Trending />
          </p>
          <div className=" overflow-hidden py-1.5">
            <Tag getTags={getTags} tagPage={false} />
          </div>
        </div>
        <div className="mt-1 hidden justify-end md:flex">
          <Link href={"/tags"}>
            <button className="cursor-pointer">
              <p className="items-center text-center text-[16px] text-[#FF5E34]  ">
                See all
              </p>
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
