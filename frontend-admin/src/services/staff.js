import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

export const createStaff = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.createStaff.v1, body });

export const createEmployee = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.createEmployee.v1, body })
    .then((res) => res)
    .catch(() => {});

export const inviteUser = (body) =>
  callApi({ uriEndPoint: apiEndPoints.staff.inviteUser.v1, body })
    .then((res) => res)
    .catch(() => {});

export const getStaffList = ({ query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffList.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getStaffMember = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffMember.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const disableStaff = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.disableStaff.v1, body })
    .then((res) => res)
    .catch(() => {});

export const getStaffDetails = (pathParams) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffDetails.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const staffClassAssociation = ({ body, staffId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.staff.addClassToStaff.v1,
    body,
    pathParams: { staffId },
  })
    .then((res) => res)
    .catch(() => {});
};
export const deleteStaffClassAssociation = ({ body, staffId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.staff.deleteClassOfStaff.v1,
    body,
    pathParams: { staffId },
  })
    .then((res) => res)
    .catch(() => {});
};

export const updateStaffDetails = ({ body, staffId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.staff.updateStaffDetails.v1,
    body,
    pathParams: { staffId },
  })
    .then((res) => res)
    .catch(() => {});
};
