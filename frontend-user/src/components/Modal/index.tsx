import { AppProps } from "next/app";
import React, { useEffect } from "react";

const Modal = ({
  children,
  isVisiable,
  onClose,
  width,
  className,
  isLoginModal,
  loginModal,
  zIndex,
}: any) => {
  
  useEffect(() => {
    const close = (e: any) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  useEffect(() => {
    if (isVisiable) {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "unset";
      }
    }
  }, [isVisiable]);
  return (
    <div>
      {isVisiable && (
        <div className="flex justify-center">
          <div
            onClick={(e) => {
              !isLoginModal && e.stopPropagation();
              !isLoginModal && e.preventDefault();
              !isLoginModal && onClose(false);
            }}
            className={`modal backdrop-blur-xs flex justify-center bg-black/60 ${
              isVisiable ? "scale-100 opacity-100 " : "scale-0 opacity-0"
            }`}
          >
            {/* <div className=" w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%]"> */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ width: width, zIndex: zIndex || 1000 }}
              className={`content ${className && className} ${
                loginModal ? "bg-[#3A2D2D]" : "top-[10%] bg-white"
              }`}
            >
              <div className="top">{children}</div>
            </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
