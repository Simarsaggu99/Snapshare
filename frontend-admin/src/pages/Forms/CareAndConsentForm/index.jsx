/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button, Checkbox } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import AwesomeEditor from '@/components/AwesomeEditor';
import ConfirmModal from '@/components/ConfirmModal';
import classNames from 'classnames';

const CareAndConsentForm = ({
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
  const signPag = React.useRef({ reviewerSignature: {}, representativeSign: {}, managerSign: {} });
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
    if (match.path === '/forms/care-and-treatment-form') {
      emptyServiceUser();
      emptyFormData();
    }
  }, [dispatch, emptyFormData, emptyServiceUser, match.path]);
  const boldList = [
    {
      text: 'I understand the benefits and risk as described to me by Ami HomeCare Limited.',
      value: '1',
    },
    {
      text: 'I understand that if I do not wish to be photographed this is my choice.',
      value: '2',
    },
    {
      text: 'I understand the recorded information will be used to support my care and treatment.',
      value: '3',
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
  const { TextArea } = Input;
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

  const CheckBoxInput = ({ main, name, text, fontBold, checked }) => {
    return (
      <Form.Item name={[main, name]}>
        <Checkbox
          defaultChecked={checked}
          onChange={(e) => {
            form.setFieldsValue({
              [main]: {
                [name]: e.target.checked,
              },
            });
          }}
        >
          <span className={classNames(fontBold && 'font-semibold')}>{text}</span>
        </Checkbox>
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
          dateOfBirth: formData?.dateOfBirth ? moment(formData?.dateOfBirth) : '',
          dateOfBirthBasicDetails: formData?.dateOfBirthBasicDetails
            ? moment(formData?.dateOfBirthBasicDetails)
            : '',
          dateOfPersonRepresentative: formData?.dateOfPersonRepresentative
            ? moment(formData?.dateOfPersonRepresentative)
            : '',
          dateOfacceptingResponsibility: formData?.dateOfacceptingResponsibility
            ? moment(formData?.dateOfacceptingResponsibility)
            : '',
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
          serviceUserBasicDetails: `${getServiceUser.title} ${getServiceUser.first_name} ${getServiceUser.last_name}`,
          dateOfBirth: getServiceUser?.date_of_birth ? moment(getServiceUser?.date_of_birth) : '',
        });
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [dispatch, emptyFormData, form, getServiceUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-semibold text-3xl  py-2">Consent To Care And Treatment Form</div>
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
          if (values.dateOfBirth)
            dataForApi.dateOfBirth = new Date(values.dateOfBirth).toISOString();
          if (values.dateOfBirthBasicDetails)
            dataForApi.dateOfBirthBasicDetails = new Date(
              values.dateOfBirthBasicDetails,
            ).toISOString();
          if (values.dateOfPersonRepresentative)
            dataForApi.dateOfPersonRepresentative = new Date(
              values.dateOfPersonRepresentative,
            ).toISOString();
          if (values.dateOfacceptingResponsibility)
            dataForApi.dateOfacceptingResponsibility = new Date(
              values.dateOfacceptingResponsibility,
            ).toISOString();

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/care-and-treatment-form' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'careAndTreatment' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('careAndTreatment');
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
                body: { ...dataForApi, type: 'careAndTreatment' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('careAndTreatment');
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
                label="Name of service user "
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
              <DateInput name="dateOfBirth" label="Date of birth" placeholder="Select Date" />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="clientIdNumber"
                label="Client ID number"
                placeholder="Client ID number"
              />
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-6">
          <div className="px-4 py-2">
            <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
              Please tick the Applicable box.
            </div>
            <div className="px-4"></div>
            <CheckBoxInput
              main="consent"
              name="consentToCollect"
              text=" I give my consent to collect, keep and when they deem necessary share information
                with any statutory orvoluntary organisations the agency considers to support my
                well-being, safety, physical/mental health andsocial care."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.consentToCollect
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="consentToEmployment"
              text="I give my consent to the employment of the service to meet my care assessment and plan needs and I have beengiven information about the duties to be carried out. I will not require any other duties to be carried out by the careworkers unless it is clearly stated in my care plan. If additional duties are required, I will request a review of my careneeds and care plan"
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.consentToEmployment
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="consentToCareWorkers"
              text="Care worker(s) to attend to me at the times we agreed together with the service. I understand that if the times or mycare worker(s) are to be changed for unavoidable reasons, I will be informed."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.consentToCareWorkers
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="consentToAssist"
              text="I give my consent for the care workers to assist me with my medication in accordance with my Care Plan."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.consentToAssist
                  : false
              }
            />
            <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
              I give consent where necessary/required for the following action to be taken.
            </div>
          </div>
          <div className="px-4">
            <CheckBoxInput
              main="consent"
              fontBold={true}
              name="administratorFirstAid"
              text="Administer First Aid."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.administratorFirstAid
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="GPToVisit"
              fontBold={true}
              text="Call for a GP to visit me where required."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.GPToVisit
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="callForParamedic"
              fontBold={true}
              text="Call for an ambulance/paramedic to visit me where required."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.callForParamedic
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="obtainPrescription"
              fontBold={true}
              text="Obtain prescriptions for my use where necessary."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.obtainPrescription
                  : false
              }
            />
            <CheckBoxInput
              main="consent"
              name="arrangementForHospital"
              fontBold={true}
              text="Arrange for me to be taken to a hospital A&E Unit where necessary."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.consent
                  ? formData?.consent?.arrangementForHospital
                  : false
              }
            />
          </div>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className="py-2">
            <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
              Photograph Consent
            </div>
            <div>
              Ami HomeCare Limited would like to take or have your photograph for identification
              purpose and to enable us to perform our service to you. This form to be used to gain
              consent for taking pictures to enable Ami HomeCare Limited to assess medications
              information, record a visual image as a means of identification where the individual
              cannot identify themselves or where medication administration will need to take place
              to avoid mistakes
            </div>
          </div>
          <div className="py-2">
            <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
              Service user section
            </div>
            <div>
              Ami HomeCare Limited will have explained why they need to take a picture to best meet
              your health needs. If you haveany further questions, please ask as we are here to help
              you. You have the right to change your mind at any time, including after you have
              signed this form.
            </div>
          </div>

          <div className="py-2">
            <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
              Service user Agreement
            </div>
            <div className="mb-2">
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
            <CheckBoxInput
              main="serviceUserAgreement"
              name="consentToTakePictures"
              text="I give consent for my pictures to be being taken, stored and safely kept for non-profit making purposes."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.serviceUserAgreement
                  ? formData?.serviceUserAgreement?.consentToTakePictures
                  : false
              }
            />
            <CheckBoxInput
              main="serviceUserAgreement"
              name="consentToNoPictures"
              text=" I do not give consent for my pictures to be taken."
              checked={
                (data === 'editForm' || data === 'editServiceUserForm') &&
                formData &&
                formData?.serviceUserAgreement
                  ? formData?.serviceUserAgreement?.consentToNoPictures
                  : false
              }
            />
          </div>
          <div className="py-2">
            <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
              Key Holding/Safe
            </div>
            <div>
              Staff who hold keys for service users should: label the key with a code, never with
              the name and address of the service user in case the key gets lost. Care staff to be
              careful that they always keep the key in a safe place and always knock on the door and
              announce themselves before entering a service user&apos;s home with a key.
            </div>
          </div>
          <div className="py-2">
            <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
              Service user Agreement
            </div>
            <div>
              <CheckBoxInput
                main="consent"
                name="haveKeySafeCode"
                text="I give my consent for Ami HomeCare Limited to have the key safe code to my enter house."
                checked={
                  (data === 'editForm' || data === 'editServiceUserForm') &&
                  formData &&
                  formData?.consent
                    ? formData?.consent?.haveKeySafeCode
                    : false
                }
              />
              <CheckBoxInput
                main="consent"
                name="noKeySafeCode"
                text="I do not give consent for Ami HomeCare Limited to have the key safe code to my enter house."
                checked={
                  (data === 'editForm' || data === 'editServiceUserForm') &&
                  formData &&
                  formData?.consent
                    ? formData?.consent?.noKeySafeCode
                    : false
                }
              />
            </div>
          </div>
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-4">
          <div className=" px-4 py-2">
            <div className=" font-semibold text-xl flex">
              <div style={{ color: '#5B3A7D' }}>
                I can confirm that my consent has been sought to provide me with care workers who
                will assist me with my: (tick as appropriate)
              </div>
            </div>
            <div className=" pt-8 pb-4 ">
              <CheckBoxInput
                fontBold={true}
                main="basicDetails"
                name="personalCode"
                text="Personal care."
                checked={
                  (data === 'editForm' || data === 'editServiceUserForm') &&
                  formData &&
                  formData?.basicDetails
                    ? formData?.basicDetails?.personalCode
                    : false
                }
              />
              <CheckBoxInput
                fontBold={true}
                main="basicDetails"
                name="medication"
                text="Medication(Care Worker Support Method: Administering/Prompting)"
                checked={
                  (data === 'editForm' || data === 'editServiceUserForm') &&
                  formData &&
                  formData?.basicDetails
                    ? formData?.basicDetails?.medication
                    : false
                }
              />
              <CheckBoxInput
                main="basicDetails"
                name="livingActivities"
                text="And other daily living activities as per my agreed care plan and I give my consent to
                what is being proposed:"
                fontBold={true}
                checked={
                  (data === 'editForm' || data === 'editServiceUserForm') &&
                  formData &&
                  formData?.basicDetails
                    ? formData?.basicDetails?.livingActivities
                    : false
                }
              />
              <div className="flex justify-between w-full lg:w-2/4 px-8">
                <CheckBoxInput
                  main="basicDetails"
                  name="domesticCleaning"
                  text=" Domestic cleaning "
                  fontBold={true}
                  checked={
                    (data === 'editForm' || data === 'editServiceUserForm') &&
                    formData &&
                    formData?.basicDetails
                      ? formData?.basicDetails?.domesticCleaning
                      : false
                  }
                />
                <CheckBoxInput
                  main="basicDetails"
                  name="laundry"
                  text="Laundry"
                  fontBold={true}
                  checked={
                    (data === 'editForm' || data === 'editServiceUserForm') &&
                    formData &&
                    formData?.basicDetails
                      ? formData?.basicDetails?.laundry
                      : false
                  }
                />
                <CheckBoxInput
                  main="basicDetails"
                  name="shopping"
                  text="Shopping"
                  fontBold={true}
                  checked={
                    (data === 'editForm' || data === 'editServiceUserForm') &&
                    formData &&
                    formData?.basicDetails
                      ? formData?.basicDetails?.shopping
                      : false
                  }
                />
                <CheckBoxInput
                  main="basicDetails"
                  name="escort"
                  text="Escort "
                  fontBold={true}
                  checked={
                    (data === 'editForm' || data === 'editServiceUserForm') &&
                    formData &&
                    formData?.basicDetails
                      ? formData?.basicDetails?.escort
                      : false
                  }
                />
              </div>
              <Row gutter={24}>
                <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                  <TextInput
                    name="serviceUserBasicDetails"
                    label="Name of service user"
                    placeholder="Name of service user"
                  />
                </Col>

                <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                  <DateInput
                    name="dateOfBirthBasicDetails"
                    label="Date"
                    placeholder="Select date "
                  />
                </Col>
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <div className="formLabel"> Signature</div>
                  {data === 'editServiceUserForm' || data === 'editForm' ? (
                    <div className="my-2">
                      {formData?.signatures?.reviewerSignature ? (
                        <img
                          className="w-full"
                          style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                          src={formData?.signatures?.reviewerSignature}
                          alt="reviewerSignature"
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
                            signPag.current.reviewerSignature = sign;
                          }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => onClear('reviewerSignature')} className="px-4">
                          Clear
                        </Button>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
              <div>
                <div className=" font-semibold ">
                  Additional comments (e.g. if the decision needs to be reviewed, state when and
                  how)
                </div>

                <Form.Item name="additionalBasicDetails">
                  <AwesomeEditor
                    placeholder="Additional comments"
                    initialValue={
                      (formData &&
                        data &&
                        data !== 'createServiceUserForm' &&
                        formData?.additionalBasicDetails?.JSONText) || [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              text:
                                'I understand that I can withdraw my consent at any time and that a review of my decision will be undertaken at the yearly review of my care',
                            },
                          ],
                        },
                      ]
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-4">
          <div className=" px-4 py-2">
            <div className=" font-semibold text-xl flex">
              <div style={{ color: '#5B3A7D' }}>
                A “best interests” decision has been taken to proceed with the proposed care and
                treatment, and this is confirmed by the person’s relative/legal representative. The
                reasons for the decision are as follows.
              </div>
            </div>
            <div className=" pt-8 pb-4 ">
              <div className=" font-semibold ">
                Summary of reasons (together with details of any proposed review, etc)
              </div>

              <Form.Item name="summaryOfReasons">
                <AwesomeEditor
                  placeholder="Summary of reasons"
                  initialValue={
                    formData &&
                    data &&
                    data !== 'createServiceUserForm' &&
                    formData?.summaryOfReasons?.JSONText
                  }
                />
              </Form.Item>
            </div>
            <Row gutter={24}>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <div className="formLabel">Signature of person&apos;s representative</div>
                {data === 'editServiceUserForm' || data === 'editForm' ? (
                  <div className="my-2">
                    {formData?.signatures?.representativeSign ? (
                      <img
                        style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                        className="w-full"
                        src={formData?.signatures?.representativeSign}
                        alt="representativeSign"
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
                          signPag.current.representativeSign = sign;
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => onClear('representativeSign')} className="px-4">
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </Col>

              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput
                  name="dateOfPersonRepresentative"
                  label="Date"
                  placeholder="Select date"
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <div className="formLabel">
                  Signature of manager accepting responsibility for the decision
                </div>
                {data === 'editServiceUserForm' || data === 'editForm' ? (
                  <div className="my-2">
                    {formData?.signatures?.managerSign ? (
                      <img
                        style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                        className="w-full"
                        src={formData?.signatures?.managerSign}
                        alt="managerSign"
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
                          signPag.current.managerSign = sign;
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => onClear('managerSign')} className="px-4">
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </Col>

              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput
                  name="dateOfacceptingResponsibility"
                  label="Date"
                  placeholder="Select date"
                />
              </Col>
            </Row>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => form?.submit()}
          >
            {match.path === '/forms/care-and-treatment-form' || serviceUserId ? 'Submit' : 'Update'}
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
}))(CareAndConsentForm);
