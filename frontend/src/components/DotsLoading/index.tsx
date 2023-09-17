import React from "react";

const DotsLoading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="absolute top-[50%] mx-auto my-auto ml-14">
        <div
          className="wrapperGlobal"
          // style={{
          //   flexDirection: "row",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   alignContent: "center",
          // }}
        >
          <span className="circle circle-1"></span>
          <span className="circle circle-2"></span>
          <span className="circle circle-3"></span>
          <span className="circle circle-4"></span>
        </div>
      </div>
    </div>
  );
};

export default DotsLoading;
