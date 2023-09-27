import { Form, Input } from 'antd';
import React from 'react';

const ProductType = () => {
  return (
    <Form.Item
      name="product_type_desc"
      label={<span className="formLabel ">Product type</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Product type can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter product type `} />
    </Form.Item>
  );
};

export default ProductType;
