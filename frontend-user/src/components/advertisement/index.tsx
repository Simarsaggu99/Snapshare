import React, { useEffect } from "react";
import Image from "next/image";
// import advertisement from "../../public/images/notification.jpeg";
import advertisement from "~/images/advertisement.png";

const Advertisement = ({ isProfileOpen }: any) => {
  return (
    <div
      className={`right-50 ${
        isProfileOpen ? "static" : "fixed mx-2 w-[25%] 2xl:w-[20%]"
      } `}
    >
      <div
        className="roudned-lg overflow-hidden bg-white px-4 py-3 shadow-md "
        style={{ borderRadius: "10px" }}
      >
        <div className="relative mt-5 flex h-[300px] w-[100%] justify-center">
          Ad
          {/* <Image
            src={advertisement}
            style={{ borderRadius: "10px" }}
            alt="advertisement"
            height={300}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
