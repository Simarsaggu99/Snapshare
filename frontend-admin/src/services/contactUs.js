import { callApi } from '@/utils/apiUtils';
import { contactUs } from '@/utils/endpoints/contactUs';

export const getContactUs = () => callApi({ uriEndPoint: contactUs.getContactUs.v1 });
export const getSingleContactUs = () => callApi({ uriEndPoint: contactUs.getSingleContactUs.v1 });
