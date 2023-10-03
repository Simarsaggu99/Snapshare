
import React, { useState, useRef, useEffect } from "react";

interface ReadMoreProps {
  text: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ text }) => {
  const [showFullText, setShowFullText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [isLineChar, setIsLineChar] = useState(false);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const contentHeight = contentRef.current.clientHeight;
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      );
      setShouldShowButton(contentHeight > containerHeight + lineHeight / 2);
    }
  }, []);

  const toggleShowFullText = () => {
    setIsLineChar(!isLineChar);
    setShowFullText(!showFullText);
  };
  const renderText = () => {
    return (
      <div
        ref={containerRef}
        style={{
          maxHeight: showFullText ? "none" : "3.1em",
          overflow: "hidden",
          lineHeight: "1.5",
        }}
      >
        <div ref={contentRef}>{text}</div>
      </div>
    );
  };
  

  return (
    <div>
      <span>
        {renderText()}

        {shouldShowButton && (
          <button
            className={`hover:underline ${
              !showFullText
                ? "text-xs  text-[#EB6625]"
                : " pl-2 text-xs text-gray-900 duration-200 hover:scale-110 "
            } ml-1 font-semibold`}
            onClick={toggleShowFullText}
          >
            {showFullText ? "Show Less" : "...Read More"}
          </button>
        )}
      </span>
    </div>
  );
};

export default ReadMore;
