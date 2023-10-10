import React from "react";
import Tags from "./Tags";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import Link from "next/link";
import { useAtom } from "jotai";
import { tagSearchLoading } from "@/store";
import { useRouter } from "next/router";

interface tagInterface {
  _id: string;
  count: number;
}
interface tagsInterface {
  tags: tagInterface[];
}
interface allTagInterface {
  getTags: tagsInterface;
  tagPage: boolean;
}
const Tag = ({ getTags, tagPage }: allTagInterface) => {
  const [, setLoading] = useAtom(tagSearchLoading);
  const router = useRouter();
  let sortedTags: string[] = [];
  let sorted: string[] = [];
  if (!tagPage) {
    sortedTags = getTags?.tags.map((item) => {
      return item?._id;
    });
    sorted = sortedTags;
  } else {
    sortedTags = getTags?.tags
      .map((item) => {
        return item?._id;
      })
      .sort();
    if (sortedTags) {
      sorted = sortedTags?.sort((a, b) => {
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      });
    }
  }
  return (
    <div
      className="w-full"
      // className={`mt-2.5 flex  w-full  gap-2 ${
      //   !tagPage
      //     ? "h-14 overflow-x-auto md:h-full md:flex-wrap md:overflow-hidden"
      //     : "h-full flex-wrap overflow-hidden"
      // } `}
    >
      {sorted?.length ? (
        <div>
          <div
            className={`mt-2.5 flex  w-full  gap-2 ${
              !tagPage
                ? "hidden h-full md:flex  md:flex-wrap"
                : "h-full flex-wrap overflow-hidden"
            } `}
          >
            {sorted?.map((item, index: number) => (
              <>
                <Tags hastag={item} key={item} />
              </>
            ))}
          </div>
          <div className={` ${!tagPage ? "block" : "hidden"}  block md:hidden`}>
            <Swiper
              style={{
                width: "100%",
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              // loop={true}
              // grabCursor={true}
              // keyboard={{
              //   enabled: true,
              // }}
              modules={[Autoplay]}
              // slidesPerView={"auto"}
              // centeredSlides={true}
              spaceBetween={10}
              slidesPerView={"auto"}
              // centeredSlides={true}
              // spaceBetween={30}
              className="mySwiper"
            >
              <div
                className={`mt-2.5  w-full  gap-2  overflow-hidden ${
                  !tagPage ? "block" : "hidden"
                } `}
              >
                {sorted?.map((item, index: number) => (
                 
                    <SwiperSlide
                    key={item}
                      style={{
                        width: "auto",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("this is swiper slider and ");
                      }}
                    >
                      <button
                        className="border-slate rounded-full border-2 bg-[#DCDDE2] px-3 py-1 text-[14px]  font-[500]	 text-[#858585]"
                        onClick={() => {
                         
                        }}
                      >
                        <p className="">#{item}</p>
                      </button>
                    </SwiperSlide>
                 
                ))}
                {sortedTags?.length > 0 && (
                  
                    <SwiperSlide
                      style={{
                        width: "auto",
                      }}
                    >
                      <div className="mt-1  md:flex">
                       
                          <p className="items-center pr-4 text-center text-[16px] text-[#FF5E34]  ">
                            See all tags
                          </p>
                    
                      </div>
                    </SwiperSlide>
              
                )}
              </div>
            </Swiper>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
          }}
          className=" mx-auto flex w-full items-center justify-center py-2 text-center text-base font-medium text-primary-600 md:ml-0 md:mt-5 md:text-lg"
        >
          No tags found yet
        </div>
      )}
    </div>
    // <div>
    //   <div className="hidden sm:flex">
    //     <div
    //       className={`mt-2.5 flex  w-full  gap-2 ${
    //         !tagPage
    //           ? "h-14 overflow-x-auto md:h-full md:flex-wrap md:overflow-hidden"
    //           : "h-full flex-wrap overflow-hidden"
    //       } `}
    //     >
    //       {sorted?.length ? (
    //         sorted?.map((item, index: number) => (
    //           <>
    //             <Tags hastag={item} key={item} />
    //           </>
    //         ))
    //       ) : (
    //         <div className=" mx-auto mt-5 flex justify-center pb-4 text-center text-xl font-medium text-primary-600">
    //           No data found yet
    //         </div>
    //       )}
    //     </div>
    //   </div>
    //   <div className="block sm:hidden">
    //     <Swiper
    //       style={{
    //         width: "100%",
    //       }}
    //       autoplay={{
    //         delay: 2500,
    //         disableOnInteraction: false,
    //       }}
    //       loop={true}
    //       grabCursor={true}
    //       keyboard={{
    //         enabled: true,
    //       }}
    //       modules={[Autoplay, Navigation]}
    //       // slidesPerView={"auto"}
    //       centeredSlides={true}
    //       spaceBetween={30}
    //     >
    //       <div
    //         className={`mt-2.5 flex  w-fit  gap-2 ${
    //           !tagPage
    //             ? "h-14 overflow-x-auto md:h-full md:flex-wrap md:overflow-hidden"
    //             : "h-full flex-wrap overflow-hidden"
    //         } `}
    //       >
    //         {sorted?.length ? (
    //           sorted?.map((item, index: number) => (
    //             <>
    //               <SwiperSlide
    //                 className="mySwiper-slide"
    //                 style={{
    //                   width: "fit-content",
    //                 }}
    //               >
    //                 <Tags hastag={item} key={item} />
    //               </SwiperSlide>
    //             </>
    //           ))
    //         ) : (
    //           <div className=" mx-auto mt-5 flex justify-center pb-4 text-center text-xl font-medium text-primary-600">
    //             No data found yet
    //           </div>
    //         )}
    //       </div>
    //     </Swiper>
    //   </div>
    // </div>
  );
};

export default Tag;
export function getRandomArbitrary(min: any, max: any) {
  return Math.random() * (max - min) + min;
}
