/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Row, Pagination, Table, Button, Input, Popconfirm, notification } from 'antd';
import { connect, Link } from 'umi';
import { debounce } from 'lodash';
import moment from 'moment';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

const { Search } = Input;
const DisplayFormTable = (props) => {
  const [authorizedRole, setAuthorizedRole] = useState('');

  const {
    formByType,
    loading,
    setLimit,
    setCurrent,
    setSearchKeyword,
    current,
    limit,
    keyValue,
    dispatch,
    getFormsData,
  } = props;
  const changePageSize = (page) => {
    setCurrent(page);
  };
  const action = (value) => {
    setSearchKeyword(value);
  };
  const deleteForm = (id) => {
    dispatch({
      type: 'forms/deleteForm',
      payload: {
        pathParams: {
          id,
        },
      },
    }).then((res) => {
      if (res?.message.includes('successfully')) {
        notification.success({
          message: 'Great job!',
          description: 'Form deleted successfully!',
        });
        getFormsData();
      } else {
        notification.error({
          message: 'Oops! Something went wrong.',
          description: 'Please try again later!',
        });
      }
    });
  };
  const debounceSearch = debounce(action, 400);
  useEffect(() => {
    setAuthorizedRole(localStorage.getItem('antd-pro-authority').includes('admin') && 'admin');
  }, []);

  const columns = [
    {
      title: 'Sr. No.',
      align: 'center',
      render: (_, __, index) => <span className="mx-4">{index + 1}</span>,
    },
    {
      title: 'Service User',
      dataIndex: 'serviceUser',
      render: (data) => <span className="capitalize ">{data}</span>,
    },
    {
      title: 'Staff Name',
      dataIndex: 'staffMember',
      render: (data) => <span className="capitalize ">{data}</span>,
    },
    {
      title: 'Applicant Name',
      dataIndex: 'mainForm',
      render: (data) => (
        <span className="capitalize ">
          {data?.title}. {data?.first_name} {data?.surname}
        </span>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (data) => <span className="capitalize ">{data}</span>,
    },
    {
      title: 'Form Id',
      dataIndex: 'form_id',
      align: 'center',
      render: (data) => <span>{data}</span>,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      align: 'center',
      render: (data) => moment(data).format('DD MMM YYYY'),
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      align: 'center',
      render: (data) => (
        <>
          {data?.name ? (
            <Link to={`/staff/${data?._id}/view`}>
              <div className="font-semibold capitalize cursor-pointer underline text-blue-600">
                {data?.name}
              </div>
            </Link>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'center',
      render: (id, record) => (
        <div className="flex justify-center">
          <div className="">
            <Link to={`/form/${record?.type}/${id}`}>
              <Button
                type="primary"
                onClick={() => {
                  setSearchKeyword('');
                  setLimit(10);
                  setCurrent(1);
                }}
              >
                View
              </Button>
            </Link>
          </div>
          <div className="ml-2">
            <Link to={`/form/${record?.type}/${id}/edit?data=editForm`}>
              <Button
                type="primary"
                onClick={() => {
                  setSearchKeyword('');
                  setLimit(10);
                  setCurrent(1);
                }}
              >
                Edit
              </Button>
            </Link>
          </div>
          <div className="ml-2">
            <Popconfirm
              title="Are you sure to delete this form?"
              onConfirm={() => {
                setSearchKeyword('');
                setLimit(10);
                setCurrent(1);
                deleteForm(id);
              }}
              okText="Delete"
              cancelText="Cancel"
              okType="danger"
            >
              <Button type="primary" onClick={(e) => e.stopPropagation()}>
                Delete
              </Button>
            </Popconfirm>
          </div>
          )
        </div>
      ),
    },
  ];

  const getColumns = () => {
    switch (keyValue) {
      case 'staffPerformanceAppraisal':
        return columns?.filter(
          (list) =>
            list?.dataIndex !== 'serviceUser' &&
            list?.dataIndex !== 'name' &&
            list?.dataIndex !== 'mainForm',
        );
      case 'careWorkerReview':
        return columns?.filter(
          (list) =>
            list?.dataIndex !== 'serviceUser' &&
            list?.dataIndex !== 'staffMember' &&
            list?.dataIndex !== 'mainForm',
        );
      case 'applicationForm':
        return columns?.filter(
          (list) =>
            list?.dataIndex !== 'serviceUser' &&
            list?.dataIndex !== 'staffMember' &&
            list?.dataIndex !== 'name',
        );
      default:
        return columns?.filter(
          (list) =>
            list?.dataIndex !== 'staffMember' &&
            list?.dataIndex !== 'name' &&
            list?.dataIndex !== 'mainForm',
        );
    }
  };

  return (
    <div>
      <div className="flex px-4 mb-4">
        <div className="w-full">
          <Search
            size="large"
            placeholder="Enter keyword here to search..."
            onInput={(value) => debounceSearch(value.target.value)}
            enterButton
          />
        </div>
      </div>
      <Table
        scroll={{ x: 200 }}
        className="no-shadow zcp-fixed-w-table"
        rowClassName="cursor-pointer"
        pagination={false}
        columns={getColumns()}
        dataSource={formByType?.forms}
        rowKey={(record) => record.id}
        loading={loading}
        bordered={false}
        locale={{
          emptyText: (
            <div className="text-center  pt-6 pb-2">
              <img src={SearchNotFound} alt="No staff member found!" style={{ height: '80px' }} />
              <p className="text-base  text-gray-600">No data found!</p>
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
              total={formByType?.total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </Row>
        )}
      />
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['forms/getForms'],
}))(DisplayFormTable);
