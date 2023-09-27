/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Row, Col, Tooltip, Form, Input, Radio } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { getPageQuery } from '@/utils/utils';
import AwesomeEditor from '@/components/AwesomeEditor';

const AvailabilityDetails = ({ form, formData }) => {
  const { data } = getPageQuery();
  const TextInput = ({ name, placeholder, label, noStyle }) => {
    return (
      <Form.Item
        name={name}
        form={form}
        noStyle={noStyle}
        label={<span className="formLabel">{label}</span>}
      >
        <Input size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  const TableBody = ({ list, supDetails, subDetails }) => {
    return (
      <Row gutter={[24, 12]}>
        <Col lg={8} xl={8} md={24} sm={24} xs={24}>
          <div>
            <Tooltip
              placement="topLeft"
              title={
                <div>
                  <div>{list?.mainText}</div>
                </div>
              }
            >
              <div className="truncate formLabel">{list?.mainText}</div>
            </Tooltip>
          </div>
        </Col>
        <Col lg={8} xl={8} md={12} sm={12} xs={12}>
          <TextInput name={supDetails} placeholder="Times" label="Times" />
        </Col>
        <Col lg={8} xl={8} md={12} sm={12} xs={12}>
          <TextInput name={subDetails} placeholder="Times" label="Times" />
        </Col>
      </Row>
    );
  };

  const availavbilityCheckList = [
    {
      value: '1',
      mainText: 'Monday',
    },
    {
      value: '2',
      mainText: 'Tuesday',
    },
    {
      value: '3',
      mainText: 'Wednesday',
    },
    {
      value: '4',
      mainText: 'Thursday',
    },
    {
      value: '5',
      mainText: 'Friday',
    },
    {
      value: '6',
      mainText: 'Saturday',
    },
    {
      value: '7',
      mainText: 'Sunday',
    },
    {
      value: '8',
      mainText: 'Which days/nights?',
    },
    {
      value: '9',
      mainText: 'Live in care (24 hours up to 6 days a week)',
    },
    {
      value: '10',
      mainText: 'Sleep ins (10pm-8am)',
    },
    {
      value: '11',
      mainText: 'Wake in nights (10pm-8am)',
    },
  ];

  const convictionsList = [
    {
      description: 'Are you on the ISA list held by the secretary of state?',
      value: '1',
      option: ['mainForm', 'conviction', 'ISAList'],
    },
    {
      description: 'Have you ever been convicted of a crime?',
      value: '2',
      option: ['mainForm', 'conviction', 'crimeConvicted'],
    },
    {
      description: 'Have you ever been cautioned?	',
      value: '3',
      option: ['mainForm', 'conviction', 'cautioned'],
    },
    {
      description: 'Have you ever had any reprimands or warning?',
      value: '4',
      option: ['mainForm', 'conviction', 'warning'],
    },
    {
      description: 'Have you ever been arrested by the police?',
      value: '5',
      option: ['mainForm', 'conviction', 'arrestedByPolice'],
    },
    {
      description: 'Have you ever been involved in any police enquiries? ',
      value: '6',
      option: ['mainForm', 'conviction', 'policeEnquiries'],
    },
    {
      description: 'Do you have any current police enquires or pending prosecutions?',
      value: '7',
      option: ['mainForm', 'conviction', 'pendingProsecutions'],
    },
  ];

  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        <span className="font-bold"> Your Availability</span> – This is important as we will
        regularly assign you to regular service users. To change this availability requires 4 weeks
        notice and it is extremely disruptive to our service users if this is changed. Changing the
        availability may also affect the level of work you receive and in some cases may result in
        you not receiving any work if it is changed without adequate notice. Please specific about
        the times you can work. In order to maximise the time you work and the money you can earn,
        starting work at 7.00am or before is preferable but not essential.
      </div>

      {availavbilityCheckList.map((list) => (
        <div key={list?.value}>
          <TableBody
            list={list}
            supDetails={['mainForm', 'availavbility', `availavbility${list?.value}`, 'startTimes']}
            subDetails={['mainForm', 'availavbility', `availavbility${list?.value}`, 'endTimes']}
          />
        </div>
      ))}
      <div className="formLabel mb-2">
        How many hours a week would you like to work? Be as precise as you can as we will aim to
        give you this number of hours.
      </div>
      <TextInput
        name={['mainForm', 'numberOfHours']}
        placeholder="Enter number of hours"
        noStyle={true}
      />
      <div className="font-bold my-4">
        You are required to declare if this will be your only job or if you are currently working or
        will be working with another company while working for Ami Homecare at the same time and the
        hours you are currently working with another company.
      </div>
      <Row gutter={24}>
        <Col xxl={12} lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className="font-semibold">Will this be your only job?</div>
        </Col>
        <Col xxl={12} lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item initialValue={'Yes'} noStyle name={['mainForm', 'currentJobOnly']}>
            <Radio.Group options={['Yes', 'No']} />
          </Form.Item>
        </Col>
      </Row>
      <div className="my-4">
        {' '}
        <Form.Item
          name={['mainForm', 'currentJobWorkingTime']}
          label={
            <span className="formLabel">
              If no please provide details of the company name(s) you are working for and the hours
              you are currently working e.g. 7am -2pm Monday to Friday etc.
            </span>
          }
        >
          <AwesomeEditor
            type="descriptionForm"
            initialValue={
              formData &&
              data &&
              data !== 'createServiceUserForm' &&
              formData?.mainForm?.currentJobWorkingTime?.JSONText
            }
            placeholder="Your comments here..."
          />
        </Form.Item>
      </div>
      <div className="font-bold">Disability Discrimination Act 1995 (DDA)</div>
      <div className="my-4">
        <Form.Item
          name={['mainForm', 'DDADetails']}
          label={
            <span className="formLabel">
              If you have a disability as defined in the DDA (Disability Discrimination Act 1995),
              please give details below. It will only be used in the interview process to assess
              whether any adjustment would be needed for you to carry out the work of the post.
              Please also use the space below to let us know of any special requirements you have to
              enable you to attend an interview, if short-listed.
            </span>
          }
        >
          <AwesomeEditor
            type="descriptionForm"
            initialValue={
              formData &&
              data &&
              data !== 'createServiceUserForm' &&
              formData?.mainForm?.DDADetails?.JSONText
            }
            placeholder="Your comments here..."
          />
        </Form.Item>
      </div>
      <div className="font-bold my-4">Disclosure of Criminal Convictions</div>
      <div className="formLabel mb-4">
        Domiciliary care agencies are exempt from the Rehabilitation of Offenders Act 1974 and you
        are therefore required to disclose all criminal record information, including details and
        dates of spent convictions, cautions, reprimands and final warnings now and ongoing. Please
        include other relevant non-conviction information such as police enquiries and pending
        prosecutions. All positions with AMI Home Care Ltd require a full Enhanced Disclosure check.
        Failure to disclose a criminal record will lead to dismissal
      </div>
      {convictionsList.map((list) => (
        <div key={list?.value}>
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className="text-sm my-2 mr-2 formLabel">{list.description}</div>
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <Form.Item initialValue={'No'} noStyle name={list?.option}>
                <Radio.Group options={['Yes', 'No']} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ))}
      <div className="italic formLabel my-2">
        If YES, please submit written details and dates in confidence to the Manager/HR at Ami
        Homecare Ltd via a statement which needs to be signed and dated by you or provide details on
        reverse of application form
      </div>
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(AvailabilityDetails);
