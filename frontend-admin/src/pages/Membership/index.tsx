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
// import image from '../../assets/dataNotFound.png';
import { Spin } from 'antd';

const { TabPane } = Tabs;
const { Search } = Input;
const onSearch = (value) => console.log(value);

const data = [
    {
        card: `Silver`,
        offers: 'No offers',
        coupons: 6,
        price: `$18/50days`
    },
    {
        card: `Gold`,
        offers: 'No offers',
        coupons: 6,
        price: `$82/510days`
    },
    {
        card: `Platinum`,
        offers: 'No offers',
        coupons: 6,
        price: `$822/150days`
    }
];

const MemberShip = ({ dispatch, eventList, loadingForGet }) => {
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
    const [membershipPlan, setMembershipPlan] = useState([]);
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
            type: 'membership/getMembership',
        }).then((res) => {
            console.log('getmembershipPlan :>> ', res.plans);

            setMembershipPlan(res.plans)

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
            title: 'Type of Plan',
            dataIndex: 'key',
            align: 'center', width: `auto`,
            render: (key: any, record) => {
                return <div className="flex justify-center">
                    < div > {key}</div>
                </div >
            }
        },

        {
            title: 'Price',
            dataIndex: 'price',
            align: 'center', width: '20%',
            render: (price, record) => {

                return <div className="flex justify-center">
                    < div > ${price}</div>
                </div >
            },
        },
        {
            title: 'Expiry',
            dataIndex: 'expiry',
            align: 'center', width: '20%',
            render: (expiry, record) => {
                const day = expiry?.slice(0, expiry.length - 1)
                console.log('expiry', expiry?.slice(0, expiry.length - 1))
                return <div className="flex justify-center">
                    < div >{expiry}d</div>
                </div >
            },
        },
        {
            title: 'Coupons',
            dataIndex: 'coupons',
            render: (coupons, record) => {
                return <div className="flex justify-center">
                    < div > 12</div>
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
                        <AiFillEye onClick={() => history.push(`/MemberShip/${record?._id}/ViewDetails`)} className="text-lg" />
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
                                        history.push(`/membership/${record._id}/editDetails`)}
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
                    {/* <Popconfirm
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
                    </Popconfirm> */}
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
            <p>meme</p>
            <Page
                title="MemberShip"
                PrevNextNeeded="N"
                breadcrumbs={
                    <Breadcrumbs
                        path={[
                            {
                                name: 'Dashboard',
                                path: '/dashboard',
                            },
                            {
                                name: 'MemberShip',
                                path: '/MemberShip',
                            },
                        ]}
                    />
                }
            // primaryAction={
            //     <Button
            //         style={{ borderRadius: '6px' }}
            //         type="primary"
            //         size="large"
            //         onClick={() => history.push('/MemberShip/AddEvents')}
            //     // onClick={() => postEvent()}
            //     >
            //         Add MemberShip
            //     </Button>
            // }
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
                                    dataSource={membershipPlan || []}
                                    //   rowKey={(record) => record._id}
                                    loading={false}
                                    locale={{
                                        emptyText: (
                                            <div className="flex items-center justify-center text-center">
                                                <div>
                                                    {/* <p className="text-lg">No Registered user yet!</p> */}
                                                    {/* <img className=" " src={image} alt="No categories found!" /> */}
                                                </div>
                                            </div>
                                        ),
                                    }}
                                />
                            </div>
                            {/* <div>
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
                            </div> */}
                        </div>
                    </div></Spin>
            </Page>
        </div>
    );
};

export default connect(({ event, loading }) => ({
    eventList: event?.eventList,
    loadingForGet: loading?.effects['event/deleteEvent']
}))(MemberShip);
// export default MemberShip