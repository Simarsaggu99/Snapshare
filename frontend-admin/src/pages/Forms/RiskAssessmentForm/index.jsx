/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import NumberInput from '@/components/NumberInput';
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import ConfirmModal from '@/components/ConfirmModal';
import AwesomeEditor from '@/components/AwesomeEditor';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SignaturePad from 'react-signature-canvas';

const RiskAssessmentForm = ({
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
  const [status, setStatus] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const { data } = getPageQuery();
  const inputEl = useRef();

  const emptyServiceUser = useCallback(
    () => dispatch({ type: 'serviceUser/setStates', payload: null, key: 'getServiceUser' }),
    [dispatch],
  );

  const signPag = React.useRef({ signature: {} });
  const onClear = (index) => signPag.current[index].clear();

  const emptyFormData = useCallback(
    () => dispatch({ type: 'forms/setStates', payload: null, key: 'formData' }),
    [dispatch],
  );

  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
        <Input ref={reff} autoFocus={autoFocus} size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  const DateInput = ({ name, label, placeholder, showTime, format }) => {
    return (
      <Form.Item name={name} label={<span className="formLabel">{label}</span>}>
        <DatePicker
          format={format || 'DD MMMM YYYY'}
          style={{ width: '100%' }}
          placeholder={placeholder}
          size="large"
          showTime={showTime}
        />
      </Form.Item>
    );
  };

  const { formId, serviceUserId } = useParams();
  const { TextArea } = Input;
  useEffect(() => {
    if (match.path === '/forms/risk-assessment') {
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
  const chartList = [
    {
      description: 'Do we remind or administer your medication or what assistance you require?',
      value: '1',
      name: ['chartData', 'medicationAdminister'],
    },
    {
      description:
        'Are you able to tell us what medication and how much you take at what times if we are reminding you of your medication?',
      value: '2',
      name: ['chartData', 'medicationTime'],
    },
    {
      description: 'If administer a MAR sheet needs to be in place? Is this in place?',
      value: '3',
      name: ['chartData', 'marSheet'],
    },
    {
      description:
        'If the MAR is in place, is the MAR correctly filled I specifying how much of what medication needs to be taken at what times and how it needs to be given?',
      value: '4',
      name: ['chartData', 'marPlacae'],
    },
    {
      description:
        'Is there any risk identifying with the MAR chart? Do you have difficulties taking medication, e.g. swallowing tablets?',
      value: '5',
      name: ['chartData', 'riskIdentify'],
    },
    {
      description: 'What is the risk associated with the above medication?',
      value: '6',
      name: ['chartData', 'riskAssociate'],
    },
  ];

  const networkList = [
    {
      description:
        'Any current pressure sores or Is there any risk involved? How will the risk be minimized?',
      value: '1',
      name: ['networkData', 'currentPressure'],
    },
    {
      description:
        'Are you able to answer the front door? Is Will someone else be present to answer the door? Is there any risk involved?',
      value: '2',
      name: ['networkData', 'frontDoor'],
    },
    {
      description: 'Do you have any hearing difficulty? if yes, how will you minimize the risk?',
      value: '3',
      name: ['networkData', 'hearDifficulty'],
    },
    {
      description: 'Do you have any visual impairment? If yes, how will you minimize the risk?',
      value: '4',
      name: ['networkData', 'visualImpairment'],
    },
    {
      description:
        'You are well - being/health issues e.g. social and emotional, mood, memory, sleep patterns.',
      value: '5',
      name: ['networkData', 'healthIssues'],
    },
    {
      description:
        'Do you have any issue we should know about? i.e. is there a risk of wandering within or outside the property? Is there any risk involved?',
      value: '6',
      name: ['networkData', 'issue'],
    },
    {
      description:
        'Do you have any dietary requirements or difficulty in eating or drinking? Do you require any support?',
      value: '7',
      name: ['networkData', 'dietary'],
    },
    {
      description: 'Continence needs/toileting – Do you require any support?',
      value: '8',
      name: ['networkData', 'continence'],
    },
  ];
  const mobilityList = [
    {
      description:
        'Are you able to walk unaided? If NO, what support do you require/use? (wheelchair/hoist/Zimmer/walking stick) How will the risk be minimized?',
      value: '1',
      name: ['mobilityData', 'unaided'],
    },
    {
      description:
        'Are you able to go out alone? If NO, what support do you require? Is there any risk involved? How will the risk be minimized?',
      value: '2',
      name: ['mobilityData', 'alone'],
    },
    {
      description:
        'Can you get in and out of bed? If NO, what support do you require? Is there any risk involved? How will the risk be minimized?',
      value: '3',
      name: ['mobilityData', 'outOfBed'],
    },
    {
      description:
        'Are you able to use the stairs? If NO, what support do you require? Is there any risk involved? How will the risk be minimized?',
      value: '4',
      name: ['mobilityData', 'stairs'],
    },
    {
      description:
        'Are you able to change position regularly? If NO, please add details-specific bed/chair-support required? Is there any risk involved? How will the risk be minimized?',
      value: '5',
      name: ['mobilityData', 'position'],
    },
    {
      description:
        'Do you have any tissue viability considerations? Is there any risk involved? If Yes, please add details including support from other health professionals. How will the risk be minimized?',
      value: '6',
      name: ['mobilityData', 'tissueViability'],
    },
    {
      description:
        'Have you fallen recently – in 12 months? If Yes, please give details (frequency – Weekly/monthly?) what support do you require? Is there any risk involved? How will the risk be minimized?',
      value: '7',
      name: ['mobilityData', 'fallen'],
    },
    {
      description:
        'Are you able to wash/bath/shower? If No, what assistance do you require? Is there any risk involved? How will the risk be minimized?',
      value: '8',
      name: ['mobilityData', 'wash'],
    },
    {
      description:
        'Are you able to dress? If No, what assistance do you require? Is there any risk involved? How will the risk be minimized?',
      value: '9',
      name: ['mobilityData', 'dress'],
    },
  ];
  const practicalList = [
    {
      description:
        'Heating/preparing food and/or Preparing hot/cold drinks? Is there any risk involved? If Yes, please give details? How will the risk be minimized?',
      value: '1',
      name: ['practicalData', 'heat'],
    },
    {
      description:
        'Housework (general cleaning/ dusting/ironing). If yes, please give details? Is any risk involved? How will the risk be minimized?',
      value: '2',
      name: ['practicalData', 'cleaning'],
    },
    {
      description:
        'Cleaning kitchen/bathroom? Is there any risk involved? If yes, please give details How will the risk be minimized?',
      value: '3',
      name: ['practicalData', 'kitchen'],
    },
    {
      description:
        'Laundry? If yes, please give details? Is there any risk involved? How will the risk be minimized?',
      value: '4',
      name: ['practicalData', 'laundary'],
    },
    {
      description:
        'Make bed? If yes, please give details Is there any risk involved? How will the risk be minimized?',
      value: '5',
      name: ['practicalData', 'makeBed'],
    },
    {
      description:
        'Shopping? If yes, please give details is there any risk involved? How will the risk be minimized?',
      value: '6',
      name: ['practicalData', 'shopping'],
    },
  ];

  const moneyList = [
    {
      description: 'Are you to manage your own finances?',
      value: '1',
      name: ['moneyData', 'finances'],
    },
    {
      description: 'If No, what support do you require?',
      value: '2',
      name: ['moneyData', 'support'],
    },
    {
      description: 'How will the risk be minimized? Is there any risk involved?',
      value: '3',
      name: ['moneyData', 'risk'],
    },
  ];

  const healthList = [
    {
      description:
        'Do you have any health consideration is there any risk involved? that have potential to cause a risk and/or have any been reported RIDDOR?',
      value: '1',
      name: ['healthData', 'riddor'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '2',
      name: ['healthData', 'riskMin'],
    },
    {
      description:
        'Is there any risk from the customer or visitor smoking in the property Is there any risk involved?',
      value: '3',
      name: ['healthData', 'smoking'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '4',
      name: ['healthData', 'riskMinSecond'],
    },
    {
      description:
        'If customer is a smoker do, they agree that while our care worker is there, they will not smoke?',
      value: '5',
      name: ['healthData', 'smokerCustomer'],
    },
    {
      description: 'Is there any risk involved?',
      value: '6',
      name: ['healthData', 'riskInvolvement'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '7',
      name: ['healthData', 'riskMinThird'],
    },
  ];
  const homeList = [
    {
      description: 'Does anyone live with you in your home? Is there any risk involved?',
      value: '1',
      name: ['homeData', 'live'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '2',
      name: ['homeData', 'riskMin'],
    },
    {
      description: 'If Yes, are any of them 16 years old or Is there any risk involved younger?',
      value: '3',
      name: ['homeData', 'young'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '4',
      name: ['homeData', 'riskMinSecond'],
    },
    {
      description:
        'If you have visitors, is there any have Is there any risk involved potential to cause risk?',
      value: '5',
      name: ['homeData', 'visitor'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '6',
      name: ['homeData', 'riskMinThird'],
    },
  ];

  const applianceList = [
    {
      description:
        'As far as we are aware, are there any electrical and gas appliances in your home that are not in good working order? Do NOT allow use of any appliance that appears to be faulty: mark those clearly on the Risk Management Plan?',
      value: '1',
      name: ['appliances', 'electrical'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '2',
      name: ['appliances', 'riskMIn'],
    },
  ];

  const loneWorkingList = [
    {
      description:
        'Will a member of staff be working alone Is at any visit on the Care/Support Plan?',
      value: '1',
      name: ['loneWorkData', 'staff'],
    },
    {
      description: 'Is there any risk involved?',
      value: '2',
      name: ['loneWorkData', 'riskInvolved'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '3',
      name: ['loneWorkData', 'riskMin'],
    },
    {
      description:
        'Does the location of property or social issues of area cause risk? Is there any risk involved?',
      value: '4',
      name: ['loneWorkData', 'location'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '5',
      name: ['loneWorkData', 'RiskMinSecond'],
    },
    {
      description:
        'Is there any consideration with the times of the calls? Is there any risk involved?',
      value: '6',
      name: ['loneWorkData', 'timesOfCall'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '7',
      name: ['loneWorkData', 'riskMinThird'],
    },
    {
      description: 'Are there any potential risks to a lone worker?',
      value: '8',
      name: ['loneWorkData', 'potentialRisk'],
    },
    {
      description: 'Is there any risk involved?',
      value: '9',
      name: ['loneWorkData', 'riskInvolvedSecond'],
    },
    {
      description: 'How will the risk be minimized?',
      value: '10',
      name: ['loneWorkData', 'riskMinForth'],
    },
    {
      description:
        'Are there any additional risks to our service user? Please list, with risk level, and how they will be minimized.',
      value: '11',
      name: ['loneWorkData', 'additionalRisk'],
    },
    {
      description: 'Overall risks.',
      value: '12',
      name: ['loneWorkData', 'overallRisk'],
    },
    {
      description:
        'Where risk is assessed low, medium, or high has the process for informing all staff (regular and irregular) attending the customer been initiated, making them aware of current best practice?',
      value: '13',
      name: ['loneWorkData', 'assessLow'],
    },
  ];

  const otherList = [
    {
      description: 'Moving and Handling Risk Assessment',
      value: '1',
      name: ['otherDetails', 'movingRisk'],
    },
    {
      description: 'COSHH Risk Assessment',
      value: '2',
      name: ['otherDetails', 'coshhRisk'],
    },
    {
      description: 'External Activities Risk Assessment',
      value: '3',
      name: ['otherDetails', 'externalActivity'],
    },
  ];

  const outerList = [
    {
      title: 'Mobility',
      value: '1',
      listName: mobilityList,
    },
    {
      title: 'Practical Tasks – Do you require any assistance with any of the following?',
      value: '2',
      listName: practicalList,
    },
    {
      title: 'Money/Financial Transactions',
      value: '3',
      listName: moneyList,
    },
    {
      title: 'Your General and Physical Health',
      value: '4',
      listName: healthList,
    },
    {
      title: 'About Your Home',
      value: '4',
      listName: homeList,
    },
    {
      title: 'Your Electrical and Gas Appliances',
      value: '5',
      listName: applianceList,
    },
    {
      title: 'Lone Working',
      value: '6',
      listName: loneWorkingList,
    },
  ];
  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          networkData: {
            ...formData.networkData,
            date: formData?.networkData?.date ? moment(formData?.networkData?.date) : '',
          },
          otherDetails: {
            ...formData.otherDetails,
            date: formData?.otherDetails?.date ? moment(formData?.otherDetails?.date) : '',
          },
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [formData, formId, data, emptyServiceUser, form]);

  const onFormRender = () => {
    inputEl.current.focus();
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    onFormRender();
  }, []);

  useEffect(() => {
    if (getServiceUser) {
      emptyFormData();
      if (getServiceUser?.first_name?.length > 0) {
        form.setFieldsValue({
          ...getServiceUser,
          serviceUser: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
          otherDetails: {
            ...getServiceUser,
            name: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
          },
          networkData: {
            ...getServiceUser,
            address: ``,
            contactNumber: getServiceUser?.phone?.slice(3, getServiceUser?.phone?.length),
          },
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Risk Assessment Form</div>
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
          if (values.networkData.date) dataForApi.networkData.date = values.networkData.date;
          if (values.otherDetails.date)
            dataForApi.otherDetails.date =
              values.otherDetails.date && new Date(values.otherDetails.date).toISOString();

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
              payload: { data: dataForApi, type: 'riskAssessmentForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('confirm');
                setType('riskAssessmentForm');
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
                body: { ...dataForApi, type: 'riskAssessmentForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('riskAssessmentForm');
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
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <TextInput
                reff={inputEl}
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
          </Row>

          <Form.Item
            name="medicalHistory"
            label={
              <span className="formLabel">
                Medical history (including allergies): What support you require for medication?
              </span>
            }
          >
            <AwesomeEditor
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.medicalHistory?.JSONText
              }
              placeholder="your history here..."
            />
          </Form.Item>

          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            List current Medication if we are supporting with administration of medication consult
            MAR chart List? If reminding from blister pack – refer to the list on the blister for
            most current medication.
          </div>
          <div className="pt-4">
            {chartList.map((list) => (
              <div key={list.value}>
                <Form.Item
                  name={list.name}
                  label={<span className="formLabel">{list.description}</span>}
                >
                  <AwesomeEditor
                    initialValue={
                      formData &&
                      data &&
                      data !== 'createServiceUserForm' &&
                      formData?.[list.name[0]]?.[list.name[1]]?.JSONText
                    }
                    placeholder="your description here..."
                  />
                </Form.Item>
              </div>
            ))}
          </div>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl pb-4" style={{ color: '#5B3A7D' }}>
            My Current Support Networks
          </div>
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name={['networkData', 'name']}
                label="Name of Person or Organization"
                placeholder="Person Name"
                rules={[
                  {
                    whitespace: true,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name={['networkData', 'address']}
                label="Address"
                placeholder="Your Address"
                rules={[
                  {
                    whitespace: true,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name={['networkData', 'date']}
                label="Assistant / Support Provided Inc. Day(s) & Time"
                placeholder="Date & Time"
                rules={[
                  {
                    whitespace: true,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <Form.Item
                name={['networkData', 'contactNumber']}
                label={<span className="formLabel ">Contact Number</span>}
              >
                <NumberInput
                  size="large"
                  style={{ width: '100%' }}
                  form={form}
                  setfields={(field) => {
                    form?.setFieldsValue({
                      networkData: { contactNumber: field },
                    });
                  }}
                  rules={[
                    {
                      message: 'Please enter atleast 10 digits!',
                      min: 10,
                    },
                    {
                      message: 'Please enter not more than 10 digits!',
                      max: 10,
                    },
                  ]}
                  nested
                  name={['networkData', 'contactNumber']}
                  placeholder="Your Number"
                />
              </Form.Item>
            </Col>
          </Row>
          {networkList.map((list) => (
            <div key={list.value}>
              <Form.Item
                name={list.name}
                label={<span className="formLabel">{list.description}</span>}
              >
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.[list.name[0]]?.[list.name[1]]?.JSONText
                  }
                  placeholder="your description here..."
                />
              </Form.Item>
            </div>
          ))}
        </div>
        {outerList.map((lists) => (
          <div className=" bg-white shadow rounded mb-4 border-b p-8" key={lists.title}>
            <div className=" font-semibold text-xl pb-4" style={{ color: '#5B3A7D' }}>
              {lists.title}
            </div>

            {lists?.listName?.map((list) => (
              <Form.Item
                name={list.name}
                key={list.value}
                label={<span className="formLabel">{list.description}</span>}
              >
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.[list.name[0]]?.[list.name[1]]?.JSONText
                  }
                  placeholder="your description here..."
                />
              </Form.Item>
            ))}
          </div>
        ))}
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl pb-4" style={{ color: '#5B3A7D' }}>
            Are other Risk Assessment Required?
          </div>
          {otherList.map((list) => (
            <Form.Item
              name={list.name}
              key={list.value}
              label={<span className="formLabel">{list.description}</span>}
            >
              <AwesomeEditor
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.[list.name[0]]?.[list.name[1]]?.JSONText
                }
                placeholder="your description here..."
              />
            </Form.Item>
          ))}
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name={['otherDetails', 'name']}
                label="Name of Service User"
                placeholder="Person Name"
                rules={[
                  {
                    whitespace: true,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name={['otherDetails', 'date']} label="Date" placeholder="Select Date" />
            </Col>
          </Row>

          <div className="">
            <div className="formLabel">Signature</div>
            {data === 'editServiceUserForm' || data === 'editForm' ? (
              <div className="my-2">
                {formData?.signatures?.signature ? (
                  <img
                    style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                    className="w-full"
                    src={formData?.signatures?.signature}
                    alt="signature"
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
                      signPag.current.signature = sign;
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => onClear('signature')} className="px-4">
                    Clear
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {(match.path === '/forms/risk-assessment' || serviceUserId) && (
            <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
              Submit
            </Button>
          )}

          {formData && !serviceUserId && match.path !== '/forms/risk-assessment' && (
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
  loadingEditForm: loading.effects['forms/editForm'],
  formData: forms.formData,
  getServiceUser: serviceUser.getServiceUser,
  loading: loading.effects['forms/storeFormsDate'],
  currentUser: user.currentUser,
}))(RiskAssessmentForm);
