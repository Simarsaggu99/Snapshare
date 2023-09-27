import { useAtom } from "jotai";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { isUserDetailsModel } from "../../../store/index";
import backgroundeImage from "~/images/loginImage.png";
import { useOnBoarding } from "@/hooks/auth/mutation";
import { useRouter } from "next/router";
import { CameraIcon } from "@/utils/AppIcons";
import { useUpdateCover, useUpdateProfile } from "@/hooks/user/mutation";
import dayjs from "dayjs";
import { formDetailInterface } from "@/types";
import { checkUserNameExist } from "@/services/user";
import Modal from "@/components/Modal";
import { notifyError } from "@/components/UIComponents/Notification";
import { useGetCountry } from "@/hooks/user/query";
import Spin from "@/components/UIComponents/Spin";
import { CgAsterisk } from "react-icons/cg";

interface userExistInterface {
  message: string;
  status: boolean;
}
const UserDetails = () => {
  const formValues = {
    user_handle: "",
    bio: "",
    gender: "",
    dob: "",
    country: "",
    city: "",
  };
  const [isModel, setIsModel] = useAtom(isUserDetailsModel);
  const [userFormDetails, setUserFormDetails] =
    useState<formDetailInterface>(formValues);
  const [profilePic, setProfilePic] = useState<any>();
  const [coverImage, setCoverImage] = useState<any>();
  const [userExist, setUserExist] = useState<userExistInterface>({
    message: "",
    status: false,
  });
  const [bioError, setBioError] = useState({
    message: "",
    status: false,
  });
  const [dobError, setDobError] = useState({
    message: "",
    status: false,
  });
  const [calculateAge, setcalculateAge] = useState<number>();

  const router = useRouter();
  const { token } = router.query;
  const updateProfile = useUpdateProfile();
  const updateCover = useUpdateCover();
  const getCountry: any = useGetCountry();

  useEffect(() => {
    setIsModel(true);
  }, []);
  const onboarding = useOnBoarding();

  const onHandleSubmit = async (e: any) => {
    e.preventDefault();
    let refferedId: any;
    if (typeof window !== "undefined") {
      refferedId = window.localStorage.getItem("reffereceId");
    }
    if (userFormDetails?.user_handle) {
      if (!mustHaveNum?.test(userFormDetails?.user_handle)) {
        return setUserExist({
          message: "Username must have one numeric value and one alphabet",
          status: true,
        });
      }

      if (
        userFormDetails?.user_handle?.length < 6 ||
        userFormDetails?.user_handle?.length > 23
      ) {
        return setUserExist({
          message: "Username must be between 6 and 23 characters",
          status: true,
        });
      }
      if (userFormDetails?.bio?.length > 300) {
        return setBioError({
          message: "Bio should be less than 300 charcters",
          status: true,
        });
      }
      if (calculateAge && calculateAge < 13) {
        return setUserExist({
          message: "",
          status: true,
        });
      }

      const body = {
        ...userFormDetails,
        date:
          userFormDetails?.dob !== ""
            ? dayjs(userFormDetails?.dob)?.toISOString()
            : undefined,
        refferId: refferedId,
      };
      if (body.dob && body.dob === "") {
        body.dob = undefined;
      }
      checkUserNameExist({
        user_handle: userFormDetails?.user_handle,
      })
        .then((res: any) => {
          if (res?.status === "true") {
            onboarding
              .mutateAsync({
                body: body,
                query: { Authorization: token },
              })
              .then((res: any) => {
                if (res?.message === "success") {
                  router.push(`/auth-verify?token=${res?.auth}`);
                }
              })
              .catch((err) => {
                notifyError({ message: "opps something went wrong " });
              });
          } else {
            setUserExist({
              message: "This user handle already taken ",
              status: true,
            });
          }
        })
        .catch((err: any) => {
          if (err?.status === "true") {
            onboarding
              .mutateAsync({
                body: body,
                query: { Authorization: token },
              })
              .then((res: any) => {
                if (res?.message === "success") {
                  router.push(`/auth-verify?token=${res?.auth}`);
                }
              });
          } else if (err?.response?.status === 400) {
            setUserExist({
              message: "This user hande alreay taken ",
              status: true,
            });
          } else {
            notifyError({ message: "opps something went wrong " });
          }
        });
    }
  };
  //Applying regex on form fields
  // let usernameReg = /^(?=[a-zA-Z0-9._]{20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  let mustHaveNum = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  let spaceRemove = /\s/g;
  let removespecialChar = /[`~!#$%^&*@()|+=?;:'",<>\{\}\[\]\\\/]/gi;
  const onChangeFields = (e: any) => {
    const { name, value } = e.target;

    if (name === "user_handle") {
      const finalVal = value?.replace(spaceRemove, "");
      const removespecial = finalVal?.replace(removespecialChar, "");
      if (!mustHaveNum?.test(finalVal)) {
      }
      setUserFormDetails({
        ...userFormDetails,
        [name]: removespecial,
      });
    } else {
      setUserFormDetails({
        ...userFormDetails,
        [name]: value,
      });
    }
  };

  console.log("efrg", userFormDetails);

  const onUploadProfile = (e: any) => {
    const file = e?.target?.files?.[0];

    const url = { url: URL.createObjectURL(file || "") };
    const contentData = Object.assign(file, url);
    setProfilePic(contentData || {});

    const data = contentData;

    const formData = new FormData();
    formData.append("file", contentData || {});

    updateProfile
      .mutateAsync({
        body: formData,
        query: { Authorization: token },
      })
      .then((res) => {});
  };
  const onUploadCover = (e: any) => {
    const file = e?.target?.files?.[0];

    const url = { url: URL.createObjectURL(file || "") };
    const contentData = Object.assign(file, url);
    setCoverImage(contentData || {});

    const data = contentData;

    const formData = new FormData();
    formData.append("file", contentData || {});

    updateCover
      .mutateAsync({
        body: formData,
        query: { Authorization: token },
      })
      .then((res) => {});
  };

  const username = (UserDetails: any) => {
    if (UserDetails)
      if (UserDetails.length < 6) {
        return "Enter user name can't be less than 6 or more than 32  characters";
      } else if (UserDetails.length > 23) {
        return "Enter user name can't be more than 23 characters";
      }
  };

  return (
    <div>
      <div>
        <Image
          layout="fill"
          objectFit="cover"
          src={backgroundeImage}
          alt="Image"
        />
      </div>

      <Modal
        isVisiable={isModel}
        onClose={setIsModel}
        isLoginModal={true}
        className=" h-[80%] w-[90%] sm:w-[70%] md:w-[50%] lg:h-[85%] lg:w-[40%] xl:w-[35%]"
      >
        <label htmlFor="cover_img">
          {coverImage?.url ? (
            <div className="relative h-48 w-full">
              <Image
                src={coverImage?.url}
                alt="cover image"
                // height={200}
                // width={600}
                // height={00}

                // width={250}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className=" relative h-48 bg-gray-200"></div>
          )}
          <label htmlFor="profile_img">
            {profilePic?.url ? (
              <div className="absolute top-[120px] left-10  rounded-full border-[6px]  border-white">
                <div className="relative">
                  <Image
                    src={profilePic?.url}
                    height={115}
                    width={115}
                    className="rounded-full"
                    alt="profile"
                    objectFit="cover"
                    // layout="fill"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="absolute top-[120px] left-10  h-32 w-32 rounded-full border-[6px] border-white bg-gray-200"></div>
              </div>
            )}
            <div className="absolute top-[205px] left-[120px] rounded-full bg-white py-2 px-2">
              <CameraIcon />
            </div>
          </label>

          <input
            onChange={(e) => {
              e.stopPropagation();
              onUploadProfile(e);
            }}
            id="profile_img"
            className="hidden"
            type="file"
            accept=".png,.jpg,.jpeg,.raw,.tiff"
          />
          <input
            className="hidden"
            id="cover_img"
            type="file"
            accept=".png,.jpg,.jpeg,.raw,.tiff"
            onChange={(e) => {
              e.stopPropagation();
              onUploadCover(e);
            }}
          />
          <div className="absolute top-36 right-0 mx-4 cursor-pointer rounded-md bg-white py-1 px-4">
            Edit cover photo
          </div>
        </label>

        <form action="">
          <div className="mx-10 mt-20">
            <div className="my-2">
              <p className="mb-1">
                User Name{" "}
                <span>
                  <CgAsterisk className="mt-0.5 text-red-500" />
                </span>
              </p>
              <input
                // required={true}
                type="text"
                value={userFormDetails.user_handle}
                onChange={(e) => {
                  onChangeFields(e);

                  setUserExist({ message: "", status: false });
                }}
                min={6}
                max={32}
                className="w-full rounded-[10px]"
                name="user_handle"
              />
              <p className="px-1 text-sm font-medium text-red-600">
                {/* {username(userFormDetails?.user_handle)} */}
                {userExist.status && userExist.message}
              </p>
              {/* <input
                    type="text"
                    onChange={(e) => {
                      onChangeFields(e);
                    }}
                    name="userName"
                    className="w-full rounded-[10px]"
                  /> */}
            </div>
            <div className="my-2">
              <p className="mb-1">Bio</p>
              <textarea
                name="bio"
                value={userFormDetails.bio}
                onChange={(e) => {
                  if (e.target.value.length > 300) {
                    setBioError({
                      message: "Bio should be less than 300 charcters",
                      status: true,
                    });
                  } else {
                    setBioError({
                      message: "",
                      status: false,
                    });
                  }
                  onChangeFields(e);
                }}
                className="w-full rounded-[10px]"
              />
              <p className="text-sm text-red-600">
                {/* {!bioError?.status && bioValidation(userFormDetails?.bio)} */}
                {bioError?.status && bioError?.message}
              </p>
            </div>
            <div className="my-2">
              <p className="mb-1">Gender</p>
              <select
                className="w-full rounded-[10px]"
                name="gender"
                id="cars"
                value={userFormDetails.gender}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setUserFormDetails({
                    ...userFormDetails,
                    [name]: value,
                  });
                }}
              >
                <option className="hidden">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="my-2">
              <p className="mb-1">D.O.B</p>
              <input
                type="date"
                max={dayjs().subtract(13, "year").format("YYYY-MM-DD")}
                value={userFormDetails.dob}
                onChange={(e: any) => {
                  const { name } = e.target;
                  // setUserFormDetails({
                  //   ...userFormDetails,
                  //   [name]: e.target.value,
                  // });

                  const validDob = dayjs()
                    .subtract(13, "year")
                    .format("YYYY-MM-DD");
                  if (validDob > e.target.value) {
                    setUserFormDetails({
                      ...userFormDetails,
                      [name]: e.target.value,
                    });
                    setDobError({
                      message: "",
                      status: false,
                    });
                  } else {
                    setDobError({
                      message: "Age should be greater than 13",
                      status: true,
                    });
                  }
                }}
                className="w-full rounded-[10px]"
                name="dob"
              />
              <p className="text-sm text-red-600">
                {dobError?.status && dobError?.message}
              </p>
            </div>
      
            {/* <div className="my-2">
              <Input
                type="text"
                value={userFormDetails.country}
                onchange={onChangeFields}
                className="w-full rounded-[10px]"
                name="country"
              />
            </div> */}
           

            <div className="mt-6 cursor-pointer">
              <button
                className="mb-8 w-full cursor-pointer rounded-[10px] bg-primary-600 py-2 text-lg text-white"
                onClick={(e) => {
                  e.preventDefault();
                  if (userFormDetails?.user_handle) {
                    onHandleSubmit(e);
                  } else {
                    setUserExist({
                      message: "User handle is required",
                      status: true,
                    });
                  }
                }}
              >
                {updateProfile?.isLoading ? <Spin /> : <p> Submit</p>}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserDetails;
