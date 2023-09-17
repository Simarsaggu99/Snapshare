import { callApi } from "@/utils/apiUtils";
import auth from "@/utils/endpoints/auth";

export const googleLogin = async () => {
  return callApi({
    uriEndPoint: {
      ...auth.loginWithGoogle,
    },
  });
};
export const userOnBoarding = async ({ body, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...auth.userOnBoarding,
    },
    body,
    query,
  });
};
