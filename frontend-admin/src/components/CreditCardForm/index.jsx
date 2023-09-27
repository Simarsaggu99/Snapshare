import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Input } from 'antd';
import { generatePayment, confirmPayment } from '../../services/common';

import s from './index.less';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';

//  css provided by stripe to format elements

// credit card element specific styling
const CARD_OPTIONS = {
  // iconStyle: 'solid',
  style: {
    base: {
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#424770',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#cccccc',
      },
      '::placeholder': {
        color: '#888',
      },
    },
    invalid: {
      iconColor: 'red',
      color: 'red',
    },
  },
};

// credit card button sub component
const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

// submit button sub component
const SubmitButton = ({ processing, error, children, disabled, onClickHandler }) => (
  <button
    // className={`${s.SubmitButton} ${error ? 'SubmitButton--error' : ''}`}
    className={`${s.pay_btn}`}
    type="submit"
    disabled={processing || disabled}
    onClick={onClickHandler}
  >
    {processing ? (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="font-semibold text-lg"
      >
        <LoadingOutlined className="mr-4" /> Processing
      </span>
    ) : (
      children
    )}
  </button>
);

// component declaration
export default function CreditCardForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [price, setPrice] = useState(props.details.price);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
  });
  // eslint-disable-next-line no-restricted-globals
  const query = new URLSearchParams(location.search);
  const userId = query.get('id');
  const encodedData = btoa(userId);

  useEffect(() => {
    setPrice(props.details.price);
  }, [props.details.price]);

  // resets state on completion
  const reset = () => {
    setError('');
    setProcessing(false);
    setPrice(0);
    setCardComplete(false);
    setBillingDetails({
      name: '',
    });
    if (elements.getElement(CardElement)) {
      elements.getElement(CardElement).clear();
    }
    // clearSuccessState();
  };
  // const clearSuccessState = () => {
  //   setTimeout(() => {
  //     props.setIsPaymentSuccess(false);
  //   }, 1500);
  // };
  /*
  This code runs when a card transaction is submitted
  There are three main components to this function:

    1. create a new stripe payment method using the form data

    2. get a payment intent from the server using the speficied price
    3. confirm the payment intent using the new payment method
    4. send a confiemation to the server if the payment succeeded
  */
  const handleSubmit = async (event) => {
    // prevent default form values
    event.preventDefault();

    // /if stripe api is loaded
    if (!stripe || !elements) {
      return;
    }

    // handle errors
    if (error) {
      elements.getElement('card')?.focus();
      return;
    }

    if (price === 0) {
      return;
    }

    // start processing animation on submit button
    if (cardComplete) {
      setProcessing(true);
    } else {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    // STEP 1:
    // create new payment method based on card and form information
    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    // handle errors, otherwise set the new payment method in state
    if (payload.error) {
      setError(String(payload.error));
      return;
    }

    // STEP 2:
    // create a new payment request and get irs client secret + id from the server
    const intentData = await generatePayment({
      body: { price },
    }).then(
      (response) => {
        // SUCCESS: put client secret and id into an object and return it
        return {
          secret: response.client_secret,
          id: response.intent_id,
        };
      },
      (err) => {
        // ERROR: log the error and return
        setError(err);
        setProcessing(false);
        setBillingDetails({
          name: '',
        });
        cardElement.clear();
        return err;
      },
    );

    // STEP 3:
    // confirm the payment and use the new payment method
    const result = await stripe.confirmCardPayment(intentData.secret, {
      payment_method: payload.paymentMethod.id,
    });

    // handle errors again
    if (result.error) {
      setError(String(result.error));
      return;
    }

    // STEP 4:
    //  The payment has been processed! send a confirmation to the server
    if (result.paymentIntent.status === 'succeeded') {
      const confirmedPayment = await confirmPayment({
        // include id of payment
        body: {
          payment_id: intentData.id,
          payment_type: 'stripe',
          to: props.to,
          postId: props.postId,
          price: props.price,
          type: 'purchase',
          userId: props.userId,
        },
        query: {
          id: encodedData,
        },
        // send any other data here
      }).then(
        (response) => {
          // SUCCESS: return the response message
          console.log('Confirm Payment success', response);

          return response.success;
        },
        (err) => {
          console.log('Confirm Payment Err', err);
          // ERROR:
          setProcessing(false);
          setBillingDetails({
            name: '',
          });
          cardElement.clear();
          setError(err);
          return err;
        },
      );

      // reset the state and show the success message
      if (confirmedPayment) {
        props.setIsSuccessVisibile(true);
        props.setIsPaymentSuccess(true);
        setTimeout(() => {
          if (props.cb) props.cb(intentData.id);
          // reset the form
          reset();
        }, 3000);
      }
    }
  };

  // render
  return (
    //  the credit card form

    <>
      {/* Credit Card Payment Form */}
      <fieldset className="mb-4">
        {/* name field */}
        <Input
          autoFocus
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              name: event.target.value,
            });
          }}
          value={billingDetails?.name}
          placeholder={'Enter Card Name'}
          size="large"
        />
      </fieldset>

      {/* credit card field and submit button */}
      <fieldset className={s.formgroup}>
        {/* card */}
        <CardField
          onChange={(event) => {
            setError(event.error);
            setCardComplete(event.complete);
          }}
        />
      </fieldset>
      {/* submit */}
      <SubmitButton
        onClickHandler={handleSubmit}
        processing={processing}
        error={error}
        disabled={!stripe}
      >
        <span className="font-semibold text-lg">Pay ${props.details.price}</span>
        <ArrowRightOutlined className="ml-4" />
      </SubmitButton>
    </>
  );
}
