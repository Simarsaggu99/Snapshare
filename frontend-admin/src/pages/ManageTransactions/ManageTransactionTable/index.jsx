import {
  AppstoreOutlined,
  CloseCircleOutlined,
  DownOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Pagination,
  Row,
  Space,
  Table,
  Menu,
  Modal,
  Form,
  Select,
  Input,
  message,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';

const ManageTransactionTable = ({
  startIndex,
  setStartIndex,
  viewSize,
  currentPage,
  handleChangePagination,
  setViewSize,
  setCurrentPage,
  allTransactionList,
  dispatch,
  getAllTransactions,
  tab,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const onFinish = (values) => {
    dispatch({
      type: 'transaction/updateTransactionStatus',
      payload: {
        pathParams: { id: transactionId },
        body: values,
      },
    })
      .then((res) => {
        form.resetFields();
        setIsModalOpen(false);
        message.success(res?.message);
        getAllTransactions();
      })
      .catch((err) => {
        message.success('There is an error while updating status');
      });
    console.log('values', values);
  };

  const actionItems = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: '0',
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];

  const itemsMenu = () => (
    <Menu mode="horizontal" defaultSelectedKeys={['mail']}>
      <Menu.Item key="mail" icon={<MailOutlined />}>
        Navigation One
      </Menu.Item>
      <Menu.SubMenu key="SubMenu" title="Navigation Two - Submenu" icon={<SettingOutlined />}>
        <Menu.Item key="two" icon={<AppstoreOutlined />}>
          Navigation Two
        </Menu.Item>
        <Menu.Item key="three" icon={<AppstoreOutlined />}>
          Navigation Three
        </Menu.Item>
        <Menu.ItemGroup title="Item Group">
          <Menu.Item key="four" icon={<AppstoreOutlined />}>
            Navigation Four
          </Menu.Item>
          <Menu.Item key="five" icon={<AppstoreOutlined />}>
            Navigation Five
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>
    </Menu>
  );

  const columns = [
    {
      title: `Sr No`,
      dataIndex: 'srno',
      key: 'srno',
      render: (_, __, index) => (
        <p className="text-black w-max">{index + 1 + viewSize * (currentPage - 1)}</p>
      ),
    },

    {
      title: 'Transaction ID',
      key: 'TransactionId',
      dataIndex: '_id',
      render: (_, record) => <p>{record?._id}</p>,
    },
    {
      title: 'Time & Date',
      dataIndex: 'timeAndDate',
      render: (data, record) => {
        return <div>{moment(record?.created_at).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      render: (data, record) => {
        return <div>NA</div>;
      },
    },
    {
      title: 'User name',
      dataIndex: 'userName',
      align: 'center',
      render: (data, record) => {
        return <div>{record?.user?.name || 'NA'}</div>;
      },
    },
    // {
    //   title: 'Paytm/Paypal',
    //   dataIndex: 'mode',
    //   key: 'mode',
    //   render: (data, record) => {
    //     return <div>{moment(record?.latestReported).format('DD/MM/YYYY')}</div>;
    //   },
    // },
    {
      title: 'Contact info',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      render: (data, record) => {
        return <div className="">{record?.user?.email || 'NA'}</div>;
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (data, record) => {
        return <div>{record?.user?.country || 'NA'}</div>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (data, record) => {
        return <div>NA</div>;
      },
    },

    {
      title: 'Coins',
      dataIndex: 'memeCoins',
      render: (data) => <p>{data || '--'}</p>,
    },

    // {
    //   title: 'Transferred Amount',
    //   dataIndex: 'coins',
    //   render: (data) => <p>{data}</p>,
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (data) => <p>{data}</p>,
    },
    // {
    //   title: 'Coins',
    //   dataIndex: 'coins',
    //   render: (data) => <p>{data}</p>,
    // },
  
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <div>
        <Table
          columns={tab === 'Pending' ? [...columns,  {
            title: 'Action',
            key: 'action',
            visible: tab === 'Pending' ? false : true,
            render: (_, record) => {
              return (
                <div className="flex  justify-center">
                  {/* <Dropdown overlay={itemsMenu} trigger={['click']}>
                    <Space className="cursor-pointer text-blue-500">
                      Change status
                      <DownOutlined />
                    </Space>
                  </Dropdown> */}
                  <Button
                    onClick={() => {
                      // handleRemoveReportedPost(record?._id);
                      setTransactionId(record?._id);
                      setIsModalOpen(true);
                    }}
                    type="primary"
                    danger
                    style={{ marginRight: '5px' }}
                  >
                    {' '}
                    Change status
                  </Button>
                  {/* <Button
                    type="primary"
                    onClick={() => {
                      handleRestorePost(record?.post?._id);
                    }}
                  >
                    {' '}
                    Restore
                  </Button> */}
                </div>
              );
            },
          },] : columns}
          dataSource={allTransactionList?.transaction || []}
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
                total={allTransactionList?.totalCount}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />

        <Modal
          title="Change status"
          visible={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          width={800}
          centered
          footer={null}
          closeIcon={<CloseCircleOutlined style={{ color: 'white', fontSize: '32px' }} />}
          className="modalStyle"
        >
          <div className="p-4">
            <Form form={form} name="statusForm" onFinish={onFinish}>
              <h4>Select status</h4>
              <Form.Item
                // label="Select status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: 'Please select status!',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a status"
                  optionFilterProp="children"
                  onChange={onChange}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: 'Pending',
                      label: 'Pending',
                    },
                    {
                      value: 'Accepted',
                      label: 'Accepted',
                    },
                    {
                      value: 'Reject',
                      label: 'Reject',
                    },
                    {
                      value: 'Complete',
                      label: 'Complete',
                    },
                  ]}
                />
              </Form.Item>

              <h4>Reason</h4>
              <Form.Item
                name="reason"
                rules={[
                  {
                    required: true,
                    message: 'Please type reason for changing the status!',
                  },
                ]}
              >
                <TextArea
                  placeholder="Controlled autosize"
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                />
              </Form.Item>
              <div className="flex justify-end  py-8">
                <Button htmlType="submit" type="primary">
                  Update
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default connect(({ transaction }) => ({
  allTransactionList: transaction?.allTransactionList,
}))(ManageTransactionTable);
