import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import AppModal from '../AppModal';
import getStripe from '@/utils/stripe';
import CreditCardForm from '@/components/CreditCardForm';
import { addSubscription } from '@/services/user';
import paymentSuccessGif from '@/assets/file-types/payment-success.gif';
import licenceupgradeGif from '@/assets/file-types/upgrade.gif';

import upgrade from '@/assets/file-types/upgrade.png';

import { connect, history } from 'umi';
import { notification } from 'antd';
import CheckValidation from '../CheckValidation';

const BuySubscriptionLicence = ({
  isVisible,
  dispatch,
  increaseLicence,
  setIncreaseLicence,
  selectedPlan,
  setSelectedPlan,
  currentUser,
}) => {
  // eslint-disable-next-line no-restricted-globals
  const query = new URLSearchParams(location.search);
  const userId = query.get('id');
  const vt = query.get('vt');
  const [isSuccessVisibile, setIsSuccessVisibile] = useState(false);

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const resetModalState = () => {
    dispatch({
      type: 'common/showBuySubscription',
      payload: {
        value: false,
        query: {
          id: userId,
        },
      },
    });
    setSelectedPlan({});
    if (increaseLicence) {
      setIncreaseLicence(false);
    }
    setIsSuccessVisibile(false);
  };
  return (
    <div>
      <Elements stripe={getStripe()}>
        <AppModal
          title=""
          showModal={isVisible}
          onCancel={resetModalState}
          // style={{ width: 1000 }}
          footer={false}
        >
          {isSuccessVisibile ? (
            <div className="w-full h-full px-10 py-10">
              <CheckValidation show={isPaymentSuccess}>
                <img src={paymentSuccessGif} alt="payment succesfull" className="w-full h-full" />
              </CheckValidation>
              {/* Show the upgrade licence gif only when user upgrade the licence only.not in the buy subscription case */}
              <CheckValidation show={!isPaymentSuccess && increaseLicence}>
                <img
                  src={licenceupgradeGif}
                  alt="licenceupgrade succesfull"
                  className="w-full h-full"
                />
                <h3 className="text-center font-semibold text-md">Licence Upgraded Successfully</h3>
              </CheckValidation>
            </div>
          ) : (
            <div className="px-10 py-10">
              {increaseLicence && (
                <div className="rounded flex justify-between items-center shadow mb-6 py-3 px-4">
                  <div>
                    <span className="text-lg md:text-3xl font-semibold ">Upgrade licence</span>
                    <div className="text-sm md:text-lg text-gray-700">Invite more partner</div>
                    <div className="text-sm text-gray-600">Pay $150/ partner invite</div>
                  </div>
                  <img src={upgrade} alt="upgrade" className="h-24 w-24 md:h-32 md:w-32 contain" />
                </div>
              )}
              <CreditCardForm
                cb={(id) => {
                  if (increaseLicence) {
                    dispatch({
                      type: 'user/addLicense',
                      payload: {
                        body: { orderId: id },
                      },
                    })
                      .then((res) => {
                        console.log('after adding licence: ', res);
                        // step1 --> reset the paymentSuccess after 1 second on confirm payment success so that upgrade licence gif can be shown.
                        setTimeout(() => {
                          setIsPaymentSuccess(false);
                        }, 1000);
                        // step2 --> close Modal after 3 second to preview upgrading licence gif.
                        setTimeout(() => {
                          resetModalState();
                        }, 3000);
                      })
                      .catch((err) => {
                        console.log('err', err);
                        notification.error({
                          message: 'Oops! Something went wrong.Please Contact Support.',
                          description: err?.data?.message,
                        });
                      });
                  } else if (!currentUser.email) {
                    const decoded = Buffer.from(vt, 'base64').toString('ascii');
                    const val = decoded.split(':');
                    dispatch({
                      type: 'login/login',
                      payload: {
                        body: { email: val[0], password: val[1] },
                      },
                      cb: () => {
                        addSubscription({ body: { orderId: id } }).then(() => {
                          resetModalState();
                          // if currentuser email does not exist, redirect to homepage

                          history.replace('/dashboard');
                        });
                      },
                    });
                  } else {
                    addSubscription({ body: { orderId: id } }).then(() => {
                      resetModalState();
                      // if currentuser email does not exist, redirect to homepage
                    });
                  }
                }}
                // eslint-disable-next-line no-underscore-dangle
                userId={userId || currentUser._id}
                details={selectedPlan}
                setIsSuccessVisibile={setIsSuccessVisibile}
                setIsPaymentSuccess={setIsPaymentSuccess}
              />
            </div>
          )}
        </AppModal>
      </Elements>
    </div>
  );
};

export default connect(({ common, user }) => ({
  isVisible: common.isVisible,
  currentUser: user.currentUser,
}))(BuySubscriptionLicence);
