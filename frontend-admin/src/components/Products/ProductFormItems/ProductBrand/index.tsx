import { Form, Input } from 'antd';
import React from 'react';

const ProductBrand = () => {
  return (
    <Form.Item
      name="brand_name"
      label={<span className="formLabel ">Product brand</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Product brand can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter product brand `} />
    </Form.Item>
  );
};

export default ProductBrand;
