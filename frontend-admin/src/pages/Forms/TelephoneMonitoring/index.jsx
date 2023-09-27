/* eslint-disable no-underscore-dangle */
import NumberInput from '@/components/NumberInput';
import { Input, Form, Row, Col, DatePicker, Button, Radio } from 'antd';
import { connect, useParams } from 'umi';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import ConfirmModal from '@/components/ConfirmModal';
import AwesomeEditor from '@/components/AwesomeEditor';

const { TextArea } = Input;

const options = ['Yes', 'No', 'N/A'];

const descriptionList = [
  {
    description: 'Do you think the care/support you receive is reliable? (Regularly on time)',
    value: '1',
    name: ['reliable', 'value'],
    option: ['reliable', 'choice'],
  },
  {
    description:
      'Have all your scheduled visits been attended? (Check for excessive missed calls etc.)',
    value: '2',
    name: ['scheduleAttended', 'value'],
    option: ['scheduleAttended', 'choice'],
  },
  {
    description:
      'Are you always informed if there is a change or if your care/support worker is delayed?',
    value: '3',
    name: ['workerDelayed', 'value'],
    option: ['workerDelayed', 'choice'],
  },
  {
    description: 'Does your care/support worker stay the full time with you for the visit?',
    value: '4',
    name: ['workerStay', 'value'],
    option: ['workerStay', 'choice'],
  },
  {
    description: 'Do they have their ID and use the required protective equipment? (Gloves etc.)',
    value: '5',
    name: ['protectiveEquipment', 'value'],
    option: ['protectiveEquipment', 'choice'],
  },
  {
    description: 'Are always your care/support workers friendly and courteous towards you?',
    value: '6',
    name: ['friendly', 'value'],
    option: ['friendly', 'choice'],
  },
  {
    description:
      'Are you receiving the care/support as agreed on your care/support plan? (Are we meeting your outcomes/needs)',
    value: '7',
    name: ['receivecare', 'value'],
    option: ['receivecare', 'choice'],
  },
  {
    description:
      'Does the care/support you receive enable you to do as much you can for yourself (Help you remain as independent as possible?) How so?',
    value: '8',
    name: ['independent', 'value'],
    option: ['independent', 'choice'],
  },
  {
    description: 'Do you feel safer because of the care/support you receive from us?',
    value: '9',
    name: ['feelSafer', 'value'],
    option: ['feelSafer', 'choice'],
  },
  {
    description:
      'Are you asked to sign a time sheet after each visit from your care support worker?',
    value: '10',
    name: ['supportWorker', 'value'],
    option: ['supportWorker', 'choice'],
  },
  {
    description:
      "Have you had to call the 'Out of Hours' service? If so, are you happy with how your call was dealt with?",
    value: '11',
    name: ['outOfHour', 'value'],
    option: ['outOfHour', 'choice'],
  },
  {
    description:
      'Are you visited regularly by your field based manager to make sure you are happy with the service?',
    value: '12',
    name: ['happyService', 'value'],
    option: ['happyService', 'choice'],
  },
  {
    description:
      'Do you know how to contact the office and who to speak to if you have a problem or wish to make a complaint?',
    value: '13',
    name: ['complaint', 'value'],
    option: ['complaint', 'choice'],
  },
];

