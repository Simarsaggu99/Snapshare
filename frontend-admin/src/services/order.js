import { callApi } from '@/utils/apiUtils';
import { order } from '@/utils/endpoints/order';

export const orderList = ({ query }) =>
  callApi({ uriEndPoint: order.orderList.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getOrder = ({ pathParams }) =>
  callApi({ uriEndPoint: order.getorder.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
