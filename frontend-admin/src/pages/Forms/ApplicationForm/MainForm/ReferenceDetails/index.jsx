/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'umi';
import React from 'react';

const ReferenceDetails = ({ form }) => {
  const TextInput = ({ name, placeholder, label, rules }) => {
    return (
      <Form.Item
        rules={rules}
        name={name}
        form={form}
        label={label && <span className="formLabel">{label}</span>}
      >
        <Input size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };
  const ReferenceCard = ({ heading, name }) => {
    return (
      <>
        <div className="formLabel my-4">{heading}</div>
        <Row gutter={24}>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['mainForm', 'reference', name, 'address']}
              label="Address"
              placeholder="Address"
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['mainForm', 'reference', name, 'postCode']}
              label="Post code"
              placeholder="Post code"
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['mainForm', 'reference', name, 'email']}
              label="Email"
              placeholder="Email"
              rules={[
                {
                  message: 'Please enter a valid email address!',
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              ]}
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['mainForm', 'reference', name, 'telephoneNumber']}
              label="Telephone number"
              placeholder="Telephone number"
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['mainForm', 'reference', name, 'positionHeld']}
              label="What position did you hold?"
              placeholder="What position did you hold?"
            />
          </Col>
        </Row>
      </>
    );
  };

  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
        Please give details of two people who can provide us with an assessment of your suitability
        for this post. <span className="font-bold">Personal referees are not suitable</span>. If you
        are employed, your first referee should be your current employer. If you are not currently
        working, your first referee should be your most recent employer.{' '}
        <span className="font-bold">
          Make sure the details are completed in full as this can delay your application or even
          make your application void
        </span>
      </div>
      <ReferenceCard
        name={'primaryReference'}
        heading="Reference 1 – Name of referee and company"
      />
      <ReferenceCard
        name={'secondaryReference'}
        heading="Reference 2 – Name of referee and company"
      />
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(ReferenceDetails);
