import { FC } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { globalSearch, tagSearchLoading } from "@/store";
import { useRouter } from "next/router";
export type Tagprops = {
  id?: number;
  username?: any;

  useremail?: any;
  userprofile?: any;
  link?: any;
  hastag?: any;
  address?: any;
};

const Tags: FC<Tagprops> = ({ hastag }) => {
  // const [search, setSearch] = useAtom(globalS  earch);
  const [, setLoading] = useAtom(tagSearchLoading);
  const router = useRouter();
  return (
    <div>
      <div className=" flex flex-wrap gap-2 ">
        <li className=" w-content cursor-pointer list-none ">
          <button
            className="border-slate rounded-full border-2   bg-[#DCDDE2] px-3 py-1 text-[14px]  font-[500]	 text-[#858585]"
            onClick={() => {
              // setLoading(true);
              // router.push(`/search?tab=all&&search_query=${hastag}`);
            }}
          >
            <p className="">#{hastag}</p>
          </button>
        </li>
      </div>
    </div>
  );
};

export default Tags;
