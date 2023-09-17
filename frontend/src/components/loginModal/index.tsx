import React from "react";
import Image from "next/image";
import logoImage from "~/images/logo.png";
import googleImage from "~/images/google.png";
import facebook from "~/images/facebook.png";

import { hostname } from "@/utils/apiUtils";
import { useAtom } from "jotai";
import { isLoginModal } from "@/store";
import Modal from "../Modal";
import { useRouter } from "next/router";
import memesakeLogo from "~/images/logo_text.png";
import smallLogo from "~/images/logo_icon.png";

const LoginModal = () => {
  const router = useRouter();
  const [isModel, setIsModel] = useAtom(isLoginModal);

  return (
    <div>
      <div>
        {/* {isModel && (
          <div className="backdrop-blur-xs fixed top-0 left-0  z-40 h-screen  w-full overflow-hidden bg-black/60">
            <div className="sticky left-0 right-0 top-[10%] mx-auto  mt-20 h-[80%] rounded-lg border border-black  bg-[#2D2525] sm:top-[29%]  sm:h-[48%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[24%]"> */}
        <Modal
          isVisiable={isModel}
          onClose={setIsModel}
          className="top-[25%] w-[95%] pb-10 sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[24%] "
          loginModal={true}
          zIndex={1000}
        >
          <div className="flex justify-end">
            <button
              onClick={() => {
                setIsModel(false);
              }}
              className="mt-1"
            >
              <svg
                height={"42px"}
                width={"42px"}
                xmlns="http://www.w3.org/2000/svg"
                fill="#FFFFFF"
                viewBox="0 0 320 512"
                className="mx-2 mt-2 rounded-md bg-[#3A2D2D] py-2 px-2 text-sm"
              >
                <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
              </svg>
            </button>
          </div>
          <div>
            <div className=" text-center text-2xl font-medium text-white">
              <p>Welcome to</p>
            </div>
            <div className="flex justify-center text-white text-2xl font-semibold">
              Snapshare
            </div>
            {/* <div className="my-8 mt-3 flex justify-center">
              Snapshare
            </div> */}
            <div className="mx-6">
              <div className="border-3 mx-atuo my-5   rounded-md  border  text-lg text-white">
                <button
                  className="flex w-full justify-center"
                  // onClick={() => {
                  //   // setUserModal(true);
                  //   setGoogleLoginState(true);
                  // }}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!router.query.userId) {
                      window.localStorage.setItem("currentPath", router.asPath);
                    }
                    await new Promise((resolve, reject) => {
                      resolve(
                        window.location.assign(`${hostname()}/api/auth/google`)
                        // axios.get(
                        // "https://api-test.memesake.managemyorg.com/api/auth/google"
                        // )
                      );
                    }).then(() => {});

                    // setIsModel(false);

                    // googleLogin();
                  }}
                >
                  <div className="mt-2 flex   pr-4 ">
                    <div className="mr-4">
                      <Image
                        src={googleImage}
                        alt="google"
                        width={25}
                        height={23}
                      />
                    </div>
                    <p className="text-base font-medium">
                      Continue with Google
                    </p>
                  </div>
                </button>

                {/* <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    axios
                      .get(`${hostname()}/api/auth/google`)
                      .then((res) => {
                        console.log("res", res);
                      })
                      .catch((err) => {
                        console.log("errrrrrrrrrrrrrrr", err);
                      });
                    // router.push(
                    //   `/auth-verify?token=${credentialResponse?.credential}`
                    // );
                    console.log(credentialResponse);
                    // await axios.get(`${hostname()}/api/auth/google`);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                /> */}
              </div>

              {/* <div className="my-2 flex justify-center rounded-md border  text-lg text-white">
                <button
                  className="flex items-center justify-center"
                  // onClick={async (e) => {
                  //   e.preventDefault();
                  //   if (!router.query.userId) {
                  //     window.localStorage.setItem("currentPath", router.asPath);
                  //   }
                  //   await new Promise((resolve, reject) => {
                  //     resolve(
                  //       window.location.assign(
                  //         `${hostname()}/api/auth/facebook`
                  //       )
                  //       // axios.get(
                  //       // "https://api-test.memesake.managemyorg.com/api/auth/google"
                  //       // )
                  //     );
                  //   }).then(() => {});
                  // }}
                >
                  <div className="mt-2 pr-4">
                    <Image
                      src={facebook}
                      alt="facebook"
                      width={25}
                      height={23}
                    />
                  </div>
                  <p className="text-base font-medium">
                    Continue with Facebook
                  </p>
                </button>
              </div> */}
            </div>
            <div className="mt-7 px-8  text-xs text-white">
              <p>
                By continuing you indicate that you agree to Memesake&apos;s{" "}
                <span
                  onClick={() => {
                    router.push("/help-center?tab=terms_and_conditions");
                    setIsModel(false);
                  }}
                  className="cursor-pointer font-medium text-primary-400"
                >
                  Terms and conditions{" "}
                </span>{" "}
                and{" "}
                <span
                  onClick={() => {
                    router.push("/help-center?tab=privacy_policy");
                    setIsModel(false);
                  }}
                  className="cursor-pointer font-medium text-primary-400"
                >
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
          {/*
            </div>
          </div>
        )} */}
        </Modal>
      </div>
    </div>
  );
};

export default LoginModal;
