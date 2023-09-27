import React from 'react';
import { Input, Form } from 'antd';
const NumberInput = (props) => {
  const { name, rules, maxlength, nested, setfields, size, placeholder } = props;
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    // eslint-disable-next-line no-restricted-globals
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (nested) {
        setfields(value);
      } else {
        props.form.setFieldsValue({
          [name]: value,
        });
      }
    } else if (nested) {
      setfields('');
    } else {
      props.form.setFieldsValue({
        [name]: '',
      });
    }
  };
  return (
    <Input.Group compact>
      <Form.Item name={name} rules={rules} maxlength={maxlength} noStyle>
        <Input {...{ props }} size={size} onChange={onChange} placeholder={placeholder} />
      </Form.Item>
    </Input.Group>
  );
};
export default NumberInput;
