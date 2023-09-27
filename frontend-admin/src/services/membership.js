import { callApi } from '@/utils/apiUtils';
import { Membership } from '@/utils/endpoints/membership';

export const updateMemberShipPlans = ({ pathParams, body }) => callApi({ uriEndPoint: Membership.updateMemberShipPlans.v1, pathParams, body })
export const getMembership = ({ pathParams }) => callApi({ uriEndPoint: Membership.getMembership.v1, pathParams })
export const getSingleMemberShipPlan = ({ pathParams }) => callApi({ uriEndPoint: Membership.getSingleMemberShipPlan.v1, pathParams })
export const addMembershipPlan = ({ pathParams, body }) => callApi({ uriEndPoint: Membership.addMembershipPlan.v1, pathParams, body })