/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
// import { getIntials } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Table, Row, Pagination, Popconfirm, Input, Button, Avatar, DatePicker, Tag, message } from 'antd';
import { Link, useSelector, useDispatch, connect } from 'umi';
import { debounce } from 'lodash';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { getInitials } from '@/utils/common';
import { resendUserEmail } from '@/services/event';

const RegisterTable = ({ getExhibitorLoading, setSelectedRows, exhibitorLists }) => {
  const [limit, setLimit] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [eventYear, setEventYear] = useState(moment().year());
  const { Search } = Input;
  const { deleteVisitor } = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const deleteRegistration = (id) => {
    dispatch({
      type: 'event/deleteRegistration',
      payload: {
        pathParams: {
          id,
        },
      },
    });
  };

  const resendEmail = (id) => {
    resendUserEmail({
      pathParams: {
        id,
      }

    }).then((res) => {
      console.log(res)
      message.success('Email has been sent successfully');
    }).catch((err) => {
      console.log(err)
      message.error('Email sending failed');
    })
  }
  const renderActionButton = (record) => {
    return (
      <Popconfirm
        placement="topRight"
        icon={<QuestionCircleOutlined style={{ color: 'green' }} />}
        title="Are you sure you want to delete this entry?"
        onConfirm={(e) => {
          // updateDisable(record);

          deleteRegistration(record._id);
          e.stopPropagation();
        }}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        onCancel={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          ghost
          onClick={(e) => {
            e.stopPropagation();
            console.log('clicked');
          }}
          type="danger"
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    );
  };
  useEffect(() => {
    dispatch({
      type: 'event/getExhibitors',
      payload: {
        pathParams: {
          type: 'exhibitor',
        },
        query: {
          _limit: limit,
          _start: (current - 1) * limit,
          keyword: searchKeyword,
          year: eventYear,
          startDate: moment()?.set('year', eventYear).startOf('year').toISOString(),
          endDate: moment().set('year', eventYear).endOf('year').toISOString(),
        },
      },
    });
  }, [limit, current, searchKeyword, dispatch, eventYear, deleteVisitor]);

  const changePageSize = (page) => {
    setCurrent(page);
  };
  const action = (value) => {
    setSearchKeyword(value);
  };

  const debounceSearch = debounce(action, 400);

  const columns = [
    {
      title: 'Sr. No.',
      align: 'center',
      render: (_, __, index) => <div>{((current - 1) * limit) + index + 1}</div>,
    },
    {
      title: 'Name',
      align: 'left',
      dataIndex: 'name',
      render: (data, record) => (
        <div className="flex items-center">
          <div className="w-28">
            <Avatar
              className="bg-blue-800 w-8 uppercase"
              style={{
                backgroundColor: '#126E32',
              }}
            >
              {record && getInitials(data)}
            </Avatar>
          </div>

          <div className="ml-2 w-28">
            <div className="font-medium capitalize">{`${data}`}</div>
            {record.isCardPrinted ? <Tag color="green"><CheckOutlined /> Printed</Tag> : null}
          </div>
        </div>
      ),
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      align: 'left',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'Email',
      align: 'left',
      dataIndex: 'email',
      render: (data) => (data ? <div>{data}</div> : 'N/A'),
    },
    {
      title: 'Booth',
      align: 'left',
      dataIndex: 'booth',
      render: (data) => (data ? <div>{data}</div> : 'N/A'),
    },

    {
      title: 'Action',
      align: 'center',
      dataIndex: '_id',
      render: (id, record) => (
        <div className="flex ">

          <Button type="primary" ghost className="mr-2" onClick={() => resendEmail(record?._id)}>
            Resend
          </Button>

          <Link to={`/exhibitors/${id}`} className="mr-2">
            <Button type="primary" ghost>
              View
            </Button>
          </Link>
          {renderActionButton(record)}

        </div>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  return (
    <div>
      <div>
        <div style={{ position: 'sticky', top: '135px', zIndex: 1 }}>
          <Search
            size="large"
            placeholder="Enter keyword here to search..."
            onInput={(value) => debounceSearch(value.target.value)}
            enterButton
          />
        </div>
        <div className="my-4 flex justify-end">
          <div>
            <span className="text-blue-800 mr-2 font-semibold">FilterBy: year</span>
            <DatePicker picker="year" onChange={(value) => setEventYear(moment(value).year())} />
          </div>
        </div>

        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          scroll={{ x: 400 }}
          loading={getExhibitorLoading}
          pagination={false}
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          rowKey={(record) => record._id}
          dataSource={exhibitorLists?.allList || []}
          columns={columns}
          locale={{
            emptyText: (
              <div className="text-center pt-6 pb-2">
                <img
                  src={SearchNotFound}
                  alt="No register events found!"
                  style={{ height: '80px' }}
                />
                <p className="text-base  text-gray-600">No data found!</p>
              </div>
            ),
          }}
        />
        <div className="p-6 bg-gray-100">
          <Row className="mt-2" type="flex" justify="end">
            <Pagination
              current={current}
              onChange={changePageSize}
              showSizeChanger
              defaultPageSize={limit}
              pageSizeOptions={['10', '25', '50', '100']}
              onShowSizeChange={(e, p) => {
                setLimit(p);
              }}
              total={exhibitorLists?.count}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </Row>
        </div>
      </div>
    </div>
  );
};

export default connect(({ loading, event }) => ({
  getExhibitorLoading: loading.effects['event/getExhibitors'],
  exhibitorLists: event.registeredExhibitors,
  deleteVisitor: event.deleteVisitor,
}))(RegisterTable);
