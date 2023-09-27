import { callApi } from '@/utils/apiUtils';
import { leads } from '@/utils/endpoints/leads';

export const getLeadsList = ({ query }) => callApi({ uriEndPoint: leads.getLeadsList.v1, query });
export const exportLeadsData = ({ query }) => callApi({ uriEndPoint: leads.exportLeads.v1, query });
