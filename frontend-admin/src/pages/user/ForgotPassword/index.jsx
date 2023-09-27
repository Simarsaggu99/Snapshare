/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Col, Form, Input, message, notification, Row } from 'antd';
import { connect, history, Link } from 'umi';
import logo from '@/assets/logo/logo.png';
import bgImg from '@/assets/background-image.svg';
import UserAuthLayout from '../UserAuthLayout';
import { forgetUserPasswordService, resetUserPassword, verifyUserOtp } from '@/services/user';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const ForgotPassword = ({ loading }) => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loadings, setLoadings] = useState(false);
  const [verifyLoadings, setVerifyLoadings] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [navigationState, setNavigationState] = useState('forgot_password');

  const forget = () => {
    setLoadings(true);
    forgetUserPasswordService({ body: { email } })
      .then((res) => {
        console.log(res);
        message.success('Please check your email to reset your password');
        setNavigationState('otp');
        setLoadings(false);
      })
      .catch(() => {
        notification.error({
          message: 'Email is not registered',
        });
        setLoadings(false);
        // loadings
        // message.error('User not found');
      });
  };
  const pin1Ref = React.useRef(null);
  const pin2Ref = React.useRef();
  const pin3Ref = React.useRef();
  const pin4Ref = React.useRef();
  const [pin1, setPin1] = useState();
  const [pin2, setPin2] = useState();
  const [pin3, setPin3] = useState();
  const [pin4, setPin4] = useState();
  const otpcode = [pin1, pin2, pin3, pin4];
  const verifyOtp = () => {
    verifyUserOtp({
      // eslint-disable-next-line new-cap
      token: new Buffer.from(`${email}-${otpcode.join('')}`).toString('base64'),
    })
      .then((res) => {
        console.log(res);
        setNavigationState('reset_password');
        message.success('OTP verified Successfully');
      })
      .catch((err) => {
        notification.error({
          message: 'Invalid OTP or it may be expired',
        });
      });
  };
  const resetPassword = () => {
    if (password === repeatPassword) {
      resetUserPassword({
        // eslint-disable-next-line new-cap
        token: new Buffer.from(`${email}-${password}`).toString('base64'),
      })
        .then((res) => {
          history.push('/user/login');
          message.success('Password reset successfully');
        })
        .catch((err) => {
          notification.error({
            message: 'password reset failed',
          });
          console.log(err);
        });
    } else {
      notification.error({
        message: 'Password mismatch',
      });
    }
  };
  console.log(email);

  return (
    <UserAuthLayout>
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="w-full h-full bg-white flex items-center justify-center my-auto"
      >
        {navigationState === 'forgot_password' ? (
          <div className="max-w-sm">
            <div className="">
              <div className="flex justify-center">
                <Row>
                  <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                    <img src={logo} alt="Store illustration" className="h-32 self-center" />
                  </Col>
                </Row>
              </div>
              <div className="my-6">
                <div className="font-bold text-4xl text-center">Forgot Password?</div>
                <div className="text-gray-500 text-base text-center">
                  Enter your email to receive reset password link.
                </div>
              </div>
              <div className="">
                <Form form={form} hideRequiredMark colon={false} layout="vertical">
                  <Form.Item
                    name="email"
                    label={<span className="formLabel">Email</span>}
                    // rules={[
                    //   {
                    //     type: 'email',
                    //     message: 'Please enter a valid email address!',
                    //   },
                    //   {
                    //     required: true,
                    //     message: "Email can't be blank!",
                    //   },
                    // ]}
                  >
                    <Input
                      size="large"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={forget}
                    block
                    size="large"
                    htmlType="submit"
                  >
                    Send reset password link
                  </Button>
                </Form>
                <div className="text-center mt-4">
                  <Link to="/user/login">Login</Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {navigationState === 'otp' ? (
          <div>
            <div className="max-w-sm">
              <div className="">
                <div className="flex justify-center">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                      <img src={logo} alt="Store illustration" className="h-32 self-center" />
                    </Col>
                  </Row>
                </div>
                <div className="my-6">
                  <div className="font-bold text-4xl text-center">Verify OTP !</div>
                  <div className="text-gray-500 text-base text-center">
                    Enter your OtP to verify your account.
                  </div>
                </div>
                <div className="">
                  <div className="login_form">
                    <Form
                      form={form}
                      hideRequiredMark
                      initialValues={'Enter otp'}
                      layout="vertical"
                    >
                      <Form.Item
                        name="Otp"
                        // label={
                        //   <div
                        //     className="text-sm font-semibold text-black-900"
                        //     style={{ fontSize: '13px' }}
                        //   >
                        //     {locale?.forget?.title4}
                        //   </div>
                        // }
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: locale?.forget?.mesotp,
                        //   },
                        // ]}
                      >
                        <div className="flex">
                          <Input
                            ref={pin1Ref}
                            size="large"
                            className="mx-2"
                            maxLength={1}
                            value={pin1}
                            onChange={(e) => {
                              setPin1(e.target.value);
                              if (e.target.value.length > 0) {
                                pin2Ref.current.focus();
                              }
                            }}
                            onKeyPress={({ nativeEvent }) => {
                              console.log(nativeEvent);
                              if (pin1) {
                                pin2Ref.current.focus();
                                setPin2(nativeEvent.key);
                              }
                            }}
                            placeholder=""
                            style={{ width: 250, marginRight: 6, textAlign: 'center' }}
                          />
                          <Input
                            ref={pin2Ref}
                            size="large"
                            className="mx-2"
                            maxLength={1}
                            value={pin2}
                            onChange={(e) => {
                              console.log(e.target.value);
                              setPin2(e.target.value);
                              if (e.target.value.length > 0) {
                                pin3Ref.current.focus();
                              } else if (e.nativeEvent.inputType === 'deleteContentBackward') {
                                pin1Ref.current.focus();
                              }
                            }}
                            placeholder=""
                            onKeyPress={({ nativeEvent }) => {
                              console.log(nativeEvent);
                              if (pin2) {
                                pin3Ref.current.focus();
                                setPin3(nativeEvent.key);
                              }
                            }}
                            style={{ width: 250, marginRight: 6, textAlign: 'center' }}
                          />
                          <Input
                            ref={pin3Ref}
                            size="large"
                            className="mx-2"
                            maxLength={1}
                            value={pin3}
                            onChange={(e) => {
                              setPin3(e.target.value);
                              if (e.target.value.length > 0) {
                                pin4Ref.current.focus();
                              } else if (e.nativeEvent.inputType === 'deleteContentBackward') {
                                pin2Ref.current.focus();
                              }
                            }}
                            onKeyPress={({ nativeEvent }) => {
                              console.log(nativeEvent);
                              if (pin3) {
                                pin4Ref.current.focus();
                                setPin4(nativeEvent.key);
                              }
                            }}
                            placeholder=""
                            style={{ width: 250, marginRight: 6, textAlign: 'center' }}
                          />
                          <Input
                            ref={pin4Ref}
                            size="large"
                            className="mx-2"
                            maxLength={1}
                            value={pin4}
                            onChange={(e) => {
                              setPin4(e.target.value);
                              console.log(e.nativeEvent.inputType, 'ad');
                              if (e.target.value.length > 0) {
                                pin4Ref.current.focus();
                              } else if (e.nativeEvent.inputType === 'deleteContentBackward') {
                                pin3Ref.current.focus();
                              }
                            }}
                            placeholder=""
                            onKeyPress={(event) => {
                              console.log(event);
                              // if (nativeEvent.key === 'BackSpace') {
                              //   pin3Ref.current.focus();
                              // }
                            }}
                            style={{ width: 250, marginRight: 6, textAlign: 'center' }}
                          />
                        </div>
                        <div className="w-full mt-2">
                          <a className="flex justify-end" onClick={forget}>
                            Resend OTP?
                          </a>
                        </div>
                      </Form.Item>

                      <Form.Item>
                        <Button
                          // size="large"
                          loading={verifyLoadings}
                          type="primary"
                          size="large"
                          style={{ fontSize: '14px' }}
                          htmlType="submit"
                          className="login-form-button text-black-900 w-full"
                          onClick={verifyOtp}
                        >
                          Verify
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {navigationState === 'reset_password' ? (
          <div className="max-w-sm">
            <div className="">
              <div className="flex justify-center">
                <Row>
                  <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                    <img src={logo} alt="Store illustration" className="h-32 self-center" />
                  </Col>
                </Row>
              </div>
              <div className="my-6">
                <div className="font-bold text-4xl text-center">Create new password</div>
                <div className="text-gray-500 text-base text-center">Enter your new password.</div>
              </div>
              <div className="login_form">
                <Form
                  form={form}
                  hideRequiredMark
                  initialValues={'Enter new password'}
                  layout="vertical"
                >
                  <div className="">
                    <Form.Item name={['New password']} rules={[{ required: true }]}>
                      <Input.Password
                        placeholder={'New password'}
                        className=""
                        size="large"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                      />
                    </Form.Item>

                    <Form.Item name={['Confirm password']} rules={[{ required: true }]}>
                      <Input.Password
                        className=""
                        placeholder={'Confirm password'}
                        size="large"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={(event) => setRepeatPassword(event.target.value)}
                        value={repeatPassword}
                      />
                    </Form.Item>
                  </div>
                </Form>
                <Button
                  // size="large"
                  loading={passwordLoading}
                  type="primary"
                  size="large"
                  style={{ fontSize: '14px' }}
                  htmlType="submit"
                  className="login-form-button text-black-900 w-full"
                  onClick={resetPassword}
                >
                  Reset password
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['user/userForgotPassword'],
}))(ForgotPassword);
