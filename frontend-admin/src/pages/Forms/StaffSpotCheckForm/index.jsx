/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button, Radio, TimePicker } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AwesomeEditor from '@/components/AwesomeEditor';
import ConfirmModal from '@/components/ConfirmModal';
import PhoneNumber from '@/components/PhoneNumber';
import SignaturePad from 'react-signature-canvas';
import classNames from 'classnames';
import styles from './index.less';

const StaffSpotCheckForm = ({
  dispatch,
  loading,
  formData,
  loadingEditForm,
  match,
  getServiceUser,
  currentUser,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [type, setType] = useState('');
  const [id, setId] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [status, setStatus] = useState('');
  const { data } = getPageQuery();
  const { formId, serviceUserId } = useParams();
  const signPag = React.useRef({ staffSignature: {}, careWorker: {} });
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
    if (match.path === '/forms/staff-spot-check-form') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [dispatch, emptyFormData, emptyServiceUser, match.path]);

  const descriptionList = [
    {
      description: 'Care Worker arrives at the Service User’s home on time',
      value: '1',
      comments: ['observations', 'careWorkerArrival', 'comments'],
      option: ['observations', 'careWorkerArrival', 'choice'],
    },
    {
      description:
        'Care Worker has keys for entry/ alerts the Service User upon arrival/key safe number',
      value: '2',
      comments: ['observations', 'careWorkerSafeEntryAlert', 'comments'],
      option: ['observations', 'careWorkerSafeEntryAlert', 'choice'],
    },
    {
      description: 'Care Worker is dressed smartly in a clean, Company uniform',
      value: '3',
      comments: ['observations', 'careWorkerUniform', 'comments'],
      option: ['observations', 'careWorkerUniform', 'choice'],
    },
    {
      description: 'Care Worker is wearing a valid and current ID badge',
      value: '4',
      comments: ['observations', 'careWorkerIDBadge', 'comments'],
      option: ['observations', 'careWorkerIDBadge', 'choice'],
    },
    {
      description: 'Care Worker practices safe hygiene (use of PPE clothing, gloves/aprons etc)',
      value: '5',
      comments: ['observations', 'careWorkerHygiene', 'comments'],
      option: ['observations', 'careWorkerHygiene', 'choice'],
    },
    {
      description:
        'Care Worker checks Service User Care Plan upon arrival for tasks to be undertaken',
      value: '6',
      comments: ['observations', 'careWorkerService', 'comments'],
      option: ['observations', 'careWorkerService', 'choice'],
    },
    {
      description: 'Equipment (hoists etc) used properly',
      value: '7',
      comments: ['observations', 'equipmentsUsed', 'comments'],
      option: ['observations', 'equipmentsUsed', 'choice'],
    },
    {
      description: 'Records of medicines taken by the Service User are up- to-date',
      value: '8',
      comments: ['observations', 'medicinesRecords', 'comments'],
      option: ['observations', 'medicinesRecords', 'choice'],
    },
    {
      description: 'Care Worker practices proper Food Safety & Hygiene principles',
      value: '9',
      comments: ['observations', 'careWorkerPractices', 'comments'],
      option: ['observations', 'careWorkerPractices', 'choice'],
    },
    {
      description:
        'Care Worker is vigilant for Health and safety hazards in the Service User’s home',
      value: '10',
      comments: ['observations', 'careWorkerVigilant', 'comments'],
      option: ['observations', 'careWorkerVigilant', 'choice'],
    },
    {
      description:
        'Care Worker communicates with the S/User re. tasks to be done maintaining confidentiality',
      value: '12',
      comments: ['observations', 'careWorkerPlanCommunicate', 'comments'],
      option: ['observations', 'careWorkerPlanCommunicate', 'choice'],
    },
    {
      description: 'Care Worker asks Service User if he / she is satisfied with the service',
      value: '13',
      comments: ['observations', 'careWorkerDeliveryStatisfied', 'comments'],
      option: ['observations', 'careWorkerDeliveryStatisfied', 'choice'],
    },
    {
      description: 'Care Worker completes Daily Report forms as required',
      value: '14',
      comments: ['observations', 'careWorkerReportForm', 'comments'],
      option: ['observations', 'careWorkerReportForm', 'choice'],
    },
    {
      description: 'Snacks left for the Service User are covered and stored properly',
      value: '15',
      comments: ['observations', 'careWorkerSnacksLeft', 'comments'],
      option: ['observations', 'careWorkerSnacksLeft', 'choice'],
    },
    {
      description: 'Care Worker leaves premises, locking doors behind him / her',
      value: '16',
      comments: ['observations', 'careWorkerLeavsPremises', 'comments'],
      option: ['observations', 'careWorkerLeavsPremises', 'choice'],
    },
    {
      description: 'Does the Care Worker have a good working relationship with the Service User?',
      value: '17',
      comments: ['observations', 'careWorkerWorkingRelationship', 'comments'],
      option: ['observations', 'careWorkerWorkingRelationship', 'choice'],
    },
  ];
  const actionToBeTaken = [
    {
      value: '1',
    },
    {
      value: '2',
    },
    {
      value: '3',
    },
    {
      value: '4',
    },
  ];
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

  const DateInput = ({ name, label, placeholder, labelValue }) => {
    return (
      <Form.Item
        name={name}
        label={<span className="formLabel">{label}</span>}
        className={classNames(labelValue && styles.labelStyling)}
      >
        <DatePicker
          format="DD MMMM YYYY"
          style={{ width: '100%' }}
          placeholder={placeholder}
          size="large"
        />
      </Form.Item>
    );
  };

  // edit the form
  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          qualityVisitDate: formData?.qualityVisitDate ? moment(formData?.qualityVisitDate) : '',
          qualityVisitTime: formData?.qualityVisitTime ? moment(formData?.qualityVisitTime) : '',
        });
        Object.keys(formData?.spotCheckAnalysis)?.map((item) => {
          form.setFieldsValue({
            spotCheck: {
              ...formData?.spotCheckAnalysis,
              [formData?.spotCheckAnalysis[item]?.key]: {
                ...formData?.spotCheckAnalysis[item],
                actionToBeTaken: formData?.spotCheckAnalysis[item]?.actionToBeTaken,
                staffResponsibility: formData?.spotCheckAnalysis[item]?.staffResponsibility,
                targetDate: formData?.spotCheckAnalysis[item]?.targetDate
                  ? moment(formData?.spotCheckAnalysis[item]?.targetDate)
                  : '',
                completedDate: formData?.spotCheckAnalysis[item]?.completedDate
                  ? moment(formData?.spotCheckAnalysis[item]?.completedDate)
                  : '',
              },
            },
          });
        });
      }
    }

    return () => {
      form?.resetFields();
    };
  }, [data, emptyServiceUser, form, formData, formId]);

  // display data of service user
  useEffect(() => {
    if (getServiceUser) {
      emptyFormData();
      if (getServiceUser?.first_name?.length > 0) {
        form.setFieldsValue({
          ...getServiceUser,
          serviceUser: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
          serviceUserAddress: `${getServiceUser?.address?.address_line_1 || ''} ${
            getServiceUser?.address?.address_line_2 || ''
          } ${getServiceUser?.address?.region || ''} ${getServiceUser?.address?.city || ''} ${
            getServiceUser?.address?.state_code?.split(' ')[1] || ''
          } ${getServiceUser?.address?.country_code.split('(')[0].trim() || ''} ${
            getServiceUser?.address?.postal_code || ''
          }`.trim(),
          phone: '',
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Staff Spot Check Form</div>
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

          dataForApi.spotCheckAnalysis = Object.keys(values?.spotCheck)?.map((item) => ({
            key: item,
            actionToBeTaken: values?.spotCheck[item]?.actionToBeTaken,
            completedDate: values?.spotCheck[item]?.completedDate
              ? new Date(values?.spotCheck[item]?.completedDate)?.toISOString()
              : '',
            staffResponsibility: values?.spotCheck[item]?.staffResponsibility,
            targetDate: values?.spotCheck[item]?.completedDate
              ? new Date(values?.spotCheck[item]?.targetDate).toISOString()
              : '',
          }));
          delete dataForApi?.spotCheck;
          if (values.QADate) dataForApi.QADate = new Date(values.QADate).toISOString();
          if (values.QADueDate) dataForApi.QADueDate = new Date(values.QADueDate).toISOString();
          if (values.qualityVisitDate)
            dataForApi.qualityVisitDate = new Date(values.qualityVisitDate).toISOString();
          if (values.qualityVisitTime)
            dataForApi.qualityVisitTime = new Date(values.qualityVisitTime).toISOString();

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/staff-spot-check-form' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'staffSpotCheckForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('staffSpotCheckForm');
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
                body: { ...dataForApi, type: 'staffSpotCheckForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('staffSpotCheckForm');
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Details of spot check
          </div>
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                reff={inputEl}
                name="serviceUser"
                label="Name of service user"
                placeholder="Name of service user"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: 'Please enter the name of service user',
                  },
                ]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput name="serviceUserAddress" label="Address" placeholder="Address" />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <Form.Item
                required
                label={<span className="FormLabel font-medium">Phone Number</span>}
              >
                <PhoneNumber
                  countryCode="country_code"
                  rules={[
                    {
                      message: 'Please enter the contact number of service user',
                    },
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        }

                        if (value?.includes('+')) {
                          return Promise.resolve();
                        }
                        if (value?.length === 0 || value.length === 10) return Promise.resolve();
                        if (getServiceUser?.phone?.split('+44')[1] === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Please enter 10 digits for phone number');
                      },
                    }),
                  ]}
                  form={form}
                  name="phone"
                />
              </Form.Item>
            </Col>

            <Col lg={6} xl={6} md={24} sm={24} xs={24}>
              <DateInput
                name="qualityVisitDate"
                label="Date of spot check"
                placeholder="Select date of spot check"
              />
            </Col>
            <Col lg={6} xl={6} md={24} sm={24} xs={24}>
              <Form.Item
                label={<span className="formLabel">Time of visit</span>}
                name="qualityVisitTime"
              >
                <TimePicker use12Hours format="h:mm a" style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput name="nameofStaff" label="Name of staff" placeholder="Name of Staff" />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="spotCheckCarriedOutBy"
                label="Spot check carried out by"
                placeholder="Depart"
              />
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Observations
          </div>
          {descriptionList.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={5} xl={5} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your obervations here..."
                        initialValue={
                          formData &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.observations[list?.option[1]]?.comments?.JSONText
                        }
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <Row gutter={24}>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <TextInput
                name="staffName"
                label="Name of staff carrying out spot check"
                placeholder="Name of staff"
              />
            </Col>

            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="formLabel">Signature</div>
              {data === 'editServiceUserForm' || data === 'editForm' ? (
                <div className="my-2">
                  {formData?.signatures?.staffSignature ? (
                    <img
                      style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                      className="w-full"
                      src={formData?.signatures?.staffSignature}
                      alt="staffSignature"
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
                        signPag.current.staffSignature = sign;
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onClear('staffSignature')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Col>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <TextInput
                name="careWorkerName"
                label="Name of Care Worker subject to spot check"
                placeholder="Care Worker name"
              />
            </Col>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="formLabel">Signature</div>
              {data === 'editServiceUserForm' || data === 'editForm' ? (
                <div className="my-2">
                  {formData?.signatures?.careWorker ? (
                    <img
                      style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                      className="w-full"
                      src={formData?.signatures?.careWorker}
                      alt="careWorker"
                    />
                  ) : (
                    <div className="my-2">
                      <TextArea disabled size="large" rows="3" className="w-full" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-full h-24 border my-2 ">
                    <SignaturePad
                      canvasProps={{ className: 'h-full w-full' }}
                      ref={(sign) => {
                        signPag.current.careWorker = sign;
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onClear('careWorker')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl mb-4 " style={{ color: '#5B3A7D' }}>
            Actions to be taken following spot check
          </div>{' '}
          <Row gutter={24}>
            <Col lg={8} xl={8} md={8} sm={8} xs={8}>
              <div className="font-semibold overflow-hidden">Action Required</div>
            </Col>
            <Col lg={6} xl={6} md={6} sm={6} xs={6}>
              <div className="font-semibold overflow-hidden">Staff Responsibility</div>
            </Col>
            <Col lg={5} xl={5} md={5} sm={5} xs={5}>
              <div className="font-semibold overflow-hidden">Target Date</div>
            </Col>
            <Col lg={5} xl={5} md={5} sm={5} xs={5}>
              <div className="font-semibold overflow-hidden">Date Completed</div>
            </Col>
          </Row>
          {actionToBeTaken.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={8} xl={8} md={8} sm={8} xs={8}>
                  <div className="">
                    <Form.Item name={['spotCheck', `spotCheck${list?.value}`, 'actionToBeTaken']}>
                      <TextArea size="large" placeholder="Actions required" rows="1" />
                    </Form.Item>
                  </div>
                </Col>
                <Col lg={6} xl={6} md={6} sm={6} xs={6}>
                  <div className="">
                    <Form.Item
                      name={['spotCheck', `spotCheck${list?.value}`, 'staffResponsibility']}
                    >
                      <TextArea size="large" placeholder="Staff responsibility" rows="1" />
                    </Form.Item>
                  </div>
                </Col>
                <Col lg={5} xl={5} md={5} sm={5} xs={5}>
                  <DateInput
                    labelValue={true}
                    name={['spotCheck', `spotCheck${list?.value}`, 'targetDate']}
                    placeholder="Select date target"
                  />
                </Col>
                <Col lg={5} xl={5} md={5} sm={5} xs={5}>
                  <DateInput
                    labelValue={true}
                    name={['spotCheck', `spotCheck${list?.value}`, 'completedDate']}
                    placeholder="Select completed date"
                  />
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => form?.submit()}
          >
            {match.path === '/forms/staff-spot-check-form' || serviceUserId ? 'Submit' : 'Update'}
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
}))(StaffSpotCheckForm);
