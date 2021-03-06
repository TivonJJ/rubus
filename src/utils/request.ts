import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { getDvaApp, getLocale } from 'umi';
import joinPath from 'join-path';

const baseURL: string = '/api';

export type ResponseError = {
    originResponse: AxiosResponse;
    code?: number | string;
    message?: string;
    data?: any;
    type: 'ResponseError';
    preventDefault: () => any;
};

function getStore() {
    const app = getDvaApp();
    // eslint-disable-next-line no-underscore-dangle
    return app._store;
}

function createDefaultRequest() {
    const instance: AxiosInstance = axios.create({
        baseURL,
        timeout: 1000 * 60,
    });
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
        config.headers['Accept-Language'] = getLocale();
        return config;
    });
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            const { data } = response;
            if (data && data.code != 0) {
                if (data.code === 'SYS010') {
                    // 未登录或登录超时
                    getStore().dispatch({
                        type: 'user/logout',
                        payload: {
                            takeRouteInfo: true,
                        },
                    });
                }
                const resultError: Partial<ResponseError> = {
                    code: data.code,
                    message: typeof data === 'object' ? data.msg : data,
                    originResponse: response,
                    type: 'ResponseError',
                };
                return Promise.reject(resultError);
            }
            return data;
        },
        (err) => {
            if (err instanceof Error) {
                return Promise.reject(err);
            }
            const { response } = err;
            const { status } = response;
            const resultError: Partial<ResponseError> = {
                originResponse: response,
                message: `[${status}]${response.statusText}`,
                code: status,
                type: 'ResponseError',
            };
            return Promise.reject(resultError);
        },
    );
    return instance;
}

export function getRequestUrl(...url: string[]): string {
    return joinPath(baseURL, ...url);
}

export default createDefaultRequest();
