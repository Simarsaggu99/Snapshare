/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import { Row, Col, Button, Form, Input, Checkbox } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { getPageQuery } from '@/utils/utils';
import AwesomeEditor from '@/components/AwesomeEditor';
import SignaturePad from 'react-signature-canvas';

const PreviousExperience = ({ form, formData, signPag, onClear, DateInput }) => {
  const { TextArea } = Input;

  const personalExperience = [
    {
      mainText: 'PERSONAL CARE',
      value: '1',
      subArray: [
        {
          subText: 'DRESSING /UNDRESSING',
          name: ['mainForm', 'previousExperience', 'personalCare', 'dressing', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'dressing', 'choice'],
        },
        {
          subText: 'PERSONAL CARE ',
          name: ['mainForm', 'previousExperience', 'personalCare', 'care', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'care', 'choice'],
        },
        {
          subText: 'BATHING /BED BATHS',
          name: ['mainForm', 'previousExperience', 'personalCare', 'bathing', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'bathing', 'choice'],
        },
        {
          subText: 'MOUTH CARE',
          name: ['mainForm', 'previousExperience', 'personalCare', 'mouthCare', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'mouthCare', 'choice'],
        },
        {
          subText: 'HAIR CARE ',
          name: ['mainForm', 'previousExperience', 'personalCare', 'hairCare', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'hairCare', 'choice'],
        },
        {
          subText: 'EYE CARE',
          name: ['mainForm', 'previousExperience', 'personalCare', 'eyeCare', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'eyeCare', 'choice'],
        },
        {
          subText: 'PRESSURE AREA CARE',
          name: ['mainForm', 'previousExperience', 'personalCare', 'pressureCare', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'pressureCare', 'choice'],
        },
        {
          subText: 'CONTINENCE',
          name: ['mainForm', 'previousExperience', 'personalCare', 'continence', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'continence', 'choice'],
        },
        {
          subText: 'CATHETER BAGS',
          name: ['mainForm', 'previousExperience', 'personalCare', 'catheterBags', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'catheterBags', 'choice'],
        },
        {
          subText: 'USE OF BED PANS/ COMMODES',
          name: ['mainForm', 'previousExperience', 'personalCare', 'bedPans', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'bedPans', 'choice'],
        },
        {
          subText: 'COLOSTOMY CARE',
          name: ['mainForm', 'previousExperience', 'personalCare', 'colostomyCare', 'value'],
          option: ['mainForm', 'previousExperience', 'personalCare', 'colostomyCare', 'choice'],
        },
      ],
    },
    {
      mainText: 'MOBILITY',
      value: '2',
      subArray: [
        {
          subText: 'MOVING AND HANDLING',
          name: ['mainForm', 'previousExperience', 'mobility', 'movingAndHandling', 'value'],
          option: ['mainForm', 'previousExperience', 'mobility', 'movingAndHandling', 'choice'],
        },
        {
          subText: 'USE OF HOIST /WALKING AIDS',
          name: ['mainForm', 'previousExperience', 'mobility', 'walkingAids', 'value'],
          option: ['mainForm', 'previousExperience', 'mobility', 'walkingAids', 'choice'],
        },
      ],
    },
    {
      mainText: 'NUTRITION',
      value: '3',
      subArray: [
        {
          subText: 'MEAL PREPARATION',
          name: ['mainForm', 'previousExperience', 'nutrition', 'mealPreparation', 'value'],
          option: ['mainForm', 'previousExperience', 'nutrition', 'mealPreparation', 'choice'],
        },
        {
          subText: 'FEEDING/ PEG FEEDING',
          name: ['mainForm', 'previousExperience', 'nutrition', 'feeding', 'value'],
          option: ['mainForm', 'previousExperience', 'nutrition', 'feeding', 'choice'],
        },
      ],
    },
    {
      mainText: 'PRACTICAL',
      value: '4',
      subArray: [
        {
          subText: 'HOUSEWORK / LAUNDRY/SHOPPING',
          name: ['mainForm', 'previousExperience', 'practical', 'housework', 'value'],
          option: ['mainForm', 'previousExperience', 'practical', 'housework', 'choice'],
        },
      ],
    },
    {
      mainText: 'SPECIALIST',
      value: '5',
      subArray: [
        {
          subText: 'PALLIATIVE CARE',
          name: ['mainForm', 'previousExperience', 'specialist', 'palliativeCare', 'value'],
          option: ['mainForm', 'previousExperience', 'specialist', 'palliativeCare', 'choice'],
        },
        {
          subText: 'DEMENTIA CARE',
          name: ['mainForm', 'previousExperience', 'specialist', 'dementiaCare', 'value'],
          option: ['mainForm', 'previousExperience', 'specialist', 'dementiaCare', 'choice'],
        },
        {
          subText: 'LEARNING DISABILITES',
          name: ['mainForm', 'previousExperience', 'specialist', 'learningDisabilities', 'value'],
          option: [
            'mainForm',
            'previousExperience',
            'specialist',
            'learningDisabilities',
            'choice',
          ],
        },
        {
          subText: 'PHYSICAL DISABILITIES',
          name: ['mainForm', 'previousExperience', 'specialist', 'physicalDisabilities', 'value'],
          option: [
            'mainForm',
            'previousExperience',
            'specialist',
            'physicalDisabilities',
            'choice',
          ],
        },
        {
          subText: 'CHILD CARE',
          name: ['mainForm', 'previousExperience', 'specialist', 'childCare', 'value'],
          option: ['mainForm', 'previousExperience', 'specialist', 'childCare', 'choice'],
        },
        {
          subText: 'CARE AFTER STROKE',
          name: ['mainForm', 'previousExperience', 'specialist', 'afterStroke', 'value'],
          option: ['mainForm', 'previousExperience', 'specialist', 'afterStroke', 'choice'],
        },
        {
          subText: 'OTHER',
          name: ['mainForm', 'previousExperience', 'specialist', 'other', 'value'],
          option: ['mainForm', 'previousExperience', 'specialist', 'other', 'choice'],
        },
      ],
    },
  ];
  const { data } = getPageQuery();
  return (
    <div className="bg-white shadow rounded mb-4 border-b p-8">
      <div className=" font-semibold text-xl mb-2" style={{ color: '#5B3A7D' }}>
        Previous experience
      </div>

      {personalExperience.map((list) => (
        <div key={list?.value}>
          <div className="formLabel">{list?.mainText}</div>
          {list?.subArray?.map((arr) => (
            <Row gutter={24} key={list?.value}>
              <Col lg={4} xl={4} md={6} sm={8} xs={12}>
                <div className="text-sm">{arr.subText}</div>
              </Col>
              <Col lg={2} xl={2} md={18} sm={16} xs={12}>
                <Form.Item name={arr?.option}>
                  <Checkbox
                    defaultChecked={
                      formData &&
                      data &&
                      data !== 'createServiceUserForm' &&
                      formData?.[arr?.option[0]]?.[arr?.option[1]]?.[arr?.option[2]]?.[
                        arr?.option[3]
                      ]?.[arr?.option[4]]
                    }
                    onChange={(e) => {
                      form.setFieldsValue({
                        [arr?.option[0]]: {
                          [arr?.option[1]]: {
                            [arr?.option[2]]: {
                              [arr?.option[3]]: {
                                [arr?.option[4]]: e.target.checked,
                              },
                            },
                          },
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={18} xl={18} md={24} sm={24} xs={24}>
                <div className="">
                  <Form.Item name={arr?.name}>
                    <AwesomeEditor
                      type="descriptionForm"
                      initialValue={
                        formData &&
                        data &&
                        data !== 'createServiceUserForm' &&
                        formData?.[arr?.name[0]]?.[arr?.name[1]]?.[arr?.name[2]]?.[arr?.name[3]]?.[
                          arr?.name[4]
                        ]?.JSONText
                      }
                      placeholder="Your comments here..."
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      ))}

      <div className="mt-4 mb-2 formLabel">
        I hereby declare to the best of my knowledge that the information given on this form and
        attached papers is true and correct and can be treated as part of any subsequent Contract of
        Employment.
      </div>
      <Row gutter={24}>
        <Col lg={12} xl={12} md={12} sm={24} xs={24}>
          <DateInput name={['mainForm', 'date']} label="Date" placeholder="Date" />
        </Col>

        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
          <div className="formLabel">Signed</div>
          {data === 'editServiceUserForm' || data === 'editForm' ? (
            <div className="my-2">
              {formData?.signatures?.signed ? (
                <img
                  style={{ height: '60px', width: 'auto', maxWidth: '100%' }}
                  className="w-full"
                  src={formData?.signatures?.signed}
                  alt="signed"
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
                    signPag.current.signed = sign;
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => onClear('signed')} className="px-4">
                  Clear
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ loading, forms, serviceUser, user }) => ({
  loading: loading.effects['forms/storeFormsDate'],
  loadingEditForm: loading.effects['forms/editForm'],
  getServiceUser: serviceUser.getServiceUser,
  formData: forms.formData,
  currentUser: user.currentUser,
}))(PreviousExperience);
