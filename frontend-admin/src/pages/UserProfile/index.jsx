/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/**
 *@BaseView - The Purpose of this component is that user can update its general  account information here
 *
 */
import React, { useEffect } from 'react';
import { connect, useParams, useHistory } from 'umi';
import { Form, message, Button } from 'antd';
import CardSection from '@/components/CardSection';
import Address from '@/components/Address';
import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import BasicDetailsForm from './BasicDetailsForm';

const UserProfile = ({ dispatch, currentUser, updateProfileLoading, getStaffMember }) => {
  const { staffId } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!staffId) {
      form?.setFieldsValue({
        ...currentUser,
        mobile: currentUser?.mobile?.slice(3, currentUser?.mobile?.length),
        address: {
          ...currentUser?.address,
        },
      });
    } else {
      dispatch({
        type: 'staff/getStaffMember',
        payload: {
          pathParams: {
            id: staffId,
          },
        },
      });
    }
  }, [currentUser, staffId]);

  useEffect(() => {
    if (staffId) {
      form?.setFieldsValue({
        ...getStaffMember,
        mobile: getStaffMember?.mobile?.slice(3, getStaffMember?.mobile?.length),
        address: {
          ...getStaffMember?.address,
        },
      });
    }
  }, [staffId, getStaffMember]);

  const staffPathArray = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'All Staff',
      path: '/staff/list',
    },
    {
      name: <div className="capitalize">{getStaffMember?.name}</div>,
      path: '#',
    },
  ];
  const pathArray = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Your profile',
      path: '/user-profile',
    },
  ];

  return (
    <div className="container mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          const data = value;
          data.address.address_line_1 =
            data?.address?.address_line_1 &&
            data?.address?.address_line_1.replaceAll(/undefined/gi, '').trim();

          data.address.address_line_2 =
            data?.address?.address_line_2 &&
            data?.address?.address_line_2.replaceAll(/undefined/gi, '').trim();

          data.mobile = data?.mobile ? `${data?.country_code}${data?.mobile}` : '';
          delete data?.country_code;
          if (data?.address && Object.keys(data?.address).length > 0)
            Object.keys(data?.address)?.map((item) => {
              if (data?.address[item] === undefined) delete data?.address[item];
            });
          data._id = staffId || currentUser?._id;
          dispatch({
            type: 'user/updateCurrent',
            payload: {
              body: {
                ...data,
              },
            },
          }).then((res) => {
            if (res) {
              message.success('Profile updated successfully!');
              if (staffId) history.push(`/staff/${staffId}/view`);
            }
          });
        }}
        hideRequiredMark
        colon={false}
      >
        <Page
          title={staffId ? getStaffMember?.name : 'Your profile'}
          breadcrumbs={<Breadcrumbs path={staffId ? staffPathArray : pathArray} />}
          primaryAction={
            <Button
              type="primary"
              size="large"
              className="Button"
              htmlType="submit"
              block
              loading={updateProfileLoading}
            >
              Update
            </Button>
          }
        >
          <CardSection
            noPadding
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">
                  {staffId ? 'Basic details' : 'Your details'}
                </div>
                <div className="text-gray-600">
                  <p className="mt-4">
                    Fill {staffId ? 'the' : 'your '} details like name and designation.
                  </p>
                </div>
              </div>
            }
            rightContent={<BasicDetailsForm form={form} />}
          />
          <CardSection
            noPadding
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">
                  {staffId ? 'Address' : 'Your address '}
                </div>
                <div className="text-gray-600">
                  <p className="mt-4">
                    Fill {staffId ? 'the' : 'your '} address details like county and city.
                  </p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white rounded shadow p-4">
                <Address form={form} />
              </div>
            }
          />
        </Page>
      </Form>
    </div>
  );
};

export default connect(({ user, loading, staff }) => ({
  currentUser: user.currentUser,
  getStaffMember: staff.getStaffMember,
  updateProfileLoading: loading.effects['user/updateCurrent'],
}))(UserProfile);
