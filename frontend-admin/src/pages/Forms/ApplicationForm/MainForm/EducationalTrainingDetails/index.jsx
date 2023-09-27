/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const EducationalTrainingDetails = ({ form }) => {
  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        Education (since 11 yrs. old)
      </div>
      <Form.List name={['mainForm', 'educationDetails']} form={form}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row key={fieldKey} gutter={24}>
                <Col lg={5} xl={5} md={11} sm={11} xs={11}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dateFrom']}
                    fieldKey={[fieldKey, 'dateFrom']}
                    label={<span className="formLabel">Date from</span>}
                  >
                    <DatePicker
                      format="DD MMMM YYYY"
                      style={{ width: '100%' }}
                      placeholder="Date from"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col lg={5} xl={5} md={11} sm={11} xs={11}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dateTo']}
                    fieldKey={[fieldKey, 'dateTo']}
                    label={<span className="formLabel">Date to</span>}
                  >
                    <DatePicker
                      format="DD MMMM YYYY"
                      style={{ width: '100%' }}
                      placeholder="Date to"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xl={6} md={11} sm={11} xs={11}>
                  <Form.Item
                    {...restField}
                    name={[name, 'schoolName']}
                    fieldKey={[fieldKey, 'schoolName']}
                    label={<span className="formLabel">School name</span>}
                  >
                    <Input placeholder="School name" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} xl={6} md={11} sm={11} xs={11}>
                  <Form.Item
                    {...restField}
                    name={[name, 'qualifications']}
                    fieldKey={[fieldKey, 'qualifications']}
                    label={<span className="formLabel">Qualifications</span>}
                  >
                    <Input placeholder="Qualifications" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={2} xl={2} md={2} sm={2} xs={2}>
                  <MinusCircleOutlined onClick={() => remove(name)} className="mt-10" />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add education details
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        <span className="font-bold"> Training</span> – please list all the relevant training you
        have done with the most recent first. Please provide copy of certificate
      </div>
      <Form.List name={['mainForm', 'trainingDetails']} form={form}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row key={fieldKey} gutter={24}>
                <Col lg={7} xl={7} md={22} sm={22} xs={22}>
                  <Form.Item
                    {...restField}
                    name={[name, 'nameOfCourse']}
                    fieldKey={[fieldKey, 'nameOfCourse']}
                    label={<span className="formLabel">Name of course</span>}
                  >
                    <Input placeholder="Name of course" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={7} xl={7} md={9} sm={9} xs={9}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dateCompleted']}
                    fieldKey={[fieldKey, 'dateCompleted']}
                    label={<span className="formLabel">Date completed</span>}
                  >
                    <DatePicker
                      format="DD MMMM YYYY"
                      style={{ width: '100%' }}
                      placeholder="Date completed"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xl={8} md={9} sm={9} xs={9}>
                  <Form.Item
                    {...restField}
                    name={[name, 'lengthOfCourse']}
                    fieldKey={[fieldKey, 'lengthOfCourse']}
                    label={<span className="formLabel">Length of course</span>}
                  >
                    <Input placeholder="Length of course" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={2} xl={2} md={2} sm={2} xs={2}>
                  <MinusCircleOutlined onClick={() => remove(name)} className="mt-10" />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add training details
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(EducationalTrainingDetails);
