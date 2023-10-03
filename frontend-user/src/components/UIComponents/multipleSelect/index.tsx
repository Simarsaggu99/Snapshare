import React from "react";
import { useState } from "react";
interface tagprops {
  finalTags: any;
  setFinalTags: React.Dispatch<React.SetStateAction<any>>;
}
const MultipleSelect = ({ finalTags, setFinalTags }: tagprops) => {
  const [tag, setTag] = useState("");
  const removeTag = (index: number) => {
    setFinalTags(finalTags?.filter((_: any, i: number) => i != index));
  };
  
  let spaceRemove = /\s/g;
  let removespecialChar = /[`~!#$%^&*@()|+=-?-;:'",<>_\{\}\[\]\\\/]/gi;
  return (
    <div className="flex  w-full justify-center text-black">
      {" "}
      <div className=" relative  flex h-10 w-full  overflow-hidden border py-0.5 ">
        <div className="w-content flex gap-2  px-1 py-1">
          {finalTags?.map((item: any, index: number) => (
            <div
              key={index}
              className="relative flex w-full items-center rounded-md border bg-gray-400 py-1 pl-3 pr-6 text-sm font-semibold text-white"
            >
              #{item}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                height={11}
                width={11}
                className="absolute right-1 top-1 fill-white hover:fill-slate-700"
                onClick={(itm) => {
                  removeTag(index);
                }}
              >
                <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
              </svg>
            </div>
          ))}
        </div>

        {finalTags?.length < 4 && (
          <input
            placeholder={`${finalTags?.length < 1 ? "#Tags" : ""}`}
            onChange={(e) => {
              const RemoveSpace = e.target.value.replace(spaceRemove, "");
              const removespecial = RemoveSpace.replace(removespecialChar, "");
              const toLowerCase = removespecial?.toLowerCase();

              if (finalTags?.length < 3) {
                setTag(toLowerCase);
              }
            }}
            type="text"
            value={tag}
            className=" w-full border-none px-1 py-1 text-xl ring-0 placeholder:text-sm focus:outline-none focus:ring-0"
            onKeyDownCapture={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (finalTags?.length < 3 && tag) {
                  setTag("");
                  setFinalTags((curr: any) => [...curr, `${tag}`]);
                }
              }
            }}
            onKeyDown={(e) => {
              if (!tag) {
                if (e.key === "Backspace") {
                  setFinalTags((curr: any) => [
                    ...curr?.filter(
                      (_: any, i: number) => i !== curr?.length - 1
                    ),
                  ]);
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MultipleSelect;
