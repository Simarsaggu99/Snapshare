/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import { Tabs } from 'antd';
import { connect, history } from 'umi';
import DisplayFormTable from './DisplayFormTable';

const AllForms = ({ match, dispatch, formByType }) => {
  const { TabPane } = Tabs;

  const [limit, setLimit] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [current, setCurrent] = useState(1);

  const requestTitle = () => {
    switch (match.path) {
      case '/all-forms/clientReviewForm':
        return 'Client Review';
      case '/all-forms/mentalCapacityForm':
        return 'Mental Capacity';
      case '/all-forms/movingAndHandlingForm':
        return 'Moving And Handling';
      case '/all-forms/riskAssessmentForm':
        return 'Risk Assessment';
      case '/all-forms/riskAssessmentFormCoshh':
        return 'Risk Assessment- COSHH';
      case '/all-forms/supportPlanForm':
        return 'Support Plan';
      case '/all-forms/telephoneMonitoring':
        return 'Telephone Monitoring';
      case '/all-forms/careAndTreatment':
        return 'Care And Treatment';
      case '/all-forms/qualityAssuranceMonitoring':
        return 'Quality Assurance Monitoring';
      case '/all-forms/staffSpotCheckForm':
        return 'Staff Spot Check';
      case '/all-forms/staffPerformanceAppraisal':
        return 'Staff Performance Appraisal';
      case '/all-forms/careWorkerReview':
        return 'Care Worker Review';
      case '/all-forms/applicationForm':
        return 'Application Form';
      default:
        return 'All Forms';
    }
  };

  const requestTab = () => {
    switch (match.path) {
      case '/all-forms/clientReviewForm':
        return 'clientReviewForm';
      case '/all-forms/mentalCapacityForm':
        return 'mentalCapacityForm';
      case '/all-forms/movingAndHandlingForm':
        return 'movingAndHandlingForm';
      case '/all-forms/riskAssessmentForm':
        return 'riskAssessmentForm';
      case '/all-forms/riskAssessmentFormCoshh':
        return 'riskAssessmentFormCoshh';
      case '/all-forms/supportPlanForm':
        return 'supportPlanForm';
      case '/all-forms/telephoneMonitoring':
        return 'telephoneMonitoring';
      case '/all-forms/careAndTreatment':
        return 'careAndTreatment';
      case '/all-forms/qualityAssuranceMonitoring':
        return 'qualityAssuranceMonitoring';
      case '/all-forms/staffSpotCheckForm':
        return 'staffSpotCheckForm';
      case '/all-forms/staffPerformanceAppraisal':
        return 'staffPerformanceAppraisal';
      case '/all-forms/careWorkerReview':
        return 'careWorkerReview';
      case '/all-forms/applicationForm':
        return 'applicationForm';
      default:
        return 'All Forms';
    }
  };

  const getFormsData = () => {
    const val = {
      type: requestTab(),
      _limit: limit,
      _start: current,
      keyword: searchKeyword,
    };

    if (!searchKeyword) {
      delete val?.keyword;
    }

    dispatch({
      type: 'forms/getForms',
      payload: {
        query: val,
      },
    });
  };

  useEffect(() => {
    getFormsData();
  }, [searchKeyword, current, limit, match?.path, dispatch]);

  return (
    <Page
      title={requestTitle()}
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: requestTitle(),
              path: '#',
            },
          ]}
        />
      }
    >
      <div className="shadow bg-white mb-8">
        <Tabs
          defaultActiveKey={requestTab}
          onTabClick={(val) => {
            history.replace(`/all-forms/${val}`);
          }}
        >
          <TabPane tab={<span className="mx-3 pl-2">Client Review </span>} key="clientReviewForm">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              current={current}
              formByType={formByType}
              limit={limit}
              keyValue="clientReviewForm"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane tab={<span className="mx-3">Mental Capacity</span>} key="mentalCapacityForm">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="mentalCapacityForm"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane
            tab={<span className="mx-3">Moving And Handling </span>}
            key="movingAndHandlingForm"
          >
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="movingAndHandlingForm"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane tab={<span className="mx-3">Risk Assessment </span>} key="riskAssessmentForm">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="riskAssessmentForm"
              getFormsData={getFormsData}
            />
          </TabPane>

          <TabPane
            tab={<span className="mx-3">Risk Assessment- COSHH</span>}
            key="riskAssessmentFormCoshh"
          >
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="riskAssessmentFormCoshh"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane tab={<span className="mx-3">Support Plan</span>} key="supportPlanForm">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="supportPlanForm"
              getFormsData={getFormsData}
            />
          </TabPane>

          <TabPane
            tab={<span className="mx-3">Telephone Monitoring</span>}
            key="telephoneMonitoring"
          >
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="telephoneMonitoring"
              getFormsData={getFormsData}
            />
          </TabPane>

          <TabPane tab={<span className="mx-3">Care And Treatment</span>} key="careAndTreatment">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="careAndTreatment"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane
            tab={<span className="mx-3">Quality Assurance Monitoring</span>}
            key="qualityAssuranceMonitoring"
          >
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="qualityAssuranceMonitoring"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane tab={<span className="mx-3">Staff Spot Check</span>} key="staffSpotCheckForm">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="staffSpotCheckForm"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane
            tab={<span className="mx-3">Staff Performance Appraisal</span>}
            key="staffPerformanceAppraisal"
          >
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="staffPerformanceAppraisal"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane tab={<span className="mx-3">Care Worker Review</span>} key="careWorkerReview">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="careWorkerReview"
              getFormsData={getFormsData}
            />
          </TabPane>
          <TabPane tab={<span className="mx-3">Application Form </span>} key="applicationForm">
            <DisplayFormTable
              setLimit={setLimit}
              setCurrent={setCurrent}
              setSearchKeyword={setSearchKeyword}
              formByType={formByType}
              current={current}
              limit={limit}
              keyValue="applicationForm"
              getFormsData={getFormsData}
            />
          </TabPane>
        </Tabs>
      </div>
    </Page>
  );
};

export default connect(({ forms }) => ({
  formByType: forms.formByType,
}))(AllForms);
