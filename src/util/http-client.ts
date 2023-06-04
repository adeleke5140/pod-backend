//  GLOBAL COMMON / UTIL functions   //
// --------------------------------- //
//  DON'T ADD Common or UTIL HERE!   //
// --------------------------------- //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
// --------------------------------- //
import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

import { echo } from './echo';
import { appConfig } from '../config/env';

const axiosClient: AxiosInstance = axios.create({
  timeout: appConfig.httpTimeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function axiosRequest(options: IHttpClientConfig): Promise<any> {
  function onSuccess(response: AxiosResponse): any {
    return response;
  }

  function onError(error: AxiosError): AxiosPromise<any> {
    echo('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      echo('Data:', error.response.data);
      echo('Status:', error.response.status);
      echo('Headers:', error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      echo('Error Message:', error.message);
    }

    return Promise.reject(error);
  }

  return axiosClient(options).then(onSuccess).catch(onError);
}

export type IHttpClientConfig = AxiosRequestConfig;

export type HttpClientType = {
  httpPOST: (opt: IHttpClientConfig) => Promise<any>;
  httpGET: (opt: IHttpClientConfig) => Promise<any>;
  httpDEL: (opt: IHttpClientConfig) => Promise<any>;
  httpPUT: (opt: IHttpClientConfig) => Promise<any>;
};

export const httpClient: HttpClientType = {
  httpPOST: async (opt: IHttpClientConfig): Promise<any> => {
    return axiosRequest({ ...opt, method: 'POST' });
  },
  httpGET: async (opt: IHttpClientConfig): Promise<any> => {
    return axiosRequest({ ...opt, method: 'GET' });
  },
  httpDEL: async (opt: IHttpClientConfig): Promise<any> => {
    return axiosRequest({ ...opt, method: 'DELETE' });
  },
  httpPUT: async (opt: IHttpClientConfig): Promise<any> => {
    return axiosRequest({ ...opt, method: 'PUT' });
  },
};
