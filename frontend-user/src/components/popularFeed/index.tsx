import Image from "next/image";
import React, { useState } from "react";
import tree from "~/images/trees.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import { useAllPost } from "@/hooks/post/query";
import RigthArrow from "~/images/rightArrow.png";
import LeftArrow from "~/images/LeftArrow.png";
import Link from "next/link";
import { useAtom } from "jotai";
import { isLoginModal, loggedInUser } from "@/store";
import { useRouter } from "next/router";


SwiperCore.use([Navigation, Pagination, A11y]);

const PopularFeed = () => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
  const [activeLink, setActiveLink] = useState();
  const [currentUser] = useAtom(loggedInUser);
  const [isModel, setIsModel] = useAtom(isLoginModal);
  const [isPostOpenLoading, setIsPostOpenLoading] = useState(false);

  const getAllPost: any = useAllPost({
    query: { popular: true, filterBy: "popular" },
  });
  const router = useRouter();

  return (
    <div className="">
      {isPostOpenLoading && (
        <div className="modal backdrop-blur-xs flex justify-center bg-black/60">
          <div className="absolute top-[50%] left-[50%] z-50 h-full">
            <div className={`   flex h-14 justify-center `}>
              <span className="circle circle-1"></span>
              <span className="circle circle-2"></span>
              <span className="circle circle-3"></span>
              <span className="circle circle-4"></span>
            </div>
          </div>
        </div>
      )}
      <div className="select-none overflow-hidden rounded-[10px] bg-white  p-1.5 pb-3  shadow-md ">
        <p className="relative top-[2px] mb-2 w-full rounded-md bg-[#FFCFC2] py-[4.5px] text-center text-lg font-[500] text-alpha-primary">
          TOP 10
        </p>
        {}

        <Swiper
          style={
            {
              
            }
          }
          slidesPerView={1}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          spaceBetween={5}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerGroupSkip={4}
          grabCursor={true}
          keyboard={{
            enabled: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
            425: {
              slidesPerView: 3,
              spaceBetween: 1,
            },
            600: {
              slidesPerView: 3,
              spaceBetween: 1,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            850: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
          }}
          modules={[Autoplay, Navigation]}
        >
          
          <div
            ref={navigationNextRef}
            className="swiper-button-next select-none rounded-md shadow-md"
            style={{
              color: "white",
              backgroundColor: "white",
              marginRight: "3px",

              
            }}
          >
            <Image src={RigthArrow} height={10} width={10} alt="Snapshare" />
          </div>
          <div
            ref={navigationPrevRef}
            className="swiper-button-prev ml-1 select-none rounded-md text-white shadow-md"
            style={{
              color: "white",
            }}
          >
            <Image src={LeftArrow} alt="Snapshare" />
          </div>

          {getAllPost?.data?.data?.Posts?.map((item: any, idx: number) => {
            return (
              <SwiperSlide key={item?._id}>
               
                <div
                  className="relative mx-1  flex cursor-pointer justify-center"
                  onClick={() => {
                    router.push(`open-post?id=${item?._id}`);
                    setIsPostOpenLoading(true);
                  }}
                >
                  <Image
                    src={item?.media?.url}
                    style={{ borderRadius: "10px" }}
                    alt="feedImg"
                    
                    objectFit="cover"
                    unoptimized={true}
                    height={"124px"}
                    width={"140px"}
                  />
                </div>
                {/* </Link> */}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularFeed;
