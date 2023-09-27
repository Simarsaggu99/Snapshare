import { callApi } from '@/utils/apiUtils';
import { forms } from '@/utils/endpoints/forms';

export const getFormData = (pathParams) =>
  callApi({
    uriEndPoint: forms.getFormData.v1,
    pathParams,
  })
    .then((res) => res)
    .catch((err) => err);

export const storeFormsDate = ({ data, type }) =>
  callApi({
    uriEndPoint: forms.storedata.v1,
    body: data,
    pathParams: {
      formType: type,
    },
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getForms = ({ query }) =>
  callApi({ uriEndPoint: forms.getForms.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getStats = () =>
  callApi({ uriEndPoint: forms.getStats.v1 })
    .then((res) => res)
    .catch(() => {});

export const editForm = ({ pathParams, body }) =>
  callApi({ uriEndPoint: forms.editForm.v1, pathParams, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const deleteForm = ({ pathParams }) =>
  callApi({ uriEndPoint: forms.deleteForm.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
