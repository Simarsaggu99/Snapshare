import Page from '@/components/Page';
import { Input, Tabs } from 'antd';
// import TabPane from 'antd/lib/tabs/TabPane';
import React, { useEffect, useState } from 'react';
import ManageTransactionTable from './ManageTransactionTable/index';
import { connect } from 'umi';

const ManageTransactions = ({ dispatch }) => {
  const { TabPane } = Tabs;
  const [tab, setTab] = useState('');
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [searchText, setSerchText] = useState('');
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const tabPaneArray = [
    {
      value: '',
      name: 'All',
    },
    {
      value: 'Pending',
      name: 'Pending',
    },
    {
      value: 'Accepted',
      name: 'Accepted',
    },
    {
      value: 'Reject',
      name: 'Rejected',
    },
    // {
    //   value: 'Complete',
    //   name: 'Complete',
    // },
  ];

  const getAllTransactions = () => {
    dispatch({
      type: 'transaction/getAllTransaction',
      payload: {
        query: { type: tab, viewSize, startIndex },
      },
    }).then((res) => {
      console.log('res', res);
    });
  };
  useEffect(() => {
    getAllTransactions();
  }, [tab, startIndex, viewSize]);

  return (
    <div>
      <div>
        <Page title={<span className="text-3xl">Manage Transaction</span>} PrevNextNeeded="N">
          <div>
            <Tabs
              // tabBarExtraContent={
              //   <div className=" flex">
              //     <Input
              //       size="middle"
              //       onChange={(e) => {
              //         // onSearch(e.target.value);
              //       }}
              //       placeholder="Enter text "
              //       allowClear
              //     />
              //   </div>
              // }
              defaultActiveKey="RedeemRequests"
              onChange={(e) => {
                setCurrentPage(1);
                setStartIndex(0);
                setTab(e);
              }}
            >
              {tabPaneArray?.map((items) => (
                <TabPane tab={items?.name} key={items?.value}>
                  <ManageTransactionTable
                    startIndex={startIndex}
                    setStartIndex={setStartIndex}
                    viewSize={viewSize}
                    currentPage={currentPage}
                    // allReportedPost={allReportedPost}
                    tab={tab}
                    handleChangePagination={handleChangePagination}
                    setViewSize={setViewSize}
                    setCurrentPage={setCurrentPage}
                    getAllTransactions={getAllTransactions}
                    // getAllReportedPost={getAllReportedPost}
                  />
                </TabPane>
              ))}
              {/* <TabPane tab="Order" key="order">
                <ManageTransactionTable
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                  viewSize={viewSize}
                  currentPage={currentPage}
                  // allReportedPost={allReportedPost}
                  handleChangePagination={handleChangePagination}
                  setViewSize={setViewSize}
                  setCurrentPage={setCurrentPage}
                  // getAllReportedPost={getAllReportedPost}
                />
              </TabPane> */}
            </Tabs>
          </div>
        </Page>
      </div>
    </div>
  );
};

export default connect(() => ({}))(ManageTransactions);
