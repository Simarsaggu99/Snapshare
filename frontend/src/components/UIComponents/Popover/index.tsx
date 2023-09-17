import React, { FC, useEffect, useRef, useState } from "react";
type popoverProps = {
  children: any;
  isVisible: boolean | string;
  userRef: React.MutableRefObject<any>;
  onclose: React.Dispatch<React.SetStateAction<boolean | any>>;
  className?: string;
  postAction?: boolean;
};

const Popover: FC<popoverProps> = ({
  children,
  isVisible,
  onclose,
  userRef,
  className,
}) => {
  const userCardRef = useRef<any>(null);
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      if (
        isVisible &&
        userCardRef.current &&
        !userCardRef.current.contains(e.target) &&
        !userRef?.current?.contains(e.target)
      ) {
        onclose(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isVisible]);
  return (
    <div className={`relative   ${className}`}>
      {isVisible ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          ref={userCardRef}
          style={{ boxShadow: " 0px 5px 20px rgba(0, 0, 0, 0.25)" }}
          className={` absolute top-3 right-0 w-max  rounded-md  bg-white  ${className}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Popover;
