import React from "react";
import Image from "next/image";
import userProfile from "~/images/userProfile.png";

const CommentsideCard = () => {
  const data = [
    {
      id: 1,
      name: "Nimisha Tiwari",
      name2: "and 5 other friends like your photo",
      count: 1,
      img: { userProfile },
      time: "2hrs ago",
    },
    {
      id: 2,
      name: "Nimisha Tiwari",
      name2: "and 5 other friends like your photo",
      count: 1,
      img: { userProfile },
      time: "2hrs ago",
    },
    {
      id: 3,
      name: "Nimisha Tiwari",
      name2: "and 5 other friends like your photo",
      count: 1,
      img: { userProfile },
      time: "2hrs ago",
    },
  ];
  return (
    <div className="align-center flex justify-between ">
      <div className="mt-5 mr-16 overflow-hidden rounded-[10px] bg-white px-4 py-2 pt-2.5 shadow-md  ">
        {data?.map((item, idx) => (
          <div
            className="flex  justify-between border-b p-4 px-3  text-base text-gray-700"
            key={idx}
          >
            <div className="relative h-10 w-10 rounded-full p-3">
              <Image
                src={userProfile}

                alt={"img"}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="pt-2 text-center text-sm">
              <p className="pl-3 text-left leading-none text-gray-900">
                <span className="font-bold">{item.name} </span>
              </p>
              <p className="pl-3 text-left leading-none text-gray-900">
                <span className="font-bold">{item.name} </span>
              </p>

              <p className="text-left text-primary-600">{item.time}</p>
              <div className="px-6 pt-2 pb-2">
                <button>
                  <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                    Nature
                  </span>
                </button>
                <button>
                  <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                    Travel
                  </span>
                </button>
                <button>
                  {" "}
                  <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                    Summer
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsideCard;
