/* eslint-disable react/no-unknown-property */
import React from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import CreatedFormTable from '@/components/CreatedFormTable';

const FormTabs = ({
  getForms,
  formByType,
  type,
  setType,
  limit,
  setLimit,
  current,
  setCurrent,
  debounceSearch,
  status,
  match,
}) => {
  const { TabPane } = Tabs;
  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs
        defaultActiveKey={
          match.path.includes('service') ? 'clientReviewForm' : 'staffSpotCheckForm'
        }
        className="bg-white"
        onTabClick={(value) => {
          setType(value);
        }}
      >
        {match.path.includes('service') && (
          <>
            {' '}
            <TabPane tab={<span className="ml-3">Client Review</span>} key="clientReviewForm">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane tab={<span className="ml-3">Mental Capacity</span>} key="mentalCapacityForm">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane tab={<span className="ml-3">Risk Assessment</span>} key="riskAssessmentForm">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane
              tab={<span className="ml-3">Risk Assessment - COSHH</span>}
              key="riskAssessmentFormCoshh"
            >
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane
              tab={<span className="ml-3">Moving And Handling</span>}
              key="movingAndHandlingForm"
            >
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane tab={<span className="ml-3">Support Plan</span>} key="supportPlanForm">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane
              tab={<span className="ml-3">Telephone Monitoring</span>}
              key="telephoneMonitoring"
            >
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane tab={<span className="ml-3">Care And Treatment</span>} key="careAndTreatment">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane
              tab={<span className="ml-3">Quality Assurance Monitoring</span>}
              key="qualityAssuranceMonitoring"
            >
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
          </>
        )}
        {match.path.includes('staff') && (
          <>
            {' '}
            <TabPane tab={<span className="ml-3">Staff Spot Check</span>} key="staffSpotCheckForm">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane
              tab={<span className="ml-3">Staff Performance Appraisal</span>}
              key="staffPerformanceAppraisal"
            >
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane tab={<span className="ml-3">Care Worker Review</span>} key="careWorkerReview">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
            <TabPane tab={<span className="ml-3">Application Form</span>} key="applicationForm">
              <CreatedFormTable
                getForms={getForms}
                status={status}
                type={type}
                dataSource={formByType}
                limit={limit}
                current={current}
                setCurrent={setCurrent}
                setLimit={setLimit}
                debounceSearch={debounceSearch}
              />
            </TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default connect(({ loading, forms, staff }) => ({
  getStaffMember: staff.getStaffMember,
  loading: loading.effects['staff/getStaffMember'],
  formByType: forms.formByType,
  formData: forms.formData,
}))(FormTabs);
