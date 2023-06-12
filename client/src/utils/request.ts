import axios, { AxiosRequestConfig } from 'axios';
import { window } from 'vscode';

const csrfToken = 'FromVscode';

function makeRequest(opts?: AxiosRequestConfig) {
  return axios.create({
    baseURL: 'http://127.0.0.1:7001',
    headers: { 'X-Request-From': 'vscode', 'x-csrf-token': csrfToken },
    ...opts,
  });
}

const _instance = makeRequest();
_instance.interceptors.response.use(
  (successResponse) => {
    return successResponse;
  },
  (errReponse) => {
    window.showErrorMessage('request error');
    console.log(errReponse);
    return Promise.reject(errReponse.response?.data ?? errReponse);
  }
);

export function request<T = any>(opts: AxiosRequestConfig) {
  _instance.request<any, T>(opts);
}
