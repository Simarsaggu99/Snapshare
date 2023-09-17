import Image from "next/image";
import { Router, useRouter } from "next/router";
import React, { useEffect } from "react";

const AuthVerify = () => {
  const router: any = useRouter();

  const token = router.query.token;
  useEffect(() => {
    window.localStorage.setItem(
      "authorization",
      `Bearer ${router.query.token}`
    );
    if (token) {
      const currentPath = window.localStorage.getItem("currentPath");
      if (currentPath) {
        window.location.replace(currentPath);
      } else {
        router.push("/");
      }
      window.localStorage.removeItem("currentPath");
    }
  }, [token]);


  return (
    <div>
      <div className="item-center flex h-[93.3vh] justify-center bg-gray-200  pt-[20rem]">
        <div className="">
          <div className="animate-bounce">
          Snapshare
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthVerify;
