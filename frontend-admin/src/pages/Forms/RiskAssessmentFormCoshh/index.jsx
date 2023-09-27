/* eslint-disable no-underscore-dangle */
import { Input, Form, Row, Col, DatePicker, Button, Radio } from 'antd';
import skull from '@/assets/RiskAssessmentForm-COSHH/skull.svg';
import substance from '@/assets/RiskAssessmentForm-COSHH/substance.svg';
import eye from '@/assets/RiskAssessmentForm-COSHH/eye.svg';
import oxidant from '@/assets/RiskAssessmentForm-COSHH/oxidant.svg';
import fire from '@/assets/RiskAssessmentForm-COSHH/fire.svg';
import Shape from '@/assets/RiskAssessmentForm-COSHH/Shape.svg';
import tick from '@/assets/RiskAssessmentForm-COSHH/tick.svg';
import ConfirmModal from '@/components/ConfirmModal';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import { connect, useParams } from 'umi';
import AwesomeEditor from '@/components/AwesomeEditor';
import SignaturePad from 'react-signature-canvas';
import styles from './index.less';

const RiskAssessmentFormCoshh = ({
  dispatch,
  loading,
  formData,
  loadingEditForm,
  match,
  getServiceUser,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState('Toxic');
  const [type, setType] = useState('');
  const [id, setId] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [status, setStatus] = useState('');
  const { data } = getPageQuery();
  const inputEl = useRef();

  const emptyServiceUser = useCallback(
    () => dispatch({ type: 'serviceUser/setStates', payload: null, key: 'getServiceUser' }),
    [dispatch],
  );
  const signPag = React.useRef({ reviewerSign: {} });
  const onClear = (index) => signPag.current[index].clear();
  const emptyFormData = useCallback(
    () => dispatch({ type: 'forms/setStates', payload: null, key: 'formData' }),
    [dispatch],
  );

  const { TextArea } = Input;
  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item
        name={name}
        rules={rules}
        label={label ? <span className="formLabel">{label}</span> : ''}
      >
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

  const { formId, serviceUserId } = useParams();

  const onFormRender = () => {
    inputEl.current.focus();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    onFormRender();
  }, []);

  useEffect(() => {
    if (match?.path === '/forms/risk-assessment-form-coshh') {
      emptyFormData();
      emptyServiceUser();
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

  const images = [
    {
      image: skull,
      data: 'Toxic',
      values: '1',
    },
    {
      image: substance,
      data: 'Corrosive',
      values: '2',
    },
    {
      image: Shape,
      data: 'Harmful',
      values: '3',
    },
    {
      image: eye,
      data: 'Irritant',
      values: '4',
    },
    {
      image: fire,
      data: 'Flammable',
      values: '5',
    },
    {
      image: oxidant,
      data: 'Oxidising',
      values: '6',
    },
  ];
  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          reviewDate: formData?.reviewDate ? moment(formData?.reviewDate) : '',
          assessmentDate: formData?.assessmentDate ? moment(formData?.assessmentDate) : '',
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
      <div className=" font-semibold text-3xl  py-2">Risk Assessment Form - COSHH</div>
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
          let dataForApi = {};
          dataForApi = { ...values, images: { choice: selected } };
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
          if (values.reviewDate) dataForApi.reviewDate = new Date(values.reviewDate).toISOString();
          if (values.assessmentDate)
            dataForApi.assessmentDate = new Date(values.assessmentDate).toISOString();
          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/risk-assessment-form-coshh' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;

            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'riskAssessmentFormCoshh' },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('confirm');
                setType('riskAssessmentFormCoshh');
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
                body: { ...dataForApi, type: 'riskAssessmentFormCoshh' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('riskAssessmentFormCoshh');
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
            name="description"
            label="Product/Substance as described on label and manufacturer"
            placeholder="product and manufacturer"
            rules={[
              {
                whitespace: true,
              },
            ]}
          />

          <Form.Item
            name="purpose"
            label={<span className="formLabel">Where used/for what purpose</span>}
          >
            <AwesomeEditor
              initialValue={
                formData && data && data !== 'createServiceUserForm' && formData?.purpose?.JSONText
              }
              placeholder="write purpose..."
            />
          </Form.Item>
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <div className="flex justify-around">
            <Row gutter={[24, 12]}>
              {images.map((image) => (
                <Col key={image.values} lg={8} xl={4} md={12} sm={12} xs={24}>
                  <div
                    className={`border cursor-pointer ${styles.selectChoice}`}
                    onClick={() => {
                      setSelected(image.data);
                    }}
                  >
                    <div className=" flex justify-end pt-2 pr-2 ">
                      <div className="h-6">
                        {image?.data === selected ? (
                          <img src={tick} alt="Store illustration" s />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="px-10 pb-4 ">
                      <div className="flex justify-center">
                        <img src={image.image} alt="Store illustration" className="h-20 " />
                      </div>

                      <div
                        className="text-center text-lg font-semibold pt-5"
                        style={{ color: '#502C74' }}
                      >
                        {image.data}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className="py-2">
            <Form.Item noStyle initialValue="Liquid" name={['reviewType', 'choice']}>
              <Radio.Group options={['Liquid', 'Gel', 'Powder', 'Granules', 'Other']} />
            </Form.Item>
          </div>

          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Possible means of exposure
          </div>
          <div className="py-2">
            <Form.Item noStyle initialValue="Inhalation" name={['exposure', 'choice']}>
              <Radio.Group
                options={['Inhalation', 'Ingestion', 'Absorption', 'Skin/Eye Contact']}
              />
            </Form.Item>
          </div>

          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Are there any Workplace Exposure Limits (WELs) listed for any of the active ingredients
            listed on the safety data sheet?
          </div>
          <div className="py-2">
            <Form.Item noStyle initialValue="Yes" name={['wels', 'choice']}>
              <Radio.Group options={['Yes', 'No']} />
            </Form.Item>
          </div>
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Is monitoring required to determine levels?
          </div>
          <div className="py-2">
            <Form.Item noStyle initialValue="Yes" name={['monitorDetermine', 'choice']}>
              <Radio.Group options={['Yes', 'No']} />
            </Form.Item>
          </div>
          <div className=" font-semibold text-xl pb-2 pt-4" style={{ color: '#5B3A7D' }}>
            Symptoms/Effects of improper use
          </div>

          <Form.Item name="symptomData">
            <AwesomeEditor
              initialValue={
                formData &&
                data &&
                data !== 'createServiceUserForm' &&
                formData?.symptomData?.JSONText
              }
              placeholder="Your comments here..."
            />
          </Form.Item>
          <div className=" font-semibold text-xl pb-2" style={{ color: '#5B3A7D' }}>
            Persons who may be exposed
          </div>
          <TextInput
            name="exposedPerson"
            placeholder="Person name"
            rules={[
              {
                whitespace: true,
              },
            ]}
          />
          <div className=" font-semibold text-xl pb-2" style={{ color: '#5B3A7D' }}>
            Safe Storage
          </div>
          <TextInput
            name="storage"
            placeholder="Safe Storage"
            rules={[
              {
                whitespace: true,
              },
            ]}
          />
          <div className=" font-semibold text-xl pb-2" style={{ color: '#5B3A7D' }}>
            Describe safe method of use including appropriate PPE to be worn
          </div>
          <Form.Item name="ppeData">
            <AwesomeEditor
              initialValue={
                formData && data && data !== 'createServiceUserForm' && formData?.ppeData?.JSONText
              }
              placeholder="Your description here..."
            />
          </Form.Item>
          <div className=" font-semibold text-xl " style={{ color: '#5B3A7D' }}>
            Risk Rating
          </div>
          <div className="pt-2 pb-6">
            <Form.Item noStyle initialValue="Low" name={['riskRating', 'choice']}>
              <Radio.Group options={['Low', 'High']} />
            </Form.Item>
          </div>
          <div className="px-12 py-3 border">
            <Row gutter={24}>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <TextInput
                  name="serviceUser"
                  label="Name"
                  placeholder="Person Name"
                  rules={[
                    {
                      whitespace: true,
                      required: true,
                      message: 'Please enter the name',
                    },
                  ]}
                />
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput
                  name="assessmentDate"
                  label="Assessment Date"
                  placeholder="Select Date"
                />
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <TextInput
                  name="actionData"
                  label="Further Action Required"
                  placeholder="Further action"
                  rules={[
                    {
                      whitespace: true,
                    },
                  ]}
                />
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <DateInput name="reviewDate" label="Action Review Date" placeholder="Select Date" />
              </Col>
            </Row>
            <div className="formLabel">Signature</div>
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
                <div className="w-full h-24 border my-2">
                  <SignaturePad
                    canvasProps={{ className: 'h-full w-full' }}
                    ref={(sign) => {
                      signPag.current.reviewerSign = sign;
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => onClear('reviewerSign')}> Clear</Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {(match.path === '/forms/risk-assessment-form-coshh' || serviceUserId) && (
            <Button type="primary" loading={loading} size="large" onClick={() => form.submit()}>
              Submit
            </Button>
          )}

          {formData && !serviceUserId && match.path !== '/forms/risk-assessment-form-coshh' && (
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
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(RiskAssessmentFormCoshh);
