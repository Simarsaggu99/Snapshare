import React from 'react';
import LightBox from 'react-image-lightbox';

const PreviewImage = ({ lightbox, setLightbox }) => {
  const { imageList } = lightbox;
  return (
    <LightBox
      mainSrc={imageList[lightbox.index]}
      nextSrc={imageList[(lightbox.index + 1) % imageList.length]}
      prevSrc={imageList[(lightbox.index + imageList.length - 1) % imageList.length]}
      onCloseRequest={() =>
        setLightbox({
          index: 0,
          visible: false,
        })
      }
      onMovePrevRequest={() =>
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index + imageList.length - 1) % imageList.length,
        }))
      }
      onMoveNextRequest={() =>
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index + 1) % imageList.length,
        }))
      }
    />
  );
};

export default PreviewImage;
