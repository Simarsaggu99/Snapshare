import React, { useState } from 'react';
import { Tabs, Table, Space, Tag, Select, Form, Button, Input } from 'antd';
import { AiFillEye } from 'react-icons/ai';
import Menu from 'antd/lib/menu';
import 'antd/lib/menu/style/css';
import Dropdown from 'antd/lib/dropdown';
import 'antd/lib/dropdown/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import { history } from 'umi';
import blue from '@/assets/blue.png';
import {
  CaretDownOutlined,
  DownCircleFilled,
  DownCircleOutlined,
  DownCircleTwoTone,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
const userData = [
  // { user: { img: blue, name: 'snapshare' }, fullName: 'memerbazz', email: 'meme@sake.com', crux: 'crux', coinBalance: 223, location: 'Hulalala', sex: 'male', warnings: 222, spanakness: 222, earning: 99, suspend: 'checkbox' },
  // { user: { img: blue, name: 'snapshare' }, fullName: 'memerbazz', email: 'meme@sake.com', crux: 'crux', coinBalance: 223, location: 'Hulalala', sex: 'male', warnings: 222, spanakness: 222, earning: 99, suspend: 'checkbox' },
  // { user: { img: blue, name: 'snapshare' }, fullName: 'memerbazz', email: 'meme@sake.com', crux: 'crux', coinBalance: 223, location: 'Hulalala', sex: 'male', warnings: 222, spanakness: 222, earning: 99, suspend: 'checkbox' },
  // { user: { img: blue, name: 'snapshare' }, fullName: 'memerbazz', email: 'meme@sake.com', crux: 'crux', coinBalance: 223, location: 'Hulalala', sex: 'male', warnings: 222, spanakness: 222, earning: 99, suspend: 'checkbox' },
  {
    user: { img: blue, name: 'snapshare' },
    fullName: 'memerbazz',
    email: 'meme@sake.com',
    crux: 'crux',
    coinBalance: 223,
    location: 'Hulalala',
    sex: 'male',
    warnings: 222,
    spanakness: 222,
    earning: 99,
    suspend: 'checkbox',
  },
  {
    user: { img: blue, name: 'snapshare' },
    fullName: 'memerbazz',
    email: 'meme@sake.com',
    crux: 'crux',
    coinBalance: 223,
    location: 'Hulalala',
    sex: 'male',
    warnings: 222,
    spanakness: 222,
    earning: 99,
    suspend: 'checkbox',
  },
];

const getAgeGroup = [
  { value: '20 - 30', id: Math.random() },
  { value: '30 - 40', id: Math.random() },
  { value: '40 - 50', id: Math.random() },
];

const UsersBoard = () => {
  const [form] = Form.useForm();
  const [searchText, setsearchText] = useState('');

  const columns = [
    {
      title: `Sr No`,
      dataIndex: 'srno',
      key: 'srno',
      render: (_, __, index) => index + 1,
    },
    // {
    //     title: `Profile`,
    //     dataIndex: 'srno',
    //     key: 'srno',
    //     width: '10%',
    //     render: (img, name) => {
    //         return <div className='flex w-[100%] bg-green-800 justify-around'>
    //             <span>Image</span>
    //             <span>userName</span>
    //         </div>
    //     }
    // },
    {
      title: 'User',
      key: 'tags',
      dataIndex: 'user',
      width: 5,
      height: 5,
      render: (_, { user }) => {
        return (
          <div className="flex flex-col justify- items-center">
            <div className="">
              {' '}
              <img src={user.img} alt="user-image" className="h-20  w-10" />{' '}
            </div>
            <p>{user.name}</p>
          </div>
        );
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email) => <p>{email}</p>,
    },
    {
      title: 'Crux',
      dataIndex: 'crux',
      key: 'age',
      render: (data) => <p>{data}</p>,
    },

    {
      title: 'Coin Balance',
      dataIndex: 'coinBalance',
      key: 'coin',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Warnings',
      dataIndex: 'warnings',
      key: 'warnings',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Spanakness',
      dataIndex: 'spanakness',
      key: 'spanakness',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Earning',
      dataIndex: 'earning',
      key: 'earning',
      render: (data) => <p>{data}</p>,
    },
    // Table.SELECTION_COLUMN,
    // {
    //     title: 'Suspend',
    //     dataIndex: 'suspend',
    //     render: (data) => <p>{data}</p>
    // },

    {
      title: 'Action',
      key: 'action',
      // render: (_, record) => (
      //     <Space size="middle">
      //         <a>Invite {record.name}</a>
      //         <a>Delete</a>
      //     </Space>
      // ),
      render: (_, record) => {
        return (
          <div className="flex  justify-center">
            <a>
              <AiFillEye
                onClick={() => {
                  history.push('/view-user-details');
                }}
                className="text-lg"
              />
            </a>
          </div>
        );
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  const handleGenderFilter = (key) => {
    console.log('first');
  };
  const cruxMenu = (
    <Menu
      onClick={() => {
        handleGenderFilter;
      }}
    >
      <Menu.Item key="1">opt</Menu.Item>
      <Menu.Item key="2">opt</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">opt3</Menu.Item>
    </Menu>
  );
  const menu = (
    <Menu onClick={() => {}}>
      <Menu.Item key="1">Male</Menu.Item>
      <Menu.Item key="2">Female</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Other</Menu.Item>
    </Menu>
  );
  const ageMenu = (
    <Menu onClick={() => {}}>
      <Menu.Item key="">10-20 </Menu.Item>
      <Menu.Item key="">20-30 </Menu.Item>
      <Menu.Item key="">30-40 </Menu.Item>
    </Menu>
  );
  const LocationMenu = (
    <Menu onClick={() => {}}>
      <Menu.Item key="">Amritsar </Menu.Item>
      <Menu.Item key="">Jaipur </Menu.Item>
      <Menu.Item key="">Chandigarh </Menu.Item>
    </Menu>
  );

  const onFinish = (values) => {
    // console.log('values', values)

    values['searchText'] = searchText;
    console.log('searchText', values);
  };

  const onFinishFailed = (err) => {
    console.log('finsihErr', err);
  };

  const onChangeTab = (key) => {
    console.log('Key', key);
    let dataUsers = form.getFieldsValue('users');
    console.log('dataUsers', dataUsers);
    //FIXME do APIs call
  };
  const onSearch = (value) => console.log(value);
  return (
    <div className="">
      <Page
        title="Manage User"
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
                path: '/users',
              },
            ]}
          />
        }
      >
        <Form
          className=""
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          name="users"
          form={form}
        >
          <div className="flex justify-between">
            <div className="flex">
              <div className="flex items-center mr-2">
                <Form.Item name="crux" rules={[]}>
                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter By Crux"
                    suffixIcon={<CaretDownOutlined style={{ color: 'black', fontSize: '16px' }} />}
                  >
                    {getAgeGroup.map((elem, idx) => (
                      <Option value={elem.value} key={elem.id}>
                        {elem.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="flex items-center mx-2">
                <Form.Item name="gender" rules={[]}>
                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter By Gender"
                    suffixIcon={<CaretDownOutlined style={{ color: 'black', fontSize: '16px' }} />}
                  >
                    {getAgeGroup.map((elem, idx) => (
                      <Option value={elem.value} key={elem.id}>
                        {elem.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="flex items-center mx-2">
                <Form.Item name="age" label="" rules={[]}>
                  <Select
                    style={{ width: 200, border: 'none' }}
                    placeholder="Filter By Age"
                    suffixIcon={<CaretDownOutlined style={{ color: 'black', fontSize: '16px' }} />}
                  >
                    {getAgeGroup.map((elem, idx) => (
                      <Option value={elem.value} key={elem.id}>
                        {elem.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="flex items-center mx-2">
                <p></p>
                <Form.Item
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the program name',
                    },
                  ]}
                >
                  <Select
                    style={{ width: 200, borderRadius: '5px' }}
                    placeholder="Filter By Location"
                    suffixIcon={<CaretDownOutlined style={{ color: 'black', fontSize: '16px' }} />}
                  >
                    {getAgeGroup.map((elem, idx) => (
                      <Option value={elem.value} key={elem.id}>
                        {elem.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <Button htmlType="submit" style={{ background: '#394b80', color: 'white' }}>
              {' '}
              Apply
            </Button>
          </div>

          <div className=" flex">
            <Input
              size="large"
              onChange={(e) => {
                setsearchText(e.target.value);
              }}
              placeholder="Enter name , eamail to search prospect user "
              allowClear
            />
            <Button
              className=" "
              type="primary"
              size="large"
              style={{ background: '#394b80' }}
              htmlType="submit"
            >
              <SearchOutlined />
            </Button>
          </div>
        </Form>

        <div>
          <Tabs defaultActiveKey="1" onChange={onChangeTab}>
            <TabPane tab="Active" key="1" className="btn">
              <Table columns={columns} dataSource={userData} scroll={{ x: 1000 }} />
            </TabPane>
            <TabPane tab="Deleted" key="2">
              <Table
                columns={columns}
                dataSource={userData}
                scroll={{ x: 1000 }}
                rowSelection={{ ...rowSelection }}
              />
            </TabPane>
          </Tabs>
        </div>
      </Page>
    </div>
  );
};

export default UsersBoard;
