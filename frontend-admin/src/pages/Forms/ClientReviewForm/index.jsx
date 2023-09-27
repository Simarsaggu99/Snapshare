/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button, Radio } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AwesomeEditor from '@/components/AwesomeEditor';
import ConfirmModal from '@/components/ConfirmModal';
import SignaturePad from 'react-signature-canvas';

const descriptionList = [
  {
    description: 'Do you feel respected, valued and listened to?',
    value: '1',
    name: ['details', 'feeling', 'value'],
    option: ['details', 'feeling', 'choice'],
  },
  {
    description: 'Is the support flexible and gives you choice?',
    value: '2',
    name: ['details', 'supportFlexible', 'value'],
    option: ['details', 'supportFlexible', 'choice'],
  },
  {
    description: 'Is the support reliable and timely?',
    value: '3',
    name: ['details', 'supportReliable', 'value'],
    option: ['details', 'supportReliable', 'choice'],
  },
  {
    description: 'Is support that is responsive to your changing needs?',
    value: '4',
    name: ['details', 'supportResponsive', 'value'],
    option: ['details', 'supportResponsive', 'choice'],
  },
  {
    description: 'Are the care workers staying the full required time?',
    value: '5',
    name: ['details', 'careworkerStay', 'value'],
    option: ['details', 'careworkerStay', 'choice'],
  },
  {
    description: 'Are the care workers recording in the logs? (Check logbook entries)',
    value: '6',
    name: ['details', 'careworkerRecord', 'value'],
    option: ['details', 'careworkerRecord', 'choice'],
  },
  {
    description: 'Are the care workers wearing full PPE ? ( Gloves, Aprons and Mask)',
    value: '7',
    name: ['details', 'careworkerfullPPE', 'value'],
    option: ['details', 'careworkerfullPPE', 'choice'],
  },
];
const outcomesList = [
  {
    description: 'Maintaining a habitable home environment',
    value: '1',
    name: ['outcome', 'homeEnvironment', 'value'],
    option: ['outcome', 'homeEnvironment', 'choice'],
  },
  {
    description: 'Managing and maintaining nutrition',
    value: '2',
    name: ['outcome', 'nutrition', 'value'],
    option: ['outcome', 'nutrition', 'choice'],
  },
  {
    description: 'Maintaining personal hygiene',
    value: '3',
    name: ['outcome', 'hygiene', 'value'],
    option: ['outcome', 'hygiene', 'choice'],
  },
  {
    description: 'Medication needs (Check Mar chart entries)',
    value: '4',
    name: ['outcome', 'medication', 'value'],
    option: ['outcome', 'medication', 'choice'],
  },
];
const reviewList = [
  {
    description:
      'Are there needs identified on Support Plan that have changed in any way, or are not being fully met, or Support Plan that need to be amended',
    value: '1',
    name: ['review', 'supportPlan'],
    placeholder: 'your answer here...',
  },
  {
    description: 'Comment or any Compliments',
    value: '2',
    name: ['review', 'comment'],
    placeholder: 'your comments here...',
  },
  {
    description:
      'Required changes/actions (E.g. reassessment, minor amendment to support plan, change in provision or care worker)',
    value: '3',
    name: ['review', 'changes'],
    placeholder: 'your changes here...',
  },
];
const boldList = [
  {
    text: 'To gather your views on the quality of the services we provide.',
    value: '1',
  },
  {
    text:
      'To check whether the support and/or services you receive are archieving what you want them to achieve (i.e outcomes).',
    value: '2',
  },
  {
    text:
      'To check how well the individual needs listed in your support plan have been/are being met and whether you have any new ones.',
    value: '3',
  },
  {
    text: 'To check if there need be any other changes to your support plan.',
    value: '4',
  },
  {
    text:
      'To give you an opportunity to say if you would like to get more involved in the way we deliver services.',
    value: '5',
  },
];

