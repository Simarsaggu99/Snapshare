import React, { useEffect, useState } from 'react';
import { Tabs, Input, Button, Dropdown, Menu, Select } from 'antd';
import { connect } from 'umi';
import Page from '@/components/Page';
import ManageReportTable from './ManageReportTable';
import { debounce } from 'lodash';
import { DownOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

const ManageReports = ({ dispatch, allReportedPost }) => {
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [searchText, setSerchText] = useState('');
  const [sortData, setSortData] = useState('Latest');
  const onChangeTab = (key) => {};
  const getAllReportedPost = () => {
    dispatch({
      type: 'reported/getAllReportedPost',
      payload: {
        query: {
          startIndex,
          viewSize,
          keyword: searchText,
          filterBy: sortData,
        },
      },
    });
  };

  console.log(allReportedPost, 'dfjdhfuj');
  useEffect(() => {
    getAllReportedPost();
  }, [startIndex, viewSize, currentPage, searchText, sortData]);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }
  const action = (value) => {
    setSerchText(value);
  };
  const onSearch = debounce(action, 400);
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setSortData('sort');
        }}
      >
        Ascending
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setSortData('Latest');
        }}
      >
        Latest
      </Menu.Item>
    </Menu>
  );
  return (
    <Page title={<span className="text-3xl">Manage Reports</span>} PrevNextNeeded="N">
      <div className="mb-8 flex">
        <Input
          size="large"
          onChange={(e) => {
            onSearch(e.target.value);
          }}
          placeholder="Enter text "
          allowClear
        />
      </div>

      <div>
        <Tabs
          defaultActiveKey="1"
          onChange={onChangeTab}
          tabBarExtraContent={
            <div>
              <Dropdown overlay={menu}>
                <Button type="primary">
                  {sortData === 'sort' ? 'Sort' : 'Latest'} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          }
        >
          <TabPane tab="All" key="All">
            <ManageReportTable
              startIndex={startIndex}
              setStartIndex={setStartIndex}
              viewSize={viewSize}
              currentPage={currentPage}
              allReportedPost={allReportedPost}
              handleChangePagination={handleChangePagination}
              setViewSize={setViewSize}
              setCurrentPage={setCurrentPage}
              getAllReportedPost={getAllReportedPost}
            />
          </TabPane>
        </Tabs>
      </div>
    </Page>
  );
};

export default connect(({ reported }) => ({
  allReportedPost: reported?.allReportedPost,
}))(ManageReports);
