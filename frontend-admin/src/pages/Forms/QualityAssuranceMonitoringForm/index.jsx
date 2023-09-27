/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button, Radio, TimePicker } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AwesomeEditor from '@/components/AwesomeEditor';
import ConfirmModal from '@/components/ConfirmModal';
import SignaturePad from 'react-signature-canvas';

const QualityAssuranceMonitoringForm = ({
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

  const signPag = React.useRef({ clientSign: {}, assessorSign: {} });
  const onClear = (index) => signPag.current[index].clear();

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
    if (match.path === '/forms/quality-assurance-monitoring-form') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [dispatch, emptyFormData, emptyServiceUser, match.path]);
  const descriptionList = [
    {
      description: 'Does the Care Worker arrive at the Service Users home on time?',
      value: '1',
      comments: ['details', 'careWorkerArrival', 'comments'],
      option: ['details', 'careWorkerArrival', 'choice'],
    },
    {
      description:
        'Does the Care Worker have the Keys/Key safe number and alert the Service Users upon arrival?',
      value: '2',
      comments: ['details', 'careWorkerSafeNumber', 'comments'],
      option: ['details', 'careWorkerSafeNumber', 'choice'],
    },
    {
      description: 'Is the Care Worker dressed smartly in a clean, company uniform?',
      value: '3',
      comments: ['details', 'careWorkerUniform', 'comments'],
      option: ['details', 'careWorkerUniform', 'choice'],
    },
    {
      description:
        'Does the Care Worker introduce him/herself and says ‘Hello’ to the Service Users and call them by the name they have asked to be called in the Care Plan?',
      value: '4',
      comments: ['details', 'careWorkerIntroduction', 'comments'],
      option: ['details', 'careWorkerIntroduction', 'choice'],
    },
    {
      description:
        'Does the Care Worker have an ID Badge that is current and valid and if they are not known to the Service Users do they show the ID badge?',
      value: '5',
      comments: ['details', 'careWorkerIDBadge', 'comments'],
      option: ['details', 'careWorkerIDBadge', 'choice'],
    },
    {
      description: 'Where electronic monitoring is used, has the Care Worker logged incorrectly?',
      value: '6',
      comments: ['details', 'careWorkerLogged', 'comments'],
      option: ['details', 'careWorkerLogged', 'choice'],
    },
  ];

  const carePlanList = [
    {
      description: 'Does the Care Worker check the Service Users Care Plan upon arrival?',
      value: '1',
      comments: ['carePlan', 'careWorkerPlanApproval', 'comments'],
      option: ['carePlan', 'careWorkerPlanApproval', 'choice'],
    },
    {
      description: 'Does the Care Worker check the Service Users  Visit Notes upon arrival?',
      value: '2',
      comments: ['carePlan', 'careWorkerVisitNotes', 'comments'],
      option: ['carePlan', 'careWorkerVisitNotes', 'choice'],
    },
    {
      description:
        'Does the Care Worker seek the Service Users consent before delivering any aspect of care?',
      value: '3',
      comments: ['carePlan', 'careWorkerDeliveryConsent', 'comments'],
      option: ['carePlan', 'careWorkerDeliveryConsent', 'choice'],
    },
    {
      description: 'Does the Care Worker know what care the Service User’s needs?',
      value: '4',
      comments: ['carePlan', 'careWorkerNeeds', 'comments'],
      option: ['carePlan', 'careWorkerNeeds', 'choice'],
    },
  ];

  const workingPractices = [
    {
      description:
        'Does the Care Worker wash their hands before and after providing care and support?',
      value: '1',
      comments: ['workingPractices', 'careWorkerHygenie', 'comments'],
      option: ['workingPractices', 'careWorkerHygenie', 'choice'],
    },
    {
      description: 'Does the Care Worker use PPE correctly?',
      value: '2',
      comments: ['workingPractices', 'careWorkerPPE', 'comments'],
      option: ['workingPractices', 'careWorkerPPE', 'choice'],
    },
    {
      description: 'Is the Care Worker vigilant for hazards in the home?',
      value: '3',
      comments: ['workingPractices', 'careWorkerHazards', 'comments'],
      option: ['workingPractices', 'careWorkerHazards', 'choice'],
    },
    {
      description: 'Is any food handled correctly and hygienically?',
      value: '4',
      comments: ['workingPractices', 'careWorkerHandling', 'comments'],
      option: ['workingPractices', 'careWorkerHandling', 'choice'],
    },
    {
      description: 'Is the working area kept clean and tidy and is any PPE disposed of correctly?',
      value: '5',
      comments: ['workingPractices', 'careWorkerPPEDisposed', 'comments'],
      option: ['workingPractices', 'careWorkerPPEDisposed', 'choice'],
    },
  ];

  const medicationList = [
    {
      description: 'Is the MAR chart completed correctly?',
      value: '1',
      comments: ['medication', 'MARChart', 'comments'],
      option: ['medication', 'MARChart', 'choice'],
    },
    {
      description: 'Does the Care Worker follow the 6 Rights of Medication correctly?',
      value: '2',
      comments: ['medication', 'sixRightMedications', 'comments'],
      option: ['medication', 'sixRightMedications', 'choice'],
    },
  ];

  const attitudeAndBehaviour = [
    {
      description:
        'Does the Care Worker communicate well with the Service Users and evidence compassionate care?',
      value: '1',
      comments: ['attitudeAndBehaviour', 'careWorkerCommunication', 'comments'],
      option: ['attitudeAndBehaviour', 'careWorkerCommunication', 'choice'],
    },
    {
      description: 'Does the Care Worker respect the privacy of the Service Users?',
      value: '2',
      comments: ['attitudeAndBehaviour', 'careWorkerRespectPrivacy', 'comments'],
      option: ['attitudeAndBehaviour', 'careWorkerRespectPrivacy', 'choice'],
    },
    {
      description: 'Does the Care Worker respect the dignity of the Service Users?',
      value: '3',
      comments: ['attitudeAndBehaviour', 'careWorkerRespectDignity', 'comments'],
      option: ['attitudeAndBehaviour', 'careWorkerRespectDignity', 'choice'],
    },
    {
      description: 'Does the Care Worker allow the Service Users to make their own choices?',
      value: '4',
      comments: ['attitudeAndBehaviour', 'careWorkerAllowChoices', 'comments'],
      option: ['attitudeAndBehaviour', 'careWorkerAllowChoices', 'choice'],
    },
    {
      description: 'Does the Care Worker work in an enabling way?',
      value: '5',
      comments: ['attitudeAndBehaviour', 'careWorkerEnablingWay', 'comments'],
      option: ['attitudeAndBehaviour', 'careWorkerEnablingWay', 'choice'],
    },
  ];

  const recording = [
    {
      description:
        'Does the Care Worker accurately record on the care records the activities that have been undertaken?',
      value: '1',
      comments: ['recording', 'careWorkerAccurateRecord', 'comments'],
      option: ['recording', 'careWorkerAccurateRecord', 'choice'],
    },
    {
      description: 'Does the Care Worker log out correctly if electronic monitoring is used?',
      value: '2',
      comments: ['recording', 'careWorkerElecronicMonitoring', 'comments'],
      option: ['recording', 'careWorkerElecronicMonitoring', 'choice'],
    },
  ];

  const feedback = [
    {
      description: 'Does the Care Worker respect your privacy and treat you with dignity?',
      value: '1',
      comments: ['feedback', 'careWorkerEtiquette', 'comments'],
      option: ['feedback', 'careWorkerEtiquette', 'choice'],
    },
    {
      description: 'Does the Care Worker make you feel comfortable and safe?',
      value: '2',
      comments: ['feedback', 'careWorkerSafeEnvironment', 'comments'],
      option: ['feedback', 'careWorkerSafeEnvironment', 'choice'],
    },
    {
      description: 'Do you know how to make a complaint?',
      value: '3',
      comments: ['feedback', 'makingComplaint', 'comments'],
      option: ['feedback', 'makingComplaint', 'choice'],
    },
    {
      description: 'If you have made a complaint was it resolved?',
      value: '4',
      comments: ['feedback', 'careWorkerIntroduction', 'comments'],
      option: ['feedback', 'careWorkerIntroduction', 'choice'],
    },
    {
      description: 'Are you happy with the care you receive from us?',
      value: '5',
      comments: ['feedback', 'careWorkerIDBadge', 'comments'],
      option: ['feedback', 'careWorkerIDBadge', 'choice'],
    },
    {
      description: 'Do you know which Care Worker will be coming to visit you?',
      value: '6',
      comments: ['feedback', 'careWorkerLogged', 'comments'],
      option: ['feedback', 'careWorkerLogged', 'choice'],
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
  const { TextArea } = Input;
  // edit the form
  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          qualityVisitDate: formData?.qualityVisitDate ? moment(formData?.qualityVisitDate) : '',
          QADate: formData?.QADate ? moment(formData?.QADate) : '',
          QADueDate: formData?.QADueDate ? moment(formData?.QADueDate) : '',
          qualityVisitTime: formData?.qualityVisitTime ? moment(formData?.qualityVisitTime) : '',
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
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Quality Assurance Monitoring Form</div>
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
          if (values.QADate) dataForApi.QADate = new Date(values.QADate).toISOString();
          if (values.QADueDate) dataForApi.QADueDate = new Date(values.QADueDate).toISOString();
          if (values.qualityVisitDate)
            dataForApi.qualityVisitDate = new Date(values.qualityVisitDate).toISOString();
          if (values.qualityVisitTime)
            dataForApi.qualityVisitTime = new Date(values.qualityVisitTime).toISOString();

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/quality-assurance-monitoring-form' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }
            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'qualityAssuranceMonitoring' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('qualityAssuranceMonitoring');
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
                body: { ...dataForApi, type: 'qualityAssuranceMonitoring' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('qualityAssuranceMonitoring');
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
                label="Service user name"
                placeholder="Service User"
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
              <TextInput
                name="serviceUserAddress"
                label="Service user address"
                placeholder="Service User's Address"
              />
            </Col>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="font-semibold mb-1">Reason for quality visit</div>
              <Form.Item name="qualityVisitReason">
                <AwesomeEditor
                  placeholder="Reason for quality visit"
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.qualityVisitReason?.JSONText
                  }
                />
              </Form.Item>
            </Col>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <TextInput
                name="careWorkerAttendee"
                label="Name of care worker(s) attending"
                placeholder="Name of care worker(s)"
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput
                name="qualityVisitDate"
                label="Date of quality visit"
                placeholder="Select date of quality visit"
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className="font-semibold mb-1">Time of quality visit</div>
              <Form.Item name="qualityVisitTime">
                <TimePicker use12Hours format="h:mm a" style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput name="Arrive" label="Arrive" placeholder="Arrive" />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput name="Depart" label="Depart" placeholder="Depart" />
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            On Arrival in the Home
          </div>
          {descriptionList.map((list) => (
            <div key={list?.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list?.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.details &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.details[list?.option[1]]?.comments?.JSONText
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Care Plan
          </div>
          {carePlanList.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.carePlan &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.carePlan[list?.option[1]]?.comments?.JSONText
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Safe Working Practices
          </div>
          {workingPractices.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.workingPractices &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.workingPractices[list?.option[1]]?.comments?.JSONText
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Medication
          </div>
          {medicationList.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.medication &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.medication[list?.option[1]]?.comments?.JSONText
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Attitude and Behaviour
          </div>
          {attitudeAndBehaviour.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.attitudeAndBehaviour &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.attitudeAndBehaviour[list?.option[1]]?.comments?.JSONText
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Recording
          </div>
          {recording.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.recording &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.recording[list?.option[1]]?.comments?.JSONText
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
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Service User Feedback
          </div>
          {feedback.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Yes'} noStyle name={list?.option}>
                    <Radio.Group options={['Yes', 'No', 'N/A']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.comments}>
                      <AwesomeEditor
                        type="descriptionForm"
                        placeholder="Your comments here..."
                        initialValue={
                          formData &&
                          formData?.feedback &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.feedback[list?.option[1]]?.comments?.JSONText
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
              <TextInput name="assessorName" label="Assessor Name" placeholder="Assessor Name" />
            </Col>

            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="formLabel">Assessor Signature</div>
              {data === 'editServiceUserForm' || data === 'editForm' ? (
                <div className="my-2">
                  {formData?.signatures?.assessorSign ? (
                    <img
                      style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                      className="w-full"
                      src={formData?.signatures?.assessorSign}
                      alt="assessorSign"
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
                        signPag.current.assessorSign = sign;
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onClear('assessorSign')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Col>

            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="formLabel">Client Signature</div>
              {data === 'editServiceUserForm' || data === 'editForm' ? (
                <div className="my-2">
                  {formData?.signatures?.clientSign ? (
                    <img
                      style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                      className="w-full"
                      src={formData?.signatures?.clientSign}
                      alt="clientSign"
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
                        signPag.current.clientSign = sign;
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onClear('clientSign')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="QADate" label="Date of QA" placeholder="Select date of QA" />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput
                name="QADueDate"
                label="Next QA check due date"
                placeholder="Select next QA check due date"
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
            {match.path === '/forms/quality-assurance-monitoring-form' || serviceUserId
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
}))(QualityAssuranceMonitoringForm);
