/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import { connect, useParams } from 'umi';
import { getPageQuery } from '@/utils/utils';
import moment from 'moment';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AwesomeEditor from '@/components/AwesomeEditor';
import ConfirmModal from '@/components/ConfirmModal';

const achievementsList = [
  {
    description:
      'a) Having reviewed the job description, what aspects of the job do you feel have been done well over the last year?',
    value: '1',
    name: ['achievementsList', 'jobDescriptionReview'],
  },
  {
    description: 'b) What contributed to the success over the last year?',
    value: '2',
    name: ['achievementsList', 'successContribution'],
  },
  {
    description:
      'c) Did the agreed training and development take place? If so, what impact did it have on your job? If not, why did it not take place?',
    value: '3',
    name: ['achievementsList', 'trainingAndDevelopmentAggreement'],
  },
];

const challengesList = [
  {
    description: 'What aspects of the job do you feel might have been done more effectively?',
    value: '1',
    name: ['challengesList', 'effectiveJobAspects'],
  },
  {
    description: 'What kind of challenges have you encountered',
    value: '2',
    name: ['challengesList', 'challengesEncountered'],
  },
];

const actionList = [
  {
    description:
      'What action have you taken to try to become more effective and efficient in your job?',
    value: '1',
    name: ['actionList', 'effectiveActions'],
  },
  {
    description: 'What action has been taken to resolve any difficulties you have encountered?',
    value: '2',
    name: ['actionList', 'difficultiesResolved'],
  },
];

const objectivesList = [
  {
    description: 'What objectives or priorities do you have for the coming year?',
    value: '1',
    name: ['objectivesList', 'comingYearObjectives'],
  },
  {
    description: 'What can the company do to help you achieve the objectives over the next year?',
    value: '2',
    name: ['objectivesList', 'companyObjectives'],
  },
];

const trainingRequirementsList = [
  {
    description:
      'What training or development would assist you in achieving your job related objectives?',
    value: '1',
    name: ['trainingRequirementsList', 'jobRelatedObjectives'],
  },
  {
    description: 'How would they assist you to achieve your objectives?',
    value: '2',
    name: ['trainingRequirementsList', 'objectivesAssisstance'],
  },
];

const otherDetails = [
  {
    text: 'Communication',
    uniqueId: '1',
    displayArray: [
      {
        description: 'How could communication in the company be improved?',
        value: '1',
        name: ['communication', 'details'],
      },
    ],
  },
  {
    text: 'Organisational issues',
    uniqueId: '2',
    displayArray: [
      {
        description:
          'Are there any ways in which the company could improve to assist you in your job?',
        value: '1',
        name: ['organisationalIssues', 'details'],
      },
    ],
  },
  {
    text: 'Job description',
    uniqueId: '3',
    displayArray: [
      {
        description:
          'Do you feel your job description reflects the job you do ? If not please write down your suggestions',
        value: '1',
        name: ['jobDescription', 'details'],
      },
    ],
  },
  {
    text: 'Comments',
    uniqueId: '4',
    displayArray: [
      {
        description: 'Are there any further comments you would like to make?',
        value: '1',
        name: ['comments', 'details'],
      },
    ],
  },
];

const StaffPerformanceAppraisal = ({
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
    if (match.path === '/forms/staff-performance-appraisal') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [dispatch, emptyFormData, emptyServiceUser, match.path]);

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

  const EditorComponent = ({ list }) => {
    return (
      <div className="items-center">
        <Form.Item name={list?.name}>
          <AwesomeEditor
            type="descriptionForm"
            initialValue={
              formData &&
              data &&
              data !== 'createServiceUserForm' &&
              formData?.[list?.name[0]]?.[list?.name[1]]?.JSONText
            }
            placeholder="Your comments here..."
          />
        </Form.Item>
      </div>
    );
  };

  const CardComponent = ({ itemList, displayName, displayBulletPoints }) => {
    return (
      <div className=" py-2">
        <div className="text-xl font-semibold my-2 text-gray-900">{displayName}</div>

        <div className="pb-4 ">
          {itemList.map((list) => (
            <div className="items-center text-sm" key={list?.value}>
              <Row gutter={24}>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  {displayBulletPoints ? (
                    <div className="flex " key={list.value}>
                      <div className="w-4 mt-2">
                        <div
                          style={{ backgroundColor: '#9D1D5A' }}
                          className="w-2 h-2 mr-2 rounded-full"
                        />
                      </div>

                      <div className="font-semibold" key={list.value}>
                        {list.description}
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold items-center">{list?.description}</div>
                  )}
                </Col>
                <Col lg={14} xl={14} md={24} sm={24} xs={24}>
                  <EditorComponent list={list} />
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          date: formData?.date ? moment(formData?.date) : '',
          appraisalDueDate: formData?.appraisalDueDate ? moment(formData?.appraisalDueDate) : '',
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
    }

    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Staff Performance Appraisal</div>
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

          if (values.date) dataForApi.date = new Date(values.date).toISOString();
          if (values.appraisalDueDate)
            dataForApi.appraisalDueDate = new Date(values.appraisalDueDate).toISOString();

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/staff-performance-appraisal' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'staffPerformanceAppraisal' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('staffPerformanceAppraisal');
                setId(res?._id);
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
                body: { ...dataForApi, type: 'staffPerformanceAppraisal' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('staffPerformanceAppraisal');
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
                name="staffMember"
                label="Name of staff member"
                placeholder="Name of the staff member"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: 'Please enter the name of staff member',
                  },
                ]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="date" label="Date" placeholder="Select Date" />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="personCarryingOutAppraisal"
                label="Name of person carrying out appraisal"
                placeholder="Name of person carrying out appraisal"
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput
                name="appraisalDueDate"
                label="Next appraisal due date"
                placeholder="Select Appraisal Due Date"
              />
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-2xl" style={{ color: '#5B3A7D' }}>
            Last period
          </div>
          <CardComponent
            displayBulletPoints={false}
            displayName={'Achievements'}
            itemList={achievementsList}
          />
          <CardComponent
            displayBulletPoints={true}
            displayName={'Challenges'}
            itemList={challengesList}
          />
          <CardComponent displayBulletPoints={true} displayName={'Action'} itemList={actionList} />
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-2xl" style={{ color: '#5B3A7D' }}>
            Next period
          </div>
          <CardComponent
            displayBulletPoints={true}
            displayName={'Objectives for the next 12 months'}
            itemList={objectivesList}
          />
          <CardComponent
            displayBulletPoints={true}
            displayName={'Training requirements'}
            itemList={trainingRequirementsList}
          />
          {otherDetails?.map((item) => (
            <CardComponent
              key={item?.uniqueId}
              displayBulletPoints={false}
              displayName={item?.text}
              itemList={item?.displayArray}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => form?.submit()}
          >
            {match.path === '/forms/staff-performance-appraisal' || serviceUserId
              ? 'Submit'
              : 'Update'}
          </Button>
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
}))(StaffPerformanceAppraisal);