const TelephonicMonitoring = ({
  dispatch,
  loading,
  formData,
  loadingEditForm,
  match,
  getServiceUser,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const [type, setType] = useState('');
  const [id, setId] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [status, setStatus] = useState('');
  const { data } = getPageQuery();
  const { formId, serviceUserId } = useParams();
  const inputEl = useRef();

  const emptyServiceUser = useCallback(
    () => dispatch({ type: 'serviceUser/setStates', payload: null, key: 'getServiceUser' }),
    [dispatch],
  );

  const emptyFormData = useCallback(
    () => dispatch({ type: 'forms/setStates', payload: null, key: 'formData' }),
    [dispatch],
  );

  const onFormRender = () => {
    inputEl.current.focus();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    onFormRender();
  }, []);

  useEffect(() => {
    if (match.path === '/forms/telephone-monitoring') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [emptyFormData, emptyServiceUser, match.path, dispatch]);

  useEffect(() => {
    if (formId) {
      dispatch({
        type: 'forms/getFormData',
        payload: { id: formId },
      });
    }
  }, [dispatch, formId]);

  useEffect(() => {
    if (serviceUserId && data === 'createServiceUserForm') {
      dispatch({
        type: 'serviceUser/getServiceUser',
        payload: { pathParams: { id: serviceUserId } },
      });
    }
  }, [dispatch, serviceUserId, data]);

  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
        <Input ref={reff} autoFocus={autoFocus} size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  const DateInput = ({ name, label, placeholder }) => {
    return (
      <Form.Item name={name} label={<span className="formLabel">{label}</span>}>
        <DatePicker
          format="DD MMMM YYYY"
          style={{ width: '100%' }}
          placeholder={placeholder}
          size="large"
        />
      </Form.Item>
    );
  };
  useEffect(() => {
    if (formData) {
      emptyServiceUser();

      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          improvementDate: formData?.improvementDate ? moment(formData?.improvementDate) : '',
          date: formData?.date ? moment(formData?.date) : '',
        });
      }
    }
    return () => form?.resetFields();
  }, [data, emptyServiceUser, form, formData, formId]);

  useEffect(() => {
    if (getServiceUser) {
      emptyFormData();
      if (getServiceUser?.first_name?.length > 0) {
        form.setFieldsValue({
          ...getServiceUser,
          serviceUser: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-2xl px-4 py-2">Telephone Monitoring Form</div>
      <ConfirmModal
        visible={confirmModal}
        setVisible={setConfirmModal}
        type={type}
        id={id}
        status={status}
      />

      <Form
        scrollToFirstError
        colon="false"
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={(values) => {
          const dataForApi = values;
          if (values.improvementDate)
            dataForApi.improvementDate = new Date(values.improvementDate).toISOString();
          if (values.date) dataForApi.date = new Date(values.date).toISOString();
          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/telephone-monitoring' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'telephoneMonitoring' },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('confirm');
                setType('telephoneMonitoring');
                setId(res?._id);
                form.resetFields();
              } else {
                setConfirmModal(true);
                setStatus('reject');
              }
            });
          } else {
            dispatch({
              type: 'forms/editForm',
              payload: {
                pathParams: { id: formId },
                body: { ...dataForApi, type: 'telephoneMonitoring' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('telephoneMonitoring');
                setId(formId);
              } else {
                setConfirmModal(true);
                setStatus('unSuccessful');
              }
            });
          }
        }}
        autoComplete="off"
      >
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                reff={inputEl}
                autoFocus
                name="serviceUser"
                label="Service user"
                placeholder="Service User"
                rules={[{ required: true, message: 'Please enter the name of service user' }]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="date" label="Date" placeholder="Select Date" />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="spokenPerson"
                label="Name of person spoken to "
                placeholder="Person Name"
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="makingCall"
                label="Name of person making call"
                placeholder="Person Name"
              />
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <Row gutter={24}>
            {descriptionList.map((list) => (
              <Col lg={12} xl={12} md={24} sm={24} xs={24} key={list.value}>
                <div className="flex px-2 justify-between text-sm">
                  <div className="flex-1">{list.description}</div>
                  <div>
                    <Form.Item initialValue="Yes" name={list?.option} noStyle>
                      <Radio.Group options={options} />
                    </Form.Item>
                  </div>
                </div>
                <div className="p-2">
                  <Form.Item name={list.name}>
                    <AwesomeEditor
                      type="descriptionForm"
                      initialValue={
                        formData &&
                        data &&
                        data !== 'createServiceUserForm' &&
                        formData?.[list?.name[0]]?.[list?.name[1]]?.JSONText
                      }
                      placeholder="Your answer here..."
                    />
                  </Form.Item>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className="text-sm px-2">
            Is there anything else you would like to tell us? This might be about the quality of the
            care or support you are receiving or anything else?
          </div>
          <div className="p-2">
            <Form.Item
              name="careSupport"
              rules={[
                {
                  whitespace: true,
                },
              ]}
            >
              <TextArea
                size="large"
                placeholder="Your answer here..."
                rows="3"
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="text-sm px-2">
            If any of the above answers are &apos;NO&apos;, records comments above and transfer to
            an improvement logs on carefree.
          </div>
          <div className="p-2">
            <Row gutter={24}>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput
                  name="improvementDate"
                  label="Date improvements logged on complaint folder"
                  placeholder="Select date"
                />
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="logNumber"
                  label={<span className="formLabel ">Improvement log number/s</span>}
                >
                  <NumberInput
                    size="large"
                    style={{ width: '100%' }}
                    form={form}
                    name="logNumber"
                    placeholder="Log number"
                  />
                </Form.Item>
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <TextInput
                  name="managerName"
                  label="Managers Name"
                  placeholder="Manager name here"
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="flex justify-end">
          {(match.path === '/forms/telephone-monitoring' || serviceUserId) && (
            <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
              Submit
            </Button>
          )}

          {formData && !serviceUserId && match.path !== '/forms/telephone-monitoring' && (
            <Button
              type="primary"
              size="large"
              loading={loadingEditForm}
              onClick={() => form.submit()}
            >
              Update
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  formData: forms.formData,
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  currentUser: user.currentUser,
}))(TelephonicMonitoring);
