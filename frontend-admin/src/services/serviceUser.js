import { callApi } from '@/utils/apiUtils';
import { serviceUser } from '@/utils/endpoints/serviceUser';

export const registerServiceUser = ({ body }) =>
  callApi({ uriEndPoint: serviceUser.registerServiceUser.v1, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const serviceUserList = ({ query }) =>
  callApi({ uriEndPoint: serviceUser.serviceUserList.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getServiceUser = ({ pathParams }) =>
  callApi({ uriEndPoint: serviceUser.getServiceUser.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const editServiceUser = ({ pathParams, body }) =>
  callApi({ uriEndPoint: serviceUser.editServiceUser.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});
