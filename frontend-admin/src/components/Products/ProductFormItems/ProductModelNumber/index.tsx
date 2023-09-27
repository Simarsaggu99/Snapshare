import NumberInput from '@/components/NumberInput';
import { Form } from 'antd';
import React from 'react';
import { ProductModelNumberProps } from './types';

const ProductModelNumber = ({ form }: ProductModelNumberProps) => {
  return (
    <Form.Item name="model_number" label={<span className="formLabel ">Model number</span>}>
      <NumberInput
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Model number can't be blank!",
          },
        ]}
        size="large"
        placeholder="Enter model number "
        style={{ width: '100%' }}
        form={form}
        name="model_number"
      />
    </Form.Item>
  );
};

export default ProductModelNumber;
