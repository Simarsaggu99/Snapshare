import Tag from "@/components/Tag/components/Tag";
import { useGetAllTags, useGetTags } from "@/hooks/user/query";
import { getTags } from "@/services/post";
import React from "react";
const Tags = () => {
  const { data: getTags }: any = useGetAllTags({});

  return (
    <div className="mt-20 xxxs:px-2 md:px-10 lg:px-44 ">
      <div className=" overflow-hidden  rounded-lg bg-[#fff] p-1.5 pb-3 shadow-md   ">
        <div className="items-center rounded-lg bg-[#FFCFC2]  py-2 px-2  text-center text-lg	 font-medium text-[#FF5E34] ">
          Tags
        </div>

        <Tag getTags={getTags} tagPage={true} />
      </div>
    </div>
  );
};

export default Tags;
