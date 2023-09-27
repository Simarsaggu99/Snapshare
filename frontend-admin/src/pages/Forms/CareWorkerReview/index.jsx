/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, DatePicker, Button, Tooltip } from 'antd';
import { connect, useParams } from 'umi';
import { getPageQuery } from '@/utils/utils';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import SignaturePad from 'react-signature-canvas';
import moment from 'moment';
import classNames from 'classnames';
import styles from './index.less';

const CareWorkerReview = ({
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
  const signPag = React.useRef({ reviewerSign: {}, employeeSign: {} });
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

  const TableHeader = ({ ColHeading1, ColHeading2, ColHeading3 }) => {
    return (
      <Row gutter={24}>
        <Col lg={8} xl={8} md={8} sm={8} xs={8}>
          <div className="font-semibold overflow-hidden mb-2">{ColHeading1}</div>
        </Col>
        <Col lg={8} xl={8} md={8} sm={8} xs={8}>
          <div className="font-semibold overflow-hidden mb-2">{ColHeading2}</div>
        </Col>
        <Col lg={8} xl={8} md={8} sm={8} xs={8}>
          <div className="font-semibold overflow-hidden mb-2">{ColHeading3}</div>
        </Col>
      </Row>
    );
  };

  const TableBody = ({ list, supDetails, subDetails, supPlaceholder, subPlaceholder }) => {
    return (
      <Row gutter={24}>
        <Col lg={8} xl={8} md={8} sm={8} xs={8}>
          <div>
            <Tooltip
              placement="topLeft"
              title={
                <div>
                  <div>{list?.mainText}</div>
                  {list?.subText && <div>{list?.subText}</div>}
                </div>
              }
            >
              <div className="truncate">{list?.mainText}</div>
              {list?.subText && <div className="truncate">{list?.subText}</div>}
            </Tooltip>
          </div>
        </Col>
        {!list?.percentageRequired && (
          <Col lg={8} xl={8} md={8} sm={8} xs={8}>
            <Form.Item name={supDetails}>
              <TextArea size="large" placeholder={supPlaceholder} rows="1" />
            </Form.Item>
          </Col>
        )}

        <Col
          lg={list?.percentageRequired ? 16 : 8}
          xl={list?.percentageRequired ? 16 : 8}
          md={list?.percentageRequired ? 16 : 8}
          sm={list?.percentageRequired ? 16 : 8}
          xs={list?.percentageRequired ? 16 : 8}
        >
          <Form.Item name={subDetails}>
            <TextArea size="large" placeholder={subPlaceholder} rows="1" />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const actionToBeTaken = [
    {
      value: '1',
      mainText: 'Using the CM mobile.',
      subText: 'Any issues with logging in.',
    },
    {
      value: '2',
      mainText: 'Last week compliance.',
    },
    {
      value: '3',
      percentageRequired: 'No',
      mainText: 'Punctuality.',
      subText: 'Time spent with the clients.',
    },
  ];

  const reviewPointsToDiscuss = [
    {
      value: '1',
      mainText: 'How do you feel your role is going and are you enjoying it?',
    },
    {
      value: '2',
      mainText: 'How could things be improved?',
    },
    {
      value: '3',
      mainText: 'Challenges with any service users or any other employees?',
    },
    {
      value: '4',
      mainText: 'Objectives and training still to be achieved – job and career?',
    },
    {
      value: '5',
      mainText:
        'Organisational issues – are there any organisational issues that need to be addressed?',
    },
    {
      value: '6',
      mainText: 'PPE/ Covid test/ Vaccine ',
    },
    {
      value: '7',
      mainText: 'Comments',
    },
  ];

  // edit the form
  useEffect(() => {
    if (formData) {
      emptyServiceUser();
      if ((data === 'editServiceUserForm' || data === 'editForm') && formId === formData?._id) {
        form.setFieldsValue({
          ...formData,
          dateOfReview: formData?.dateOfReview ? moment(formData?.dateOfReview) : '',
          nextReviewDate: formData?.nextReviewDate ? moment(formData?.nextReviewDate) : '',
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
      <div className=" font-semibold text-3xl  py-2">Care Worker Review Form</div>
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
          if (values.dateOfReview)
            dataForApi.dateOfReview = new Date(values.dateOfReview).toISOString();
          if (values.nextReviewDate)
            dataForApi.nextReviewDate = new Date(values.nextReviewDate).toISOString();

          if (
            (formData && Object?.keys(formData)?.length === 0) ||
            (getServiceUser && Object?.keys(getServiceUser)?.length > 0) ||
            match.path === '/forms/care-worker-review' ||
            !formId
          ) {
            if (getServiceUser) {
              dataForApi.user_id = serviceUserId;
            }

            dataForApi.createdBy = currentUser?._id;
            dispatch({
              type: 'forms/storeFormsDate',
              payload: { data: dataForApi, type: 'careWorkerReview' },
            }).then((res) => {
              if (res?.status === 'ok') {
                form.resetFields();
                setConfirmModal(true);
                setStatus('confirm');
                setType('careWorkerReview');
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
                body: { ...dataForApi, type: 'careWorkerReview' },
              },
            }).then((res) => {
              if (res?.status === 'ok') {
                setConfirmModal(true);
                setStatus('successful');
                setType('careWorkerReview');
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
                name="name"
                label="Name"
                placeholder="Enter the name"
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
                label="Date of review"
                name="dateOfReview"
                placeholder="Select date of review"
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <DateInput
                label="Next review date"
                name="nextReviewDate"
                placeholder="Select next review date"
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="personPresentAtReview"
                label="Persons present at review"
                placeholder="Persons present at review"
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput name="IDCard" label="ID card" placeholder="Enter ID card details" />
            </Col>
          </Row>
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <TableHeader
            ColHeading2="Percentage achieved"
            ColHeading1="Care professionals KPI’s"
            ColHeading3="Action taken, by whom and by when"
          />
          {actionToBeTaken.map((list) => (
            <div key={list?.value}>
              <TableBody
                list={list}
                supDetails={[
                  'careProfessional',
                  `careProfessional${list?.value}`,
                  'percentageAchieved',
                ]}
                subDetails={[
                  'careProfessional',
                  `careProfessional${list?.value}`,
                  'actionTakenDetails',
                ]}
                supPlaceholder={'Percentage achieved'}
                subPlaceholder={'Action taken, by whom and by when'}
              />
            </div>
          ))}
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <TableHeader
            ColHeading2="Improvement and action points"
            ColHeading1="Review points to discuss"
            ColHeading3="By whom and by when"
          />
          {reviewPointsToDiscuss.map((list) => (
            <div key={list?.value}>
              <TableBody
                list={list}
                supDetails={[
                  'reviewPoints',
                  `reviewPointsDiscussion${list?.value}`,
                  'actionPoints',
                ]}
                subDetails={[
                  'reviewPoints',
                  `reviewPointsDiscussion${list?.value}`,
                  'personDetails',
                ]}
                supPlaceholder={'Improvement and action points'}
                subPlaceholder={'By whom and by when'}
              />
            </div>
          ))}
        </div>

        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <Row gutter={24}>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <TextInput
                name="reviewerName"
                label="Reviewer name"
                placeholder="Name of the reviewer"
              />
            </Col>

            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="formLabel">Reviewer signature</div>
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
                    <Button onClick={() => onClear('reviewerSign')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Col>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <TextInput
                name="employeeName"
                label="Employee name"
                placeholder="Name of the employee"
              />
            </Col>
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="formLabel">Employee signature</div>
              {data === 'editServiceUserForm' || data === 'editForm' ? (
                <div className="my-2">
                  {formData?.signatures?.employeeSign ? (
                    <img
                      style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                      className="w-full"
                      src={formData?.signatures?.employeeSign}
                      alt="employeeSign"
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
                        signPag.current.employeeSign = sign;
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onClear('employeeSign')} className="px-4">
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>
        <div className=" bg-white shadow rounded mb-4 border-b p-8">
          <Row gutter={24}>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="probationPeriodSigned"
                label="Probationary period signed"
                placeholder="Enter the probationary period signed"
              />
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="noProbationPeriod"
                label="If no, please give reasons"
                placeholder="Enter the reason"
              />
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <TextInput
                name="probationExtendedPeriod"
                label="If no, extended for"
                placeholder="Enter the extended period"
              />
            </Col>
          </Row>
          <div className="text-center font-semibold text-2xl">
            Issues to be actioned immediately
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            loading={loading || loadingEditForm}
            size="large"
            onClick={() => form?.submit()}
          >
            {match.path === '/forms/care-worker-review' || serviceUserId ? 'Submit' : 'Update'}
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
}))(CareWorkerReview);
