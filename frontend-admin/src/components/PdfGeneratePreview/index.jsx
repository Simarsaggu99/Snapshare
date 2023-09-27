import React from 'react';
import AppModal from '../AppModal';
import fileGenerateGif from '@/assets/file-types/fileGenrator.gif';
import successTick from '@/assets/file-types/successtick.gif';
import { connect } from 'umi';
const PdfGeneratePreview = ({
  dispatch,
  pdfUrl,
  showGeneratePdf,
  pdfGenerateLoading,
  setPdfUrl,
}) => {
  const onCloseModal = () => {
    setPdfUrl('');
    dispatch({
      type: 'event/showGeneratePdf',
      payload: {
        body: {
          value: false,
        },
      },
    });
  };
  return (
    <div>
      <AppModal
        closable={!pdfGenerateLoading}
        width={'700px'}
        showModal={showGeneratePdf}
        onCancel={onCloseModal}
        titleName={
          <span className="text-indigo-900 font-bold">{`${
            pdfUrl ? 'Preview' : 'Be Patient'
          }`}</span>
        }
        subtitle={
          <span className="text-lg">
            {`${
              pdfUrl
                ? 'Your Pdf is here'
                : '  we are preparing your pdf,it can take couple of seconds...'
            }`}
          </span>
        }
        footer={false}
        bodyStyle={{ height: '70vh' }}
      >
        {!pdfUrl ? (
          <img
            src={pdfGenerateLoading ? fileGenerateGif : successTick}
            style={{ width: '100%', objectFit: 'contain' }}
          />
        ) : (
          <iframe
            title="Preview"
            alt="Preview"
            style={{ height: '70vh' }}
            width="100%"
            type="application/pdf"
            src={pdfUrl}
          ></iframe>
        )}
      </AppModal>
    </div>
  );
};

export default connect(({ event }) => ({
  // pdfUrl: event.idCardPdfUrl,
  showGeneratePdf: event.showGeneratePdf,
}))(PdfGeneratePreview);
