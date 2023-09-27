import { Form, Input } from 'antd';
import React from 'react';

const ProductFamily = () => {
  return (
    <Form.Item
      name="category_id"
      label={<span className="formLabel ">Product family</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Product family can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter product family `} />
    </Form.Item>
  );
};

export default ProductFamily;
