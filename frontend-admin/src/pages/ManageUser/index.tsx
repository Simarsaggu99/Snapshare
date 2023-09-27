import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import Breadcrumbs from '@/components/BreadCrumbs';
import {
  Tabs,
  Table,
  Space,
  Tag,
  Select,
  Form,
  Button,
  Input,
  Row,
  Pagination,
  message,
  Avatar,
} from 'antd';

import { history, connect, Link } from 'umi';

const { TabPane } = Tabs;
const { Option } = Select;

import Page from '@/components/Page';
import { debounce } from 'lodash';
import { getInitials } from '@/utils/common';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const ManageUsers = ({ dispatch, users }: any) => {
  const { Search } = Input;
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [searchText, setSerchText] = useState('');
  const [tabs, setTabs] = useState('');
  const [selectedRow, setSelectedRow] = useState([]);
  const action = (value) => {
    setSerchText(value);
  };
  const onSearch = debounce(action, 400);
  const handleCreateBounty = () => {
    dispatch({
      type: 'users/suspendUser',
      payload: {
        body: {
          userId: selectedRow,
        },
      },
    }).then((res) => {
      if (res?.message === 'user deleted successfully!') {
        getAllUserData();
        message.success('user suspended successfully');
      }
    });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: `Sr No`,
      dataIndex: 'srno',
      key: 'srno',
      width: 80,
      render: (__, _, index) => (
        <p className="text-black w-max">{index + 1 + viewSize * (currentPage - 1)}</p>
      ),
    },
    {
      title: `Profile`,
      dataIndex: 'profile',
      key: 'profile',
      width: 200,

      render: (__, record: any) => {
        return (
          <Link to={`/users/profile/${record?._id}`}>
            <div className="flex gap-3 w-fit">
              <div className="">
                {record?.avatar_url ? (
                  <img
                    src={record?.avatar_url}
                    width={40}
                    height={40}
                    className="rounded-full object-cover "
                  />
                ) : (
                  <Avatar>{getInitials(record?.name)}</Avatar>
                )}
              </div>
              <p className="mt-2 w-20 mx-2">{record?.user_handle}</p>
            </div>
          </Link>
        );
      },
    },

    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'name',
      width: 200,
      render: (__, record) => (
        <div className="mb-4 w-max  ">
          <a>{record?.name}</a>
        </div>
      ),
    },
    {
      title: 'Email ID',
      dataIndex: 'email',
      width: 350,
      render: (email) => <p className="w-full">{email}</p>,
    },
    {
      title: 'Crux',
      dataIndex: 'crux',
      key: 'age',
      render: (data, record) => <p>{record?.cruxLevel || 'N/A'}</p>,
    },

    {
      title: 'Coin Balance',
      dataIndex: 'coinBalance',
      key: 'coin',
      // width: 400,
      align: 'center',
      render: (__, record: any) => <p className="">{record?.wallet?.meme_coins.toFixed(2)}</p>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (__, record: any) => (
        <div>
          {/* {` ${((record?.state || record?.city) && record?.state, record?.city)}`} */}

          <p>
            {record?.state && <span> {record?.state},</span>}
            <span> {record?.city}</span>
          </p>
        </div>
      ),
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
      render: (__, record: any) => <p>{record?.gender || 'N/A'}</p>,
    },
    {
      title: 'Warnings',
      dataIndex: 'warnings',
      key: 'warnings',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Spanakness',
      dataIndex: 'spankeeCount',
      key: 'spanakness',
      render: (data) => <p>{data || 'N/A'}</p>,
    },
    {
      title: ' Total Earning',
      dataIndex: 'earning',
      key: 'earning',
      render: (data) => <p>{data}</p>,
    },
  ];
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRows', selectedRows);
      const selectedRowData = selectedRows;
      const filterRowData = selectedRowData?.map((rowData) => {
        return rowData?._id;
      });
      setSelectedRow(filterRowData);
    },
  };
  const getAllUserData = () => {
    dispatch({
      type: 'users/getAllUser',
      payload: {
        query: {
          viewSize,
          startIndex,
          keyword: searchText,
          status: tabs === 'Active' ? '' : tabs,
        },
      },
    });
  };
  useEffect(() => {
    getAllUserData();
  }, [viewSize, startIndex, currentPage, tabs, searchText]);

  return (
    <div className="">
      <Page title={<p className="text-3xl">Manage User</p>} PrevNextNeeded="N">
        <div className="relative flex justify-between px-3 ">
          <div className="w-full">
            <div className=" ">
              <Tabs
                // style={{ width: '100%', justifyContent: 'center' }}
                tabBarExtraContent={
                  <div className=" flex justify-between  items-center ">
                    {selectedRow?.length > 0 && (
                      <div className="">
                        <div className="px-4">
                          <Button type="primary" onClick={handleCreateBounty}>
                            <span className="text-white px-6">Suspend</span>
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <Search
                        placeholder="Search"
                        allowClear
                        onChange={(e) => {
                          // console.log('val', val);
                          onSearch(e.target.value);
                        }}
                        style={{
                          width: 250,
                        }}
                      />
                    </div>
                  </div>
                }
                defaultActiveKey="1"
                onChange={(e) => {
                  setStartIndex(0);
                  setCurrentPage(1);
                  setTabs(e);
                }}
              >
                <TabPane tab="Active" key="Active" style={{ padding: '5px' }}>
                  <Table
                    rowSelection={{
                      type: 'checkbox',
                      ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={users?.data?.users?.map((ite) => ({
                      ...ite,
                      key: ite?._id,
                    }))}
                    pagination={false}
                    // scroll={{ x: 100 }}
                    scroll={{ y: 530, x: 1600 }}
                    footer={() => (
                      <Row className="mt-2" type="flex" justify="end">
                        <Pagination
                          key={`page-${currentPage}`}
                          showSizeChanger
                          pageSizeOptions={['10', '25', '50', '100']}
                          onShowSizeChange={(e, p) => {
                            setViewSize(p);
                            setCurrentPage(1);
                            setStartIndex(0);
                          }}
                          defaultCurrent={1}
                          current={currentPage}
                          pageSize={viewSize}
                          total={users?.data?.user_total}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </TabPane>

                <TabPane tab="Deleted" key="deleted">
                  <Table
                    columns={columns}
                    dataSource={users?.data?.users}
                    scroll={{ y: 530, x: 1300 }}
                    pagination={false}
                    rowKey={(record) => record?.id}
                    footer={() => (
                      <Row className="mt-2" type="flex" justify="end">
                        <Pagination
                          key={`page-${currentPage}`}
                          showSizeChanger
                          pageSizeOptions={['10', '25', '50', '100']}
                          onShowSizeChange={(e, p) => {
                            setViewSize(p);
                            setCurrentPage(1);
                            setStartIndex(0);
                          }}
                          defaultCurrent={1}
                          current={currentPage}
                          pageSize={viewSize}
                          total={users?.data?.user_total}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </TabPane>
                <TabPane tab="Suspend" key="suspend" style={{ padding: '5px' }}>
                  <Table
                    rowSelection={{
                      type: 'checkbox',
                      ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={users?.data?.users?.map((ite) => ({
                      ...ite,
                      key: ite?._id,
                    }))}
                    pagination={false}
                    // scroll={{ x: 100 }}
                    scroll={{ y: 530, x: 1600 }}
                    footer={() => (
                      <Row className="mt-2" type="flex" justify="end">
                        <Pagination
                          key={`page-${currentPage}`}
                          showSizeChanger
                          pageSizeOptions={['10', '25', '50', '100']}
                          onShowSizeChange={(e, p) => {
                            setViewSize(p);
                            setCurrentPage(1);
                            setStartIndex(0);
                          }}
                          defaultCurrent={1}
                          current={currentPage}
                          pageSize={viewSize}
                          total={users?.data?.user_total}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ users }) => ({
  users: users.allUserList,
}))(ManageUsers);
