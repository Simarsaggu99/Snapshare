import Popover from "@/components/UIComponents/Popover";
import { useDeleteProfile, useUpdateCover } from "@/hooks/user/mutation";
import { loggedInUser } from "@/store";
import { CameraIcon, EditCoverPhoto } from "@/utils/AppIcons";
import { useAtom } from "jotai";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import logo from "~/images/logo.png";
import getCroppedImg from "@/components/addPost/imageCrop";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { UseMutationResult } from "@tanstack/react-query";
interface coverImageInterface {
  getSingleUser: any;
  coverImage: any;
  openCover: React.MutableRefObject<any>;
  deleteCover: UseMutationResult<unknown, unknown, void, unknown>;
  setCoverImage: React.Dispatch<any>;
}

interface coverImagePropsInterface {

  coverImageProps: coverImageInterface;
}
const CoverImage = ({

  coverImageProps: {
    getSingleUser,
    coverImage,
    openCover,
    deleteCover,
    setCoverImage,
  },
}: coverImagePropsInterface) => {
  const [isEditCoverPhoto, setIsEditCoverPhoto] = useState(false);
  const editCoverRef = React.useRef<HTMLButtonElement>(null);
  const [currentUser] = useAtom(loggedInUser);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [upImg, setUpImg] = useState<any>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const updateCover = useUpdateCover();
  const onUploadCover = (e: any) => {
    setUpImg(undefined);
    const file = e;
    let url;
    if (e) {
      url = { url: URL.createObjectURL(file || "") };
      const contentData = Object.assign(file, url);
      setCoverImage(contentData || {});

      const data = contentData;

      const formData = new FormData();
      formData.append("file", contentData || {});

      updateCover
        .mutateAsync({
          body: formData,
        })
        .then((res) => {});
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(upImg, croppedAreaPixels);

      let file = await fetch(croppedImage)
        .then((r) => r.blob())
        .then(
          (blobFile) =>
            new File([blobFile], coverImage?.name, { type: "image/png" })
        );
      
      const newFile = await onUploadCover(file);

      return newFile;
    } catch (e) {
      
    }
  }, [croppedAreaPixels]);
  return (
    <div className="relative top-0 h-[125px] w-[100%] bg-black xxs:h-[170px] xs:h-[200px] sm:h-[250px] md:mx-auto  md:h-[300px] md:w-[90%] lg:h-[250px] xl:h-[400px]">
      {!getSingleUser?.data?.data?.isblocked &&
      (getSingleUser?.data?.data?.cover_url || coverImage?.url) ? (
        <div className="h-full w-full">
          {/* this is part is used for when image is upload */}
          {upImg ? (
            <div
              className="h-full w-full"
              
            >
              <div className="cover-crop-container  h-full">
                <Cropper
                  image={upImg}
                  crop={crop}
                  zoom={zoom}
                  aspect={5 / 1.2}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className=" absolute right-2 bottom-2 z-20 cursor-pointer rounded-md bg-white ">
                <button
                  onClick={() => {
                    showCroppedImage();
                  }}
                  className="px-2 py-1"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    showCroppedImage();
                  }}
                  className="px-2 py-1"
                >
                  done
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <Image
                src={coverImage?.url || getSingleUser?.data?.data?.cover_url}
                alt="cover image"
                layout="fill"
                objectFit="cover"
                className=" rounded-b-md"
              />
              {currentUser?.data?._id === getSingleUser?.data?.data?._id && (
                <div className="">
                  <div
                    onClick={() => setIsEditCoverPhoto(true)}
                    className="absolute bottom-2 right-2 hidden cursor-pointer rounded-md bg-white md:block  "
                  >
                    <EditCoverPhoto />

                    <Popover
                      userRef={editCoverRef}
                      isVisible={isEditCoverPhoto}
                      onclose={setIsEditCoverPhoto}
                     
                    >
                      <div className="p-4 text-lg">
                        <label htmlFor="cover_img">
                          <button
                            onClick={() => {
                              console.log("eee");
                              openCover.current?.click();
                            }}
                          >
                            Edit
                          </button>
                        </label>
                        <div>
                          <button
                            onClick={() => {
                              deleteCover.mutateAsync().then(() => {
                                setIsEditCoverPhoto(false);
                                setCoverImage("");
                                getSingleUser.refetch();
                              });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Popover>
                  </div>
                  {/* )} */}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className="h-full w-full"
         
        >
          {/* this is a part where image is not update yet */}
          {upImg ? (
            <div>
              <div className="cover-crop-container">
                <Cropper
                  image={upImg}
                  crop={crop}
                  zoom={zoom}
                  aspect={5 / 2}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />

              </div>
            </div>
          ) : (
            <div
              className="flex h-full w-full justify-center"
              
            >
              <div className="relative flex  h-[90%] w-[70%] justify-center sm:w-[40%] md:w-[35%]">
              Snapshare
              </div>
            </div>
          )}

          {currentUser?.data?._id === getSingleUser?.data?.data?._id && (
            // <label htmlFor="cover_img">
            <div className="absolute bottom-2 right-2   ">
              {upImg ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUpImg("");
                    }}

                    className="cursor-pointer rounded-md  bg-white px-2 py-1 "
                  >
                    Cancel
                  </button>
                  <div className="cursor-pointer rounded-md  bg-white p-1 px-2 ">
                    <button
                      onClick={() => {
                        showCroppedImage();
                      }}
                    >
                      done
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditCoverPhoto(true)}
                  className="absolute bottom-2 right-2 hidden cursor-pointer rounded-md bg-white md:block  "
                >
                  <EditCoverPhoto />
                  <Popover
                    userRef={editCoverRef}
                    isVisible={isEditCoverPhoto}
                    onclose={setIsEditCoverPhoto}
                    className="right-2 top-0   z-20 hidden  md:block "
                  >
                    <div className="p-4 text-lg">
                      <label htmlFor="cover_img">
                        <button
                          onClick={() => {
                            openCover.current?.click();
                          }}
                        >
                          Edit
                        </button>
                      </label>
                      <div>
                        <button
                          onClick={() => {
                            deleteCover.mutateAsync().then(() => {
                              setIsEditCoverPhoto(false);
                              setCoverImage("");
                              getSingleUser.refetch();
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <input
        className="hidden"
        id="cover_img"
        accept=".png,.jpg,.jpeg,.raw,.tiff"
        type="file"
        ref={openCover}
        onChange={(e) => {
          e.stopPropagation();
          onSelectFile(e);
        }}
      />
    </div>
  );
};


export default CoverImage;
