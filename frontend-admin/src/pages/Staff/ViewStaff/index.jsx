/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/BreadCrumbs';
import { useParams, connect, Link } from 'umi';
import { Row, Col, Skeleton, Tooltip, Button } from 'antd';
import Page from '@/components/Page';
import svg from '@/assets/icons/m-0.svg';
import { debounce } from 'lodash';
import moment from 'moment';
import styles from './index.less';
import FormTabs from '@/components/FormTabs';

const ViewServiceUser = ({ dispatch, loading, getStaffMember, match }) => {
  const { staffId } = useParams();
  const [type, setType] = useState(
    match.path.includes('service') ? 'clientReviewForm' : 'staffSpotCheckForm',
  );
  const [limit, setLimit] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const action = (value) => {
    setSearchKeyword(value);
  };
  const debounceSearch = debounce(action, 400);

  useEffect(() => {
    dispatch({
      type: 'staff/getStaffMember',
      payload: {
        pathParams: {
          id: staffId,
        },
      },
    });
  }, [dispatch, staffId]);

  const getForms = () => {
    const val = {
      type,
      _limit: limit,
      _start: current,
      createdBy: staffId,
      keyword: searchKeyword,
    };

    dispatch({
      type: 'forms/getForms',
      payload: {
        query: val,
      },
    });
  };
  useEffect(() => {
    getForms();
  }, [current, limit, type, staffId, searchKeyword, dispatch]);

  const Item = ({ title, value, classNames }) => (
    <div className=" px-4 py-2 border-b">
      <span className="flex justify-between">
        <div className="text-gray-700 font-normal text-sm">{title}</div>
        <Skeleton loading={loading}>
          <div className={classNames || 'font-semibold'} style={{ color: '#126E32' }}>
            {value}
          </div>
        </Skeleton>
      </span>
    </div>
  );

  const countryCode = getStaffMember?.mobile?.slice(0, 3);

  const phoneNumber = getStaffMember?.mobile?.slice(3, getStaffMember?.mobile?.length);

  return (
    <div className="bg-white px-5">
      <Page
        title={<div className="capitalize">{getStaffMember?.name}</div>}
        breadcrumbs={
          <Breadcrumbs
            path={[
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
            ]}
          />
        }
        primaryAction={
          <Link to={`/staff/${staffId}/profile/update`}>
            <Button type="primary" size="large">
              Update Profile
            </Button>
          </Link>
        }
      >
        <div className="container mx-auto mt-6">
          <Row gutter={[24, 24]} className="mb-5">
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div className="bg-white shadow rounded mb-3">
                <div className="flex justify-between border-b">
                  {' '}
                  <div className="flex items-center px-4 py-4 ">
                    <div className="">
                      <img src={svg} className="h-16 w-16 rounded-full" alt="" />
                    </div>
                    <div className="">
                      <div className="pl-2 w-full">
                        <Skeleton loading={loading}>
                          <span className="flex justify-between">
                            <div className="text-lg capitalize font-medium text-gray-900">
                              {`${getStaffMember?.name}`}
                            </div>
                          </span>
                          <div className="" style={{ fontSize: '13px' }}>
                            Created at {moment(getStaffMember?.created_at).format('LL')}
                          </div>
                        </Skeleton>
                      </div>
                    </div>
                  </div>
                </div>

                {getStaffMember?.role && (
                  <Item
                    classNames="capitalize font-semibold"
                    value={getStaffMember?.role?.name}
                    title="Role"
                  />
                )}
                {getStaffMember?.designation && (
                  <Item value={getStaffMember?.designation} title="Designation" />
                )}

                {getStaffMember?.email && (
                  <div className=" px-4 py-2 border-b">
                    <span className="flex justify-between">
                      <div className="text-gray-700 font-normal text-sm">Email</div>
                      <Skeleton loading={loading}>
                        <Tooltip title={getStaffMember?.email} className="mr-2">
                          <div className="truncate font-semibold ml-2" style={{ color: '#9D1D5A' }}>
                            {getStaffMember?.email}
                          </div>
                        </Tooltip>
                      </Skeleton>
                    </span>
                  </div>
                )}
                {getStaffMember?.mobile && (
                  <Item
                    classNames="text-right font-semibold"
                    value={`(${countryCode}) ${phoneNumber}`}
                    title="Phone Number"
                  />
                )}
              </div>
              {getStaffMember?.address?.address_line_1 && (
                <div className="bg-white shadow rounded mb-3">
                  <div className={`px-4 py-2 border-b ${styles?.previewStyles}`}>
                    <div className="text-gray-700 font-normal text-sm font-semibold p-2 mx-2">
                      Address Details
                    </div>
                  </div>
                  {(getStaffMember?.address?.address_line_1 ||
                    getStaffMember?.address?.address_line_2) && (
                      <Item
                        textRight={true}
                        classNames="capitalize font-semibold text-right"
                        value={`${getStaffMember?.address?.address_line_1 &&
                          getStaffMember?.address?.address_line_1.replaceAll(/undefined/gi, '')
                          }, ${getStaffMember?.address?.address_line_2 &&
                          getStaffMember?.address?.address_line_2.replaceAll(/undefined/gi, '')
                          }`}
                        title="Street Name"
                      />
                    )}
                  {getStaffMember?.address?.region && (
                    <Item
                      classNames="capitalize font-semibold"
                      value={getStaffMember?.address?.region}
                      title="Region"
                    />
                  )}
                  {getStaffMember?.address?.city && (
                    <Item
                      value={getStaffMember?.address?.city}
                      classNames="capitalize font-semibold"
                      title="City"
                    />
                  )}
                  {getStaffMember?.address?.state_code && (
                    <Item
                      value={getStaffMember?.address?.state_code?.split(' ')[1]}
                      classNames="capitalize font-semibold"
                      title="County"
                    />
                  )}
                  {getStaffMember?.address?.country_code && (
                    <Item
                      value={getStaffMember?.address?.country_code}
                      classNames="capitalize font-semibold text-right"
                      title="Country"
                    />
                  )}
                  {getStaffMember?.address?.postal_code && (
                    <Item value={getStaffMember?.address?.postal_code} title="Postal Code" />
                  )}
                </div>
              )}
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <FormTabs
                match={match}
                status="staff"
                setType={setType}
                type={type}
                limit={limit}
                setLimit={setLimit}
                current={current}
                setCurrent={setCurrent}
                debounceSearch={debounceSearch}
                getForms={getForms}
              />
            </Col>
          </Row>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ loading, forms, staff }) => ({
  getStaffMember: staff.getStaffMember,
  loading: loading.effects['staff/getStaffMember'],
  formByType: forms.formByType,
  formData: forms.formData,
}))(ViewServiceUser);
