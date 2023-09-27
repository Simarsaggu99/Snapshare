/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import {
  Table,
  Pagination,
  Select,
  Input,
  Breadcrumb,
  Badge,
  Tabs,
  Popconfirm,
  Button,
  Avatar,
  Tag,
  Modal,
} from 'antd';
import { getIntials } from '@/utils/utils';
import axios from 'axios';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';

import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CgAddR } from 'react-icons/cg';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoEye } from 'react-icons/io5';
import image from '../../assets/dataNotFound.png';
import { connect } from 'umi';

const { TabPane } = Tabs;
const { Search } = Input;
const onSearch = (value) => console.log(value);

const Contacts = ({ dispatch, contactList }) => {
  console.log('contactUs :>> ', contactList);
  const history = useHistory();
  const [keyword, setKeyword] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('green');
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [contactData, setContactData] = useState([]);
  const [pendingContactData, setPendingContactData] = useState([]);
  const action = (value) => {
    setKeyword(value);
  };
  const { Option } = Select;
  const debounceSearch = debounce(action, 400);
  const onChange = (key) => {
    console.log(key);
  };
  const [getTabKey, setGetTabKey] = useState('active');
  const renderActionButton = (record) => {
    if (getTabKey === 'active') {
      return (
        <Popconfirm
          title="Are you sure you want to disable this staff member?"
          onConfirm={(e) => {
            // updateDisable(record);
            e.stopPropagation();
          }}
          okText="Disable"
          cancelText="Cancel"
          okType="danger"
          onCancel={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            size="small"
            type="danger"
          // disabled={record.id === currentUser.id}
          >
            Disable
          </Button>
        </Popconfirm>
      );
      // eslint-disable-next-line no-else-return
    } else {
      return (
        <Popconfirm
          title="Are you sure you want to enable this staff member?"
          onConfirm={(e) => {
            // updateDisable(record);
            e.stopPropagation();
          }}
          okText="Enable"
          cancelText="Cancel"
          okType="primary"
          onCancel={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            onClick={(e) => {
              // updateDisable(record);
              e.stopPropagation();
            }}
            size="small"
            type="primary"
            style={{ background: 'green', borderColor: 'green' }}
          >
            Enable
          </Button>
        </Popconfirm>
      );
    }
  };

  const getData = () => {
    dispatch({
      type: 'contactUs/getContactUs',
    }).then((res) => {
      console.log('getContactData :>> ', res.contactUsData);
      setContactData(res.contactUsData);
    });
  };

  const pendingContact = () => {
    dispatch({
      type: 'contactUs/:id',

    })
  }

  useEffect(() => {
    getData();
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const activeColumns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'name',

      render: (name, record) => (
        <div className="flex items-center">
          <div>{name}</div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => <div className="">{record.email}</div>,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      render: (text, record) => <div className="">+91 {record.phone}</div>,
    },
    {
      title: 'Services',
      dataIndex: 'services',
      render: (text, record) => <div className="">{record.services}</div>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      render: (text, record) => (
        <div className="flex">
          <IoEye
            onClick={() => {
              showModal();
              setMessage(record.message);
            }}
            className=" ml-4 text-lg cursor-pointer hover:text-[15px]"
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => {
        if (status === true) {
          setColor('green');
          status = 'completed';
        } else if (status === false) {
          setColor('red');
          status = 'In-Completed';
        }

        return (
          <>
            <Popconfirm
              title="Are you sure you want to mark this complete ?"
              onConfirm={(e) => {
                // updateDisable(record);
                e.stopPropagation();
              }}
              okText="Complete"
              cancelText="Cancel"
              onCancel={(e) => {
                e.stopPropagation();
              }}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                size="small"
                style={{ backgroundColor: '#18a2a9', color: 'white', borderRadius: '5px' }}
              // disabled={record.id === currentUser.id}
              >
                Pending
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  function handleChangePagination(current, size) {
    setStartIndex(size * (current - 1));
    setCurrentPage(current);
  }
  return (
    <div className="container mx-auto">
      <Page
        title="Contact Users"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Users',
                path: '/contacts',
              },
            ]}
          />
        }
      >
        <Modal
          title="Message"
          visible={isModalVisible}
          onOk={handleOk}
          footer={false}
          onCancel={handleCancel}
        >
          <div className="pb-5 max-h-60 overflow-auto p-4">{message}</div>
        </Modal>
        <div className="bg-white  rounded-md shadow-md ">
          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane
              tab={
                <Badge
                  // count={staffCount?.totalCount?.active}
                  size="small"
                  style={{
                    fontSize: '10px',
                    marginTop: '-5px',
                    backgroundColor: '#0050b3',
                    padding: '0px 4px 0px 4px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    width: '28px',
                  }}
                >
                  <span className="px-4">All</span>
                </Badge>
              }
              key="all"
            >
              <div className="pt-4 px-5">
                <Search
                  size="large"
                  placeholder="input search text"
                  onSearch={onSearch}
                  enterButton
                />
              </div>

              <div className="profile-wrapper p-5">
                <div className="w-full overflow-auto">
                  <Table
                    className="no-shadow zcp-fixed-w-table"
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // setJobId(record._id);
                        }, // click row
                      };
                    }}
                    rowClassName="cursor-pointer"
                    pagination={false}
                    columns={activeColumns}
                    dataSource={contactData || []}
                    //   rowKey={(record) => record._id}
                    loading={false}
                    locale={{
                      emptyText: (
                        <div className="flex items-center justify-center text-center">
                          <div>
                            <img className=" " src={image} alt="No categories found!" />
                          </div>
                        </div>
                      ),
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-end mt-6">
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
                      total={totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane
              tab={
                <Badge
                  // count={staffCount?.totalCount?.inactive}
                  size="small"
                  style={{
                    fontSize: '10px',
                    marginTop: '-5px',
                    backgroundColor: '#0050b3',
                    padding: '0px 4px 0px 4px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    width: '28px',
                  }}
                >
                  <span className="px-4">Pending</span>
                </Badge>
              }
              key="pending"
            >
              <div className="pt-4 px-5">
                <Search
                  size="large"
                  placeholder="input search text"
                  onSearch={onSearch}
                  enterButton
                />
              </div>

              <div className="profile-wrapper p-5">
                <div className="w-full overflow-auto">
                  <Table
                    className="no-shadow zcp-fixed-w-table"
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // setJobId(record._id);
                        }, // click row
                      };
                    }}
                    rowClassName="cursor-pointer"
                    pagination={false}
                    columns={activeColumns}
                    dataSource={pendingContactData || []}
                    //   rowKey={(record) => record._id}
                    loading={false}
                    locale={{
                      emptyText: (
                        <div className="flex items-center justify-center text-center">
                          <div>
                            {/* <p className="text-lg">No Registered user yet!</p> */}
                            <img className=" " src={image} alt="No categories found!" />
                          </div>
                        </div>
                      ),
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-end mt-6">
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
                      total={totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane
              tab={
                <Badge
                  // count={staffCount?.totalCount?.inactive}
                  size="small"
                  style={{
                    fontSize: '10px',
                    marginTop: '-5px',
                    backgroundColor: '#0050b3',
                    padding: '0px 4px 0px 4px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    width: '28px',
                  }}
                >
                  <span className="px-4">Contacted</span>
                </Badge>
              }
              key="contacted"
            >
              <div className="pt-4 px-5">
                <Search
                  size="large"
                  placeholder="input search text"
                  onSearch={onSearch}
                  enterButton
                />
              </div>

              <div className="profile-wrapper p-5">
                <div className="w-full overflow-auto">
                  <Table
                    className="no-shadow zcp-fixed-w-table"
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // setJobId(record._id);
                        }, // click row
                      };
                    }}
                    rowClassName="cursor-pointer"
                    pagination={false}
                    columns={activeColumns}
                    dataSource={contactData || []}
                    //   rowKey={(record) => record._id}
                    loading={false}
                    locale={{
                      emptyText: (
                        <div className="flex items-center justify-center text-center">
                          <div>
                            {/* <p className="text-lg">No Registered user yet!</p> */}
                            <img className=" " src={image} alt="No categories found!" />
                          </div>
                        </div>
                      ),
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-end mt-6">
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
                      total={totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ contactUs }) => ({
  contactList: contactUs?.contactList,
}))(Contacts);
