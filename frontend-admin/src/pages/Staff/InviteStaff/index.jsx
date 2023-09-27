/* eslint-disable no-param-reassign */
import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import Page from '@/components/Page';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Form, notification } from 'antd';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import InviteForm from './InviteForm';

const InviteStaff = ({ dispatch, loading, user }) => {
  const [inviteType, setInviteType] = useState('');
  const [form] = Form.useForm();
  const button = (
    <Button
      onClick={() => {
        form.submit();
      }}
      type="primary"
      loading={loading}
    >
      {inviteType === 'employee' ? 'Add Staff' : 'Send Invite'}
    </Button>
  );
  return (
    <>
      <div className="container mx-auto px-5">
        <Page
          title="Add Staff"
          primaryAction={button}
          breadcrumbs={
            <Breadcrumbs
              path={[
                {
                  name: 'Dashboard',
                  path: '/dashboard',
                },
                {
                  name: 'Add Staff',
                  path: '/staff/add',
                },
              ]}
            />
          }
        >
          <CardSection
            noPadding
            leftContent={
              <div className="pr-8">
                <div className="text-blue-900 font-semibold text-xl">Staff information</div>
                <div className="text-gray-600">
                  <p className="mt-4">
                    Give staff access to your store by sending them an invitation.
                  </p>
                </div>
              </div>
            }
            rightContent={
              <Form
                layout="vertical"
                hideRequiredMark
                autoComplete="off"
                colon={false}
                onFinish={(values) => {
                  dispatch({
                    type: 'staff/createStaff',
                    payload: {
                      body: {
                        ...values,
                      },
                    },
                  })
                    .then((res) => {
                      notification.open({
                        message: 'Great Job!',
                        description: (
                          <div>
                            You have successfully invited. <strong>{values.name}</strong>.
                          </div>
                        ),
                        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                      });
                      form.resetFields();
                      history.push('/staff/list');
                    })
                    .catch((err) => {
                      notification.error({
                        message: 'Oops! Something went wrong.',
                        description: err?.data?.message,
                      });
                    });
                }}
                form={form}
              >
                <InviteForm form={form} />
              </Form>
            }
          />
        </Page>
      </div>
    </>
  );
};

export default connect(({ loading, user }) => ({
  loading: loading.effects['staff/createStaff'],
  user: user.currentUser,
}))(InviteStaff);
