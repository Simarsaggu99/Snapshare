import Button from "@/components/buttons/Button";
import React from "react";
interface reportModalInterface {
  reportModal: any;
}

const PostReportModal = ({
  reportModal: {
    isReportModal,
    setIsReportModal,
    setoption,
    option,
    onReportPost,
    setReportContentValue,
  },
}: reportModalInterface) => {
  return (
    <div>
      {" "}
      {isReportModal?.isModal && (
        <div
          onClick={() => {
            setIsReportModal({ id: "", isModal: false });
            setoption("");
          }}
          className="backdrop-blur-xs fixed top-0 left-0  z-40 h-screen  w-full overflow-hidden bg-black/60"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="sticky left-0 right-0 top-[29%] mx-auto mt-20 h-[40%] w-[70%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[24%] "
          >
            <div className="rounded-lg border bg-white px-4 py-5 ">
              <div className="mb-5 text-lg font-medium text-primary-600">
                {" "}
                Report content
              </div>
              <div className="my-4">
                <p className="">Reason</p>

                <select
                  name=""
                  id=""
                  className="w-full rounded-md border border-gray-400 text-base"
                  onChange={(e) => {
                    setoption(e.target.value);
                  }}
                  value={option}
                >
                  <option value="spam" key="spam">
                    Spam
                  </option>
                  <option
                    value="bullying_or_harassment"
                    key="bullying_or_harassment"
                  >
                    Bullying or harassment
                  </option>
                  <option value="scams_or_fraud" key="scams_or_fraud">
                    Scams or fraud
                  </option>
                  <option value="false_information" key="false_information">
                    False information
                  </option>
                  <option
                    value="nudity_or_sexual_activity"
                    key="nudity_or_sexual_activity"
                  >
                    Nudity or sexual activity
                  </option>
                  <option
                    value="hate_speech_or_symbols"
                    key="hate_speech_or_symbols"
                  >
                    Hate speech or symbols
                  </option>
                  <option value="other" key="other">
                    Other
                  </option>
                </select>
              </div>
              {option === "other" && (
                <div>
                  <p>description</p>
                  <textarea
                    onChange={(e) => {
                      setReportContentValue(e.target.value);
                    }}
                    className="w-full rounded outline-none ring-0 focus:outline-none focus:ring-0"
                    rows={5}
                  />
                </div>
              )}
              <div className="mt-4 flex justify-end gap-4">
                <Button
                  onClick={() => {
                    setIsReportModal({ id: "", isModal: false });
                    setoption("");
                  }}
                  className="border border-primary-600 bg-white text-primary-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReportPost();
                  }}
                >
                  Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostReportModal;
