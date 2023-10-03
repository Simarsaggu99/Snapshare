import { getFirstLetter } from "@/utils/common";
import React from "react";

const Avatar = ({ name }: any) => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
      {getFirstLetter(name)}
    </div>
    
  );
};

export default Avatar;
