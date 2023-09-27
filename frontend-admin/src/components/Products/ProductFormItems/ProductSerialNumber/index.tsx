import { Form, Input } from 'antd';
import React from 'react';

const ProductSerialNumber = () => {
  return (
    <Form.Item
      name="serial_number"
      label={<span className="formLabel ">Serial number</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Serial number can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter serial number `} />
    </Form.Item>
  );
};

export default ProductSerialNumber;
