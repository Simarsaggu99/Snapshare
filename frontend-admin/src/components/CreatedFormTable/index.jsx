import React, { useEffect, useState } from 'react';
import { Table, Row, Pagination, Button, Input, Popconfirm, notification } from 'antd';
import { connect, Link } from 'umi';
import moment from 'moment';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

const CreatedFormTable = ({
  dataSource,
  limit,
  current,
  setCurrent,
  setLimit,
  loading,
  type,
  debounceSearch,
  status,
  dispatch,
  getForms,
}) => {
  const [authorizedRole, setAuthorizedRole] = useState('');
  useEffect(() => {
    setAuthorizedRole(localStorage.getItem('antd-pro-authority').includes('admin') && 'admin');
  }, []);
  const { Search } = Input;
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
        getForms();
      } else {
        notification.error({
          message: 'Oops! Something went wrong.',
          description: 'Please try again later!',
        });
      }
    });
  };
  const columns = [
    {
      title: 'Sr. No.',
      width: 80,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Form Id',
      dataIndex: 'form_id',
      align: 'center',
      render: (data) => <span className="capitalize">{data}</span>,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      width: 150,
      align: 'left',
      render: (data) => moment(data).format('LL'),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'center',
      render: (id) => (
        <div className="flex justify-center">
          <div className="">
            <Link to={`/form/${type}/${id}`}>
              <Button
                type="primary"
                onClick={() => {
                  setLimit(10);
                  setCurrent(1);
                }}
              >
                View
              </Button>
            </Link>
          </div>
          <div className="ml-2">
            <Link to={`/form/${type}/${id}/edit?data=editServiceUserForm`}>
              <Button
                type="primary"
                onClick={() => {
                  setLimit(10);
                  setCurrent(1);
                }}
              >
                Edit
              </Button>
            </Link>
          </div>
          {authorizedRole === 'admin' && (
            <div className="ml-2">
              <Popconfirm
                title="Are you sure to delete this form?"
                onConfirm={() => {
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
          )}
        </div>
      ),
    },
  ];
  const changePageSize = (page) => {
    setCurrent(page);
  };

  return (
    <>
      <div className="w-full px-4 mb-4">
        <Search
          size="large"
          placeholder="Enter keyword here to search..."
          onInput={(value) => debounceSearch(value.target.value)}
          enterButton
        />
      </div>
      <Table
        scroll={{ x: 300, y: status === 'staff' ? 500 : 340 }}
        loading={loading}
        pagination={false}
        rowClassName="cursor-pointer"
        rowKey={(record) => record.srno}
        dataSource={dataSource?.forms || []}
        columns={columns}
        locale={{
          emptyText: (
            <div className="text-center  pt-6 pb-2">
              <img src={SearchNotFound} alt="No staff member found!" style={{ height: '80px' }} />
              <p className="text-base  text-gray-600">No data found!</p>
            </div>
          ),
        }}
      />
      <div className="p-2 bg-gray-100">
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
            total={dataSource?.total}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </Row>
      </div>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['forms/getForms'],
}))(CreatedFormTable);
