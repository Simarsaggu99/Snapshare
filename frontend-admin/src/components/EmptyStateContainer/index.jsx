import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { Link } from 'umi';
import emptySeatEmptyStateSvg from '@/assets/icons/empty-search-contact.png';
import CheckValidation from '../CheckValidation';

const EmptyStateContainer = ({ type, subHeading, goto, showAddButton = false, onButtonClick }) => {
  const renderButton = () => {
    let btnJSX = null;
    if (showAddButton) {
      if (goto) {
        btnJSX = (
          <Link to={goto}>
            <Button type="primary" className="mt-3">
              Let&apos;s create a new{' '}
              {type.endsWith('s') ? type.substring(0, type.lastIndexOf('s')) : type}!
              <ArrowRightOutlined />
            </Button>
          </Link>
        );
      } else if (onButtonClick) {
        btnJSX = (
          <Button type="primary" className="mt-3" onClick={onButtonClick}>
            Let&apos;s create a new{' '}
            {type.endsWith('s') ? type.substring(0, type.lastIndexOf('s')) : type}!
            <ArrowRightOutlined />
          </Button>
        );
      }
    }

    return btnJSX;
  };
  return (
    <div className="my-2">
      <div className="text-center bg-white p-4">
        <img
          src={emptySeatEmptyStateSvg}
          alt="No address"
          style={{ height: '100px' }}
          className="mt-2"
        />
        <div className="text-lg text-gray-700 font-semibold">No {type} found?</div>
        <CheckValidation show={subHeading}>
          <div className="text-base font-semibold">{subHeading}</div>
        </CheckValidation>
        {renderButton()}
      </div>
    </div>
  );
};
export default EmptyStateContainer;
