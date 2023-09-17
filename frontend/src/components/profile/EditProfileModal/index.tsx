import Modal from "@/components/Modal";
import { useUpdateCover, useUpdateUserDetails } from "@/hooks/user/mutation";
import { currentUserDataState, loggedInUser } from "@/store";
import { formDetailInterface } from "@/types";
import { CameraIcon, CrossIcon } from "@/utils/AppIcons";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGetCountry } from "@/hooks/user/query";
import Spin from "@/components/UIComponents/Spin";
import { checkUserNameExist } from "@/services/user";
import { CgAsterisk } from "react-icons/cg";
import { currentUser as getCurrentUser } from "@/services/user/index";

interface modalProps {
  isUserModal: boolean;
  setIsUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  getSingleUser: any;
  profilePic: any;
  onUploadProfile: (e: any) => void;
  getPosts: any;
}
interface modal {
  modalProps: modalProps;
}

const EditProfileModal = ({
  modalProps: {
    setIsUserModal,
    isUserModal,
    getSingleUser,
    profilePic,
    onUploadProfile,
    getPosts,
  },
}: modal) => {
  const formValues = {
    user_handle: "",
    bio: "",
    gender: "male",
    dob: "",
    country: "Australia",
    city: "",
  };
  const [userFormDetails, setUserFormDetails] =
    useState<formDetailInterface>(formValues);
  const [calculateAge, setcalculateAge] = useState<number>();

  const updateUserDetails = useUpdateUserDetails();
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [userNameError, setUserNameError] = useState({
    message: "",
    status: false,
  });
  const [bioError, setBioError] = useState({
    message: "",
    status: false,
  });
  const [coverImage, setCoverImage] = useState<any>();
  const updateCover = useUpdateCover();
  const getCountry: any = useGetCountry();

  const router = useRouter();
  const userId = router.query.id;
  let mustHaveNum = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  let spaceRemove = /\s/g;
  let removespecialChar = /[`~!#$%^&*@()|+=?;:'",<>\{\}\[\]\\\/]/gi;

  const regexp = /^\S*$/;
  const onUploadCover = (e: any) => {
    const file = e.target.files[0];
    let url;
    if (e.target.files[0]) {
      url = { url: URL.createObjectURL(file || "") };
      const contentData = Object.assign(file, url);
      setCoverImage(contentData || {});
      const formData = new FormData();
      formData.append("file", contentData || {});
      updateCover
        .mutateAsync({
          body: formData,
        })
        .then((res) => {});
    }
  };
  const onHandleSubmit = (e: any) => {
    e.preventDefault();
    if (userFormDetails?.bio?.length > 300) {
      return setBioError({
        message: "Bio should be less than 300 charcters",
        status: true,
      });
    }
    if (userFormDetails?.user_handle) {
      if (!mustHaveNum?.test(userFormDetails?.user_handle)) {
        return setUserNameError({
          message: "Username must have one numeric value and one alphabet",
          status: true,
        });
      }
      if (
        userFormDetails?.user_handle?.length < 6 ||
        userFormDetails?.user_handle?.length > 23
      ) {
        return setUserNameError({
          message: "Username must be between 6 to 23 characters",
          status: true,
        });
      }
      if (calculateAge && calculateAge < 13) {
        return setUserNameError({
          message: " ",
          status: true,
        });
      }
      setUserNameError({ message: "", status: false });
      const body = {
        ...userFormDetails,
        dob:
          userFormDetails?.dob !== ""
            ? userFormDetails?.dob
              ? dayjs(userFormDetails?.dob)?.toISOString()
              : ""
            : "",
      };

      updateUserDetails
        .mutateAsync({
          body: body,
        })
        .then((res: any) => {
          if (res?.success) {
            setIsUserModal(false);

            getCurrentUser()
              .then((response: any) => {
                setCurrentUser(response);
                window.localStorage.setItem(
                  "currentUser",
                  JSON.stringify(response?.data)
                );
              })
              .catch((err) => {
                if (err?.response?.data?.error?.message?.includes("expired")) {
                  window.localStorage.clear();
                }
              });
            getPosts.refetch();
            getSingleUser.refetch();
            // setTimeout(() => {
            //   if (typeof window !== "undefined") {
            //     window.location.reload();
            //   }
            // }, 700);
          }
        });
    }
  };
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

  useEffect(() => {
    setUserFormDetails({
      user_handle: currentUser?.data?.user_handle,
      bio: currentUser?.data?.bio,
      gender: currentUser?.data?.gender,
      dob:
        currentUser?.data?.dob !== ""
          ? dayjs(currentUser?.data?.dob).format("YYYY-MM-DD")
          : "",
      country: currentUser?.data?.country,
      city: currentUser?.data?.city,
    });
    setCoverImage({
      url:
        currentUser?.data?._id === userId ? currentUser?.data?.cover_url : "",
    });
  }, [currentUser, userId]);

  const username = (UserDetails: any) => {
    if (UserDetails)
      if (UserDetails.length < 6) {
        return "Enter user name can't be less than 6 or more than 23  characters";
      } else if (UserDetails.length > 23) {
        return "Enter user name can't be more than 23 characters";
      }
  };

  return (
    <div>
      <Modal
        isVisiable={isUserModal}
        onClose={setIsUserModal}
        className=" h-[80%] w-[90%] sm:w-[70%] md:w-[50%] lg:h-[85%] lg:w-[40%] xl:w-[35%]"
      >
        <label htmlFor="modal_cover_img">
          {coverImage?.url ? (
            <div className="relative h-48 w-[100%]">
              <Image
                src={coverImage?.url}
                alt="cover image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className=" relative h-48 bg-gray-200"></div>
          )}

          <button
            onClick={() => setIsUserModal(false)}
            className="absolute top-2 right-2 rounded bg-gray-300 p-1 "
          >
            <CrossIcon />
          </button>

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
            <div className="absolute top-[205px] left-[120px] cursor-pointer rounded-full bg-white py-2 px-2">
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
            id="modal_cover_img"
            type="file"
            accept=".png,.jpg,.jpeg,.raw,.tiff"
            onChange={(e) => {
              e.stopPropagation();
              onUploadCover(e);
            }}
          />

          <div className="absolute  top-36 right-0 mx-4  cursor-pointer rounded-md bg-white py-1 px-4 ">
            <p className="hidden xs:block"> Edit cover photo</p>
            <div className="block py-2 xs:hidden">
              <CameraIcon />
            </div>
          </div>
        </label>
        <form action="">
          <div className="mx-10 mt-20">
            <div className="my-3">
              <p className="mb-1.5 flex">
                User Name{" "}
                <span>
                  <CgAsterisk className="mt-0.5 text-red-500" />
                </span>
              </p>
              <input
                required={true}
                pattern="/^\S*$/;"
                type="text"
                onChange={(e: any) => {
                  setUserNameError({ message: "", status: false });
                  onChangeFields(e);

                  if (e.target.value === "") {
                    setUserNameError({
                      message: "",
                      status: false,
                    });
                  } else if (
                    currentUser?.data?.user_handle === e.target.value
                  ) {
                    setUserNameError({
                      message: "",
                      status: false,
                    });
                  } else {
                    checkUserNameExist({
                      user_handle: e.target.value,
                    })
                      .then((res: any) => {})
                      .catch((err: any) => {
                        setUserNameError({
                          message: "This user handle is already taken ",
                          status: true,
                        });
                      });
                  }
                }}
                className="w-full rounded-[10px] border border-gray-300"
                name="user_handle"
                value={userFormDetails?.user_handle}
              />
              <p className="text-sm text-red-600">
                {/* {username(userFormDetails?.user_handle)} */}
                {userNameError?.status && userNameError?.message}
              </p>
            </div>
            <div className="my-3">
              <p className="mb-1.5">Bio</p>
              <textarea
                value={userFormDetails?.bio}
                name="bio"
                placeholder="I'm here for the sake of memes"
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
                className="w-full rounded-[10px] border border-gray-300"
              />
              <p className="text-sm text-red-600">
                {/* {!bioError?.status && bioValidation(userFormDetails?.bio)} */}
                {bioError?.status && bioError?.message}
              </p>
            </div>
            <div className="my-3">
              <p className="mb-1.5">Gender</p>
              <select
                className="w-full rounded-[10px] border border-gray-300"
                name="gender"
                id="cars"
                value={userFormDetails?.gender}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setUserFormDetails({
                    ...userFormDetails,
                    [name]: value,
                  });
                }}
              >
                <option className="hidden">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="my-3">
              <p className="mb-1.5">D.O.B</p>

              <input
                value={userFormDetails?.dob}
                type="date"
                max={dayjs().subtract(13, "year").format("YYYY-MM-DD")}
                onChange={(e: any) => {
                  const { name, value } = e.target;
                  setUserFormDetails({
                    ...userFormDetails,
                    [name]: value,
                  });

                  if (value) {
                    let dateOfBirth = value;
                    let dt = new Date();
                    let diff = dt.getTime() - new Date(dateOfBirth).getTime();
                    let calculation = Math.floor(
                      diff / (1000 * 60 * 60 * 24 * 365.25)
                    );
                    setcalculateAge(calculation);
                  }
                }}
                className="w-full rounded-[10px] border border-gray-300"
                name="dob"
              />

              <p className="text-sm text-red-600">
                {userFormDetails
                  ? calculateAge &&
                    calculateAge < 13 &&
                    "User age must be  13 year for this application"
                  : null}
              </p>
            </div>
         

            <div className="my-6">
              <button
                type="submit"
                onClick={(e) => {
                  if (!updateUserDetails.isLoading)
                    if (userFormDetails?.user_handle) {
                      onHandleSubmit(e);
                    } else {
                    }
                }}
                className="w-full rounded-[10px]  bg-primary-600 py-2 text-xl text-white"
              >
                {updateUserDetails.isLoading ? (
                  <div className="">
                    <Spin color="white" size={2} />
                  </div>
                ) : (
                  <p>Submit</p>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditProfileModal;
