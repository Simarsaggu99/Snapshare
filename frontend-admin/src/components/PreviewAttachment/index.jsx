import React from 'react';
import { Modal } from 'antd';

const PreviewAttachment = (props) => {
  const { visible, handleCancel, previewImage } = props;

  return (
    <Modal
      width="1200px"
      // bodyStyle={{ height: 800 }}
      visible={visible}
      footer={null}
      onCancel={handleCancel}
    >
      <iframe title="iframe" src={previewImage} style={{ width: '100%', height: 700 }} />
    </Modal>
  );
};
export default PreviewAttachment;
