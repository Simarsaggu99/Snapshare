import React, { useEffect } from 'react';
import { useState } from 'react';
import Page from '@/components/Page';

import BountyTable from './BountyTable';
import { connect } from 'umi';
import LiveBountyTable from './BountyTable/LiveBountyTable';
import { message } from 'antd';

const CreateBounty = ({ dispatch }) => {
  const [tabs, setTabs] = useState('all');
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSizeLive, setViewSizeLive] = useState(10);
  const [currentPageLive, setCurrentPageLive] = useState(1);
  const [startIndexLive, setStartIndexLive] = useState(0);
  const getAllExpireBounty = () => {
    dispatch({
      type: 'bounty/getExpireBounty',
      payload: {
        query: { startIndex, viewSize, type: tabs, bounty: 'expire' },
      },
    }).then((res) => {
      if (!res?.success) {
        message.error('opps something went wrong. while fetching expire bounty');
      }
    });
  };
  const getAllLiveBounty = () => {
    dispatch({
      type: 'bounty/getBounty',
      payload: {
        query: { startIndex: startIndexLive, viewSize: viewSizeLive, type: tabs, bounty: 'live' },
      },
    }).then((res) => {
      if (!res?.success) {
        message.error('opps something went wrong. while fetching live bounty');
      }
    });
  };

  useEffect(() => {
    getAllExpireBounty();
  }, [tabs, startIndex, viewSize, currentPage]);
  useEffect(() => {
    getAllLiveBounty();
  }, [tabs, startIndexLive, viewSizeLive, currentPageLive]);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }
  function handleChangePaginationLive(current) {
    setStartIndexLive(viewSizeLive * (current - 1));
    setCurrentPageLive(current);
  }
  return (
    <Page title="Manage Bounties" PrevNextNeeded="N">
      <div className=" px-3 ">
        <BountyTable
          setTabs={setTabs}
          getAllBounty={getAllLiveBounty}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
          viewSize={viewSize}
          currentPage={currentPage}
          handleChangePagination={handleChangePagination}
          setViewSize={setViewSize}
          setCurrentPage={setCurrentPage}
          handleChangePaginationLive={handleChangePaginationLive}
          startIndexLive={startIndexLive}
          viewSizeLive={viewSizeLive}
          setViewSizeLive={setViewSizeLive}
          setCurrentPageLive={setCurrentPageLive}
          currentPageLive={currentPageLive}
          getAllLiveBounty={getAllLiveBounty()}
        />
        {/* <LiveBountyTable
          handleChangePaginationLive={handleChangePaginationLive}
          startIndexLive={startIndexLive}
          viewSizeLive={viewSizeLive}
          setViewSizeLive={setViewSizeLive}
          setCurrentPageLive={setCurrentPageLive}
          currentPageLive={currentPageLive}
          setStartIndexLive={setStartIndexLive}
        /> */}
      </div>
    </Page>
  );
};

export default connect(() => ({}))(CreateBounty);
