import { callApi } from "@/utils/apiUtils";
import contactUsEndpoints from "@/utils/endpoints/contactUs";

export const contactUs = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...contactUsEndpoints.contactUs,
    },
    body,
  });
};
