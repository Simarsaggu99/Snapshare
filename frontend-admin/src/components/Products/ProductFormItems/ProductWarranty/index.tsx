import NumberInput from '@/components/NumberInput';
import { Form } from 'antd';
import React from 'react';
import { ProductWarrantyProps } from './types';

const ProductWarranty = ({ form }: ProductWarrantyProps) => {
  return (
    <Form.Item name="warranty" label={<span className="formLabel ">Warranty</span>}>
      <NumberInput
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Product warranty can't be blank!",
          },
        ]}
        size="large"
        placeholder="Enter number of years "
        style={{ width: '100%' }}
        form={form}
        name="warranty"
      />
    </Form.Item>
  );
};

export default ProductWarranty;
