import React, { useEffect } from 'react';
import { Button, Form, Input, message, Row, Col } from 'antd';
import JWT from 'jwt-decode';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect, history } from 'umi';
import UserAuthLayout from '../UserAuthLayout';
import logo from '@/assets/logo/logo.png';
import bgImg from '@/assets/background-image.svg';
import styles from '../index.less';

const ForgotPassword = ({
  dispatch,
  loading,
  location: {
    query: { token },
  },
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!token && token?.emailAddress) {
      history.replace('/user/login');
    } else {
      const decodedToken = JWT(token);
      form.setFieldsValue({
        email_address: decodedToken?.data?.email,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <div className="font-bold text-4xl text-center">Reset Password!</div>
              <div className="text-gray-500 text-base text-center mx-4">
                Please enter a new password to reset your current password
              </div>
            </div>
            <div className="mx-6">
              <Form
                form={form}
                colon={false}
                layout="vertical"
                onFinish={(val) => {
                  dispatch({
                    type: 'user/resetUserPassword',
                    payload: {
                      body: {
                        password: val.password,
                        token,
                      },
                    },
                  }).then((res) => {
                    if (res) {
                      message.success('Password changed successfully!');
                      history.replace('/user/login');
                    }
                  });
                }}
                className={styles.SignUpForm}
              >
                <Form.Item
                  name="email_address"
                  label={<span className="formLabel">Email address</span>}
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
                  <Input size="large" disabled placeholder="Please enter your email here" />
                </Form.Item>
                <Form.Item name="password" label={<span className="formLabel">Password</span>}>
                  <Input.Password
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Button
                  className="mt-4"
                  type="primary"
                  loading={loading}
                  block
                  size="large"
                  htmlType="submit"
                >
                  Reset Password
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['user/resetUserPassword'],
}))(ForgotPassword);
