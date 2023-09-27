/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import NumberInput from '@/components/NumberInput';
import AwesomeEditor from '@/components/AwesomeEditor';
import SignaturePad from 'react-signature-canvas';

const SupportPlan = ({
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
  const inputEl = useRef();

  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => (
    <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
      <Input ref={reff} autoFocus={autoFocus} size="large" placeholder={placeholder} />
    </Form.Item>
  );
  const DateInput = ({ name, label, placeholder }) => (
    <Form.Item name={name} label={<span className="formLabel">{label}</span>}>
      <DatePicker
        format="DD MMMM YYYY"
        style={{ width: '100%' }}
        placeholder={placeholder}
        size="large"
      />
    </Form.Item>
  );
  const { TextArea } = Input;
  const { formId, serviceUserId } = useParams();

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

  const signPag = React.useRef({ signature: {} });
  const onClear = (index) => signPag.current[index].clear();

  useEffect(() => {
    onFormRender();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (match.path === '/forms/support-plan') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [emptyFormData, emptyServiceUser, dispatch, match.path]);

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

  const individualDetails = [
    {
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Person Name',
      message: 'Please enter the full name',
    },
    {
      name: 'address',
      label: 'Address',
      placeholder: 'Your Address',
      message: 'Please enter the address',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Email',
      message: 'Please enter the email',
    },
    {
      name: 'relationship',
      label: 'Relationship to client',
      placeholder: 'Relationship',
      message: 'Please enter the relationship',
    },
  ];
  const myDetails = [
    {
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Person Name',
      message: 'Please enter the full name',
      value: '1',
    },
    {
      name: 'address',
      label: 'Address',
      placeholder: 'Your Address',
      message: 'Please enter the address',
      value: '2',
    },
    {
      name: 'language',
      label: 'Religion / Language',
      placeholder: 'Religion / Language',
      message: 'Please enter the religion or language',
      value: '3',
    },
  ];

  const extraInfo = [
    {
      name: 'wayToReach',
      label:
        'We want to ensure we communicate with you effectively about our service. What’s the best way if we cannot reach you on telephone?',
      placeholder: 'Best way to reach',
      message: 'Please enter the way to reach',
    },
    {
      name: 'capacity',
      label: 'Capacity/Consent - Does the customer have capacity?',
      placeholder: 'Your answer...',
      message: 'Please enter the answer',
    },
  ];
  const locationDetails = [
    {
      name: 'kinDetail1',
      label: 'Next of Kin details 1 Contact Number & Email Address',
      placeholder: 'Kin details...',
      message: 'Please enter the kin details',
    },
    {
      name: 'kinDetail2',
      label: 'Next of Kin details 2 Contact Number & Email Address',
      placeholder: 'Kin details...',
      message: 'Please enter the kin details',
    },
  ];

  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          myDetails: {
            ...formData.myDetails,
            serviceStartDate: formData?.myDetails?.serviceStartDate
              ? moment(formData?.myDetails?.serviceStartDate)
              : '',
          },
          dateOfBirth: formData?.dateOfBirth ? moment(formData?.dateOfBirth) : '',
          payingIndividual: {
            ...formData.payingIndividual,
            date: formData?.payingIndividual?.date ? moment(formData?.payingIndividual?.date) : '',
          },
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
          myDetails: {
            ...getServiceUser,
            fullName: `${getServiceUser?.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
            address: `${getServiceUser?.address?.address_line_1 || ''} ${
              getServiceUser?.address?.address_line_2 || ''
            } ${getServiceUser?.address?.region || ''} ${getServiceUser?.address?.city || ''} ${
              getServiceUser?.address?.state_code?.split(' ')[1] || ''
            } ${getServiceUser?.address?.country_code.split('(')[0].trim() || ''} ${
              getServiceUser?.address?.postal_code || ''
            }`.trim(),
          },
          contactNumber: getServiceUser?.phone?.slice(3, getServiceUser?.phone?.length),
          payingIndividual: {
            serviceUser: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
          },
          dateOfBirth: getServiceUser?.date_of_birth ? moment(getServiceUser?.date_of_birth) : '',
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [emptyFormData, dispatch, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-2xl py-2">Support Plan Form</div>
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
        scrollToFirstError
        form={form}
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
          if (values.myDetails.serviceStartDate)
            dataForApi.myDetails.serviceStartDate = new Date(
              values.myDetails.serviceStartDate,
            ).toISOString();
          if (values.payingIndividual.date)
            dataForApi.payingIndividual.date = new Date(values.payingIndividual.date).toISOString();
          if (values.dateOfBirth)
            dataForApi.dateOfBirth = new Date(values.dateOfBirth).toISOString();
          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/support-plan' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'supportPlanForm' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('supportPlanForm');
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
                body: { ...dataForApi, type: 'supportPlanForm' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('supportPlanForm');
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
          <Row gutter={[24, 12]}>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
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
          </Row>
          <div className="">
            <TextInput
              name="preferredName"
              label="I prefer to be called"
              placeholder="Preferred Name..."
            />
            <div className="mb-8">
              <Form.Item name="medicalCondition">
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.medicalCondition?.JSONText
                  }
                  placeholder="Medical condition..."
                />
              </Form.Item>
            </div>
          </div>
          <div className="">
            <TextInput
              name="morningVisit"
              label="Morning visit, days and times of the visits"
              placeholder="Days and times of the visit..."
              rules={[{ whitespace: true }]}
            />
            <div className="mb-8">
              <Form.Item name="morningVisitDescription">
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.morningVisitDescription?.JSONText
                  }
                  placeholder="your description here..."
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <TextInput
              name="outcomeMorningVisit"
              label="Expected outcome and how it will be achieved?"
              placeholder="your description here..."
              rules={[{ whitespace: true }]}
            />
          </div>
          <div className="">
            <TextInput
              name="lunchVisit"
              label="Lunch visit, days and times of the visits"
              placeholder="Days and times of the visit..."
              rules={[{ whitespace: true }]}
            />
            <div className="mb-8">
              <Form.Item name="lunchVisitDescription">
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.lunchVisitDescription?.JSONText
                  }
                  placeholder="your description here..."
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <TextInput
              name="outcomeLunchVisit"
              label="Expected outcome and how it will be achieved?"
              placeholder="your description here..."
              rules={[{ whitespace: true }]}
            />
          </div>
          <div className="">
            <TextInput
              name="teaVisit"
              label="Tea visit, days and times of the visits"
              placeholder="Days and times of the visit..."
              rules={[{ whitespace: true }]}
            />
            <div className="mb-8">
              <Form.Item name="teaVisitDescription">
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.teaVisitDescription?.JSONText
                  }
                  placeholder="your description here..."
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <TextInput
              name="outcomeTeaVisit"
              label="Expected outcome and how it will be achieved?"
              placeholder="your description here..."
              rules={[{ whitespace: true }]}
            />
          </div>
          <div className="">
            <TextInput
              name="nightVisit"
              label="Night visit, days and times of the visits"
              placeholder="Days and times of the visit..."
              rules={[{ whitespace: true }]}
            />
            <div className="mb-8">
              <Form.Item name="nightVisitDescription">
                <AwesomeEditor
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.nightVisitDescription?.JSONText
                  }
                  placeholder="your description here..."
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <TextInput
              name="outcomeNightVisit"
              label="Expected outcome and how it will be achieved?"
              placeholder="your description here..."
              rules={[{ whitespace: true }]}
            />
          </div>
          <div className="">
            <Form.Item
              name="support"
              label={
                <span className="formLabel">
                  I also would like some support with (domestic, shopping, laundry, companionships
                  outreach).
                </span>
              }
            >
              <AwesomeEditor
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.support?.JSONText
                }
                placeholder="Medical condition..."
              />
            </Form.Item>
          </div>
          <div>
            <TextInput
              name="outcomeSupport"
              label="Expected outcome and how it will be achieved? "
              placeholder="your description here..."
              rules={[{ whitespace: true }]}
            />
          </div>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
            My Current Support Networks
          </div>
          <div className="">
            <Form.Item
              name={['currentSupportNetwork', 'generalWhereAbouts']}
              label={
                <span className="formLabel">
                  Things like – Where you were born, where did you grow up, do you or did you have a
                  career, what do you like doing, what is your favorite food/drink, what is your
                  favorite past time?
                </span>
              }
            >
              <AwesomeEditor
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.currentSupportNetwork?.generalWhereAbouts?.JSONText
                }
                placeholder="Your description here..."
              />
            </Form.Item>
          </div>
          <div>
            <TextInput
              name={['currentSupportNetwork', 'interests']}
              label="Your interests/hobbies – what do you like to do?"
              placeholder="Interests..."
              rules={[{ whitespace: true }]}
            />
          </div>
          <div>
            <TextInput
              name={['currentSupportNetwork', 'expectations']}
              label="What do you expect from your care & support workers?"
              placeholder="expectations..."
              rules={[{ whitespace: true }]}
            />
          </div>
          <div>
            <TextInput
              name={['currentSupportNetwork', 'medications']}
              label="What medication support you required?"
              placeholder="medications..."
              rules={[{ whitespace: true }]}
            />
          </div>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
            My Details
          </div>
          <Row gutter={[24, 12]}>
            {myDetails?.map((detail) => (
              <Col lg={12} xl={12} md={12} sm={24} xs={24} key={detail.name}>
                <TextInput
                  name={['myDetails', detail?.name]}
                  label={detail?.label}
                  placeholder={detail?.placeholder}
                  rules={[{ whitespace: true }]}
                />
              </Col>
            ))}
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="contactNumber"
                label={<span className="formLabel ">Contact Number</span>}
              >
                <NumberInput
                  rules={[
                    {
                      whitespace: true,
                    },
                    {
                      message: 'Please enter atleast 10 digits!',
                      min: 10,
                    },
                    {
                      message: 'Please enter not more than 10 digits!',
                      max: 10,
                    },
                  ]}
                  size="large"
                  style={{ width: '100%' }}
                  form={form}
                  name="contactNumber"
                  placeholder="Your Number"
                />
              </Form.Item>
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <DateInput name="dateOfBirth" label="Date of Birth" placeholder="Date of Birth" />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name="access"
                label="Access"
                placeholder="Access"
                rules={[{ whitespace: true }]}
              />
            </Col>
          </Row>

          <Row gutter={[24, 12]}>
            {locationDetails?.map((location) => (
              <Col key={location?.name} lg={12} xl={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name={['myDetails', location?.name]}
                  label={<span className="formLabel">{location?.label}</span>}
                >
                  <AwesomeEditor
                    initialValue={
                      formData &&
                      data &&
                      data !== 'createServiceUserForm' &&
                      formData?.myDetails?.[location.name]?.JSONText
                    }
                    placeholder={location?.placeholder}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
          <div className="">
            <Form.Item
              name={['myDetails', 'gpDetails']}
              label={
                <span className="formLabel">GP details Contact Number &amp; Email Address</span>
              }
            >
              <AwesomeEditor
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.myDetails?.gpDetails?.JSONText
                }
                placeholder="GP details..."
              />
            </Form.Item>
          </div>
          <Row gutter={[24, 12]}>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['myDetails', 'havePets']}
                label="Do you have pets?"
                placeholder="Pets..."
                rules={[{ whitespace: true }]}
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <DateInput
                name={['myDetails', 'serviceStartDate']}
                label="Start date of service"
                placeholder="Date"
              />
            </Col>
          </Row>
          <div>
            <TextInput
              name={['myDetails', 'communicatingDifficulties']}
              label="Do you have any difficulties communicating your needs? if yes give details."
              placeholder="Your details..."
              rules={[{ whitespace: true }]}
            />
          </div>
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
            Details of individual paying for the service
          </div>
          <Row gutter={[24, 12]}>
            {individualDetails?.map((detail) => (
              <Col lg={12} xl={12} md={12} sm={24} xs={24} key={detail.name}>
                <TextInput
                  name={['payingIndividual', detail?.name]}
                  label={detail?.label}
                  placeholder={detail?.placeholder}
                  rules={
                    detail.name === 'email'
                      ? [
                          {
                            whitespace: true,
                          },
                          {
                            message: 'Please enter a valid email address!',
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          },
                        ]
                      : [{ whitespace: true }]
                  }
                />
              </Col>
            ))}
          </Row>

          <Row gutter={[24, 12]}>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['payingIndividual', 'postCode']}
                label={<span className="formLabel ">Postcode</span>}
                placeholder="Postcode"
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <Form.Item
                name={['payingIndividual', 'contactNumber']}
                label={<span className="formLabel ">Contact Number</span>}
              >
                <NumberInput
                  size="large"
                  style={{ width: '100%' }}
                  form={form}
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
                  setfields={(field) => {
                    form?.setFieldsValue({
                      payingIndividual: { contactNumber: field },
                    });
                  }}
                  nested
                  name={['payingIndividual', 'contactNumber']}
                  placeholder="Contact Number"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 12]}>
            {extraInfo?.map((info) => (
              <Col lg={24} xl={24} md={24} sm={24} xs={24} key={info.name}>
                <TextInput
                  name={['payingIndividual', info?.name]}
                  label={info?.label}
                  placeholder={info?.placeholder}
                  rules={[{ whitespace: true }]}
                />
              </Col>
            ))}
          </Row>
          <div className="pb-6 font-semibold">
            If Yes, do they give consent for their NOK to be involved in agreeing Support Plan and
            be a part of the assessment process and are they happy for us to contact their NOK to
            carry out reviews and discuss their care plan with them?
          </div>
          <div>
            <TextInput
              name={['payingIndividual', 'namesConcentYes']}
              label="Please Write the names here"
              placeholder="Names here"
              rules={[{ whitespace: true }]}
            />
          </div>
          <div className="pb-6 font-semibold">
            If NO, does NOK/Advocate/Social Service have legal power of attorney or do we have best
            interest /mental capacity meeting notes to make decisions for customer and agree the
            Care Plan (evidence of this to be obtained and filed in customers file)
          </div>
          <div>
            <TextInput
              name={['payingIndividual', 'namesConcentNo']}
              label="Please Write the names here"
              placeholder="Names here"
              rules={[{ whitespace: true }]}
            />
          </div>

          <Row gutter={[24, 12]}>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <TextInput
                name={['payingIndividual', 'serviceUser']}
                label="Name of Service User"
                placeholder="Service user"
                rules={[
                  {
                    whitespace: true,
                  },
                ]}
              />
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <DateInput
                name={['payingIndividual', 'date']}
                label="Date"
                placeholder="Select Date"
              />
            </Col>
          </Row>
          <div>
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
          {(match.path === '/forms/support-plan' || serviceUserId) && (
            <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
              Submit
            </Button>
          )}

          {formData && !serviceUserId && match.path !== '/forms/support-plan' && (
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
  loadingEditForm: loading.effects['forms/editForm'],
  formData: forms.formData,
  getServiceUser: serviceUser.getServiceUser,
  currentUser: user.currentUser,
}))(SupportPlan);
