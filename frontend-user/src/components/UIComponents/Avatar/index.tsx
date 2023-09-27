import { getFirstLetter } from "@/utils/common";
import React from "react";

const Avatar = ({ name }: any) => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
      {getFirstLetter(name)}
    </div>
    //     <div className="mt-5 flex justify-center">
    //     {data?.avatar_url ? (
    //       <Image
    //         src={data?.avatar_url}
    //         height={height}
    //         width={width}
    //         className="rounded-full"
    //         objectFit="cover"
    //         alt="profile"
    //       />
    //     ) : (
    //       <div
    //         className={`flex h-[${height}px] h-full w-[${width}px] w-full items-center justify-center rounded-full bg-gray-300 text-white`}
    //       >
    //         {getInitials(data?.name)}
    //       </div>
    //     )}
    //   </div>
  );
};

export default Avatar;
