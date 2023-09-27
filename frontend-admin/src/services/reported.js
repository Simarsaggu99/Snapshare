import { callApi } from '@/utils/apiUtils';
import { reported } from '@/utils/endpoints/reported';

export const getAllReportedPost = ({ query }) =>
  callApi({ uriEndPoint: reported.getAllReportedPost.v1, query }).then((res) => {
    return res;
  });
export const restorePost = ({ pathParams }) =>
  callApi({ uriEndPoint: reported.restorePost.v1, pathParams }).then((res) => {
    return res;
  });
export const deleteReportedPost = ({ pathParams }) =>
  callApi({ uriEndPoint: reported.deleteReportedPost.v1, pathParams }).then((res) => {
    return res;
  });
export const singleRestorePost = ({ pathParams }) =>
  callApi({ uriEndPoint: reported.singleRestorePost.v1, pathParams });
