interface IRequestParams {
    url: string;
    method: string;
    query?: Record<string, any>;
    body?: object;
    headers?: object;
}
interface IHttpResponse {
    data?: {
        [key: string]: any;
    } | any[];
    error?: string;
}
export default function http(reqOptions: IRequestParams): Promise<IHttpResponse>;
export {};
