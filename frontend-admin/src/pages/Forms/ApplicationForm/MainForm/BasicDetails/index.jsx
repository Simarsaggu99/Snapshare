/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, DatePicker, Radio, Select } from 'antd';
import { connect } from 'umi';
import React from 'react';
import PhoneNumber from '@/components/PhoneNumber';
import Address from '@/components/Address';
import classNames from 'classnames';
import styles from '../../index.less';

const BasicDetails = ({ form }) => {
  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
        <Input ref={reff} autoFocus={autoFocus} size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  const DateInput = ({ name, label, placeholder, labelValue, noStyle }) => {
    return (
      <Form.Item
        noStyle={noStyle}
        name={name}
        label={<span className="formLabel">{label}</span>}
        className={classNames(labelValue && styles.labelStyling)}
      >
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

  return (
    <div className=" bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        Your details
      </div>
      <Row gutter={[24, 12]}>
        <Col lg={4} xl={4} md={4} sm={24} xs={24}>
          <TextInput
            name={['mainForm', 'title']}
            label="Miss/Mrs/Mr"
            placeholder="Miss/Mrs/Mr"
            rules={[
              {
                whitespace: true,
                required: true,
                message: 'Please enter the title',
              },
            ]}
          />
        </Col>
        <Col lg={10} xl={10} md={10} sm={24} xs={24}>
          <TextInput
            name={['mainForm', 'first_name']}
            label="First name"
            placeholder="First name"
            rules={[
              {
                whitespace: true,
                required: true,
                message: 'Please enter the first name',
              },
            ]}
          />
        </Col>
        <Col lg={10} xl={10} md={10} sm={24} xs={24}>
          <TextInput
            name={['mainForm', 'surname']}
            label="Surname"
            placeholder="Surname"
            rules={[
              {
                whitespace: true,
                required: true,
                message: 'Please enter the surname',
              },
            ]}
          />
        </Col>
      </Row>
      <Address form={form} />
      <Row gutter={[24, 12]}>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <TextInput
            name={['mainForm', 'email']}
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
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item required label={<span className="FormLabel font-medium">Mobile</span>}>
            <PhoneNumber
              countryCode={['mainForm', 'country_code']}
              rules={[
                {
                  message: 'Please enter your mobile number',
                },
                () => ({
                  validator(_, value) {
                    if (value?.length === 0) return Promise.resolve();
                    return Promise.resolve();
                  },
                }),
                { max: 10, message: 'Please enter only 10 digits for phone number' },
                { min: 10, message: 'Please enter atleast 10 digits for phone number' },
              ]}
              form={form}
              name={['mainForm', 'mobile']}
            />
          </Form.Item>
        </Col>
        <Col xxl={12} lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className="font-semibold">
            I agree to disclose my phone number and e-mail in a business purposes
          </div>
        </Col>
        <Col xxl={12} lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item initialValue={'Yes'} noStyle name={['mainForm', 'agreeToDiscloseDetails']}>
            <Radio.Group options={['Yes', 'No']} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={12} xl={12} md={24} sm={24} xs={24} className="mt-4">
          <TextInput
            name={['mainForm', 'homeTelephone']}
            label="Home telephone"
            placeholder="Home telephone"
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24} className="mt-4">
          <DateInput
            name={['mainForm', 'dateOfBirth']}
            label="Date of birth"
            placeholder="Date of birth"
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24} className="mt-4">
          <TextInput name={['mainForm', 'NINumber']} label="NI number" placeholder="NI Number" />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24} className="mt-4">
          <Form.Item
            name={['mainForm', 'languagesSpoken']}
            label={<span className="formLabel">List all the languages you speak</span>}
          >
            <Select
              size="large"
              dropdownStyle={{ display: 'none' }}
              mode="tags"
              //   defaultValue={['a10', 'c12']}
              placeholder="Please list down the languages you speak and hit enter"
              style={{ width: '100%' }}
            />
          </Form.Item>
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
}))(BasicDetails);
