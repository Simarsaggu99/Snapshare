import { AxiosRequestHeaders, Method } from "axios";

export interface UriEndPoint {
  uri: string;
  method: Method;
  version: string;
  headerProps?: AxiosRequestHeaders;
}
export interface Post {}
