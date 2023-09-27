import { Button, Modal } from 'antd';
import React from 'react';
import { Link } from 'umi';
import RejectedImg from '@/assets/icons/rejected.png';
import CheckedImg from '@/assets/icons/checked.png';
import { RightOutlined } from '@ant-design/icons';

const ConfirmModal = ({ visible, setVisible, type, id, status }) => {
  return (
    <Modal
      maskClosable={false}
      width={600}
      footer={null}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <div className="text-center pt-10">
        {(status === 'confirm' ||
          status === 'successful' ||
          status === 'registered' ||
          status === 'serviceUserUpdated') && <img src={CheckedImg} alt="check" />}
        {(status === 'reject' ||
          status === 'unSuccessful' ||
          status === 'notRegistered' ||
          status === 'serviceUserNotUpdated') && (
          <img src={RejectedImg} alt="rejected" width="100px" height="100px" />
        )}
      </div>
      <div className="text-center text-2xl text-gray-700 font-semibold py-6">
        {status === 'confirm' && ' Your form is successfully submitted'}
        {status === 'reject' && 'Your form is not submitted successfully'}
        {status === 'successful' && ' Your form is successfully updated'}
        {status === 'unSuccessful' && 'Your form is not updated successfully'}
        {status === 'registered' && 'New service user is registered successfully'}
        {status === 'notRegistered' && 'New service user is not registered successfully'}
        {status === 'serviceUserNotUpdated' && 'Service user is not updated successfully'}
        {status === 'serviceUserUpdated' && 'Service user is updated successfully'}
      </div>
      <div className="text-center py-6">
        {(status === 'confirm' || status === 'successful') && (
          <Link to={`/form/${type}/${id}`}>
            <Button size="large" type="primary">
              Print Preview <RightOutlined />
            </Button>
          </Link>
        )}
        {(status === 'registered' || status === 'serviceUserUpdated') && (
          <Link to={`/service-user/${id}/view`}>
            <Button size="large" type="primary">
              Visit Profile <RightOutlined />
            </Button>
          </Link>
        )}
        {(status === 'notRegistered' ||
          status === 'reject' ||
          status === 'unSuccessful' ||
          status === 'serviceUserNotUpdated') && (
          <Button
            size="large"
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            Try Again <RightOutlined />
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
