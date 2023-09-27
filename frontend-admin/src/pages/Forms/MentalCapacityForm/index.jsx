/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AwesomeEditor from '@/components/AwesomeEditor';
import ConfirmModal from '@/components/ConfirmModal';

const MentalCapacityForm = ({
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
  const { formId, serviceUserId } = useParams();
  const { data } = getPageQuery();

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
    if (match.path === '/forms/mental-capacity') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [emptyFormData, emptyServiceUser, match?.path]);
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

  const boldList = [
    {
      text: 'Understand the information relevant to the decision',
      value: '1',
    },
    {
      text: 'Retain that information',
      value: '2',
    },
    {
      text: 'Use or weigh up that information as part of the process of making the decision',
      value: '3',
    },
  ];

  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          date1: formData?.date1 ? moment(formData?.date1) : '',
          date2: formData?.date2 ? moment(formData?.date2) : '',
          date3: formData?.date3 ? moment(formData?.date3) : '',
        });
      }
    }
    return () => {
      form?.resetFields();
    };
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
  }, [emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl py-2">Mental Capacity Assessment Form</div>
      <ConfirmModal
        visible={confirmModal}
        setVisible={setConfirmModal}
        type={type}
        id={id}
        status={status}
      />

      <Form
        colon="false"
        layout="vertical"
        form={form}
        scrollToFirstError
        autoComplete="off"
        requiredMark={false}
        onFinish={(values) => {
          const dataForApi = values;
          if (values.date1) dataForApi.date1 = new Date(values.date1).toISOString();
          if (values.date2) dataForApi.date2 = new Date(values.date2).toISOString();
          if (values.date3) dataForApi.date3 = new Date(values.date3).toISOString();
          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/mental-capacity' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'mentalCapacityForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('confirm');
                setType('mentalCapacityForm');
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
                body: { ...dataForApi, type: 'mentalCapacityForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('mentalCapacityForm');
                setId(formId);
              } else {
                setConfirmModal(true);
                setStatus('unSuccessful');
              }
            });
          }
        }}
      >
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                reff={inputEl}
                autoFocus
                name="serviceUser"
                label="Service User Name"
                placeholder="Service User"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: 'Please enter name of service user',
                  },
                ]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="date1" label="Date" placeholder="Select Date" />
            </Col>
          </Row>
          <div className=" font-semibold text-xl" style={{ color: '#5B3A7D' }}>
            This assessment is for service user aged 16 and over and in relation to the decision
            making to this service user care and support from AMI Home Care. Remember, individuals
            can lack capacity to make some decisions but have capacity to make others, so it is
            vital to consider whether the individual lack capacity to make the specific decision.
          </div>
          <div className="py-2 pt-4 font-semibold">
            Does the individual have an impairment of, or a disturbance in the functioning of their
            mind or brain, whether as a result of a condition, illness, or external facts, such as
            alcohol or drug use e.g. demantia, severe learning disability, brain injury, mental
            health condition, stroke, unconsciousness caused by a sudden accident/anesthic. This
            could be temporary impairment e.g. alcohol excess
          </div>

          <Form.Item name="serviceUserData">
            <AwesomeEditor
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.serviceUserData?.JSONText
              }
              placeholder="your comments here..."
            />
          </Form.Item>

          <div className="py-2 font-semibold">
            Does the impairment or disturbance mean the individual is unable to make a specific
            decision when they need to in relation to their care support from AMI. Remember the MCA
            says a person is unable to make a decision if they cannot:
          </div>
          <div>
            {boldList.map((list) => (
              <div className="flex items-center" key={list.value}>
                <div style={{ backgroundColor: '#9D1D5A' }} className="w-2 h-2 mr-3 rounded-full" />
                <div key={list.value}>{list.text}</div>
              </div>
            ))}
          </div>

          <div className="py-2 pt-4 font-semibold">
            If customer is not able to do any of the above three things or communicate their
            decision (by talking, using sign language, or through other means), the customer will be
            treated as unable to make the specific decision in question.
          </div>

          <Form.Item name="specificDecisionData">
            <AwesomeEditor
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.specificDecisionData?.JSONText
              }
              placeholder="your comments here..."
            />
          </Form.Item>

          <div className=" font-semibold text-xl" style={{ color: '#5B3A7D' }}>
            If above answer is NO, you do not need to be complete the rest of the form. The customer
            is able to make their own decisions. Remember to continue reviewing the customer and
            complete another form if the mental capacity changes. If YES, please continue to next
            question.
          </div>
          <div className="py-2 pt-4 font-semibold">
            Please record more details of the potential decisions care workers / managers may make
            in the customers best interest. Individual is unable to make a specific decision when
            they need to in relation to their care and support plan form AMI?
          </div>

          <Form.Item name="supportAmi">
            <AwesomeEditor
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.supportAmi?.JSONText
              }
              placeholder="your comments here..."
            />
          </Form.Item>

          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="printName"
                label="Print Name"
                placeholder="Print Name"
                rules={[{ whitespace: true }]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="date2" label="Date" placeholder="Select Date" />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="customer"
                label="Customer or Customer Representative"
                placeholder="Person Name"
                rules={[{ whitespace: true }]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="date3" label="Date" placeholder="Select Date" />
            </Col>
          </Row>
        </div>

        <div className="flex justify-end">
          {(match.path === '/forms/mental-capacity' || serviceUserId) && (
            <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
              Submit
            </Button>
          )}

          {formData && !serviceUserId && match.path !== '/forms/mental-capacity' && (
            <Button
              type="primary"
              size="large"
              loading={loadingEditForm}
              onClick={() => form?.submit()}
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
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(MentalCapacityForm);
