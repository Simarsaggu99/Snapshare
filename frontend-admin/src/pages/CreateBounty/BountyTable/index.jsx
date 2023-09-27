import React from 'react';
import { useState } from 'react';
import Icon, { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tabs, Tag, Collapse, Row, Pagination } from 'antd';
import BountyForm from '../BountyForm';
import TakersUsers from '../TakersUsers';
import { connect } from 'umi';
import { bounty } from '@/utils/endpoints/bounty';
import moment from 'moment';
import LiveBountyTable from './LiveBountyTable';
import * as XLSX from 'xlsx';

const { Panel } = Collapse;
const BountyTable = ({
  allBountyList,
  setTabs,
  getAllBounty,
  startIndex,
  viewSize,
  setStartIndex,
  currentPage,
  handleChangePagination,
  setViewSize,
  setCurrentPage,
  handleChangePaginationLive,
  currentPageLive,
  viewSizeLive,
  startIndexLive,
  setCurrentPageLive,
  expireBounty,
  setViewSizeLive,
  getAllLiveBounty,
  dispatch,
}) => {
  const [scrol1, setScrol1] = useState(true);
  const [scrol2, setScrol2] = useState(true);
  const [searchText, setsearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState({ modal: false, id: '' });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    setOpen({ modal: false, id: '' });
  };
  const handChange1 = () => {
    setScrol1(!scrol1);
    setScrol2(false);
  };
  const handChange2 = () => {
    setScrol2(!scrol2);
    setScrol1(false);
  };
  const chnge = (checkedValues) => {};
  const onFinish = () => {
    bounty.getBounty();
  };
  const checkTimeDefferent = (record) => {
    // start time and end time
    const startTime = moment();
    const endTime = moment(record?.endDate);
    // calculate total duration
    const duration = moment.duration(endTime.diff(startTime));
    // duration in hours
    const days = parseInt(duration.days());

    const hours = parseInt(duration.asHours());
    startTime.diff(endTime);
    // duration in minutes
    const minutes = parseInt(duration.asMinutes()) % 60;
    if (hours > 0) {
      return days + 'days' + hours + ' hour and ' + minutes + ' minutes.';
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

  console.log('d', expireBounty);
  console.log('current', currentPage);

  // const column1 = [
  //   {
  //     title: `Sr No`,
  //     dataIndex: 'srno',
  //     key: 'srno',
  //     render: (_, __, index) => (
  //       <p className="text-black w-max">{index + 1 + viewSize * (currentPage - 1)}</p>
  //     ),
  //   },
  //   {
  //     title: 'Name of program',
  //     dataIndex: 'description',
  //     key: 'description',
  //     render: (data) => <div>{data}</div>,
  //   },
  //   {
  //     title: 'Remaining time',
  //     dataIndex: 'timeRemain',
  //     render: (_, record) => (
  //       <div>
  //         {record?.totalAttempts ? (
  //           <p> {record?.totalAttempts - record?.count} user left</p>
  //         ) : (
  //           checkTimeDefferent(record)
  //         )}
  //       </div>
  //     ),
  //   },

  //   {
  //     title: 'No. of takers',
  //     dataIndex: 'totalAttempts',
  //     key: 'totalAttempts',
  //     render: (data, record) => (
  //       <div
  //         className="cursor-pointer pl-6"
  //         onClick={() => {
  //           setOpen({ modal: true, id: record?._id });
  //         }}
  //       >
  //         {record?.count}
  //       </div>
  //     ),
  //   },
  //   {
  //     title: 'Start Date',
  //     dataIndex: 'startDate',
  //     key: 'startDate',
  //     render: (record) => <div> {moment(record).format('L')} </div>,
  //   },
  //   {
  //     title: ' Start Time',
  //     dataIndex: 'startDate',
  //     key: 'start_time',
  //     render: (record) => <div>{moment(record).format('LT')}</div>,
  //   },

  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     render: (data) => (
  //       <Tag
  //         style={{
  //           textAlign: 'center',
  //           padding: '5px ',
  //           borderRadius: '5px',
  //           width: 100,
  //           color:
  //             // eslint-disable-next-line no-nested-ternary
  //             data === 'completed' ? '#FF5E34' : data === 'not_completed' ? '#303030' : '#303030',
  //           backgroundColor:
  //             // eslint-disable-next-line no-nested-ternary
  //             data === 'completed' ? '#FFCFC2' : data === 'not_completed' ? '#DCDDE2' : 'red',
  //         }}
  //         key={'status'}
  //       >
  //         {data}
  //       </Tag>
  //     ),
  //   },
  //   {
  //     title: 'Action',
  //     dataIndex: 'action',
  //     key: 'action',
  //     render: (data) => <Button onClick={() => {}}>Changes Status</Button>,
  //   },
  // ];
  const column2 = [
    {
      title: `Sr No`,
      dataIndex: 'srno',
      key: 'srno',
      render: (__, ___, idx) => <div>{idx + 1 + viewSize * (currentPage - 1)}</div>,
    },
    {
      title: 'Name of program',
      dataIndex: 'description',
      key: 'description',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'No. of takers',
      dataIndex: 'totalAttempts',
      key: 'totalAttempts',
      render: (data, record) => (
        <div
          className="cursor-pointer"
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
      render: (record) => <div>{moment(record).format('L')} </div>,
    },
    {
      title: ' Start Time',
      dataIndex: 'startDate',
      render: (record) => <div>{moment(record).format('LT')}</div>,
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'end_time',
      render: (record1) => <div>{moment(record1).format('L')}</div>,
    },
    {
      title: ' End Time',
      dataIndex: 'endDate',
      key: 'end_time',
      render: (record2) => <div>{moment(record2).format('LT')} </div>,
    },
    {
      title: ' Finished Type',
      dataIndex: 'finishedType',
      render: (__, record) => <div>{record?.status}</div>,
    },
    {
      title: 'Action',
      render: (record) => (
        <button
          onClick={() => {
            console.log('clickable', record);
            dispatch({
              type: 'bounty/downloadBounty',
              payload: {
                pathParams: { id: record?._id },
              },
            }).then((response) => {
              console.log('response', response);
              const worksheet = XLSX.utils.json_to_sheet(response?.bountyUser);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
              //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
              //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
              XLSX.writeFile(workbook, 'bountySheet.xlsx');

              // const worksheet = XLSX.utils.json_to_sheet(jsonData);

              // // Create workbook and add worksheet
              // const workbook = XLSX.utils.book_new();
              // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

              // // Generate and save the workbook as a file
              // const fileName = 'example.xlsx';
              // XLSX.writeFile(workbook, fileName);
              // Create a Blob from the response data
              // const blob = new Blob([response], {
              //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              // });
              // console.log('blob', blob);

              // // Create a temporary URL for the Blob
              // const url = window.URL.createObjectURL(blob);

              // // Create a temporary link element
              // const link = document.createElement('a');
              // link.href = url;
              // link.download = 'example.xlsx';

              // // Append the link element to the document body
              // document.body.appendChild(link);

              // // Trigger the click event to start the download
              // link.click();

              // // Clean up the temporary link element and URL
              // document.body.removeChild(link);
              // window.URL.revokeObjectURL(url);
            });
          }}
        >
          {' '}
          download
        </button>
      ),
    },
  ];
  console.log('currentPage :>> ', currentPage);
  return (
    <div>
      <div className="w-full">
        <div>
          <Tabs
            onChange={(e) => {
              setTabs(e);
            }}
            defaultActiveKey="all"
            style={{ font: 'black' }}
            tabBarExtraContent={
              <div className=" flex justify-between  items-center ">
                <div className="">
                  <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    style={{ height: '40px', borderRadius: '5px' }}
                  >
                    <span className="text-white">Create a Bounty</span>
                  </Button>
                </div>
              </div>
            }
          >
            <Tabs.TabPane tab="All" key="All">
              <div className="mb-8 flex">
                <Input
                  size="large"
                  onChange={(e) => {
                    setsearchText(e.target.value);
                  }}
                  placeholder="Search here "
                  allowClear
                />
                <div>
                  <Button
                    className="w-full bg-yellow-300"
                    type="primary"
                    size="large"
                    htmlType="submit"
                    onClick={onFinish}
                  >
                    <SearchOutlined />
                  </Button>
                </div>
              </div>

              <Collapse bordered={true} defaultActiveKey={['1', '2']} onChange={chnge}>
                <Panel
                  header="Live bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="1"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange1}>
                      <Space>
                        <DownOutlined rotate={scrol1 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  {/* <Table
                    columns={column1}
                    dataSource={allBountyList?.liveBounty}
                    scroll={{ y: scrol2 ? 200 : 700, x: 1200 }}
                    pagination={false}
                    key="1"
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
                          total={allBountyList?.liveBountyCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePaginationLive}
                        />
                      </Row>
                    )}
                  /> */}
                  <LiveBountyTable
                    handleChangePaginationLive={handleChangePaginationLive}
                    startIndexLive={startIndexLive}
                    viewSizeLive={viewSizeLive}
                    setViewSizeLive={setViewSizeLive}
                    setCurrentPageLive={setCurrentPageLive}
                    currentPageLive={currentPageLive}
                    scrol2={scrol2}
                    setOpen={setOpen}
                  />
                </Panel>
                <Panel
                  header="Finished bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="2"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange2}>
                      <Space>
                        <DownOutlined rotate={scrol2 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  <Table
                    columns={column2}
                    dataSource={expireBounty?.data}
                    scroll={{ y: scrol1 ? 200 : 700, x: 1200 }}
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
                          total={expireBounty?.totalCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </Panel>
              </Collapse>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Survey" key="Survey">
              <div className="mb-8 flex">
                <Input
                  size="large"
                  onChange={(e) => {
                    setsearchText(e.target.value);
                  }}
                  placeholder="Enter text "
                  allowClear
                />
                <div>
                  <Button
                    className="w-full bg-yellow-300"
                    style={{ background: '#394b80' }}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    onClick={onFinish}
                  >
                    <SearchOutlined />
                  </Button>
                </div>
              </div>

              <Collapse bordered={true} defaultActiveKey={['1', '2']} onChange={chnge}>
                <Panel
                  header="Live bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="1"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange1}>
                      <Space>
                        <DownOutlined rotate={scrol1 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  {/* <Table
                    columns={column1}
                    dataSource={allBountyList?.liveBounty}
                    scroll={{ y: scrol2 ? 200 : 700, x: 1200 }}
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
                          total={allBountyList?.liveBountyCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePaginationLive}
                        />
                      </Row>
                    )}
                    key="1"
                  /> */}
                  <LiveBountyTable
                    handleChangePaginationLive={handleChangePaginationLive}
                    startIndexLive={startIndexLive}
                    viewSizeLive={viewSizeLive}
                    setViewSizeLive={setViewSizeLive}
                    setCurrentPageLive={setCurrentPageLive}
                    currentPageLive={currentPageLive}
                    scrol2={scrol2}
                  />
                </Panel>
                <Panel
                  header="Finished bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="2"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange2}>
                      <Space>
                        <DownOutlined rotate={scrol2 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  <Table
                    columns={column2}
                    dataSource={expireBounty?.data}
                    scroll={{ y: scrol1 ? 200 : 700, x: 1200 }}
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
                          total={expireBounty?.totalCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </Panel>
              </Collapse>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Question" key="Question">
              <div className="mb-8 flex">
                <Input
                  size="large"
                  onChange={(e) => {
                    setsearchText(e.target.value);
                  }}
                  placeholder="Enter text "
                  allowClear
                />
                <div>
                  <Button
                    className="w-full bg-yellow-300"
                    style={{ background: '#394b80' }}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    onClick={onFinish}
                  >
                    <SearchOutlined />
                  </Button>
                </div>
              </div>

              <Collapse bordered={true} defaultActiveKey={['1', '2']} onChange={chnge}>
                <Panel
                  header="Live bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="1"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange1}>
                      <Space>
                        <DownOutlined rotate={scrol1 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  {/* <Table
                    columns={column1}
                    dataSource={allBountyList?.liveBounty}
                    scroll={{ y: scrol2 ? 200 : 700, x: 1200 }}
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
                          total={allBountyList?.liveBountyCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePaginationLive}
                        />
                      </Row>
                    )}
                    key="1"
                  /> */}
                  <LiveBountyTable
                    handleChangePaginationLive={handleChangePaginationLive}
                    startIndexLive={startIndexLive}
                    viewSizeLive={viewSizeLive}
                    setViewSizeLive={setViewSizeLive}
                    setCurrentPageLive={setCurrentPageLive}
                    currentPageLive={currentPageLive}
                    scrol2={scrol2}
                  />
                </Panel>
                <Panel
                  header="Finished bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="2"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange2}>
                      <Space>
                        <DownOutlined rotate={scrol2 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  <Table
                    columns={column2}
                    dataSource={expireBounty?.data}
                    pagination={false}
                    scroll={{ y: scrol1 ? 200 : 700, x: 1200 }}
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
                          total={expireBounty?.totalCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </Panel>
              </Collapse>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Meme Contest" key="Meme_contest">
              <div className="mb-8 flex">
                <Input
                  size="large"
                  onChange={(e) => {
                    setsearchText(e.target.value);
                  }}
                  placeholder="Enter text "
                  allowClear
                />
                <div>
                  <Button
                    className="w-full bg-yellow-300"
                    style={{ background: '#394b80' }}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    onClick={onFinish}
                  >
                    <SearchOutlined />
                  </Button>
                </div>
              </div>

              <Collapse bordered={true} defaultActiveKey={['1', '2']} onChange={chnge}>
                <Panel
                  header="Live bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="1"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange1}>
                      <Space>
                        <DownOutlined rotate={scrol1 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  {/* <Table
                    columns={column1}
                    dataSource={allBountyList?.liveBounty}
                    scroll={{ y: scrol2 ? 200 : 700, x: 1200 }}
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
                          total={allBountyList?.liveBountyCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePaginationLive}
                        />
                      </Row>
                    )}
                    key="1"
                  /> */}
                  <LiveBountyTable
                    handleChangePaginationLive={handleChangePaginationLive}
                    startIndexLive={startIndexLive}
                    viewSizeLive={viewSizeLive}
                    setViewSizeLive={setViewSizeLive}
                    setCurrentPageLive={setCurrentPageLive}
                    currentPageLive={currentPageLive}
                    scrol2={scrol2}
                    getAllLiveBounty={getAllLiveBounty}
                  />
                </Panel>
                <Panel
                  header="Finished bounty"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    lineHeight: '24px',
                    paddingLeft: '10px',
                  }}
                  key="2"
                  showArrow={false}
                  extra={
                    <Button onClick={handChange2}>
                      <Space>
                        <DownOutlined rotate={scrol2 ? 180 : 0} />
                      </Space>
                    </Button>
                  }
                >
                  <Table
                    columns={column2}
                    dataSource={expireBounty?.data}
                    scroll={{ y: scrol1 ? 200 : 700, x: 1200 }}
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
                          total={expireBounty?.totalCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    )}
                  />
                </Panel>
              </Collapse>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Upcoming" key="upcoming">
              <div className="mb-8 flex">
                <Input
                  size="large"
                  onChange={(e) => {
                    setsearchText(e.target.value);
                  }}
                  placeholder="Enter text "
                  allowClear
                />
                <div>
                  <Button
                    className="w-full bg-yellow-300"
                    style={{ background: '#394b80' }}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    onClick={onFinish}
                  >
                    <SearchOutlined />
                  </Button>
                </div>
              </div>
              <Table
                columns={column2}
                dataSource={allBountyList?.data}
                scroll={{ y: scrol1 ? 200 : 700 }}
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
                      total={expireBounty?.totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </Row>
                )}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      <BountyForm
        getAllBounty={getAllBounty}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />

      <TakersUsers
        open={open}
        setOpen={setOpen}
        confirmLoading={confirmLoading}
        setConfirmLoading={setConfirmLoading}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default connect(({ bounty }) => ({
  allBountyList: bounty?.allBountyList,
  expireBounty: bounty?.expireBounty,
}))(BountyTable);
