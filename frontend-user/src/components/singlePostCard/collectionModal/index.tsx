import {
  notifyError,
  notifySuccess,
} from "@/components/UIComponents/Notification";
import Button from "@/components/buttons/Button";
import {
  useAddPostInCollection,
  useCreateMyCollection,
} from "@/hooks/mycollection/mutation";
import { useGetCollectionFolders } from "@/hooks/mycollection/query";
import { CrossIcon, FolderIcon, PlusIcon } from "@/utils/AppIcons";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
interface collectionModelInterface {
  id: any;
  isModal: boolean;
}
interface collectionPropsInterface {
  isCollectionModal: collectionModelInterface;
  setIsCollectionModal: React.Dispatch<
    React.SetStateAction<collectionModelInterface>
  >;
}
interface collectionInterface {
  collectionProps: collectionPropsInterface;
}
const CollectionModal = ({
  collectionProps: { isCollectionModal, setIsCollectionModal },
}: collectionInterface) => {
  const [isInputShow, setIsInputShow] = useState<boolean>(false);
  const [FolderName, setFolderName] = useState<string>("");
  const createMyCollection = useCreateMyCollection();
  const getCollectionFolders: any = useGetCollectionFolders({
    pathParams: { id: isCollectionModal?.id },
  });
  const addPostInCollection = useAddPostInCollection();

  const addMyCollection = () => {
    createMyCollection
      .mutateAsync({
        pathParams: { id: isCollectionModal?.id },
        body: { folder_name: FolderName },
      })
      .then((res: any) => {
        if (res?.message === "success") {
          setIsInputShow(false);
          getCollectionFolders.refetch();
        }
      });
  };

  return (
    <div className="backdrop-blur-xs fixed top-0 left-0  z-40 h-screen  w-full overflow-hidden bg-black/60">
      <div className="sticky left-0 right-0 top-[15%] mx-auto mt-20 h-max w-[70%] sm:w-[45%] lg:w-[40%]    ">
        <div className="mb-7 h-[700px] max-h-full overflow-auto rounded-lg  border bg-white px-4 py-5">
          <div className="flex justify-between ">
            <p className="text-lg font-medium">My Collection&apos;s</p>
            <button
              onClick={() => {
                setIsCollectionModal({ id: "", isModal: false });
              }}
            >
              <CrossIcon />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ">
            {getCollectionFolders?.data?.data?.map((item: any) => (
              <button
                onClick={() => {
                  addPostInCollection
                    .mutateAsync({
                      pathParams: {
                        postId: isCollectionModal?.id,
                        folderId: item?._id,
                      },
                    })
                    .then((res: any) => {
                      if (res?.message === "success") {
                        setIsCollectionModal({ id: "", isModal: false });
                        notifySuccess({ message: "Post added to collection" });
                      }
                    })
                    .catch((er) => {
                      notifyError({
                        message: er?.response?.data?.error?.message,
                      });
                    });
                }}
                key={item?._id}
                className="flex justify-center rounded-md border p-5"
              >
                <div>
                  <div className="flex justify-center ">
                    <div className="w-max rounded-full bg-gray-300 p-2">
                      <FolderIcon />
                    </div>
                  </div>
                  <div className=" mt-2 w-32 overflow-hidden  truncate">
                    {item?.folder_name}
                  </div>
                </div>
              </button>
            ))}

            <div className="flex  justify-center rounded-md border p-5">
              {isInputShow ? (
                <div>
                  <div>
                    <input
                      className="mb-5 w-full border px-1 py-0.5 outline-none ring-0"
                      onChange={(e) => {
                        setFolderName(e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      addMyCollection();
                    }}
                    className="mx-auto flex justify-center px-1 py-0.5 text-sm  "
                  >
                    Add folder
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsInputShow(true);
                  }}
                >
                  <div>
                    <div className="flex justify-center ">
                      <div className="w-max rounded-full bg-primary-200 p-2">
                        <PlusIcon />
                      </div>
                    </div>
                    <div className="mt-2 text-primary-600">Add folder</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
