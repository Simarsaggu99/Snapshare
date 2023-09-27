/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, DatePicker, Button, Radio } from 'antd';
import { connect, useParams } from 'umi';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import AwesomeEditor from '@/components/AwesomeEditor';
import PhoneNumber from '@/components/PhoneNumber';
import moment from 'moment';
import classNames from 'classnames';
import styles from './index.less';
import AvailabilityDetails from './MainForm/AvailabilityDetails';
import ReferenceDetails from './MainForm/ReferenceDetails';
import PreviousEmploymentDetails from './MainForm/PreviousEmploymentDetails';
import PreviousExperience from './MainForm/PreviousExperience';
import BasicDetails from './MainForm/BasicDetails';
import EducationalTrainingDetails from './MainForm/EducationalTrainingDetails';
import TravelDetails from './MainForm/TravelDetails';
import PreEmploymentDetailsForm from './PreEmploymentDetailsForm';
import EqualOpportunitiesForm from './EqualOpportunitiesForm';

const ApplicationForm = ({
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
  const signPag = React.useRef({ signed: {}, preEmployment: {}, equalOpportunitiesSign: {} });
  const onClear = (index) => signPag.current[index].clear();

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
    if (match.path === '/forms/application-form') {
      emptyServiceUser();
      emptyFormData();
      form.setFieldsValue({
        mainForm: {
          educationDetails: [{ dateFrom: '' }],
          trainingDetails: [{ nameOfCourse: '' }],
          employeeWorkingHistory: [{ dateFrom: '' }],
        },
      });
    }
  }, [dispatch, emptyFormData, emptyServiceUser, match.path, form]);

  // get form data to edit
  useEffect(() => {
    if (formId) {
      dispatch({
        type: 'forms/getFormData',
        payload: { id: formId },
      });
    }
  }, [dispatch, formId]);

  // get service user data
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

  const descriptionList = [
    {
      description: 'Older people',
      value: '1',
      option: ['mainForm', 'serviceUserDetails', 'olderPeople'],
    },
    {
      description: 'People with dementia',
      value: '2',
      option: ['mainForm', 'serviceUserDetails', 'dementia'],
    },
    {
      description: 'People with Parkinson’s',
      value: '3',
      option: ['mainForm', 'serviceUserDetails', 'Parkinson'],
    },
    {
      description: 'Care after a stroke',
      value: '4',
      option: ['mainForm', 'serviceUserDetails', 'careStroke'],
    },
    {
      description: 'Rehabilitation',
      value: '5',
      option: ['mainForm', 'serviceUserDetails', 'rehabilitation'],
    },
    {
      description: 'Palliative care',
      value: '6',
      option: ['mainForm', 'serviceUserDetails', 'palliativeCare'],
    },
    {
      description: 'Multiple Sclerosis',
      value: '7',
      option: ['mainForm', 'serviceUserDetails', 'multipleSclerosis'],
    },
    {
      description: 'Motor Neurone',
      value: '8',
      option: ['mainForm', 'serviceUserDetails', 'motorNeurone'],
    },
    {
      description: 'People with learning disabilities',
      value: '9',
      option: ['mainForm', 'serviceUserDetails', 'disabilities'],
    },
    {
      description: 'People with mental health',
      value: '10',
      option: ['mainForm', 'serviceUserDetails', 'mentalHealth'],
    },
    {
      description: 'People with physical disabilities',
      value: '11',
      option: ['mainForm', 'serviceUserDetails', 'physicalDisabilities'],
    },
    {
      description: 'Children',
      value: '12',
      option: ['mainForm', 'serviceUserDetails', 'children'],
    },
  ];

  // edit the form
  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        const eduList = formData?.mainForm?.educationDetails?.map((field) => {
          return {
            ...field,
            dateFrom: field?.dateFrom ? moment(field?.dateFrom) : '',
            dateTo: field?.dateTo ? moment(field?.dateTo) : '',
          };
        });

        const trainingList = formData?.mainForm?.trainingDetails?.map((field) => {
          return {
            ...field,
            dateCompleted: field?.dateCompleted ? moment(field?.dateCompleted) : '',
          };
        });

        const employeeList = formData?.mainForm?.employeeWorkingHistory?.map((field) => {
          return {
            ...field,
            dateFrom: field?.dateFrom ? moment(field?.dateFrom) : '',
            dateTo: field?.dateTo ? moment(field?.dateTo) : '',
          };
        });

        form.setFieldsValue({
          ...formData,
          mainForm: {
            ...formData.mainForm,
            dateOfBirth: formData?.mainForm?.dateOfBirth
              ? moment(formData?.mainForm?.dateOfBirth)
              : '',
            date: formData?.mainForm?.date ? moment(formData?.mainForm?.date) : '',
            educationDetails: eduList,
            trainingDetails: trainingList,
            plannedHoliday: {
              plannedHoliday1: {
                dateFrom: formData?.mainForm?.plannedHoliday?.plannedHoliday1?.dateFrom
                  ? moment(formData?.mainForm?.plannedHoliday?.plannedHoliday1?.dateFrom)
                  : '',
                dateTo: formData?.mainForm?.plannedHoliday?.plannedHoliday1?.dateTo
                  ? moment(formData?.mainForm?.plannedHoliday?.plannedHoliday1?.dateTo)
                  : '',
              },

              plannedHoliday2: {
                dateFrom: formData?.mainForm?.plannedHoliday?.plannedHoliday2?.dateFrom
                  ? moment(formData?.mainForm?.plannedHoliday?.plannedHoliday2?.dateFrom)
                  : '',
                dateTo: formData?.mainForm?.plannedHoliday?.plannedHoliday2?.dateTo
                  ? moment(formData?.mainForm?.plannedHoliday?.plannedHoliday2?.dateTo)
                  : '',
              },

              plannedHoliday3: {
                dateFrom: formData?.mainForm?.plannedHoliday?.plannedHoliday3?.dateFrom
                  ? moment(formData?.mainForm?.plannedHoliday?.plannedHoliday3?.dateFrom)
                  : '',
                dateTo: formData?.mainForm?.plannedHoliday?.plannedHoliday3?.dateTo
                  ? moment(formData?.mainForm?.plannedHoliday?.plannedHoliday3?.dateTo)
                  : '',
              },
            },
            employeeWorkingHistory: employeeList,
          },
          preEmployment: {
            ...formData?.preEmployment,
            vaccination: {
              ...formData?.preEmployment?.vaccination,
              firstDose: formData?.preEmployment?.vaccination?.firstDose
                ? moment(formData?.preEmployment?.vaccination?.firstDose)
                : '',
              secondDose: formData?.preEmployment?.vaccination?.secondDose
                ? moment(formData?.preEmployment?.vaccination?.secondDose)
                : '',
            },
            declarationDate: formData?.preEmployment?.declarationDate
              ? moment(formData?.preEmployment?.declarationDate)
              : '',
          },
          equalOpportunities: {
            ...formData?.equalOpportunities,
            date: formData?.equalOpportunities?.date
              ? moment(formData?.equalOpportunities?.date)
              : '',
          },
        });
      }
    }

    return () => {
      form?.resetFields();
    };
  }, [data, emptyServiceUser, form, formData, formId]);

  //   display data of service user
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
      <div className=" font-semibold text-3xl  py-2">Application Form</div>
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
          window.scrollTo(0, 9999);
          const dataForApi = values;
          if (!data || (data !== 'editServiceUserForm' && data !== 'editForm')) {
            const filters = Object.keys(signPag.current).filter(
              (key) => !signPag.current[key].isEmpty(),
            );
            const signatures = filters.map((key) => ({
              key,
              value: signPag.current[key].getTrimmedCanvas().toDataURL('image/png'),
            }));

            dataForApi.signatures = signatures.reduce(
              (map, { key, value }) => ({ ...map, [key]: value }),
              {},
            );
          }

          if (values.mainForm.dateOfBirth)
            dataForApi.mainForm.dateOfBirth = new Date(values?.mainForm?.dateOfBirth).toISOString();
          if (values?.mainForm?.date)
            dataForApi.mainForm.date = new Date(values?.mainForm?.date).toISOString();
          if (values?.mainForm?.educationDetails?.length > 0) {
            values?.mainForm?.educationDetails?.map((list, index) => {
              if (list.dateFrom)
                dataForApi.mainForm.educationDetails[index].dateFrom = new Date(
                  list?.dateFrom,
                ).toISOString();
              if (list.dateTo)
                dataForApi.mainForm.educationDetails[index].dateTo = new Date(
                  list?.dateTo,
                ).toISOString();
            });
          }
          if (values?.mainForm?.trainingDetails?.length > 0) {
            values?.mainForm?.trainingDetails?.map((list, index) => {
              if (list?.dateCompleted)
                dataForApi.mainForm.trainingDetails[index].dateCompleted = new Date(
                  list?.dateCompleted,
                ).toISOString();
            });
          }

          if (
            values?.mainForm?.plannedHoliday &&
            Object.keys(values?.mainForm?.plannedHoliday)?.length > 0
          ) {
            Object.keys(values?.mainForm?.plannedHoliday)?.map((item) => {
              if (values?.mainForm?.plannedHoliday[item]?.dateFrom)
                dataForApi.mainForm.plannedHoliday[item].dateFrom = new Date(
                  values?.mainForm?.plannedHoliday[item]?.dateFrom,
                ).toISOString();
              if (values?.mainForm?.plannedHoliday[item]?.dateTo)
                dataForApi.mainForm.plannedHoliday[item].dateTo = new Date(
                  values?.mainForm?.plannedHoliday[item]?.dateTo,
                ).toISOString();
            });
          }
          if (values?.mainForm?.employeeWorkingHistory?.length > 0) {
            values?.mainForm?.employeeWorkingHistory?.map((list, index) => {
              if (list?.dateFrom)
                dataForApi.mainForm.employeeWorkingHistory[index].dateFrom = new Date(
                  list?.dateFrom,
                ).toISOString();
              if (list.dateTo)
                dataForApi.mainForm.employeeWorkingHistory[index].dateTo = new Date(
                  list?.dateTo,
                ).toISOString();
            });
          }
          if (values?.preEmployment?.vaccination?.firstDose) {
            dataForApi.preEmployment.vaccination.firstDose = new Date(
              values?.preEmployment?.vaccination?.firstDose,
            ).toISOString();
          }
          if (values?.preEmployment?.vaccination?.secondDose) {
            dataForApi.preEmployment.vaccination.secondDose = new Date(
              values?.preEmployment?.vaccination?.secondDose,
            ).toISOString();
          }
          if (values?.preEmployment?.declarationDate) {
            dataForApi.preEmployment.declarationDate = new Date(
              values?.preEmployment?.declarationDate,
            ).toISOString();
          }
          if (values?.equalOpportunities?.date) {
            dataForApi.equalOpportunities.date = new Date(
              values?.equalOpportunities?.date,
            ).toISOString();
          }

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/application-form' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;
            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'applicationForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('applicationForm');
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
                body: { ...dataForApi, type: 'applicationForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('applicationForm');
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
                name={['mainForm', 'positionAppliedFor']}
                label="Which position are you applying for?"
                placeholder="Position you are applying for"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: 'Please enter the position you are applying for',
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name={['mainForm', 'advertSeen']}
                label="Where did you see the advert?"
                placeholder="Mention the source of advert"
              />
            </Col>

            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <Form.Item
                name={['mainForm', 'experienceDetails']}
                label={
                  <span className="formLabel">
                    Can you give brief details of your experience in the role for which you are
                    applying and why you are applying i.e. length of time of experience and in what
                    type of setting? If you do not have experience, please write NONE
                  </span>
                }
              >
                <AwesomeEditor
                  type="descriptionForm"
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.mainForm?.experienceDetails?.JSONText
                  }
                  placeholder="Your comments here..."
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        {/* your details template */}
        <BasicDetails form={form} />
        {/* kindetails template */}
        <div className="bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
            Your next of kin details (Emergency Contact Details)
          </div>
          <Row gutter={24}>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['mainForm', 'kinDetails', 'emergencyContactName']}
                label="Name"
                placeholder="Emergency contact name"
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['mainForm', 'kinDetails', 'address']}
                label="Address"
                placeholder="Address"
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['mainForm', 'kinDetails', 'postCode']}
                label="Post code"
                placeholder="Post code"
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['mainForm', 'kinDetails', 'email']}
                label="Email"
                placeholder="Email"
                rules={[
                  {
                    message: 'Please enter a valid email address!',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <Form.Item required label={<span className="FormLabel font-medium">Mobile</span>}>
                <PhoneNumber
                  countryCode={['mainForm', 'kinDetails', 'countryCode']}
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value?.length === 0) return Promise.resolve();
                        return Promise.resolve();
                      },
                    }),
                    { max: 10, message: 'Please enter only 10 digits for phone number' },
                    { min: 10, message: 'Please enter atleast 10 digits for phone number' },
                  ]}
                  form={form}
                  name={['mainForm', 'kinDetails', 'mobile']}
                />
              </Form.Item>
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['mainForm', 'kinDetails', 'homeTelephone']}
                label="Home telephone"
                placeholder="Home telephone"
              />
            </Col>
          </Row>
        </div>
        {/* education and training template */}
        <EducationalTrainingDetails form={form} />
        {/* service users template */}
        <div className="bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
            Service users
          </div>
          <div className="formLabel">Which service users do you have experience with?</div>
          {descriptionList.map((list) => (
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
          <div className="formLabel my-2">
            Are there any groups above who you would prefer not to work with and why?
          </div>
          <Form.Item name={['mainForm', 'serviceUserGroups']}>
            <AwesomeEditor
              type="descriptionForm"
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.mainForm?.serviceUserGroups?.JSONText
              }
              placeholder="Your comments here..."
            />
          </Form.Item>
        </div>
        {/* Travel template */}
        <TravelDetails form={form} />
        {/* Availability */}
        <AvailabilityDetails form={form} />
        {/* References template */}
        <ReferenceDetails form={form} />
        {/* previous deployment details */}
        <PreviousEmploymentDetails form={form} />
        {/* Previous Experience Template */}
        <PreviousExperience form={form} signPag={signPag} onClear={onClear} DateInput={DateInput} />

        <PreEmploymentDetailsForm form={form} signPag={signPag} onClear={onClear} />
        <EqualOpportunitiesForm form={form} signPag={signPag} onClear={onClear} />
        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => {
              form?.submit();
            }}
          >
            {match.path === '/forms/application-form' || serviceUserId ? 'Submit' : 'Update'}
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
}))(ApplicationForm);
