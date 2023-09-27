import { hostname } from '@/utils/apiUtils';
import request from '@/utils/request';
import Axios from 'axios';

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export const userLogin = ({ body }) =>
  Axios({
    method: 'post',
    url: `${hostname()}/api/auth/admin/login`,
    timeout: 10000,
    data: body,
  })
    .then((response) => {
      localStorage.setItem('accessToken', response.data.accessToken);
      return {
        status: 'ok',
        resp: response,
        accessToken: response.data.accessToken,
      };
    })
    .catch((err) => ({
      status: 'notok',
      currentAuthority: 'guest',
      error: err.response,
    }));
