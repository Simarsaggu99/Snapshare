/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Table, Input, Row, Pagination, Avatar, Button, Popconfirm, message, Tag } from 'antd';
import { getIntials } from '@/utils/utils';
import moment from 'moment';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import { connect, Link } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';

const { Search } = Input;

/**
 *
 * @updateDisable - The purpose of this function is to update enabled prop to y or n
 */

const StaffListTable = ({
  awaiting,
  setKeyword,
  totalRecords,
  staffLoading,
  dispatch,
  staffList,
  currentUser,
  getStaffList,
  setCurrent,
  setLimit,
  current,
  limit,
}) => {
  const changePageSize = (page) => {
    setCurrent(page);
  };
  const action = (value) => {
    setKeyword(value);
  };
  /**
   *
   * @param {object} staff
   */
  const updateDisable = (staff) => {
    dispatch({
      type: 'staff/disableStaff',
      payload: {
        body: {
          _id: staff?._id,
          // isActive: !staff?.isActive,
        },
      },
    }).then((res) => {
      if (res?.email) {
        message.success(
          `${staff.name}'s account has been ${!staff?.isActive ? 'enabled' : 'disabled'}`,
        );
        getStaffList();
      }
    });
  };

  const debounceSearch = debounce(action, 400);

  // eslint-disable-next-line consistent-return
  const getColorForRole = (role) => {
    switch (role) {
      case 'admin':
        return 'magenta';
      case 'manager':
        return 'red';
      case 'employee':
        return 'orange';
      default:
        break;
    }
  };
  const colomns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => <span className="mx-4">{index + 1}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="flex">
          <div className="w-28">
            <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#126E32' }}>
              {name && getIntials(name)}
            </Avatar>
          </div>

          <div className="ml-2 w-28 ">
            <div className="font-medium truncate capitalize" title={record?.name && record?.name}>
              {record?.name && record?.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: 150,
      render: (data) => (
        <Tag color={getColorForRole(data)} className="capitalize text-center">
          {data}
        </Tag>
      ),
    },
    {
      title: 'Invited',
      dataIndex: 'invited',
      render: (_, record) => (
        <div className="">
          <div>
            Invited by{' '}
            <span className="font-medium text-gray-800 capitalize">{record?.invitedBy?.name}</span>
          </div>
          <div>on {moment(record.created_at).format('LL')}</div>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'statusId',
      render: (_, record) => (
        <Link to={`/staff/${record?._id}/view`}>
          <Button ghost size="small" type="primary">
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full ">
          <Search
            allowClear
            size="large"
            placeholder="Enter keyword here to search staff..."
            onInput={(value) => debounceSearch(value.target.value)}
            enterButton
          />
        </div>
      </div>
      <div className="w-full">
        <Table
          scroll={{ x: 300 }}
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          columns={colomns}
          dataSource={staffList?.users}
          loading={staffLoading}
          locale={{
            emptyText: (
              <div className="text-center">
                <p className="text-lg">No staff member invited yet!</p>
                <img
                  src={SearchNotFound}
                  alt="No staff member found!"
                  style={{ height: '100px' }}
                />
              </div>
            ),
          }}
          footer={() => (
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
                total={totalRecords}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} staffs`}
              />
            </Row>
          )}
        />
      </div>
    </div>
  );
};
export default connect(({ loading, staff, user }) => ({
  currentUser: user.currentUser,
  staffLoading: loading.effects['staff/getStaffList'],
  staffList: staff.staffList,
}))(StaffListTable);
