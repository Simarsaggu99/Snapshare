import apiEndPoints from '@/utils/apiEndPoints';
import { callApi, hostname } from '@/utils/apiUtils';
import Axios from 'axios';

export const userRegister = (body) =>
  Axios.post(`${hostname()}/xapi/v1/accounts`, body)
    .then((result) => result?.data)
    .catch(() => {});

export const checkEmail = (path) =>
  Axios.post(`${hostname()}/xapi/v1/user/isExistingLoginId?user_id=${path}`);

export const queryCurrent = () =>
  callApi({ uriEndPoint: apiEndPoints.user.fetchCurrent.v1 })
    .then((res) => res)
    .catch(() => {});

export const updateCurrent = (body) =>
  callApi({ uriEndPoint: apiEndPoints.user.updateCurrent.v1, body })
    .then((res) => res)
    .catch(() => {});

export const userAvatar = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.user.uploadAvatar.v1, body, pathParams })
    .then((res) => res)
    .catch(() => {});

export const updateUserProfile = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.updateProfile.v1, body })
    .then((res) => res)
    .catch(() => {});

export const updatePassword = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.updateUserProfilePassword.v1, body })
    .then((res) => res)
    .catch((err) => err);
export const forgotUserPassword = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.forgotPassword.v1, body })
    .then((res) => res)
    .catch(() => {});

export const updateUserPassword = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.updatePassword.v1, body })
    .then((res) => res)
    .catch(() => {});
export const getAllUser = () =>
  callApi({ uriEndPoint: apiEndPoints.user.getAllUser.v1 })
    .then((res) => res)
    .catch(() => {});

export const signUp = () => {
  // const user = {
  //   firstName: 'Sandeep',
  //   lastName: 'Mansotra',
  //   password: '123456789',
  //   engageTime: 0,
  //   phoneNumber: '9149665892',
  // };
  // return firebase
  //   .firestore()
  //   .collection('users')
  //   .doc('sandeep_mansotra')
  //   .set(user)
  //   .then((doc) => doc)
  //   .catch((error) => error);
};

export const checkUniqueness = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.user.checkUniqueness.v1, pathParams });
export const addPartner = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.addPartner.v1, body });
export const addLicense = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.addLicense.v1, body });

export const addSubscription = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.addSubscription.v1, body })
    .then((res) => res)
    .catch(() => {});
export const forgetUserPasswordService = ({ body }) =>
  callApi({
    body,
    uriEndPoint: apiEndPoints.user.forgotPassword.v1,
  });
export const verifyUserOtp = (payload) =>
  callApi({
    pathParams: payload,
    uriEndPoint: apiEndPoints.user.verifyOtp.v1,
  });
export const resetUserPassword = (payload) =>
  callApi({
    pathParams: payload,
    uriEndPoint: apiEndPoints.user.resetPassword.v1,
  });
export const offlineSubscription = (payload) =>
  callApi({
    body: payload,
    uriEndPoint: apiEndPoints.user.offlineSubscription.v1,
  });
