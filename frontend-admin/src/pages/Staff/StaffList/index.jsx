/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Tabs, Button } from 'antd';
import { connect, Link } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PlusSquareOutlined } from '@ant-design/icons';
import StaffListTable from './StaffListTable';

const { TabPane } = Tabs;

const StaffList = (props) => {
  const { staffList, dispatch } = props;
  const [acceptedKeyword, setAcceptedKeyword] = useState('');
  const [tab, setTab] = useState(true);
  const [limit, setLimit] = useState(10);
  const [current, setCurrent] = useState(1);
  const getStaffList = () => {
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          // isVerified: tab,
          _limit: limit,
          _start: current,
          keyword: acceptedKeyword,
          invitedBy: props.user?._id,
        },
      },
    });
  };

  useEffect(() => {
    getStaffList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, limit, tab, acceptedKeyword, dispatch]);
  // console.log(props.user,'currentUser')
  return (
    <div className="container mx-auto ">
      <Page
        title="All Staff"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Staff',
                path: '/staff/list',
              },
            ]}
          />
        }
        primaryAction={
          <>
            {(props.user.role === 'admin' || props.user.role === 'manager') && (
              <Link
                to={{
                  pathname: '/staff/add',
                }}
              >
                <Button icon={<PlusSquareOutlined />} type="primary" id="open-invite-staff">
                  Invite Staff
                </Button>
              </Link>
            )}
          </>
        }
      >
        <div className="bg-white shadow rounded">
          <Tabs
            defaultActiveKey="ACTIVE"
            className=""
            onTabClick={(val) => {
              setTab(val === 'ACTIVE');
              setLimit(10);
              setCurrent(1);
              setAcceptedKeyword('');
            }}
          >
            <TabPane tab={<span className="px-4">Staffs</span>} key="ACTIVE">
              <StaffListTable
                getStaffList={getStaffList}
                totalRecords={staffList?.total}
                setKeyword={setAcceptedKeyword}
                setCurrent={setCurrent}
                setLimit={setLimit}
                current={current}
                limit={limit}
              />
            </TabPane>

          </Tabs>
        </div>
      </Page>
    </div>
  );
};
export default connect(({ staff, user }) => ({
  staffList: staff.staffList,
  user: user.currentUser,
}))(StaffList);
