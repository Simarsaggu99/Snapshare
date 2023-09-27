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
  Space,
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
import { MdDelete } from 'react-icons/md';
import { DeleteTwoTone, EditFilled, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CgAddR } from 'react-icons/cg';
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai';
import { connect } from 'umi';
import { IoEye } from 'react-icons/io5';
import image from '../../assets/dataNotFound.png';
import { Spin } from 'antd';

const { TabPane } = Tabs;
const { Search } = Input;
const onSearch = (value) => console.log(value);

const data = [
  {
    email: 'sham1@gmail.com',
    id: '10301',
    lastInvitedOn: '2022-07-19T05:47:04.711Z',
    partyId: '10540',
    driveType: 'Online',
    location: 'Mumbai',
    salary: '55K / month',
    name: 'Rishabh Pandey',
    phone: '15151421112',
    date: '19 Dec 2012',
    desc:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a',

    time: '9 AM - 10 PM',
  },
  {
    email: 'sham1@gmail.com',
    id: '10301',
    lastInvitedOn: '2022-07-19T05:47:04.711Z',
    partyId: '10540',
    driveType: 'Off-Online',
    phone: '15151421112',
    location: 'Kanpur',
    salary: '515K / year',
    name: 'Rohit Singh',
    date: '19 Dec 2012',
    time: '9 AM - 10 PM',
    desc:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a',
  },
  {
    email: 'sham1@gmail.com',
    id: '10301',
    driveType: 'Off-Online',
    name: 'Rishabh Pandey',
    lastInvitedOn: '2022-07-19T05:47:04.711Z',
    partyId: '10540',
    salary: '5K / day',
    location: 'Mumbai',
    phone: '15151421112',
    date: '19 Dec 2012',
    time: '9 AM - 10 PM',
    desc:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a',
  },
  {
    email: 'sham1@gmail.com',
    id: '10301',
    lastInvitedOn: '2022-07-19T05:47:04.711Z',
    partyId: '10540',
    driveType: 'Online',
    phone: '15151421112',
    location: 'Chennai',
    salary: '5K / day',
    date: '19 Dec 2012',
    time: '9 AM - 10 PM',
    desc:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a',
    name: 'Rishbah Pandey',
  },
  {
    email: 'sham1@gmail.com',
    name: 'Rishabh',
    id: '10301',
    lastInvitedOn: '2022-07-19T05:47:04.711Z',
    driveType: 'Off-Online',
    salary: '555K / year',
    phone: '15151421112',
    partyId: '10540',
    location: 'Chennai',
    date: '19 Dec 2012',
    time: '9 AM - 10 PM',
    desc:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using , making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for  will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
  },
];

const Events = ({ dispatch, eventList, loadingForGet }) => {
  console.log('eventList =>', eventList);
  const history = useHistory();
  const [keyword, setKeyword] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const [message1, setMessage1] = useState('');
  const [color, setColor] = useState('green');
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventData, setEventData] = useState([]);
  const action = (value) => {
    setKeyword(value);
  };
  const { Option } = Select;
  const debounceSearch = debounce(action, 400);
  const onChange = (key) => {
    console.log(key);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getData = () => {
    dispatch({
      type: 'event/getEvent',
    }).then((res) => {
      console.log('getContactData :>> ', res.eventData);

      setEventData(res.eventData)
      // setEventData((prevDate) => [...prevDate, res.eventDate]);
    });
  };
  useEffect(() => {
    getData();
  }, []);
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
    }
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
  };
  const activeColumns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center', width: '10%',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center', width: `auto`,
      render: (name, record) => {
        return <div className="flex justify-center">
          < div > {name}</div>
        </div >
      }
    },

    {
      title: 'Date',
      dataIndex: 'date',
      align: 'center', width: '20%',
      render: (date, record) => {
        const chnageDate = moment(record.eventDate.date).format('MM/DD/YYYY')
        return <div className="flex justify-center">
          < div > {chnageDate}</div>
        </div >
      },
    },
    {
      title: 'Time Duration',
      dataIndex: 'time',
      align: 'center', width: '20%',
      render: (date, record) => {
        const startTime = moment(record.eventDate.startTime).format('ha');
        const endTime = moment(record.eventDate.endTime).format('ha');
        // startTime: moment(form.getFieldValue('time')[0]).format('ha'),
        // endTime: moment(form.getFieldValue('time')[1]).format('ha'),
        return <div className="flex justify-center">
          < div > {startTime}</div>
          < div > -{endTime}</div>
        </div >
      },
    },

    {
      title: 'Actions',
      key: 'ACTIONS', align: 'center', width: '20%',

      render: (_, record) => {
        console.log('delete-record', record)

        // const formData = new FormData();
        // formData.append('files', image);
        // formData.append('description', form.getFieldValue('description'));
        // formData.append('name', form.getFieldValue('name'));
        // formData.append('eventDate', JSON.stringify(eventDate));


        return < div className="flex gap-5 justify-center" >
          <a>
            <AiFillEye onClick={() => history.push(`/Events/${record?._id}/ViewDetails`)} className="text-lg" />
          </a>
          {!moment(record?.dueDate).isBefore(moment()) &&
            record?.status !== 'active' &&
            record?.status !== 'completed' && (
              <a
              //   onClick={(e) => {
              //     e.preventDefault();
              //     setIsTaskModalVisible(record?._id);
              //     taskFrom.setFieldsValue({
              //       ...record,
              //       assignee: record?.assignee?.map((item) => item?._id),
              //       dueDate: record?.dueDate && moment(record?.dueDate),
              //     });
              //   }}
              >
                <EditFilled
                  onClick={() =>
                    // eslint-disable-next-line no-underscore-dangle
                    history.push(`/Events/${record?._id}/EditEvents`)}
                  // onClick={() =>
                  //   dispatch({
                  //     type: 'event/:id/EditEvents',
                  //     payload: {
                  //       pathParams: {
                  //         id: record?._id,
                  //       },
                  //     },
                  //   }).then((res) => {
                  //     console.log('res', res)
                  //     if (res?.success) {
                  //       // message.success(res.message);
                  //       // getData();
                  //     }
                  //   })
                  // }

                  style={{ color: '#437dcb' }}
                  className="text-blue-500"
                />
              </a>
            )}
          <Popconfirm
            title="are you sure you want to delete this event?"
            okText="Delete"
            onConfirm={() =>
              dispatch({
                type: 'event/deleteEvent',
                payload: {
                  pathParams: {
                    // eslint-disable-next-line no-underscore-dangle
                    id: record?._id,
                  },

                },
              }).then((res) => {
                if (res?.success) {
                  // message.success(res.message);
                  getData();
                }
              })
            }
          >
            <DeleteTwoTone twoToneColor="red" />
          </Popconfirm>
        </div >
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
        title="Events"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Events',
                path: '/Events',
              },
            ]}
          />
        }
        primaryAction={
          <Button
            style={{ borderRadius: '6px' }}
            type="primary"
            size="large"
            onClick={() => history.push('/Events/AddEvents')}
          // onClick={() => postEvent()}
          >
            Add Events
          </Button>
        }
      >
        <Spin spinning={Boolean(loadingForGet)}>
          <div className="bg-white  rounded-md shadow-md p-5">
            <div className="mb-4">
              <Search size="large" placeholder="input search text" onSearch={onSearch} enterButton />
            </div>

            <div className="profile-wrapper ">
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
                  dataSource={eventData || []}
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
          </div></Spin>
      </Page>
    </div>
  );
};

export default connect(({ event, loading }) => ({
  eventList: event?.eventList,
  loadingForGet: loading?.effects['event/deleteEvent']
}))(Events);
