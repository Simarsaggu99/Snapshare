import React from 'react';
import { Input, Row, Col, Form, Radio } from 'antd';
import { useDispatch } from 'umi';
const InviteForm = ({ form }) => {
  const dispatch = useDispatch();
  const checkUniqueness = (emailString) =>
    dispatch({
      type: 'user/checkUniqueness',
      payload: { pathParams: { email: emailString } },
    });
  return (
    <div className="bg-white shadow rounded">
      <div className="p-4 border-b">
        <Row gutter={24}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name="name"
              label={<span className="formLabel">Name</span>}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Name can't be blank!",
                },
              ]}
            >
              <Input size="large" autoFocus placeholder="Enter staff name" />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span className="formLabel">Email</span>}
              name="email"
              initialValue=""
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Email can't be blank!",
                },
                {
                  message: 'Please enter a valid email address!',
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              ]}
            >
              <Input
                size="large"
                type="email"
                name="staff-email"
                id="staff-email"
                placeholder="Enter staff email address"
                onChange={() => {
                  form
                    .validateFields(['email'])
                    .then(({ email }) => {
                      checkUniqueness(email.toLowerCase()).then(({ isUnique }) => {
                        if (!isUnique) {
                          form.setFields([
                            {
                              name: 'email',
                              errors: ['This email already exist'],
                            },
                          ]);
                        }
                      });
                    })
                    .catch(() => {});
                }}
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <Form.Item name="designation" label={<span className="formLabel">Designation</span>}>
              <Input size="large" placeholder="Enter staff designation" />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <Form.Item
              initialValue=""
              label={<span className="formLabel">Password</span>}
              name="password"
            >
              <Input.Password name="staff-password" id="staff-password" size="large" placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div className="bg-gray-100 p-4 border-b">
        <div className="mb-4">
          <div className="font-semibold">What role would you like to give your staff?</div>
          <div>
            After your staff accepts their invitation they will be able to manage your organization
            in the role selected below.
          </div>
        </div>
        <Form.Item
          name="role"
          initialValue="admin"
          rules={[
            {
              required: true,
              message: 'Please select staff role',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            <div className="rounded border bg-white rounded">
              <div className="hover:bg-gray-100 border-b rounded rounded-b-none px-4 ">
                <Radio
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  value="admin"
                >
                  <div className="flex-auto whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="">
                      <div className="font-semibold">Admin</div>
                      <span>
                        Has access to all organization manager functions plus manage organization
                        level settings.
                      </span>
                    </div>
                  </div>
                </Radio>
              </div>
              <div className="flex items-center hover:bg-gray-100 border-b rounded rounded-b-none px-4 ">
                <Radio
                  value="manager"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div className="whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="font-semibold">Manager</div>
                    <div className="flex-1 w-full">
                      Has access to all employee functions plus can manage organization.
                    </div>
                  </div>
                </Radio>
              </div>
              <div className="flex items-center hover:bg-gray-100 rounded rounded-b-none px-4 ">
                <Radio
                  value="employee"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div className="flex-auto whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="font-semibold">Employee</div>
                    <div>Has access to employee functions.</div>
                  </div>
                </Radio>
              </div>
            </div>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};
export default InviteForm;
