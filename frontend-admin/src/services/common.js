import { hostname, callApi } from '@/utils/apiUtils';
import { common } from '@/utils/endpoints/common';
import Axios from 'axios';

export const getCountryStates = ({ pathParams: { countryId } }) =>
  Axios.get(`${hostname()}/xapi/v1/common/country/${countryId}/provinces`)
    .then((result) => result.data)
    .catch(() => {});

export const getCountriesList = () =>
  Axios({
    method: 'get',
    url: `${hostname()}/xapi/v1/common/country`,
  })
    .then((response) => {
      const status = 'ok';
      return {
        data: response.data,
        status,
      };
    })
    .catch(() => {
      const status = 'notok';
      return {
        status,
      };
    });

export const uploadContent = (body) =>
  callApi({ uriEndPoint: common.uploadContent.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const getProductTypesList = ({ query }) =>
  callApi({ uriEndPoint: common.productTypes.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const createProductType = ({ query, body }) =>
  callApi({ uriEndPoint: common.createProductType.v1, query, body })
    .then((res) => res)
    .catch((err) => err);

export const updateProductType = ({ pathParams, body }) =>
  callApi({ uriEndPoint: common.updateProductType.v1, pathParams, body })
    .then((res) => res)
    .catch((err) => err);

export const generatePayment = async ({ pathParams, body }) =>
  callApi({ uriEndPoint: common.generatePayment.v1, pathParams, body })
    .then((res) => res)
    .catch((err) => err);

export const confirmPayment = async ({ pathParams, body, query }) =>
  callApi({ uriEndPoint: common.confirmPayment.v1, pathParams, body, query })
    .then((res) => res)
    .catch((err) => err);
export const dashboardStats = async ({ query }) =>
  callApi({ uriEndPoint: common.dashboardStats.v1, query })
    .then((res) => res)
    .catch((err) => err);
