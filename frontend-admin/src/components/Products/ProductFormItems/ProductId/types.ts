import { FormInstance } from 'antd/lib/form/Form';
import { ReactNode } from 'react';

export interface ProductNameInputProps {
  form?: FormInstance;
  initialValue?: string;
  label: ReactNode | string;
}
