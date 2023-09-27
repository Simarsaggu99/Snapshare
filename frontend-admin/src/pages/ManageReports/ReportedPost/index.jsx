import { getInitials } from '@/utils/common';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, connect } from 'umi';

const ReportedPost = ({ dispatch, singleRestorePost }) => {
  const { id: reportedId } = useParams();
  const [viewDocument, setViewDocument] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const getSinlgeReport = () => {
    dispatch({
      type: 'reported/singleRestorePost',
      payload: {
        pathParams: {
          id: reportedId,
        },
      },
    });
  };
  useEffect(() => {
    getSinlgeReport();
  }, []);

  return (
    <div>
      {/* <div>
        <div className="bg-white">
          <img />
        </div>
      </div> */}
      <div>
        <div className="relative">
          <div className="absolute " style={{ top: '70px', left: '60px', width: '92%' }}>
            <div className="text-white font-bold text-2xl ml-2">
              <p>Reported Post</p>
            </div>
            <div
              className="border w-full flex items-center justify-between "
              style={{ borderRadius: '10px', background: 'white', padding: '20px', width: '100%' }}
            >
              <div className="w-full flex gap-10 justify-between ">
                <div>
                  <div className="flex gap-5">
                    <div
                      onClick={() => {
                        setViewDocument(true);
                      }}
                    >
                      <img
                        src={singleRestorePost?.data?.reports?.postDetail?.media?.url}
                        height={150}
                        width={150}
                        alt=""
                        className="object-fit"
                      />
                    </div>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}
                    >
                      <p className="text-base font-medium mb-0">
                        <span className="font-base ">
                          like: {singleRestorePost?.data?.reports?.postDetail?.like_count}
                        </span>
                      </p>
                      <p className="text-base mb-0 font-medium">
                        <span className="font-base">
                          comment: {singleRestorePost?.data?.reports?.postDetail?.comment_count}
                        </span>
                      </p>
                      <p className="mb-0 text-base font-medium break-all  flex flex-col">
                        <span className="font-base userdescription">
                          description:{' '}
                          {showMore
                            ? singleRestorePost?.data?.reports?.postDetail?.description
                            : singleRestorePost?.data?.reports?.postDetail?.description?.slice(
                                1,
                                40,
                              )}
                        </span>
                        <div
                          className="text-[#ea4115] w-full items-end text-sm mt-1 flex justify-end"
                          onClick={() => {
                            showMore ? setShowMore(false) : setShowMore(true);
                          }}
                        >
                          <span>{showMore ? '... Show less' : '... Show more'}</span>
                        </div>
                      </p>
                      <p className="text-base mb-0 font-medium">
                        tags:{' '}
                        {singleRestorePost?.data?.reports?.postDetail?.tags?.map((item, idx) => (
                          <span key={idx} className="font-base">
                            {item}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5">
                    No. time post Reported: <span>{singleRestorePost?.data?.reports?.count}</span>
                  </p>
                </div>
                <div className="flex gap-5">
                  <div className="mt-10">
                    <p className="mb-0">
                      <span>name: </span>
                      {singleRestorePost?.data?.reports?.postDetail?.user?.name}
                    </p>
                    <p>
                      <span>email: </span>
                      {singleRestorePost?.data?.reports?.postDetail?.user?.email}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-center">
                      {!singleRestorePost?.data?.reports?.postDetail?.user?.avatar_url ? (
                        <div className="h-16 w-16">
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                            {getInitials(singleRestorePost?.data?.reports?.postDetail?.user?.name)}
                          </div>
                        </div>
                      ) : (
                        <img
                          src={singleRestorePost?.data?.reports?.postDetail?.user?.avatar_url}
                          alt="user-image"
                          className="h-16 w-16 object-cover rounded-full"
                        />
                      )}
                    </div>
                    {/* <img
                      height={100}
                      width={100}
                      src={singleRestorePost?.data?.reports?.postDetail?.user?.avatar_url}
                      className="object-cover rounded-full"
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" " style={{ backgroundColor: '#211414', height: '250px' }}></div>
      </div>
      <div className="mt-40 mx-16">
        <div>
          <p className="text-xl w-max font-medium bg-white p-2 py-2.5 rounded-lg  ">User List</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {singleRestorePost?.data?.reports?.reportBy?.map((item) => (
            <div key={item?.reportedUser?._id} className="border bg-white p-3 rounded-md w-full">
              <div className="flex gap-2">
                <img
                  height={80}
                  width={80}
                  src={item?.reportedUser?.avatar_url}
                  className="object-cover rounded-full"
                  alt=""
                />
                <div
                  className=""
                  style={{ display: 'flex', justifyContent: 'end', flexDirection: 'column' }}
                >
                  <p className="mb-1 break-all">{item?.reportedUser?.user_handle}</p>
                  <p className="mb-1 break-word">Name :{item?.reportedUser?.name}</p>

                  <div className="">Description: {item?.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        visible={viewDocument}
        title="Privew Document"
        onCancel={() => {
          setViewDocument(false);
        }}
        footer={null}
        width={700}
        height={800}
      >
        <div className="flex justify-center">
          <img
            width={700}
            height={800}
            src={singleRestorePost?.data?.reports?.postDetail?.media?.url}
            alt=""
          />
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ reported }) => ({
  singleRestorePost: reported?.singleRestorePost,
}))(ReportedPost);
