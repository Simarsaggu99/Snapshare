import React from 'react';

const CheckValidation = ({ show, fallback, children }) => {
  return (
    <div>
      {show && children}
      {!show && fallback}
    </div>
  );
};

export default CheckValidation;
