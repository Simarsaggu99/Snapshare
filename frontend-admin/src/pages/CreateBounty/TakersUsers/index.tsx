import { Avatar, Card, Col, Modal, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect } from 'react';
import { connect } from 'umi';

const TakersUsers = ({ open, setOpen, handleCancel, confirmLoading, dispatch, bountyUserList }) => {
  useEffect(() => {
    if (open?.modal) {
      dispatch({
        type: 'bounty/bountyUserList',
        payload: {
          pathParams: {
            id: open?.id,
          },
        },
      });
    }
  }, [open]);
  console.log('bountyUserList', bountyUserList);

  return (
    <div>
      <Modal
        centered
        width={800}
        footer={null}
        className="stylemodal2"
        title="No. of Takers"
        visible={open?.modal}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div className="px-4 m-2 py-4">
          <div className=" mx-auto justify-center items-center">
            <Row gutter={[8, 8]}>
              {bountyUserList?.data?.length > 0 ? (
                bountyUserList?.data?.map((item) => (
                  <div>
                    <Col xs={24} xl={12} style={{ display: 'flex' }}>
                      <Card style={{ width: 'full' }}>
                        <div className=" ">
                          <Meta
                            avatar={<Avatar className="w-36 h-36" src={item?.avatar_url} />}
                            title={<span className="text-lg">{item?.name}</span>}
                            description={<span className="">{item?.user_handle}</span>}
                          />

                          <div className="answer mt-2 ">
                            <div className="text-lg font-semibold">Answer</div>
                            <div className="">{item?.userAnswer}</div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center mx-auto text-xl text-gray-500">
                  No data found yet!
                </div>
              )}
            </Row>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ bounty }) => ({
  bountyUserList: bounty?.bountyUserList,
}))(TakersUsers);
