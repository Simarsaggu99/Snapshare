import { Avatar, Button, Modal, Pagination, Row, Space, Table } from 'antd';
import moment from 'moment';
import { connect, history, Link } from 'umi';
import React, { useState } from 'react';
// import { history, connect, Link } from 'umi';

import { getInitials } from '@/utils/common';

const ManageReportTable = ({
  startIndex,
  viewSize,
  setStartIndex,
  currentPage,
  allReportedPost,
  handleChangePagination,
  setViewSize,
  setCurrentPage,
  dispatch,
  getAllReportedPost,
}) => {
  const [viewDocument, setViewDocument] = useState(false);
  const [postUrl, setPostUrl] = useState('');

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   onSelect: (record, selected, selectedRows) => {
  //     console.log(record, selected, selectedRows);
  //   },
  //   onSelectAll: (selected, selectedRows, changeRows) => {
  //     console.log(selected, selectedRows, changeRows);
  //   },
  // };
  const handleRestorePost = (id: any) => {
    dispatch({
      type: 'reported/restorePost',
      payload: {
        pathParams: {
          id,
        },
      },
    }).then((res) => {
      console.log('res', res);
      if (res?.message === 'post restored successfully!') {
        getAllReportedPost();
      }
    });
  };
  const handleRemoveReportedPost = (id: any) => {
    dispatch({
      type: 'reported/deleteReportedPost',
      payload: {
        pathParams: {
          id,
        },
      },
    }).then((res: any) => {
      if (res?.success) {
        getAllReportedPost();
      }
    });
  };
  const columns: any = [
    {
      title: `Sr No`,
      dataIndex: 'srno',
      key: 'srno',
      render: (_, __, index) => (
        <p className="text-black w-max">{index + 1 + viewSize * (currentPage - 1)}</p>
      ),
    },
    {
      title: `Thumbnail`,
      dataIndex: 'Thumbnail',
      key: 'Thumbnail ',
      width: 100,
      render: (__, record: any) => {
        return (
          // <Link to={`/users/profile/${record?._id}`}>
          <div
            className="flex gap-3 w-fit"
            onClick={() => {
              setViewDocument(true);
              setPostUrl(record?.post?.media?.url);
            }}
          >
            <div className="">
              <img src={record?.post?.media?.url} width={100} height={100} />
            </div>
            <p className="mt-2 w-20 mx-2">{record?.user_handle}</p>
          </div>
          // </Link>
        );
      },
    },
    {
      title: 'User',
      key: 'tags',
      dataIndex: 'user',
      render: (_, record) => {
        return (
          <div
            className=" "
            onClick={() => {
              history.push(`/reports/${record?._id}`);
            }}
          >
            <div className="flex justify-center">
              {!record?.user?.avatar_url ? (
                <div className="h-16 w-16">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                    {getInitials(record?.user?.name)}
                  </div>
                </div>
              ) : (
                <img
                  src={record?.user?.avatar_url}
                  alt="user-image"
                  className="h-16 w-16 object-cover rounded-full"
                />
              )}
            </div>
            <p className="text-center">{record?.user?.name}</p>
          </div>
        );
      },
    },
    {
      title: '1st reported on',
      dataIndex: 'firstReported',
      render: (data, record) => {
        return <div>{moment(record?.firstReported).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: 'No. of times reported',
      dataIndex: 'frequencyOfReporting',
      align: 'center',
      render: (__, record) => {
        return <div>{record?.count}</div>;
      },
    },
    {
      title: 'Last reported on',
      dataIndex: 'lastReported',
      key: 'age',
      render: (__, record) => {
        return <div>{moment(record?.latestReported).format('DD/MM/YYYY')}</div>;
      },
    },

    {
      title: 'No of Warnings/Spankees sent',
      dataIndex: 'countWarnings',
      render: (__, record) => (
        <div>
          <p>Warning:{record?.user?.warningCount}</p>
          <p>Spankee:{record?.user?.spankeeCount}</p>
        </div>
      ),
    },

    {
      title: 'Action',
      key: 'action',

      render: (_, record) => {
        return (
          <div className="flex  justify-center">
            <Button
              onClick={() => {
                handleRemoveReportedPost(record?._id);
              }}
              type="primary"
              danger
              style={{ marginRight: '5px' }}
            >
              {' '}
              Remove
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleRestorePost(record?.post?._id);
              }}
            >
              {' '}
              Restore
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div>
        <Table
          columns={columns}
          dataSource={allReportedPost?.data?.reported}
          scroll={{ x: 1000 }}
          // rowSelection={{ ...rowSelection }}
          pagination={false}
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
                total={allReportedPost?.data?.totalCount}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />
      </div>
      <Modal
        visible={viewDocument}
        title="Privew Document"
        onCancel={() => {
          setViewDocument(false);
        }}
        footer={null}
        width={700}
        height={800}
      >
        <div className="flex justify-center">
          <img width={700} height={'100%'} src={postUrl} alt="" />
        </div>
      </Modal>
    </div>
  );
};

export default connect(({}) => ({}))(ManageReportTable);
