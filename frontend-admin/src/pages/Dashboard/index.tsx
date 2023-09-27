import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import { DownOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styles from './styles.module.css';

const CardData = [
  { numberOfUser: 7879, text: 'Members online', color: '#FB7185' },
  { numberOfUser: 7879, text: 'New Signups', color: '#60A5FA' },
  { numberOfUser: 7879, text: 'Users Live', color: '#FB923C' },
  { numberOfUser: 7879, text: 'Number of Users Deleted', color: '#34D399' },
];
const trafficVisitors = [
  { title: 'Visits', users: 7879, percentage: '23', fill: '#585858' },
  { title: 'Unique', Unique: 7879, percentage: '23', fill: '#FB7185' },
  { title: 'PageViews', PageViews: 7879, percentage: '23', fill: '#60A5FA' },
  { title: 'New Users', NewUsers: 7879, percentage: '23', fill: '#34D399' },
  { title: 'Bounce Rate', BounceRate: 7879, percentage: '23', fill: '#FB7185' },
];

const Dashboard = () => {
  return (
    <Page
      className="bg-[#2D2525]"
      title="DASHBOARD"
      PrevNextNeeded="N"
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'Manage Users',
              path: '/users',
            },
            {
              name: 'Manage Marketplace',
              path: '/users',
            },
            {
              name: 'Manage Bounty',
              path: '/manage-bounties',
            },
            {
              name: 'Manage Reports',
              path: '/manage-reports',
            },

            {
              name: 'Manage Marketplace',
              path: '/manage-transactions',
            },
          ]}
        />
      }
    >
      <div className="h-full w-auto w-full  ">
        <div className="flex  w-[100%] mt-6 justify-around h-[200px]">
          {CardData.map((card, idx) => (
            <DashCard user={card.numberOfUser} text={card.text} key={idx} color={card.color} />
          ))}
        </div>
        <div
          className={styles.trafficCard}
          style={{ border: '1px solid black', borderRadius: '3px' }}
        >
          <div className={styles.trafficHeader} style={{ padding: '0 5px' }}>
            <div className={styles.left}>
              <span>Traffic</span>
              {/* <p> {new Date()}</p> */}
            </div>
            <div className={styles.right}>
              <Button style={{ background: 'red' }}>Day</Button>
              <Button style={{ background: 'yellow' }}>Month</Button>
              <Button style={{ background: 'green' }}>Year</Button>
            </div>
          </div>
          <div className={styles.trafficContent} style={{ padding: '0 5px' }}>
            trafficContent
          </div>
          <div className="grid grid-cols-5  gap-5 " style={{ borderTop: '2px solid black' }}>
            {trafficVisitors.map((info, idx) => (
              <div className=" m-[2px] w-full p-4">
                <p className=" text-center">{info.title}</p>
                <p className=" text-center">{info.percentage} Users (40%)</p>
                <div
                  className="bg-white flex items-center  rounded "
                  style={{ width: '100%', height: '10px' }}
                >
                  <div
                    className=" rounded "
                    style={{ width: '30%', height: '8px', background: `${info.fill}` }}
                  ></div>
                  {/* //FIXME add width dynamic */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4" style={{ marginTop: '100px' }}>
          <div className=" grid grid-cols-2 gap-2 py-4 bg-blue-700">
            <div className="flex flex-col items-center " style={{ borderRight: '2px solid grey' }}>
              <p>89k </p>
              <p>FRIENDS </p>
            </div>
            <div className="flex flex-col items-center">
              <p>498 </p>
              <p>FEEDS </p>
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-2 py-4 bg-green-700">
            <div className="flex flex-col items-center" style={{ borderRight: '2px solid grey' }}>
              <p>89k </p>
              <p>FRIENDS </p>
            </div>
            <div className="flex flex-col items-center">
              <p>498 </p>
              <p>FEEDS </p>
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-2 py-4 bg-red-700">
            <div className="flex flex-col items-center" style={{ borderRight: '2px solid grey' }}>
              <p>89k </p>
              <p>FRIENDS </p>
            </div>
            <div className="flex flex-col items-center">
              <p>498 </p>
              <p>FEEDS </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

const DashCard = ({ user, text, color }) => {
  return (
    <div className={styles.dashcard} style={{ background: `${color}`, height: '150px' }}>
      <div className="flex flex-col  justify-center">
        <p>{user}</p>
        <span> {text}</span>
      </div>
      <span>
        {' '}
        <DownOutlined />
      </span>
    </div>
  );
};

export default Dashboard;
