import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';

const AppModal = (props) => {
  const { showModal, titleName, subtitle, onCancel, children, footer, width } = props;
  return (
    <Modal
      width={width}
      {...props}
      centered
      maskClosable={false}
      visible={showModal}
      onCancel={onCancel}
      footer={footer}
      className={`${styles.AppModal} AppModal`}
    >
      {/* <div className={`${styles.ModalTitle} text-gray-900`}>
        {titleName}
        {subtitle && <div className={`${styles.ModalSubTitle}`}>{subtitle}</div>}
      </div> */}
      {children}
    </Modal>
  );
};
export default AppModal;
