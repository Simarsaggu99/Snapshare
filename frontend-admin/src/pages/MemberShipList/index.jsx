import React, { useState } from 'react';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { Button } from 'antd';
import moment from 'moment';
import BuySubscriptionLicence from '@/components/BuySubscriptionLicence';

const data = [
  {
    key: 'STARTER_PLAN',
    name: 'Starter Plan',
    price: 200,
    available_licence: 2,
    atshow: 250,
  },
  {
    key: 'PREMIUM_PLAN',
    name: 'Premium Plan',
    price: 275,
    available_licence: 3,
    atshow: 350,
  },
  {
    key: 'PRO_PLAN',
    name: 'Pro Plan',
    price: 450,
    available_licence: 5,
    atshow: 600,
  },
];

const MemberShipList = ({ currentUser, dispatch }) => {
  const [selectedPlan, setSelectedPlan] = useState({});
  const [increaseLicence, setIncreaseLicence] = useState(false);

  const showModal = () => {
    dispatch({
      type: 'common/showBuySubscription',
      payload: {
        value: true,
      },
    });
  };

  return (
    <div>
      <div className="container flex flex-wrap pt-4 pb-10 m-auto mt-6 md:mt-15 lg:px-12 xl:px-16">
        <div className="w-full px-0 lg:px-4">
          <div className="text-center mb-6">
            <h1 style={{ color: '#126E32' }} className="px-12  font-bold text-center text-3xl">
              EarlyBird  <span className="text-black"> Plans</span>
            </h1>
            <span className=" text-gray-600">
              Choose a plan that works best for you and your team.
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center py-4 pt-0 ">
            {data.map((card) => {
              return (
                <div className="w-full p-4 md:w-1/2 lg:w-1/4 plan-card" key={card?.key}>
                  <label
                    className={`flex flex-col bg-white rounded-lg shadow-lg group relative cursor-pointer hover:shadow-2xl transform hover:scale-110 transition duration-500 ${currentUser?.planKey === card?.key &&
                      'shadow-2xl  transform scale-110 transition duration-500 '
                      } `}
                    style={{
                      backgroundColor: `${currentUser?.planKey === card?.key ? 'rgb(82 82 82' : '#fff'
                        })`,
                    }}
                  >
                    <div className="w-full px-4 py-6 rounded-t-lg card-section-1">
                      {currentUser?.isActive && currentUser?.planKey === card?.key && (
                        <div className="w-full flex justify-end">
                          <Button
                            type="primary"
                            ghost
                            onClick={(e) => {
                              setIncreaseLicence(true);
                              setSelectedPlan({ price: 150 });
                              showModal(true);
                            }}
                          >
                            <span className="text-white">Increase Licence</span>
                          </Button>
                        </div>
                      )}
                      <div
                        className={`${currentUser?.isActive &&
                          currentUser?.planKey === card?.key &&
                          'text-white'
                          }`}
                      >

                        <h3
                          className="mx-auto text-base font-semibold text-center  text-blue-500 group-hover:text-white"
                          style={{
                            color:
                              currentUser?.isActive && currentUser?.planKey === card?.key
                                ? '#fff'
                                : '#126E32',
                          }}
                        >
                          {card.name}
                        </h3>
                        <p className={`text-5xl font-bold text-center group-hover:text-white  `}>
                          <span className="text-sm ">$</span>
                          <span
                            style={{
                              color:
                                currentUser?.isActive && currentUser?.planKey === card?.key
                                  ? '#fff'
                                  : '#126E32',
                            }}
                          >
                            {card.price}
                          </span>
                          {/* <span className="text-sm ">/month</span> */}
                        </p>
                        <p className={`text-sm font-bold text-center group-hover:text-white  `}>

                          <span className="text-sm font-medium">at show</span>
                          <span
                            className='text-2xl ml-3'
                            style={{
                              color: '126E32',

                            }}
                          >
                            <span className="text-sm ">$</span>{card.atshow}
                          </span>
                          {/* <span className="text-sm ">/month</span> */}
                        </p>

                        {currentUser?.isActive && currentUser?.planKey === card?.key ? (
                          <div className="text-center">
                            <div>
                              <span>Expires on </span>
                              <div className="font-semibold">
                                ({moment(currentUser?.planExpiry).format('lll')})
                              </div>
                            </div>
                            <div className=" flex items-center justify-center">
                              <span className="text-lg">Remaining Invites </span>
                              <strong className="ml-2 text-2xl">
                                {currentUser?.remainingInvites}
                              </strong>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-center uppercase group-hover:text-white text-blue-500 text-black">

                            <div>
                              <CheckOutlined style={{ color: '#126E32' }} />
                              <span className={`font-semibold text-black`}>
                                Upto {card.available_licence} Licences
                              </span>
                            </div>
                            <div>
                              <CheckOutlined style={{ color: '#126E32' }} />
                              <span className={`font-semibold text-black`}> Invite any member</span>
                            </div>

                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg bg-green-700">
                      <p className="text-xl text-white"></p>
                      <button
                        onClick={(e) => {
                          if (currentUser?.isActive && currentUser?.planKey === card?.key) {
                            e.preventDefault();
                          } else {
                            setSelectedPlan(data.find((item) => item.key === card.key));
                            showModal(true);
                          }
                        }}
                        // disabled the action to buy other subscription when user had already an active subscription.
                        disabled={currentUser?.planKey && currentUser?.planKey !== card?.key}
                        style={{ color: '#126E32' }}
                        className="w-5/6 py-2 mt-2 font-semibold text-center uppercase  border border-transparent rounded text-blue-500 cursor-pointer  "
                      >
                        {currentUser?.isActive && currentUser?.planKey === card?.key ? (
                          <span>
                            <CheckCircleOutlined /> Your Plan
                          </span>
                        ) : (
                          'Get Started'
                        )}
                      </button>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BuySubscriptionLicence
        increaseLicence={increaseLicence}
        setIncreaseLicence={setIncreaseLicence}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(MemberShipList);
