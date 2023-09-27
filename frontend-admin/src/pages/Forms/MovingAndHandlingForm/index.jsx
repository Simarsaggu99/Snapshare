/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import ConfirmModal from '@/components/ConfirmModal';
import AwesomeEditor from '@/components/AwesomeEditor';
import { connect, useParams } from 'umi';

const otherInputList = [
  {
    description: 'Description of equipment used',
    value: '1',
    row: 3,
    name: ['details', 'equipment'],
  },
  {
    description:
      'Does the requirement involve strenuous pushing or pulling? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '2',
    row: 3,
    name: ['details', 'involveStrenuous'],
  },
  {
    description:
      'Does the requirement involve twisting or bending or any awkward postures? Is there any risk involved? Description of the risk.',
    value: '3',
    row: 3,
    name: ['details', 'involveTwisting'],
  },
  {
    description: 'How will the risk be minimized?',
    value: '4',
    row: 2,
    name: ['details', 'riskMinimize1'],
  },
  {
    description:
      "Does the requirement involve insufficient time to work at the customer's own pace, or insufficient rest or recovery? Is there any risk involved?",
    value: '5',
    row: 2,
    name: ['details', 'involveTime'],
  },
  {
    description: 'Description of risk. How will the risk be minimized?',
    value: '6',
    row: 2,
    name: ['details', 'riskMinimize2'],
  },
  {
    description:
      'Are there any other concerns? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '7',
    row: 3,
    name: ['details', 'otherRiskConcern'],
  },
  {
    description: 'Care workers role.',
    value: '8',
    row: 2,
    name: ['details', 'careWorker'],
  },
  {
    description:
      'Does the task require special information or training other than manual handling and care worker induction training?',
    value: '9',
    row: 2,
    name: ['details', 'specialInfo'],
  },
  {
    description:
      'Does the task require height or strength to be considered? Is there any risk involved? How will the risk be minimized?',
    value: '10',
    row: 2,
    name: ['details', 'taskDimensions'],
  },
  {
    description:
      'Does the task pose a risk to people with health problems or who are pregnant? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '11',
    row: 2,
    name: ['details', 'healthProblem'],
  },
  {
    description:
      'Does the task require more than one care worker? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '12',
    row: 2,
    name: ['details', 'moreCareWorker'],
  },
  {
    description:
      'Is there insufficient time allocated to complete the task? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '13',
    row: 2,
    name: ['details', 'insufficientTime'],
  },
  {
    description:
      'Are there any other concerns? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '14',
    row: 2,
    name: ['details', 'otherConcerns'],
  },

  {
    description:
      'Do you have any health issue which need to be considered? e.g. tissue viability/joint problems. Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '15',
    row: 2,
    name: ['details', 'jointProblem'],
  },
  {
    description:
      'Do you have any problems with us supporting? You to be able to carry out the task? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '16',
    row: 2,
    name: ['details', 'supportProblem'],
  },
  {
    description: 'Environment',
    value: '17',
    row: 2,
    name: ['details', 'environment'],
  },
  {
    description:
      'Are there any constraints on posture? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '18',
    row: 2,
    name: ['details', 'posture'],
  },
  {
    description:
      'Are floors surfaces uneven, are there level variations or does the floor covering not allow equipment to move freely? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '19',
    row: 2,
    name: ['details', 'floorSurface'],
  },
  {
    description:
      'Any space constraints? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '20',
    row: 2,
    name: ['details', 'spaceConstraint'],
  },
  {
    description:
      'Are there any concerns regarding lighting and temperature? Is there any risk involved? Description of risk. How will the risk be minimized?',
    value: '21',
    row: '2',
    name: ['details', 'lightConcern'],
  },
];

const MovingAndHandlingForm = ({
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
    if (match?.path === '/forms/moving-and-handling') {
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
    if (serviceUserId && data === 'createServiceUserForm') {
      dispatch({
        type: 'serviceUser/getServiceUser',
        payload: { pathParams: { id: serviceUserId } },
      });
    }
  }, [dispatch, serviceUserId, data]);

  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          assignmentDate: formData?.assignmentDate ? moment(formData?.assignmentDate) : '',
          date: formData?.date ? moment(formData?.date) : '',
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
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Moving and Handling Assessment Form</div>
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
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError
        onFinish={(values) => {
          const dataForApi = values;
          if (values.assignmentDate)
            dataForApi.assignmentDate = new Date(values.assignmentDate).toISOString();
          if (values.date) dataForApi.date = new Date(values.date).toISOString();
          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/risk-assessment' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }
            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'movingAndHandlingForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('confirm');
                setType('movingAndHandlingForm');
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
                body: { ...dataForApi, type: 'movingAndHandlingForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('movingAndHandlingForm');
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
          <TextInput
            reff={inputEl}
            autoFocus
            name="serviceUser"
            label="Service User Name"
            placeholder="product and manufacturer"
            rules={[
              {
                whitespace: true,
                required: true,
                message: 'Please enter the name ',
              },
            ]}
          />
          {otherInputList.map((list) => (
            <Form.Item
              key={list.value}
              name={list.name}
              label={<span className="formLabel">{list.description}</span>}
            >
              <AwesomeEditor
                type="descriptionForm"
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.[list?.name[0]]?.[list?.name[1]]?.JSONText
                }
                placeholder="your description here..."
              />
            </Form.Item>
          ))}
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="completedBy"
                label="Completed by"
                placeholder="Person Name"
                rules={[
                  {
                    whitespace: true,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="date" label="Date" placeholder="Select Date" />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput
                name="assignmentDate"
                label="Next Assessment due"
                placeholder="Select Date"
              />
            </Col>
          </Row>
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => form.submit()}
          >
            {match.path === '/forms/moving-and-handling' || serviceUserId ? 'Submit' : 'Update'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  formData: forms.formData,
  getServiceUser: serviceUser.getServiceUser,
  loadingEditForm: loading.effects['forms/editForm'],
  currentUser: user.currentUser,
}))(MovingAndHandlingForm);
