/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, DatePicker, Radio } from 'antd';
import { connect } from 'umi';
import React from 'react';
import AwesomeEditor from '@/components/AwesomeEditor';
import classNames from 'classnames';
import { getPageQuery } from '@/utils/utils';
import styles from '../../index.less';

const TravelDetails = ({ form, formData }) => {
  const plannedHoliday = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
  ];

  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item
        form={form}
        name={name}
        rules={rules}
        label={<span className="formLabel">{label}</span>}
      >
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

  const travelDetails = [
    {
      description: 'Will you use a car and are you a driver',
      value: '1',
      option: ['mainForm', 'travelDetails', 'useOfCar'],
    },
    {
      description: 'If yes, do you have business insurance',
      value: '2',
      option: ['mainForm', 'travelDetails', 'businessInsurance'],
    },
  ];
  const { data } = getPageQuery();
  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        <span className="font-bold"> Travel</span> – We want to be kind to the environment by
        minimising travel time and the fuel costs. We want to promote a healthy workforce and would
        like our carers to walk, bike or use public transport
      </div>
      {travelDetails.map((list) => (
        <div key={list?.value}>
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className="text-sm my-2 mr-2 formLabel">{list.description}</div>
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                <Radio.Group options={['Yes', 'No']} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ))}
      <div className="font-bold my-4">
        To use your car for work purposes you must ensure your car insurance covers business use.
        You must supply us with a copy of this.
      </div>
      <Row gutter={24}>
        <Col lg={24} xl={12} md={24} sm={24} xs={24}>
          <TextInput
            name={['mainForm', 'travelTransport', 'bikeRideScheme']}
            label="Will you use a bike? (Ask about our ride to work scheme)"
            placeholder="Will you use a bike?"
          />
        </Col>
        <Col lg={24} xl={12} md={24} sm={24} xs={24}>
          <TextInput
            name={['mainForm', 'travelTransport', 'walkConvience']}
            label="Will you walk?"
            placeholder="Will you walk?"
          />
        </Col>
        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
          <Form.Item
            name={['mainForm', 'travelTransport', 'publicTransport']}
            label={
              <span className="formLabel">
                Will you take public transport? If so, can you be more specific?
              </span>
            }
          >
            <AwesomeEditor
              type="descriptionForm"
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.mainForm?.travelTransport?.publicTransport?.JSONText
              }
              placeholder="Your comments here..."
            />
          </Form.Item>
        </Col>
      </Row>
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        Planned holidays
      </div>
      <div className="font-bold my-4">
        If you have already booked a holiday please use the space below to outline the dates you
        will be away
      </div>

      <Row gutter={24}>
        <Col lg={12} xl={12} md={12} sm={12} xs={12}>
          <div className="font-semibold overflow-hidden mb-2">From</div>
        </Col>
        <Col lg={12} xl={12} md={12} sm={12} xs={12}>
          <div className="font-semibold overflow-hidden mb-2">To</div>
        </Col>
      </Row>
      {plannedHoliday?.map((list) => (
        <Row gutter={[24, 12]} key={list?.value}>
          <Col lg={12} xl={12} md={12} sm={12} xs={12}>
            <div className="my-2">
              <DateInput
                noStyle={true}
                name={['mainForm', 'plannedHoliday', `plannedHoliday${list?.value}`, 'dateFrom']}
                placeholder="From"
              />
            </div>
          </Col>
          <Col lg={12} xl={12} md={12} sm={12} xs={12}>
            <div className="my-2">
              <DateInput
                noStyle={true}
                name={['mainForm', 'plannedHoliday', `plannedHoliday${list?.value}`, 'dateTo']}
                placeholder="To"
              />
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(TravelDetails);
