import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Tooltip,
  Modal,
  Form,
  Row,
  Pagination,
  Skeleton,
  Dropdown,
  Table,
  Alert,
  Input,
  Menu,
  Button,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, Link } from 'umi';
import { debounce } from 'lodash';
import moment from 'moment';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import classNames from 'classnames';
import styles from './index.less';

const SearchBarModal = (props) => {
  const [newType, setNewType] = useState('');
  const [limit, setLimit] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { dispatch, formByType, loading, setModalVisible, modalVisible } = props;
  const [dropDownDisplayText, storeDropDownDisplay] = useState(`I'm looking for forms...`);
  const [current, setCurrent] = useState(1);
  const [form] = Form.useForm();

  useEffect(() => {
    const val = {
      type: newType,
      _limit: limit,
      _start: current - 1,
      keyword: searchKeyword,
    };
    if (!newType) {
      delete val?.type;
    }
    if (!searchKeyword) {
      delete val?.keyword;
    }
    if (newType || searchKeyword) {
      dispatch({
        type: 'forms/getForms',
        payload: {
          query: val,
        },
      });
    }
  }, [searchKeyword, current, newType, limit]);

  const changePageSize = (page) => {
    setCurrent(page);
  };

  const menu = (
    <Menu
      onClick={({ key }) => {
        setNewType(key);
      }}
    >
      <Menu.Item key="clientReviewForm" onClick={() => storeDropDownDisplay('Client Review')}>
        Client Review{' '}
      </Menu.Item>
      <Menu.Item key="mentalCapacityForm" onClick={() => storeDropDownDisplay('Mental Capacity')}>
        Mental Capacity
      </Menu.Item>
      <Menu.Item key="riskAssessmentForm" onClick={() => storeDropDownDisplay('Risk Assessment')}>
        Risk Assessment
      </Menu.Item>
      <Menu.Item
        key="riskAssessmentFormCoshh"
        onClick={() => storeDropDownDisplay('Risk Assessment-COSH')}
      >
        Risk Assessment-COSH
      </Menu.Item>
      <Menu.Item
        key="movingAndHandlingForm"
        onClick={() => storeDropDownDisplay('Moving and Handling Assessment')}
      >
        Moving and Handling Assessment
      </Menu.Item>
      <Menu.Item key="supportPlanForm" onClick={() => storeDropDownDisplay('Support Plan')}>
        Support Plan
      </Menu.Item>
      <Menu.Item
        key="telephoneMonitoring"
        onClick={() => storeDropDownDisplay('Telephone Monitoring')}
      >
        Telephone Monitoring
      </Menu.Item>
    </Menu>
  );
  const action = (value) => {
    setSearchKeyword(value);
  };

  const debounceSearch = debounce(action, 400);
  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Service User',
      dataIndex: 'serviceUser',
      key: 'serviceUser',
      render: (text) => <a style={{ color: 'black' }}>{text}</a>,
    },
    {
      title: 'Form Id',
      dataIndex: 'form_id',
      render: (text) => <a style={{ color: 'black' }}>{text}</a>,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (text) => <a style={{ color: 'black' }}>{moment(text).format('DD MMM YYYY')}</a>,
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <Link to={`/form/${record?.type}/${id}`}>
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setModalVisible(false);
              setSearchKeyword('');
              storeDropDownDisplay(`I'm looking for forms...`);
              setNewType('');
              setLimit(10);
              setCurrent(1);
            }}
          >
            View <ArrowRightOutlined />
          </Button>
        </Link>
      ),
    },
  ];
  return (
    <Modal
      title={
        <div className={classNames(styles.inputStyle)}>
          <Form
            layout="vertical"
            hideRequiredMark
            colon={false}
            form={form}
            autoComplete="off"
            className={classNames(styles.formStyle)}
          >
            <Form.Item name="search">
              <Input
                autoFocus
                onChange={(e) => {
                  debounceSearch(e.target.value);
                }}
                allowClear
                bordered={false}
                size="medium"
                placeholder="Enter keyword to search..."
                prefix={
                  <Tooltip title="Click to search" className="mr-2">
                    <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                suffix={
                  <div className="border-r mr-6 ml-2">
                    <div className="mb-1 mt-1 pr-3">
                      <Alert
                        message={
                          <>
                            <Dropdown overlay={menu} placement="bottomLeft">
                              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                {dropDownDisplayText}
                              </a>
                            </Dropdown>
                          </>
                        }
                        type="error"
                        severity="error"
                      />
                    </div>
                  </div>
                }
              />
            </Form.Item>
          </Form>
        </div>
      }
      style={{ top: 8 }}
      visible={modalVisible}
      bodyStyle={{ maxHeight: 600 }}
      width={800}
      footer={null}
      maskClosable={false}
      onOk={() => setModalVisible(false)}
      onCancel={() => {
        form.resetFields();
        setSearchKeyword('');
        setNewType('');
        setLimit(10);
        setCurrent(1);
        setModalVisible(false);
        storeDropDownDisplay(`I'm looking for forms...`);
      }}
    >
      <div>
        {formByType?.total >= 1 && (searchKeyword || newType) ? (
          <Table
            sticky
            scroll={{ x: 400, y: 400 }}
            bordered={false}
            rowClassName="cursor-pointer"
            pagination={false}
            rowKey={(record) => record.id}
            loading={loading}
            columns={columns}
            dataSource={formByType?.forms}
            locale={{
              emptyText: (
                <div className="text-center  pt-6 pb-2">
                  <img
                    src={SearchNotFound}
                    alt="No staff member found!"
                    style={{ height: '80px' }}
                  />
                  <p className="text-base  text-gray-600">No data found!</p>
                </div>
              ),
            }}
            footer={() => (
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  current={current}
                  onChange={changePageSize}
                  showSizeChanger
                  defaultPageSize={limit}
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setLimit(p);
                  }}
                  total={formByType?.total}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                />
              </Row>
            )}
          />
        ) : (
          <Skeleton loading={loading}>
            <div className="text-center pt-6 pb-2">
              <img src={SearchNotFound} alt="No staff member found!" style={{ height: '80px' }} />
              <p className="text-base text-gray-600">No data found!</p>
            </div>
          </Skeleton>
        )}
      </div>
    </Modal>
  );
};

export default connect(({ forms, loading }) => ({
  formByType: forms.formByType,
  loading: loading.effects['forms/getForms'],
}))(SearchBarModal);
