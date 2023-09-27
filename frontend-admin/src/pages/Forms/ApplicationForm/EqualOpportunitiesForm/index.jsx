/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, Checkbox, Radio, DatePicker, Button } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { getPageQuery } from '@/utils/utils';
import AwesomeEditor from '@/components/AwesomeEditor';
import SignaturePad from 'react-signature-canvas';

const EqualOpportunitiesForm = ({ form, formData, signPag, onClear }) => {
  const descriptionList = [
    {
      description: 'Black African',
      value: '1',
      option: ['equalOpportunities', 'birthOrigin', 'blackAfrican'],
    },
    {
      description: 'Pakistani',
      value: '2',
      option: ['equalOpportunities', 'birthOrigin', 'pakistani'],
    },
    {
      description: 'Black Caribbean',
      value: '3',
      option: ['equalOpportunities', 'birthOrigin', 'blackCaribbean'],
    },
    {
      description: 'Chinese',
      value: '4',
      option: ['equalOpportunities', 'birthOrigin', 'chinese'],
    },
    {
      description: 'Black Other',
      value: '5',
      option: ['equalOpportunities', 'birthOrigin', 'blackOther'],
    },
    {
      description: 'Irish',
      value: '6',
      option: ['equalOpportunities', 'birthOrigin', 'irish'],
    },
    {
      description: 'Bangladeshi',
      value: '7',
      option: ['equalOpportunities', 'birthOrigin', 'bangladeshi'],
    },
    {
      description: 'White',
      value: '8',
      option: ['equalOpportunities', 'birthOrigin', 'white'],
    },
    {
      description: 'Indian',
      value: '9',
      option: ['equalOpportunities', 'birthOrigin', 'indian'],
    },
  ];
  const vacancyInfoSources = [
    {
      description: 'Internal Advert',
      value: '1',
      option: ['equalOpportunities', 'vacancyInfoSources', 'internalAdvert'],
    },
    {
      description: 'Agency',
      value: '2',
      option: ['equalOpportunities', 'vacancyInfoSources', 'agency'],
    },
    {
      description: 'External Advert',
      value: '3',
      option: ['equalOpportunities', 'vacancyInfoSources', 'externalAdvert'],
    },
    {
      description: 'Job Centre',
      value: '4',
      option: ['equalOpportunities', 'vacancyInfoSources', 'jobCentre'],
    },
    {
      description: 'Word of Mouth',
      value: '5',
      option: ['equalOpportunities', 'vacancyInfoSources', 'wordOfMouth'],
    },
  ];
  const TextInput = ({ name, label, placeholder }) => {
    return (
      <Form.Item name={name} label={<span className="formLabel">{label}</span>}>
        <Input size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };
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
  const { data } = getPageQuery();
  const { TextArea } = Input;
  return (
    <>
      <div className="bg-white shadow rounded mb-4 border-b p-8">
        <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
          EQUAL OPPORTUNITIES MONITORING
        </div>
        <div className="formLabel">
          The Company will take measures to ensure that its Equality Policy is observed, and will
          ensure that all those involved in the selection process (for example) are aware of the
          obligations and duties imposed by relevant employment legislation. In order to satisfy
          these obligations and duties and to monitor the effectiveness of this policy, certain
          personal sensitive data will be collected from Job Applicants. This information will not
          be used in order to select individuals for employment, but some sensitive personal data
          (regarding criminal convictions and physical/mental health) may be used in order to verify
          the safety of proceeding with either an application or a job offer. The following
          information is requested in order to allow the Company to monitor the effectiveness of its
          Equality Policy. You are requested to complete this form, and sign it. This will indicate
          your explicit consent to the collection and processing of such data in accordance with the
          principles of the Data Protection Act.
        </div>

        <div className="formLabel lg:text-center text-left my-2">
          Please √ as appropriate. Thank you for your co-operation
        </div>
        <div className="formLabel">Ethnic Origin</div>
        <Row gutter={24}>
          {descriptionList.map((list) => (
            <Col lg={12} xl={12} md={24} sm={24} xs={24} key={list?.value}>
              <div className="flex">
                <div className="text-sm my-2 mr-2 formLabel w-1/4">{list.description}</div>
                <div className="mt-2 ml-6">
                  <Form.Item name={list?.option} form={form}>
                    <Checkbox
                      defaultChecked={
                        formData &&
                        data &&
                        data !== 'createServiceUserForm' &&
                        formData?.[list?.option[0]]?.[list?.option[1]]?.[list?.option[2]]
                      }
                      onChange={(e) => {
                        form.setFieldsValue({
                          [list?.option[0]]: {
                            [list?.option[1]]: {
                              [list?.option[2]]: e.target.checked,
                            },
                          },
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <TextInput
          name={['equalOpportunities', 'birthOrigin', 'otherState']}
          label="Other (Please state)"
          placeholder="Other"
        />
        <div className="formLabel">Disability</div>
        <Row gutter={24}>
          <Col xxl={20} lg={20} xl={20} md={24} sm={24} xs={24}>
            <div className="font-semibold mb-2">
              Do you consider yourself to have a disability (i.e. a physical or mental impairment
              which has a substantial and long term adverse effect on your ability to carry out
              normal day to day activities)?
            </div>
          </Col>
          <Col xxl={4} lg={4} xl={4} md={24} sm={24} xs={24} className="mb-2">
            <Form.Item
              initialValue={'No'}
              noStyle
              name={['equalOpportunities', 'disability', 'haveAdisability']}
              form={form}
            >
              <Radio.Group options={['Yes', 'No']} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name={['equalOpportunities', 'disability', 'adaptationAndAdjustment']}
          form={form}
          label={
            <span className="formLabel">
              If yes, what equipment, adaptations or adjustments to working conditions would assist
              you in carrying out your duties?
            </span>
          }
        >
          <AwesomeEditor
            type="descriptionForm"
            initialValue={
              formData &&
              data &&
              data !== 'createServiceUserForm' &&
              formData?.equalOpportunities?.disability?.adaptationAndAdjustment?.JSONText
            }
            placeholder="Your comments here..."
          />
        </Form.Item>
        <Row gutter={24}>
          <Col xxl={12} lg={12} xl={12} md={12} sm={12} xs={12}>
            <div className="formLabel">Gender</div>

            <Form.Item
              initialValue={'Female'}
              noStyle
              name={['equalOpportunities', 'gender']}
              form={form}
            >
              <Radio.Group options={['Female', 'Male']} />
            </Form.Item>
          </Col>
          <Col xxl={12} lg={12} xl={12} md={12} sm={12} xs={12} className="mb-2">
            <div className="formLabel">Marital Status</div>
            <Form.Item
              initialValue={'Married'}
              noStyle
              name={['equalOpportunities', 'maritalStatus']}
              form={form}
            >
              <Radio.Group options={['Married', 'Single']} />
            </Form.Item>
          </Col>
        </Row>
        <div className="formLabel mt-2">
          How did you hear about the vacancy, or about the Company?
        </div>
        <Row gutter={24}>
          {vacancyInfoSources.map((list) => (
            <Col lg={12} xl={12} md={24} sm={24} xs={24} key={list?.value}>
              <div className="flex">
                <div className="text-sm my-2 mr-2 formLabel w-1/4">{list.description}</div>
                <div className="mt-2 ml-6">
                  <Form.Item name={list?.option} form={form}>
                    <Checkbox
                      defaultChecked={
                        formData &&
                        data &&
                        data !== 'createServiceUserForm' &&
                        formData?.[list?.option[0]]?.[list?.option[1]]?.[list?.option[2]]
                      }
                      onChange={(e) => {
                        form.setFieldsValue({
                          [list?.option[0]]: {
                            [list?.option[1]]: {
                              [list?.option[2]]: e.target.checked,
                            },
                          },
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <TextInput
          name={['equalOpportunities', 'vacancyInfoSources', 'otherSource']}
          label="Other (Please state)"
          placeholder="Other"
        />
        <Row gutter={24}>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['equalOpportunities', 'Age']}
              label="Age-Years (Please insert)"
              placeholder="Age"
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['equalOpportunities', 'printName']}
              label="Print name"
              placeholder="Print name"
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <TextInput
              name={['equalOpportunities', 'positionAppliedFor']}
              label="Position applied for"
              placeholder="Position applied for"
            />
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <DateInput name={['equalOpportunities', `date`]} label="Date" placeholder="Date" />
          </Col>
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <div className="formLabel">Signature</div>
            {data === 'editServiceUserForm' || data === 'editForm' ? (
              <div className="my-2">
                {formData?.signatures?.equalOpportunitiesSign ? (
                  <img
                    style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                    className="w-full"
                    src={formData?.signatures?.equalOpportunitiesSign}
                    alt="equalOpportunitiesSign"
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
                      signPag.current.equalOpportunitiesSign = sign;
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => onClear('equalOpportunitiesSign')} className="px-4">
                    Clear
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(EqualOpportunitiesForm);
