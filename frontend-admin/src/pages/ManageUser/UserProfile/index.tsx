import { sendSpankee } from '@/services/users';
import { Avatar, Button, Col, Input, List, message, Modal, Popconfirm, Row, Skeleton } from 'antd';
import moment from 'moment/moment';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { connect, useParams } from 'umi';
import { RxDotFilled } from 'react-icons/rx';
import { AiOutlineWarning } from 'react-icons/ai';
import { BiMessageRoundedError } from 'react-icons/bi';

const array = [
  {
    img: 'jkmkm',
    name: 'Manisha Tiwari',
    name2: 'YO_Manisha_YO',
    status: 'Active / Disabled',
    joiningDate: '07 July 2022',
    userId: 'Manishatiwari@gmail.com',
    post: '55K',
    location: 'India',
    crux: 'Crux level 10',
    warnings: '10',
    coinbal: '10',
    postReported: '10',
  },
];

const UserProfile = ({ dispatch, singleUser, singleUserWarning, singleUserSpankee }) => {
  const { id }: any = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [isSpankeeModalVisible, setIsSpankeeModalVisible] = useState(false);
  const [showWarning, setShowWarning] = useState('');
  const [calculateAge, setcalculateAge] = useState<number>();

  const [deductCoin, setDeductCoin] = useState(0);
  const [text, setText] = useState('');
  const getSingleUser = () => {
    if (id) {
      dispatch({
        type: 'users/getSingleUser',
        payload: {
          pathParams: { id: id },
        },
      });
    }
  };
  useEffect(() => {
    getSingleUser();
  }, []);
  useEffect(() => {
    if (singleUser?.data?._id) {
      getSingleUserWarnings();
      getSingleUserSpankee();
    }
  }, [singleUser?.data?._id]);

  console.log('singleUserWarning :>> ', singleUserSpankee?.data?.getSpankeeList);

  const getSingleUserWarnings = () => {
    dispatch({
      type: 'users/getSingleUserWarning',
      payload: {
        query: { userId: singleUser?.data?._id },
      },
    });
  };

  const getSingleUserSpankee = () => {
    dispatch({
      type: 'users/getSingleUserSpankee',
      payload: {
        query: { userId: singleUser?.data?._id },
      },
    });
  };

  const myfunction = () => {
    setIsModalVisible(true);
  };
  const deductUserCoins = () => {
    dispatch({
      type: 'users/deductCoins',
      payload: {
        pathParams: { id: singleUser?.data?._id },
        body: {
          amount: deductCoin,
          notificationText: text,
        },
      },
    }).then((res) => {
      setText('');
      setDeductCoin(0);
      if (res?.success) {
        setIsModalVisible(false);
        message?.success('Coins deducted successfully');
      }
    });
  };
  const onSendWarning = () => {
    dispatch({
      type: 'users/sendWarning',
      payload: {
        pathParams: {
          id,
        },
        body: {
          notificationText: text,
        },
      },
    }).then((res: any) => {
      if (res?.message === 'success') {
        setText('');
        setIsWarningModalVisible(false);
        getSingleUser();
        getSingleUserWarnings();
        message.success('warning send to user');
      } else {
        message.error('something went wrong ');
      }
    });
  };
  const handleSendSpanke = () => {
    dispatch({
      type: 'users/sendSpankee',
      payload: {
        pathParams: {
          id,
        },
        body: {
          notificationText: text,
        },
      },
    }).then((res: any) => {
      if (res?.success) {
        getSingleUser();
        setText('');
        setIsSpankeeModalVisible(false);
        getSingleUserSpankee();
        message.success('spankee send to user');
      } else {
        message.error('something went wrong');
      }
    });
  };
  useEffect(() => {
    if (singleUser?.data?.dob) {
      let dateOfBirth = singleUser?.data?.dob;
      let dt = new Date();
      let diff = dt.getTime() - new Date(dateOfBirth).getTime();
      let calculation = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      if (Number.isNaN(calculation)) {
        setcalculateAge(0);
      } else {
        setcalculateAge(calculation);
      }
    }
  }, [singleUser]);
  return (
    <div style={{ margin: '-24px' }}>
      <div className="relative">
        <div className="absolute w-full" style={{ top: '70px' }}>
          <div className="text-white font-bold text-2xl ml-40">
            <p>Manager user</p>
          </div>
          <div
            className="border mx-40 flex items-center justify-between "
            style={{ borderRadius: '10px', background: 'white', padding: '50px' }}
          >
            <div className=" flex justify-between items-center">
              <div className="px-5 background-gray  ">
                <img
                  src={singleUser?.data?.avatar_url}
                  className="object-cover rounded-full"
                  alt=""
                  width={'118px'}
                  height={'118px'}
                />
              </div>
              <div>
                <h3>{singleUser?.data?.name}</h3>
                <p>{singleUser?.data?.user_handle}</p>
              </div>
            </div>
            <div>
              <h3>
                Status :<span>Active / Disabled</span>{' '}
              </h3>
              <p>
                Joining Date :{' '}
                <span>{moment(singleUser?.data?.created_at).format('dd MM YYYY')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" " style={{ backgroundColor: '#211414', height: '250px' }}></div>
      <div className="flex justify-center mt-32 ml-2 ">
        <div className=" mt-2 " style={{ borderRadius: '10px', width: '80%' }}>
          <div>
            <Row gutter={24} style={{ width: '100%', margin: 'auto', marginTop: '20px' }}>
              <Col xs={12} sm={8} md={16} lg={16} xl={8}>
                <h3>Email ID</h3>
                <p>{singleUser?.data?.email}</p>
              </Col>
              <Col xs={12} sm={8} md={16} lg={16} xl={8}>
                <h3>Delivery Destinations</h3>
                <p>{singleUser?.data?.country}</p>
              </Col>
              <Col xs={12} sm={8} md={16} lg={16} xl={8}>
                <h3>Crux</h3>
                <p>{singleUser?.data?.cruxLevel}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Total no. of posts</h3>
                <p>{singleUser?.totalPosts}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Total Reshared Posts</h3>
                <p>{singleUser?.reposted}</p>
              </Col>

              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Bio</h3>
                <p className="w-[100px] break-all overflow-hidden ">{singleUser?.data?.bio}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Age</h3>
                <p>{calculateAge}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Sex</h3>
                <p>{singleUser?.data?.gender}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Location</h3>
                <p>{singleUser?.data?.country || 'N/A'}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Total coins earned</h3>
                <p>{singleUser?.coins?.toFixed(2)}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Coins balance</h3>
                <p>{singleUser?.coins?.toFixed(2)}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>Last Post Published on</h3>
                <p>{moment(singleUser?.latestPost).format('DD/MM/YYYY')}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>No. of Reports Submitted</h3>
                <p>{singleUser?.reportedPostByUser}</p>
              </Col>
              <Col xs={12} sm={16} md={16} lg={16} xl={8}>
                <h3>No. of posts that got reported</h3>
                <p>{singleUser?.reportedPostOfUser}</p>
              </Col>
              <Col
                xs={12}
                sm={16}
                md={16}
                lg={16}
                xl={8}
                onClick={() => {
                  showWarning === 'spankee' ? setShowWarning('') : setShowWarning('spankee');
                }}
              >
                <h3>Spankee Count</h3>
                <p>{singleUser?.data?.spankeeCount}</p>
              </Col>
              <Col
                xs={12}
                sm={16}
                md={16}
                lg={16}
                xl={8}
                onClick={() => {
                  showWarning === 'warning' ? setShowWarning('') : setShowWarning('warning');
                }}
              >
                <h3>Warnings</h3>
                <p>{singleUser?.data?.warningCount}</p>
              </Col>
              {(showWarning === 'warning' || showWarning === 'spankee') && (
                <Col xs={36} sm={36} md={48} lg={48} xl={24}>
                  <List
                    className="demo-loadmore-list "
                    itemLayout="horizontal"
                    dataSource={
                      showWarning === 'warning'
                        ? singleUserWarning?.data?.getWarningsList
                        : singleUserSpankee?.data?.getSpankeeList
                    }
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          // avatar={<Avatar src={''} />}
                          // title={<div>{item?._id}</div>}
                          description={
                            <div className="flex text-lg text-black mt-1">
                              <div>
                                {showWarning === 'warning' ? (
                                  <AiOutlineWarning />
                                ) : (
                                  <BiMessageRoundedError />
                                )}
                              </div>{' '}
                              <div className=" ml-2">{item?.notificationText}</div>
                            </div>
                          }
                        />
                        <div className="text-">{moment(item?.created_at).format('LLL')}</div>
                      </List.Item>
                    )}
                  />
                </Col>
              )}
            </Row>
          </div>
          <div className="flex justify-start items-center m-16">
            <div className="flex">
              <div className="px-4">
                <Button
                  type="primary"
                  onClick={() => {
                    setIsWarningModalVisible(true);
                  }}
                >
                  <span className="text-white">Warning</span>
                </Button>
              </div>
              <div className="px-4">
                {/* <Popconfirm
                  title="Are you sure you want to send spankee  "
                  onConfirm={handleSendSpanke}
                  okText="Yes"
                  cancelText="No"
                > */}
                <Button type="primary" onClick={() => setIsSpankeeModalVisible(true)}>
                  <span className="text-white">Spankees</span>
                </Button>
                {/* </Popconfirm> */}
              </div>
            </div>
            <div>
              <Button
                disabled={singleUser?.coins < 0}
                type="primary"
                className="px-4 ml-2"
                onClick={myfunction}
              >
                Deduct Coins
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title=""
        style={{ borderRadius: '20px' }}
        centered
        footer={null}
        visible={isModalVisible}
        onOk={() => {
          setText('');
          setIsModalVisible(false);
        }}
        onCancel={() => {
          setText('');
          setIsModalVisible(false);
        }}
      >
        <div className=" py-10">
          <div className="text-center">
            <h2 className="pt-5  text-center">Deduct Coins</h2>
            <p className="text-[#858585]">Enter reason for deduction</p>

            <div className="pb-7">
              <Input
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
                style={{ width: 'calc(100% - 200px)' }}
              />
            </div>
            <p className="text-[#858585] mt-4">Number of coins deducted from the user account</p>
            <div className="">
              {/* <Input.Group compact> */}

              <Input
                type="number"
                min={0}
                value={deductCoin}
                onChange={(e: any) => {
                  setDeductCoin(e.target.value);
                }}
                style={{ width: 'calc(100% - 200px)' }}
                defaultValue="20 coins"
              />
              <div className="px-3 mt-3">
                <Button
                  onClick={() => {
                    deductUserCoins();
                  }}
                  type="primary"
                >
                  Deduct
                </Button>
              </div>
              {/* </Input.Group> */}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title=""
        style={{ borderRadius: '20px' }}
        centered
        footer={null}
        open={isWarningModalVisible}
        onOk={() => {
          setIsWarningModalVisible(false);
          setText('');
        }}
        onCancel={() => {
          setText('');
          setIsWarningModalVisible(false);
        }}
      >
        <div className=" py-10">
          <div className="text-center">
            <h2 className="pt-5  text-center">Send Warning</h2>
            {/* <p className="text-[#858585]">Number of coins deducted from the user account</p> */}
            <div className="pb-5">
              <Input.Group compact>
                <Input
                  onChange={(e) => {
                    setText(e.target.value);

                    // setDeductCoin(e.target.value);
                  }}
                  value={text}
                  style={{ width: 'calc(100% - 200px)' }}
                />
                <div className="px-3">
                  <Button
                    onClick={() => {
                      onSendWarning();
                    }}
                    type="primary"
                  >
                    Send
                  </Button>
                </div>
              </Input.Group>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title=""
        style={{ borderRadius: '20px' }}
        centered
        footer={null}
        open={isSpankeeModalVisible}
        onOk={() => {
          setIsSpankeeModalVisible(false);
          setText('');
        }}
        onCancel={() => {
          setIsSpankeeModalVisible(false);
          setText('');
        }}
      >
        <div className=" py-10">
          <div className="text-center">
            <h2 className="pt-5  text-center">Send Spankee</h2>
            {/* <p className="text-[#858585]">Number of coins deducted from the user account</p> */}
            <div className="pb-5">
              <Input.Group compact>
                <Input
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  value={text}
                  style={{ width: 'calc(100% - 200px)' }}
                  // defaultValue="Spanke"
                />
                <div className="px-3">
                  <Button
                    onClick={() => {
                      handleSendSpanke();
                    }}
                    type="primary"
                  >
                    Send
                  </Button>
                </div>
              </Input.Group>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ users }) => ({
  singleUser: users?.singleUser,
  singleUserWarning: users?.singleUserWarning,
  singleUserSpankee: users?.singleUserSpankee,
}))(UserProfile);
