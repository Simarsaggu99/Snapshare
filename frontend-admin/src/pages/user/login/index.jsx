import React, { useState } from 'react';
import { Alert, Form, Input, Button, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect, Link } from 'umi';
import logo2 from '@/assets/logo/logo2.png';
import logo1 from '@/assets/logo/logo.png';
import styles from './index.less';

const Login = ({ dispatch, loading }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(false);
  return (
    <div className="flex  justify-center h-screen overflow-y-auto">
      <Row className="h-full w-full" gutter={2}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="h-full">
          <div
            // style={{
            //   backgroundImage: `url(${bgImg})`,
            //   backgroundSize: 'cover',
            //   backgroundRepeat: 'no-repeat',
            // }}
            className=" h-full flex flex-col items-center justify-center mx-auto"
          >
            <Row className="w-full">
              <Col xs={0} sm={0} md={12} lg={12} xl={12} className="w-full ">
                <div className=" h-full flex justify-center items-center ">
                  <span className=" p-8 rounded-lg h-1/2 w-1/2 text-4xl font-semibold" >Snapshare</span>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="h-full w-full">
                <div className=" h-full flex justify-center items-center">
                  <div className="todos-container">
                    <div>
                      <div className={`${styles.form} `}>
                        <div className="max-w-sm ">
                          <div className="">
                            <div className="flex justify-center ">
                              <img
                                src={logo2}
                                alt="Store illustration"
                                width={100}
                                className="h-20 "
                              />
                            </div>
                            <div className="my-6">
                              <div className="font-bold text-4xl text-center ">Welcome back!</div>
                              <div className=" text-base text-center text-sm">
                                Enter your email address and password to log in
                              </div>
                            </div>
                            <div className="">
                              {error && (
                                <div className="my-2">
                                  <Alert
                                    message="Invalid email address or password!"
                                    type="error"
                                    showIcon
                                    closable
                                  />
                                </div>
                              )}
                              <Form
                                hideRequiredMark
                                autoComplete="off"
                                form={form}
                                onFieldsChange={() => setError(false)}
                                colon={false}
                                layout="vertical"
                                onFinish={(val) => {
                                  // const apiToken = btoa(`${val.email_address}:${val.password}`);
                                  dispatch({
                                    type: 'login/login',
                                    payload: {
                                      body: {
                                        email: val?.email_address,
                                        password: val?.password,
                                      },
                                    },
                                    cb: (res) => {
                                      if (res?.status === 'notok') {
                                        setError(true);
                                      }
                                    },
                                  });
                                }}
                              >
                                <Form.Item
                                  name="email_address"
                                  label={<span className="formLabel ">Email</span>}
                                  rules={[
                                    {
                                      type: 'email',
                                      message: 'Please enter a valid email address!',
                                    },
                                    {
                                      required: true,
                                      message: "Email can't be blank!",
                                    },
                                  ]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: "Password can't be blank!",
                                    },
                                  ]}
                                  name="password"
                                  label={<span className="formLabel ">Password</span>}
                                >
                                  <Input.Password
                                    size="large"
                                    iconRender={(visible) =>
                                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                    }
                                  />
                                </Form.Item>
                                <Button
                                  type="primary"
                                  loading={loading}
                                  block
                                  size="large"
                                  htmlType="submit"
                                >
                                  Login
                                </Button>
                                <div className="text-center mt-4 ">
                                  <Link to="/user/forgotpassword" className="">
                                    Forgot Password ?
                                  </Link>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))(Login);