const ClientReviewForm = ({
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
  const { TextArea } = Input;
  const signPag = React.useRef({ reviewerSign: {}, serviceUserSign: {} });
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
    if (match.path === '/forms/client-review') {
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

  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          dateOfReview1: formData?.dateOfReview1 ? moment(formData?.dateOfReview1) : '',
          dateOfInitialsupport: formData?.dateOfInitialsupport
            ? moment(formData?.dateOfInitialsupport)
            : '',
          dateOfReview2: formData?.dateOfReview2 ? moment(formData?.dateOfReview2) : '',
          reviewerDate: formData?.reviewerDate ? moment(formData?.reviewerDate) : '',
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
          serviceUser2: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
        });
      }
    }

    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Client Review Form</div>
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
          if (values.dateOfReview1)
            dataForApi.dateOfReview1 = new Date(values.dateOfReview1).toISOString();
          if (values.dateOfInitialsupport)
            dataForApi.dateOfInitialsupport = new Date(values.dateOfInitialsupport).toISOString();
          if (values.dateOfReview2)
            dataForApi.dateOfReview2 = new Date(values.dateOfReview2).toISOString();
          if (values.reviewerDate)
            dataForApi.reviewerDate = new Date(values.reviewerDate).toISOString();

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/client-review' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'clientReviewForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('clientReviewForm');
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
                body: { ...dataForApi, type: 'clientReviewForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('clientReviewForm');
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
                    message: 'Please enter the name of service user',
                  },
                ]}
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput name="dateOfReview1" label="Date of Review" placeholder="Select Date" />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput
                name="dateOfInitialsupport"
                label="Date of initial support plan"
                placeholder="Select Date"
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="presentReview"
                label="Persons present of review"
                placeholder="Person Name"
              />
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className="px-4 py-2">
            <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
              The purpose of your review is
            </div>
            <div>
              {boldList.map((list) => (
                <div className="flex items-center" key={list.value}>
                  <div
                    style={{ backgroundColor: '#9D1D5A' }}
                    className="w-2 h-2 mr-3 rounded-full"
                  />
                  <div key={list.value}>{list.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="font-semibold text-xl px-4 py-2" style={{ color: '#5B3A7D' }}>
            Type of Review
            <div>
              <Form.Item noStyle initialValue={'Three Months'} name={['reviewType', 'choice']}>
                <Radio.Group
                  options={['Three Months', 'Annual', 'Other (if other, specify reason)']}
                />
              </Form.Item>
            </div>
          </div>
          <div className="px-4 py-2">
            <Form.Item name={['reviewType', 'value']}>
              <AwesomeEditor
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.reviewType?.value?.JSONText
                }
                placeholder="Specify reason..."
              />
            </Form.Item>
          </div>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          {descriptionList.map((list) => (
            <div key={list.value}>
              <Row gutter={24}>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <div className="text-sm">{list.description}</div>
                </Col>
                <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                  <Form.Item initialValue={'Always'} noStyle name={list?.option}>
                    <Radio.Group options={['Always', 'Usually', 'Rarely', 'Never']} />
                  </Form.Item>
                </Col>
                <Col lg={10} xl={10} md={24} sm={24} xs={24}>
                  <div className="">
                    <Form.Item name={list?.name}>
                      <AwesomeEditor
                        type="descriptionForm"
                        initialValue={
                          formData &&
                          data &&
                          data !== 'createServiceUserForm' &&
                          formData?.[list?.name[0]]?.[list?.name[1]]?.[list?.name[2]]?.JSONText
                        }
                        placeholder="Your comments here..."
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-4">
          <div className=" px-4 py-2">
            <div className=" font-semibold text-xl" style={{ color: '#5B3A7D' }}>
              How well do you consider that the outcomes on your support plan have been achieved?
            </div>
            <div className="px-2 pt-8 pb-4 ">
              {outcomesList.map((list) => (
                <div className="items-center text-sm" key={list.value}>
                  <Row gutter={24}>
                    <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                      <div className="font-semibold items-center">{list.description}</div>
                    </Col>
                    <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                      <div className="items-center">
                        <Form.Item name={list?.name}>
                          <AwesomeEditor
                            type="descriptionForm"
                            initialValue={
                              formData &&
                              data &&
                              data !== 'createServiceUserForm' &&
                              formData?.[list?.name[0]]?.[list?.name[1]]?.[list?.name[2]]?.JSONText
                            }
                            placeholder="Your comments here..."
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-4">
          <div className=" px-4 py-2">
            {reviewList.map((list) => (
              <div key={list.value}>
                <div className=" font-semibold text-xl" style={{ color: '#5B3A7D' }}>
                  {list?.description}
                </div>

                <Form.Item name={list?.name}>
                  <AwesomeEditor
                    initialValue={
                      formData &&
                      data &&
                      data !== 'createServiceUserForm' &&
                      formData?.[list?.name[0]]?.[list?.name[1]]?.JSONText
                    }
                    placeholder={list.placeholder}
                  />
                </Form.Item>
              </div>
            ))}
            <div className=" font-semibold text-xl" style={{ color: '#5B3A7D' }}>
              Agreement to your review (If you agree with your review, please sign below)
            </div>
            <Row gutter={24} className="pt-2">
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <TextInput
                  name="serviceUser2"
                  label="Name of service user"
                  placeholder="Service User"
                />
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput name="dateOfReview2" label="Date of Review" placeholder="Select Date" />
              </Col>
            </Row>
            <div className="formLabel">Service User&apos;s Signature</div>

            {data === 'editServiceUserForm' || data === 'editForm' ? (
              <div className="my-2">
                {formData?.signatures?.serviceUserSign ? (
                  <img
                    style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                    className="w-full"
                    src={formData?.signatures?.serviceUserSign}
                    alt="serviceUserSign"
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
                      signPag.current.serviceUserSign = sign;
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => onClear('serviceUserSign')} className="px-4">
                    Clear
                  </Button>
                </div>
              </>
            )}
            <div className=" font-semibold text-xl" style={{ color: '#5B3A7D' }}>
              Review completed by
            </div>
            <Row gutter={24} className="pt-2">
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <TextInput
                  name="reviewerName"
                  label="Name of reviewer"
                  placeholder="Service User"
                />
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput name="reviewerDate" label="Date" placeholder="Select Date" />
              </Col>
            </Row>
            <div className="">
              <div className="formLabel">Reviewer&apos;s Signature</div>
              {data === 'editServiceUserForm' || data === 'editForm' ? (
                <div className="my-2">
                  {formData?.signatures?.reviewerSign ? (
                    <img
                      style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                      className="w-full"
                      src={formData?.signatures?.reviewerSign}
                      alt="reviewerSign"
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
                        signPag.current.reviewerSign = sign;
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onClear('reviewerSign')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => form.submit()}
          >
            {match.path === '/forms/client-review' || serviceUserId ? 'Submit' : 'Update'}
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
}))(ClientReviewForm);
