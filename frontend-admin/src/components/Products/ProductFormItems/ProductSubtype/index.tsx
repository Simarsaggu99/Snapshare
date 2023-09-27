import { Form, Input } from 'antd';
import React from 'react';

const ProductSubtype = () => {
  return (
    <Form.Item
      name="product_sub_type_desc"
      label={<span className="formLabel ">Product sub-type</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          message: `Product sub-type can't be blank!`,
        },
      ]}
    >
      <Input size="large" placeholder={`Enter product sub-type `} />
    </Form.Item>
  );
};

export default ProductSubtype;
