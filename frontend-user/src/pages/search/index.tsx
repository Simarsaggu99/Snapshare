import Advertisement from "@/components/advertisement";
import SearchData from "@/components/searchData";
import SearchPageSeo from "@/components/searchPageSep";
import Sidebar from "@/components/Tag/components/Sidebar";
import { globalSearch } from "@/store";
import { useAtom } from "jotai";
import React from "react";

const Search = () => {
  const [searchInput, setSearchInput] = useAtom(globalSearch);
  return (
    <div>
      <SearchPageSeo searchInput={searchInput} />
      <div>
        <div className=" relative   h-[100%] gap-4 text-black lg:grid lg:grid-cols-3  ">
          <div className="hidden justify-center  px-2 xs:flex md:px-0 lg:mr-7  lg:justify-end">
            <Sidebar search={true} />
          </div>
          <div className="searchData mt-8">
            <SearchData />
          </div>
          <div className="mt-8 ml-8 hidden lg:block">
            <Advertisement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
