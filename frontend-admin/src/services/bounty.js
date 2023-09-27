import { callApi } from '@/utils/apiUtils';
import { bounty } from '@/utils/endpoints/bounty';

export const createBounty = ({ body }) =>
  callApi({ uriEndPoint: bounty.createBounty.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const getBounty = ({ query }) =>
  callApi({
    uriEndPoint: bounty.getBounty.v1,
    query,
  });
export const bountyUserList = ({ query, pathParams }) =>
  callApi({
    uriEndPoint: bounty.bountyUserList.v1,
    query,
    pathParams,
  });
export const getExpireBounty = ({ query }) =>
  callApi({
    uriEndPoint: bounty.getExpireBounty.v1,
    query,
  });
export const downloadBounty = ({ pathParams }) =>
  callApi({
    uriEndPoint: bounty.downloadBounty.v1,
    pathParams,
  });
