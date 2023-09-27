import { Button, Pagination, Row, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
const LiveBountyTable = ({
  allBountyList,
  currentPageLive,
  viewSizeLive,

  setCurrentPageLive,
  setViewSizeLive,
  handleChangePaginationLive,
  scrol2,
  setOpen,
  getAllLiveBounty,
}) => {
  const checkTimeDefferent = (record) => {
    // start time and end time
    const startTime = moment();
    const endTime = moment(record?.endDate);
    // calculate total duration
    const duration = moment.duration(endTime.diff(startTime));
    // duration in hours
    const hours = parseInt(duration.asHours());
    startTime.diff(endTime);
    // duration in minutes
    const minutes = parseInt(duration.asMinutes()) % 60;
    if (hours > 0) {
      return hours + ' hour and ' + minutes + ' minutes.';
    } else {
      return minutes + ' minutes.';
    }
    // {
    //   moment(record?.end_time).diff(record?.start_time, 'hours') > 0 ? (
    //     <span>{moment(record?.end_time).diff(record?.start_time, 'hours')} h</span>
    //   ) : (
    //     <span> {moment(record?.end_time).diff(record?.start_time, 'minutes')}m</span>
    //   );
    // }
  };

  const column1 = [
    {
      title: `Sr No`,
      dataIndex: 'srno',
      key: 'srno',
      render: (_, __, index) => (
        <p className="text-black w-max">{index + 1 + viewSizeLive * (currentPageLive - 1)}</p>
      ),
    },
    {
      title: 'Name of program',
      dataIndex: 'description',
      key: 'description',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'Remaining time',
      dataIndex: 'timeRemain',
      render: (_, record) => (
        <div>
          {record?.totalAttempts ? (
            <p> {record?.totalAttempts - record?.count} user left</p>
          ) : (
            checkTimeDefferent(record)
          )}
        </div>
      ),
    },

    {
      title: 'No. of takers',
      dataIndex: 'totalAttempts',
      key: 'totalAttempts',
      render: (data, record) => (
        <div
          className="cursor-pointer pl-6"
          onClick={() => {
            setOpen({ modal: true, id: record?._id });
          }}
        >
          {record?.count}
        </div>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (record) => <div> {moment(record).format('L')} </div>,
    },
    {
      title: ' Start Time',
      dataIndex: 'startDate',
      key: 'start_time',
      render: (record) => <div>{moment(record).format('LT')}</div>,
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data) => (
        <Tag
          style={{
            textAlign: 'center',
            padding: '5px ',
            borderRadius: '5px',
            width: 100,
            color:
              // eslint-disable-next-line no-nested-ternary
              data === 'completed' ? '#FF5E34' : data === 'not_completed' ? '#303030' : '#303030',
            backgroundColor:
              // eslint-disable-next-line no-nested-ternary
              data === 'completed' ? '#FFCFC2' : data === 'not_completed' ? '#DCDDE2' : 'red',
          }}
          key={'status'}
        >
          {data}
        </Tag>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (data) => <Button onClick={() => {}}>Changes Status</Button>,
    },
  ];
  return (
    <div>
      <Table
        columns={column1}
        dataSource={allBountyList?.data}
        scroll={{ y: scrol2 ? 200 : 700, x: 1200 }}
        pagination={false}
        key="1"
        footer={() => (
          <Row className="mt-2" type="flex" justify="end">
            <Pagination
              key={`page-${currentPageLive}`}
              showSizeChanger
              pageSizeOptions={['10', '25', '50', '100']}
              onShowSizeChange={(e, p) => {
                setViewSizeLive(p);
                setCurrentPageLive(1);
                setViewSizeLive(0);
              }}
              defaultCurrent={1}
              current={currentPageLive}
              pageSize={viewSizeLive}
              total={allBountyList?.totalCount}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={handleChangePaginationLive}
            />
          </Row>
        )}
      />
    </div>
  );
};
export default connect(({ bounty }) => ({
  allBountyList: bounty?.allBountyList,
}))(LiveBountyTable);
