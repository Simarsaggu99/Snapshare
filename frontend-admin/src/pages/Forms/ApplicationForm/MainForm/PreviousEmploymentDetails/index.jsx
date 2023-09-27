/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Row, Col, Button, Form, Input, Radio, DatePicker, Tooltip } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { getPageQuery } from '@/utils/utils';
import AwesomeEditor from '@/components/AwesomeEditor';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const PreviousEmploymentDetails = ({ form, formData }) => {
  const { data } = getPageQuery();
  const TextInput = ({ name, placeholder, label }) => {
    return (
      <Form.Item
        name={name}
        form={form}
        label={label && <span className="formLabel">{label}</span>}
      >
        <Input size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        Please provide full employment including current employer (please write most recent first).
        It is important there are no gaps in employment. Previous employment to this to be listed
        but gaps may not always be justified.
      </div>
      <Row gutter={24}>
        <Col xxl={18} lg={18} xl={18} md={24} sm={24} xs={24}>
          <div className="font-semibold mb-2">
            Any gaps in employment below are due to looking after family member including children,
            full time unemployment or full time education/studying – YES / NO (if no please state
            below dates with reason{' '}
          </div>
        </Col>
        <Col xxl={6} lg={6} xl={6} md={24} sm={24} xs={24} className="mb-2">
          <Form.Item
            initialValue={'Yes'}
            noStyle
            name={['mainForm', 'gapInEmployment']}
            form={form}
          >
            <Radio.Group options={['Yes', 'No']} />
          </Form.Item>
        </Col>
      </Row>
      <Form.List name={['mainForm', 'employeeWorkingHistory']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row key={fieldKey} gutter={24}>
                <Col lg={3} xl={3} md={7} sm={7} xs={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dateFrom']}
                    fieldKey={[fieldKey, 'dateFrom']}
                    label={
                      <Tooltip placement="topLeft" title="Date from">
                        <span className="formLabel truncate">Date from</span>
                      </Tooltip>
                    }
                  >
                    <DatePicker
                      format="DD MMMM YYYY"
                      style={{ width: '100%' }}
                      placeholder="Date from"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col lg={3} xl={3} md={7} sm={7} xs={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dateTo']}
                    fieldKey={[fieldKey, 'dateTo']}
                    label={
                      <Tooltip placement="topLeft" title="Date to">
                        <span className="formLabel truncate">Date to</span>
                      </Tooltip>
                    }
                  >
                    <DatePicker
                      format="DD MMMM YYYY"
                      style={{ width: '100%' }}
                      placeholder="Date to"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xl={4} md={7} sm={7} xs={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'employerName']}
                    fieldKey={[fieldKey, 'employerName']}
                    label={
                      <Tooltip placement="topLeft" title="Name/address of employer">
                        <span className="formLabel truncate">Name/address of employer</span>
                      </Tooltip>
                    }
                  >
                    <Input placeholder="Name and address of employer" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={4} xl={4} md={7} sm={7} xs={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'positionHeld']}
                    fieldKey={[fieldKey, 'positionHeld']}
                    label={
                      <Tooltip placement="topLeft" title="Position held">
                        <span className="formLabel truncate">Position held</span>
                      </Tooltip>
                    }
                  >
                    <Input placeholder="Position held" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={4} xl={4} md={7} sm={7} xs={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'keyResponsibilities']}
                    fieldKey={[fieldKey, 'keyResponsibilities']}
                    label={
                      <Tooltip placement="topLeft" title="Key responsibilities">
                        <span className="formLabel truncate">Key responsibilities</span>
                      </Tooltip>
                    }
                  >
                    <Input placeholder="Key responsibilities" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={4} xl={4} md={7} sm={7} xs={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'reasonForLeaving']}
                    fieldKey={[fieldKey, 'reasonForLeaving']}
                    label={
                      <Tooltip placement="topLeft" title="Reason for leaving">
                        <span className="formLabel truncate">Reason for leaving</span>
                      </Tooltip>
                    }
                  >
                    <Input placeholder="Reason for leaving" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={2} xl={2} md={2} sm={2} xs={2}>
                  <MinusCircleOutlined onClick={() => remove(name)} className="mt-10" />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add employment details
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <div className="formLabel">Tell us more about you</div>
      <div className="mt-2">
        {' '}
        <TextInput
          name={['mainForm', 'aboutYourself', 'religion']}
          label=" What religion are you?"
          placeholder="Religion"
        />
      </div>
      <div className="formLabel">Your hobbies/interests? Your aspirations in life?</div>
      <Form.Item form={form} name={['mainForm', 'aboutYourself', 'hobbies']}>
        <AwesomeEditor
          type="descriptionForm"
          initialValue={
            formData &&
            data &&
            data !== 'createServiceUserForm' &&
            formData?.mainForm?.aboutYourself?.hobbies?.JSONText
          }
          placeholder="Your comments here..."
        />
      </Form.Item>
      <TextInput
        name={['mainForm', 'aboutYourself', 'promotionInCompany']}
        label="We are always looking to promote from within the company. Are you looking to progress within the company? "
        placeholder="Promotion in company"
      />

      <Row gutter={24}>
        <Col xxl={20} lg={20} xl={20} md={24} sm={24} xs={24}>
          <div className="font-semibold mb-2">
            If you are successful in your application, we may share your telephone number with other
            employees in the company. Are you happy for us to do this?
          </div>
        </Col>
        <Col xxl={4} lg={4} xl={4} md={24} sm={24} xs={24} className="mb-2">
          <Form.Item
            initialValue={'Yes'}
            noStyle
            name={['mainForm', 'aboutYourself', 'shareTelephoneNumberUponSuccess']}
            form={form}
          >
            <Radio.Group options={['Yes', 'No']} />
          </Form.Item>
        </Col>
      </Row>

      <div>
        <Form.Item
          name={['mainForm', 'aboutYourself', 'reasonToBeWorker']}
          label={
            <span className="formLabel">
              Discuss the main reasons why you would like to be a care & support worker, your
              strengths and weaknesses
            </span>
          }
        >
          <AwesomeEditor
            type="descriptionForm"
            initialValue={
              formData &&
              data &&
              data !== 'createServiceUserForm' &&
              formData?.mainForm?.aboutYourself?.reasonToBeWorker?.JSONText
            }
            placeholder="Your comments here..."
          />
        </Form.Item>
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
}))(PreviousEmploymentDetails);
