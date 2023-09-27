import { Form, Input } from 'antd';
import React from 'react';

const ProductId = () => {
  return (
    <Form.Item
      label={<span className="formLabel ">Product code</span>}
      name="product_id"
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Product code can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter product code `} />
    </Form.Item>
  );
};

export default ProductId;
