/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Row, Col, Form, DatePicker, Input, Button } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { getPageQuery } from '@/utils/utils';
import AwesomeEditor from '@/components/AwesomeEditor';
import SignaturePad from 'react-signature-canvas';

const VaccinationDetails = ({ form, signPag, onClear, formData }) => {
  const { TextArea } = Input;
  const { data } = getPageQuery();
  const DateInput = ({ name, label, placeholder }) => {
    return (
      <Form.Item name={name} label={<span className="formLabel">{label}</span>} form={form}>
        <DatePicker
          allowClear
          format="DD MMMM YYYY"
          style={{ width: '100%' }}
          placeholder={placeholder}
          size="large"
        />
      </Form.Item>
    );
  };

  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
        <Input ref={reff} autoFocus={autoFocus} size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        Did you have covid vaccine?
      </div>
      <TextInput
        name={['preEmployment', `vaccination`, 'vaccinationName']}
        label="Covid vaccine"
        placeholder="Covid vaccine"
      />

      <Row gutter={[24, 12]}>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className="my-2">
            <DateInput
              name={['preEmployment', `vaccination`, 'firstDose']}
              label="First dose date"
              placeholder="First dose date"
            />
          </div>
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className="my-2">
            <DateInput
              name={['preEmployment', `vaccination`, 'secondDose']}
              label="Second dose date"
              placeholder="Second dose date"
            />
          </div>
        </Col>
      </Row>
      <div className="formLabel"></div>
      <Form.Item
        name={['preEmployment', 'vaccination', 'noDosageHistory']}
        form={form}
        label={<span className="formLabel">If not please give reason why</span>}
      >
        <AwesomeEditor
          type="descriptionForm"
          initialValue={
            formData &&
            data &&
            data !== 'createServiceUserForm' &&
            formData?.preEmployment?.vaccination?.noDosageHistory?.JSONText
          }
          placeholder="Your comments here..."
        />
      </Form.Item>
      <div className="formLabel">Declaration</div>

      <div className="formLabel flex">
        <div>1.</div>
        <div className="ml-4">
          I declare that to the best of my knowledge the above information, and that submitted in
          any accompanying documents, is correct. I understand that any false or misleading
          information given on this form may result in my dismissal.
        </div>
      </div>
      <div className="formLabel flex">
        <div>2.</div>
        <div className="ml-4">
          I consent to a medical interview and assessment if considered necessary.
        </div>
      </div>
      <Row gutter={24}>
        <Col lg={12} xl={12} md={12} sm={24} xs={24} className="mt-2">
          <DateInput name={['preEmployment', 'declarationDate']} label="Date" placeholder="Date" />
        </Col>

        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
          <div className="formLabel">Signed</div>
          {data === 'editServiceUserForm' || data === 'editForm' ? (
            <div className="my-2">
              {formData?.signatures?.preEmployment ? (
                <img
                  style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                  className="w-full"
                  src={formData?.signatures?.preEmployment}
                  alt="preEmployment"
                />
              ) : (
                <div className="my-2">
                  <TextArea disabled size="large" rows="3" className="w-full" />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-full h-24 border my-2">
                <SignaturePad
                  canvasProps={{ className: 'h-full w-full' }}
                  ref={(sign) => {
                    signPag.current.preEmployment = sign;
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => onClear('preEmployment')} className="px-4">
                  Clear
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(VaccinationDetails);
