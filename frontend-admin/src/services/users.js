import { callApi } from '@/utils/apiUtils';
import { users } from '@/utils/endpoints/users';

export const getAllUser = ({ query }) =>
  callApi({ uriEndPoint: users.getAllUser.v1, query })
    .then((res) => res)
    .catch(() => {});
export const getSingleUser = ({ pathParams }) =>
  callApi({ uriEndPoint: users.getSingleUser.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const deductCoins = ({ pathParams, body }) =>
  callApi({ uriEndPoint: users.deductCoins.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});
export const suspendUser = ({ body }) => callApi({ uriEndPoint: users.suspendUser.v1, body });

export const sendWarning = ({ pathParams, body }) =>
  callApi({ uriEndPoint: users.sendWarning.v1, pathParams, body });

export const sendSpankee = ({ pathParams, body }) =>
  callApi({ uriEndPoint: users.sendSpankee.v1, pathParams, body });

export const getSingleUserWarning = ({ query }) =>
  callApi({ uriEndPoint: users.getSingleUserWarning.v1, query });

export const getSingleUserSpankee = ({ query }) =>
  callApi({ uriEndPoint: users.getSingleUserSpankee.v1, query });
