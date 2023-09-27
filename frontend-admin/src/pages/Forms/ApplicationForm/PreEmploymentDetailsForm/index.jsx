/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Input, Form, Row, Col, Checkbox, Tooltip } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { getPageQuery } from '@/utils/utils';
import AwesomeEditor from '@/components/AwesomeEditor';
import VaccinationDetails from './VaccinationDetails';

const PreEmploymentDetailsForm = ({ form, signPag, onClear, formData }) => {
  const { data } = getPageQuery();
  const TextInput = ({ name, rules, label, placeholder, autoFocus, reff }) => {
    return (
      <Form.Item
        name={name}
        rules={rules}
        label={<span className="formLabel">{label}</span>}
        form={form}
      >
        <Input ref={reff} autoFocus={autoFocus} size="large" placeholder={placeholder} />
      </Form.Item>
    );
  };

  const generalHealthDescription = [
    {
      value: '1',
      heading: 'Have you ever registered as disabled?',
      noText: ['preEmployment', 'generalHealth', 'registeredAsDisabled', 'value'],
      yesText: ['preEmployment', 'generalHealth', 'registeredAsDisabled', 'description'],
    },
    {
      value: '2',
      heading: 'Have you ever claimed industrial injury/disease compensation or benefits?',
      noText: ['preEmployment', 'generalHealth', 'industrialInjury', 'value'],
      yesText: ['preEmployment', 'generalHealth', 'industrialInjury', 'description'],
    },
    {
      value: '3',
      heading: 'Have you ever left or had to modify a job due to illness or injury',
      noText: ['preEmployment', 'generalHealth', 'modificationInJob', 'value'],
      yesText: ['preEmployment', 'generalHealth', 'modificationInJob', 'description'],
    },
    {
      value: '4',
      heading:
        'How much time have you taken as absence from work or school in the last 2 years due to illness or injury',
      noText: ['preEmployment', 'generalHealth', 'absenceFromWork', 'value'],
      yesText: ['preEmployment', 'generalHealth', 'absenceFromWork', 'description'],
    },
  ];

  const conditionList = [
    {
      value: '1',
      heading:
        'Fits, blackouts, epilepsy, fainting attacks, severe head injuries, frequent or severe migraine headaches.',
      noText: ['preEmployment', 'condition', 'headInjuries', 'value'],
      yesText: ['preEmployment', 'condition', 'headInjuries', 'description'],
    },
    {
      value: '2',
      heading:
        'Chest problems including asthma, bronchitis, emphysema, pleurisy, persistent cough or breathlessness.',
      noText: ['preEmployment', 'condition', 'chestProblems', 'value'],
      yesText: ['preEmployment', 'condition', 'chestProblems', 'description'],
    },
    {
      value: '3',
      heading:
        'Heart or circulation problems e.g. raised blood pressure, angina, stroke, chest pains.',
      noText: ['preEmployment', 'condition', 'circulationProblems', 'value'],
      yesText: ['preEmployment', 'condition', 'circulationProblems', 'description'],
    },
    {
      value: '4',
      heading: 'Eye disease or severe vision defects',
      noText: ['preEmployment', 'condition', 'eyeDisease', 'value'],
      yesText: ['preEmployment', 'condition', 'eyeDisease', 'description'],
    },
    {
      value: '5',
      heading: 'Defective colour vision',
      noText: ['preEmployment', 'condition', 'colorVision', 'value'],
      yesText: ['preEmployment', 'condition', 'colorVision', 'description'],
    },
    {
      value: '6',
      heading: 'Ear conditions e.g. recurring discharge or hearing loss.',
      noText: ['preEmployment', 'condition', 'earConditions', 'value'],
      yesText: ['preEmployment', 'condition', 'earConditions', 'description'],
    },
    {
      value: '7',
      heading:
        'Mental health conditions e.g. schizophrenia, depression, anxiety states, phobias, eating disorders or self-harm (including overdoses).',
      noText: ['preEmployment', 'condition', 'mentalHealth', 'value'],
      yesText: ['preEmployment', 'condition', 'mentalHealth', 'description'],
    },
    {
      value: '8',
      heading: 'Addiction to alcohol or any other substance.',
      noText: ['preEmployment', 'condition', 'addictionToAlcohol', 'value'],
      yesText: ['preEmployment', 'condition', 'addictionToAlcohol', 'description'],
    },
    {
      value: '9',
      heading:
        'Neck, back or other joint problems including arthritis, slipped disc, sciatica, recurrent backache.',
      noText: ['preEmployment', 'condition', 'jointProblem', 'value'],
      yesText: ['preEmployment', 'condition', 'jointProblem', 'description'],
    },
    {
      value: '10',
      heading: 'Skin conditions e.g. eczema, psoriasis, dermatitis.',
      noText: ['preEmployment', 'condition', 'skinConditions', 'value'],
      yesText: ['preEmployment', 'condition', 'skinConditions', 'description'],
    },
    {
      value: '11',
      heading:
        'Gastro-intestinal conditions, including ulcers, irritable bowel syndrome, typhoid or persistent diarrhoea.',
      noText: ['preEmployment', 'condition', 'gastroConditions', 'value'],
      yesText: ['preEmployment', 'condition', 'gastroConditions', 'description'],
    },
    {
      value: '12',
      heading: 'Diabetes, thyroid disease or any other glandular condition.',
      noText: ['preEmployment', 'condition', 'glandularConditions', 'value'],
      yesText: ['preEmployment', 'condition', 'glandularConditions', 'description'],
    },
    {
      value: '12',
      heading: 'Liver/kidney or bladder disease.',
      noText: ['preEmployment', 'condition', 'bladderDisease', 'value'],
      yesText: ['preEmployment', 'condition', 'bladderDisease', 'description'],
    },
    {
      value: '13',
      heading: 'Hernia or rupture.',
      noText: ['preEmployment', 'condition', 'hernia', 'value'],
      yesText: ['preEmployment', 'condition', 'hernia', 'description'],
    },
    {
      value: '14',
      heading: 'Operations (other than minor operations)',
      noText: ['preEmployment', 'condition', 'operations', 'value'],
      yesText: ['preEmployment', 'condition', 'operations', 'description'],
    },
    {
      value: '15',
      heading: 'Allergies to any substances.',
      noText: ['preEmployment', 'condition', 'allergies', 'value'],
      yesText: ['preEmployment', 'condition', 'allergies', 'description'],
    },
    {
      value: '15',
      heading:
        'Any other medical condition or disability, which you feel, may require adjustment to your work or working environment.',
      noText: ['preEmployment', 'condition', 'medicalCondition', 'value'],
      yesText: ['preEmployment', 'condition', 'medicalCondition', 'description'],
    },

    {
      value: '16',
      heading: ' Are you taking any regular medications? (please list)',
      noText: ['preEmployment', 'condition', 'regularMedication', 'value'],
      yesText: ['preEmployment', 'condition', 'regularMedication', 'description'],
    },
  ];

  const TableBody = ({ list, primaryHeading, secondaryHeading, ternaryHeading }) => {
    return (
      <>
        <Row gutter={24}>
          <Col lg={13} xl={13} md={18} sm={18} xs={18}>
            <div>
              <div className="formLabel overflow-hidden mb-2">{primaryHeading}</div>
              <Tooltip placement="topLeft" title={<div>{list?.heading}</div>}>
                <div className="truncate">{list?.heading}</div>
              </Tooltip>
            </div>
          </Col>
          <Col lg={3} xl={3} md={6} sm={6} xs={6}>
            <Form.Item name={list?.noText} form={form} label={secondaryHeading}>
              <Checkbox
                defaultChecked={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.[list?.noText[0]]?.[list?.noText[1]]?.[list?.noText[2]]?.[
                    list?.noText[3]
                  ]
                }
                onChange={(e) => {
                  form.setFieldsValue({
                    [list?.noText[0]]: {
                      [list?.noText[1]]: {
                        [list?.noText[2]]: {
                          [list?.noText[3]]: e.target.checked,
                        },
                      },
                    },
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xl={8} md={24} sm={24} xs={24}>
            <Form.Item name={list?.yesText} form={form} label={ternaryHeading}>
              <AwesomeEditor
                type="descriptionForm"
                initialValue={
                  formData &&
                  data &&
                  data !== 'createServiceUserForm' &&
                  formData?.[list?.yesText[0]]?.[list?.yesText[1]]?.[list?.yesText[2]]?.[
                    list?.yesText[3]
                  ]?.JSONText
                }
                placeholder="Your comments here..."
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <div className="bg-white shadow rounded mb-4 border-b p-8">
        <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
          PRE-EMPLOYMENT FITNESS ASESSMENT QUESTIONNAIRE
        </div>
        <div className="formLabel my-2">
          The purpose of the questionnaire is to satisfy the obligation we share with you, which is
          to try to ensure that the work you are applying for will not be detrimental to your health
          and that you, in turn, are not likely to be a health risk to Clients and colleagues.
        </div>
        <div className="formLabel mb-2">
          The questionnaire seeks certain personal sensitive data regarding your physical/mental
          health. This information will not be used in order to select individuals for employment,
          but may be used in order to verify the safety of proceeding with either an application or
          a job offer.
        </div>
        <div className="formLabel mb-2">
          You are therefore requested to complete this form, and sign it. This will indicate your
          explicit consent to the collection and processing of such data in accordance with the
          principles of the Data Protection Act.
        </div>
        <div className="font-bold text-center my-2">Thank you for your co-operation</div>
        <Row gutter={[24, 12]}>
          <Col lg={4} xl={4} md={4} sm={24} xs={24}>
            <TextInput name={['preEmployment', 'title']} label="Title" placeholder="Title" />
          </Col>
          <Col lg={4} xl={4} md={4} sm={24} xs={24}>
            <TextInput
              name={['preEmployment', 'initials']}
              label="Initials"
              placeholder="Initials"
            />
          </Col>
          <Col lg={8} xl={8} md={8} sm={24} xs={24}>
            <TextInput
              name={['preEmployment', 'firstName']}
              label="First name"
              placeholder="First name"
            />
          </Col>
          <Col lg={8} xl={8} md={8} sm={24} xs={24}>
            <TextInput
              name={['preEmployment', 'lastName']}
              label="Last name"
              placeholder="Last name"
            />
          </Col>
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <TextInput
              name={['preEmployment', 'positionAppliedFor']}
              label="Position applied for"
              placeholder="Position applied for"
            />
          </Col>
        </Row>
        {generalHealthDescription.map((list) => (
          <div key={list?.value}>
            <TableBody
              list={list}
              primaryHeading="General Health"
              secondaryHeading={
                <span className="formLabel overflow-hidden mb-2">
                  If <span className="font-bold">“NO”</span> please tick
                </span>
              }
              ternaryHeading={
                <span className="formLabel overflow-hidden mb-2">
                  If <span className="font-bold">“YES”</span>, please give details
                </span>
              }
            />
          </div>
        ))}
        <div className="mb-2">
          <span className="formLabel overflow-hidden mb-2">Medical conditions.</span> Have you had
          any of the following? If so, please give full details including any ongoing effects on
          your day-to-day activities. Please continue on a separate sheet if necessary.
        </div>
        {conditionList.map((list) => (
          <div key={list?.value}>
            <TableBody
              list={list}
              primaryHeading="Condition"
              secondaryHeading={
                <span className="formLabel overflow-hidden mb-2">
                  If <span className="font-bold">“NO”</span> please tick
                </span>
              }
              ternaryHeading={
                <span className="formLabel overflow-hidden mb-2">
                  If <span className="font-bold">“YES”</span>, please give details
                </span>
              }
            />
          </div>
        ))}
      </div>
      <VaccinationDetails signPag={signPag} onClear={onClear} />
    </>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(PreEmploymentDetailsForm);
