import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Input, Row, notification } from 'antd';
import { CheckCircleTwoTone, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, history, connect } from 'umi';
import JWT from 'jwt-decode';
import logo from '@/assets/logo/logo.png';
import bgImg from '@/assets/background-image.svg';
import UserAuthLayout from '../UserAuthLayout';
import styles from '../index.less';

const InvitesUser = ({
  dispatch,
  loading,
  location: {
    query: { token },
  },
}) => {
  const decodedToken = JWT(token);
  const [form] = Form.useForm();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token && token?.emailAddress) {
      history.replace('/user/login');
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
        <div className="">
          <div className="flex justify-center">
            <Row>
              <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                <img src={logo} alt="Store illustration" className="h-32 self-center" />
              </Col>
            </Row>
          </div>

          <div className="font-bold text-4xl text-center w-full">
            Welcome {decodedToken?.data?.name} !
          </div>
          <div className="my-6">
            <div className="text-gray-500 text-base text-center">Your account has been set for</div>
            <div className="text-gray-500 text-base text-center font-bold text-gray-700">
              {decodedToken?.data?.email}
            </div>
            <div className="text-gray-500 text-base text-center text-gray-600 pt-3">
              Done with your setup already?{' '}
              <Link to="/user/login" className={styles.LoginLink}>
                Login
              </Link>
            </div>
          </div>
          <div className="mx-6">
            {error && (
              <div className="my-2">
                <Alert message="Your link has been expired!" type="error" showIcon closable />
              </div>
            )}
            <Form
              form={form}
              onFieldsChange={() => setError(false)}
              colon={false}
              hideRequiredMark
              layout="vertical"
              onFinish={(val) => {
                const newVal = {};
                newVal.password = val.password;
                newVal.token = token;
                dispatch({ type: 'staff/inviteUser', payload: newVal }).then((res) => {
                  if (res && res?.nModified > 0) {
                    notification.open({
                      message: 'Great Job!',
                      description: 'Your account is all set to go!',
                      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    });
                    history.replace('/user/login');
                  } else {
                    setError(true);
                  }
                });
              }}
            >
              <Form.Item
                name="password"
                label={<span className="formLabel">Password</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label={<span className="formLabel">Confirm Password</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  () => ({
                    validator(_, value) {
                      if (value?.length === 0 || form?.getFieldValue('password') === value)
                        return Promise.resolve();
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('The two passwords that you entered do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <Button loading={loading} size="large" htmlType="submit" type="primary" block>
                Create Account
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({ loading: loading.effects['staff/inviteUser'] }))(
  InvitesUser,
);
