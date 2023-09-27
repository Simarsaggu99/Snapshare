import { Form, Input } from 'antd';
import React from 'react';

const ProductName = () => {
  return (
    <Form.Item
      name="product_name"
      label={<span className="formLabel ">Product name</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Product name can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter product name `} />
    </Form.Item>
  );
};

export default ProductName;
