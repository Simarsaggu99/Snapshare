import React from "react";

const Spin = ({ dotSize, color, size }: any) => {
  let bgColor = color ? color : "primary-700";
  return (
    <div className="my-auto flex items-center justify-center ">
      <div
        className={`ant-spin ant-spin-lg ant-spin-spinning  ${
          size ? size : "h-[32px] w-[32px]"
        } `}
      >
        <span className="ant-spin-dot ant-spin-dot-spin">
          <i
            className={`ant-spin-dot-item bg-${bgColor} ${
              dotSize ? dotSize : "h-[14px] w-[14px]"
            }`}
          ></i>
          <i
            className={`ant-spin-dot-item bg-${bgColor} ${
              dotSize ? dotSize : "h-[14px] w-[14px]"
            }`}
          ></i>
          <i
            className={`ant-spin-dot-item bg-${bgColor} ${
              dotSize ? dotSize : "h-[14px] w-[14px]"
            }`}
          ></i>
          <i
            className={`ant-spin-dot-item bg-${bgColor} ${
              dotSize ? dotSize : "h-[14px] w-[14px]"
            }`}
          ></i>
        </span>
      </div>
    </div>
  );
};

export default Spin;
