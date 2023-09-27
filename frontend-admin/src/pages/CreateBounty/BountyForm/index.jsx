import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import moment from 'moment';

import React, { useState } from 'react';
import { connect, history } from 'umi';

const rewardCoins = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: '10' },
];
const timetaken = [
  { value: '1 ' },
  { value: '2 ' },
  { value: '3 ' },
  { value: '4 ' },
  { value: '5 ' },
  { value: '6 ' },
  { value: '7 ' },
  { value: '8 ' },
  { value: '9 ' },
  { value: '10 ' },
];
const { Option } = Select;
const bountyType = [
  { value: 'Survey', type: 'Survey' },
  { value: 'Question', type: 'Question' },
  { value: 'Meme Contest', type: 'Meme_contest' },
];
const BountyForm = ({ isModalVisible, setIsModalVisible, dispatch, getAllBounty }) => {
  const [isMemeContest, setIsMemeContest] = useState('');
  const [isTimeSelected, setIsTimeSelected] = useState();
  const [form] = Form.useForm();
  const [value, setValue] = useState('Fulltime');
  const [startDate, setStartDate] = useState();

  const onChange = (checkedValues) => {};
  const handleChange = (nvalue) => {
    setValue(nvalue);
  };

  const onFinish = (values) => {
    if (isTimeSelected === 'End_time') {
      if (moment(values?.endDate) <= moment(values?.startDate)) {
        return message.error('End date should be greater than start date');
      }
    }
    const body = {
      ...values,
      end_time: values?.end_time ? values?.end_time.toISOString() : undefined,
      startDate: values?.startDate ? values?.startDate.toISOString() : undefined,
      endDate: values?.endDate?.toISOString() || null,
      totalQuestions: '1',
    };

    if (values?.answerType === 'MCQ') {
      body.correctAnswer =
        (values?.option.a && 'a') ||
        (values?.option.b && 'b') ||
        (values?.option.c && 'c') ||
        (values?.option.d && 'd');
    }
    if (values?.answerType !== 'Text' && values?.type !== 'Meme_contest') {
      body.options = [
        {
          option: values?.option.a && 'a',
          value: values?.option?.a,
        },
        {
          option: values?.option.b && 'b',
          value: values?.option?.b,
        },
        {
          option: values?.option.c && 'c',
          value: values?.option?.c,
        },
        {
          option: values?.option.d && 'd',
          value: values?.option?.d,
        },
      ];
    }

    dispatch({
      type: 'bounty/createBounty',
      payload: {
        body,
      },
    }).then((res) => {
      if (res?.message === 'success') {
        form.resetFields();
        setIsModalVisible(false);
        setIsMemeContest('');
        setValue('Fulltime');
        setIsTimeSelected('');
        setStartDate();
        getAllBounty();
        // window.replace('/manage-bounties');
        message.success('Bounty created successfully ');
        history.replace('/manage-bounties');
      } else if (res.status === 400) {
        message.info('End date and time is required!');
      } else {
        message.error('something went wrong please try again ');
      }
    });
  };
  return (
    <div>
      <Modal
        title="Create a bounty"
        width={800}
        centered
        footer={null}
        closeIcon={<CloseCircleOutlined style={{ color: 'white', fontSize: '32px' }} />}
        className="modalStyle"
        visible={isModalVisible}
        onOk={() => {
          setIsModalVisible(false);
        }}
        onCancel={() => {
          form.resetFields();
          setIsModalVisible(false);
          setIsMemeContest('');
          setValue('Fulltime');
          setIsTimeSelected('');
          setStartDate();
        }}
      >
        <div className="mx-auto">
          <Form form={form} name="bountyForm" onFinish={onFinish}>
            <Row gutter={24} style={{ padding: '15px' }}>
              <Col xs={24} sm={12} md={8} xl={8}>
                <div className=" ">
                  <h4>Program Name</h4>
                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter program name ',
                      },
                    ]}
                  >
                    <Input placeholder="Enter program name" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>Select Bounty Type </h4>
                  <Form.Item
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: ' Please select bounty type',
                      },
                    ]}
                  >
                    <Select
                      onChange={(e) => {
                        setIsMemeContest(e);
                        setValue('');
                        form.setFieldsValue({
                          answerType: undefined,
                        });
                        setValue();
                      }}
                      placeholder="please select bounty type"
                    >
                      {bountyType.map((elem, idx) => (
                        <Option value={elem.type} key={elem.id}>
                          {elem.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>Coin To Reward</h4>
                  <Form.Item
                    name="meme_coins"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the coins',
                      },
                    ]}
                  >
                    <Select defaultValue="select" size="medium">
                      {rewardCoins.map((elem, idx) => (
                        <Option value={elem.value} key={elem.id}>
                          {elem.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {isMemeContest !== 'Meme_contest' && (
                <Col xs={24} sm={12} md={8} xl={8}>
                  <div className="">
                    <h4>Write a Question/Survey </h4>
                    <Form.Item
                      name="question"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter the question/survey',
                        },
                      ]}
                    >
                      <Input placeholder="Enter the question/survey" />
                    </Form.Item>
                  </div>
                </Col>
              )}
              {isMemeContest !== 'Meme_contest' && (
                <Col xs={24} sm={12} md={8} xl={8}>
                  <div className="">
                    <h4>Answer type</h4>
                    <Form.Item
                      name="answerType"
                      rules={[
                        {
                          required: true,
                          message: 'Text/MCQ',
                        },
                      ]}
                    >
                      <Select placeholder="Please select answer type" onChange={handleChange}>
                        <Select.Option key="MCQ" value="MCQ">
                          MCQ
                        </Select.Option>
                        <Select.Option key="Text" value="Text">
                          Text
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              )}

              <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>Start date / Time</h4>
                  <Form.Item
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message: 'Please select date',
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) => current && moment(current) < moment()}
                      // defaultPickerValue={moment()}
                      // defaultValue={moment()}
                      defaultPickerValue={moment()}
                      onChange={(e) => {
                        console.log('e', e);
                        form.setFieldsValue({
                          endDate: undefined,
                        });
                        setStartDate(e);
                      }}
                      showTime
                      style={{ width: '100%' }}
                      name="selectDate"
                      placeholder="DD/MM/YYYY HH:MM"
                    />
                  </Form.Item>
                </div>
              </Col>

              {/* {isMemeContest === 'Meme_contest' && (
                <Col xs={24} sm={12} md={8} xl={8}>
                  <div className="">
                    <h4>End date </h4>
                    <Form.Item
                      // name="end_date"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date',
                        },
                      ]}
                    >
                      <DatePicker style={{ width: '100%' }} name="selectDate" />
                    </Form.Item>
                  </div>
                </Col>
              )} */}

              {value === 'MCQ' && (
                <Checkbox.Group onChange={onChange}>
                  <Row>
                    <Col xs={12} md={8} xl={6} style={{ padding: '3px' }}>
                      <p className="mx-2 mb-1">A</p>
                      <Form.Item
                        name={['option', 'a']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter option',
                          },
                        ]}
                      >
                        <Input placeholder="Enter option A" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={8} xl={6} style={{ padding: '3px' }}>
                      <p className="mx-2 mb-1">B</p>
                      <Form.Item
                        name={['option', 'b']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter option',
                          },
                        ]}
                      >
                        <Input placeholder="Enter option B" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={8} xl={6} style={{ padding: '3px' }}>
                      <p className="mx-2 mb-1">C</p>
                      <Form.Item
                        name={['option', 'c']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter option',
                          },
                        ]}
                      >
                        <Input placeholder="Enter option C" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={8} xl={6} style={{ padding: '3px' }}>
                      <p className="mx-2 mb-1">D</p>
                      <Form.Item
                        name={['option', 'd']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter option',
                          },
                        ]}
                      >
                        <Input placeholder="Enter option D" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Checkbox.Group>
              )}
              {value === 'Text' && (
                <Col xs={24} sm={12} md={8} xl={24}>
                  <div className=" ">
                    <h4>Answer</h4>
                    <Form.Item
                      name="correctAnswer"
                      rules={[
                        {
                          required: true,
                          message: 'Answer',
                        },
                      ]}
                    >
                      <Input placeholder="Answer" />
                    </Form.Item>
                  </div>
                </Col>
              )}

              {/* <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>Start Time</h4>
                  <Form.Item
                    name="start_time"
                    rules={[
                      {
                        required: true,
                        message: 'Please select time ',
                      },
                    ]}
                  >
                    <TimePicker
                      use12Hours
                      format="h:mm a"
                      style={{ width: '100%' }}
                      placeholder="HH:MM:am"
                      name="start_time"
                      defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    />
                  </Form.Item>
                </div>
              </Col> */}
              <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>End date/Time </h4>
                  <Form.Item
                    initialValue={startDate && moment(startDate).add('minute', 5)}
                    name="endDate"
                    rules={[
                      {
                        required: isTimeSelected !== 'total_attempt',
                        message: 'Please select date',
                      },
                    ]}
                  >
                    <DatePicker
                      // disabledTime={(c) => c && c.valueOf() <= startDate}
                      disabledDate={(current) => current && current.valueOf() < startDate}
                      onChange={(e) => {
                        setIsTimeSelected(e ? 'End_time' : undefined);
                      }}
                      disabled={isTimeSelected === 'total_attempt'}
                      showTime
                      style={{ width: '100%' }}
                      name="selectDate"
                      placeholder="DD/MM/YYYY HH:MM"
                    />
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>Ends Time</h4>
                  <Form.Item
                    name="end_time"
                    rules={[
                      {
                        required: isTimeSelected === 'total_attempt' ? false : true,
                        message: 'Please select end time ',
                      },
                    ]}
                  >
                    <TimePicker
                      use12Hours
                      format="h:mm a"
                      placeholder="HH:MM:am"
                      disabled={isTimeSelected === 'total_attempt' ? true : false}
                      // allowClear={() => setIsTimeSelected()}
                      style={{ width: '100%' }}
                      name="end_time"
                      defaultOpenValue={moment()}
                      onChange={(e) => {
                        setIsTimeSelected(e ? 'End_time' : undefined);
                      }}
                    />
                  </Form.Item>
                </div>
              </Col> */}
              <Col xs={24} sm={12} md={8} xl={8}>
                <div className="">
                  <h4>No. of times it can be taken</h4>
                  <Form.Item
                    name="totalAttempts"
                    rules={[
                      {
                        required: isTimeSelected === 'End_time' ? false : true,
                        message: 'Please select the items',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      disabled={isTimeSelected === 'End_time' ? true : false}
                      placeholder="Total attempt"
                      onChange={(e) => {
                        setIsTimeSelected(e ? 'total_attempt' : undefined);
                      }}
                    >
                      {timetaken.map((elem, idx) => (
                        <Option value={elem.value} key={elem.id}>
                          {elem.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="flex justify-end px-10 py-8">
              <Button htmlType="submit" type="primary">
                Create
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default connect(() => ({}))(BountyForm);
