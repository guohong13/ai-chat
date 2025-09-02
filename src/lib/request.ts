// 定义请求配置接口，继承自 RequestInit
export interface RequestConfig extends RequestInit {
  url: string;
  params?: Record<string, any>;
}

// 定义请求拦截器函数类型
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;

// 定义响应拦截器函数类型
export type ResponseInterceptor = (
  response: Response
) => Response | Promise<Response>;

// 定义错误拦截器函数类型
export type ErrorInterceptor = (error: any) => any;

// 封装 fetch 的 Http 类
class Http {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  // 添加一个请求拦截器
  public addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加一个响应拦截器
  public addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // 添加一个错误拦截器
  public addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // 发起一个请求
  public async request(config: RequestConfig): Promise<Response> {
    try {
      let processedConfig = await this.applyRequestInterceptors(config);
      const { url, params, ...options } = processedConfig;
      let requestUrl = url;
      if (params) {
        const query = new URLSearchParams(params).toString();
        requestUrl = `${url}?${query}`;
      }
      let response = await fetch(requestUrl, options);
      response = await this.applyResponseInterceptors(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      return this.applyErrorInterceptors(error);
    }
  }

  // 应用请求拦截器
  private async applyRequestInterceptors(
    config: RequestConfig
  ): Promise<RequestConfig> {
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    return processedConfig;
  }

  // 应用响应拦截器
  private async applyResponseInterceptors(
    response: Response
  ): Promise<Response> {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  // 应用错误拦截器
  private async applyErrorInterceptors(error: any): Promise<any> {
    let processedError = error;
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    throw processedError;
  }
}

const http = new Http();

http.addRequestInterceptor(async (config) => {
  // 从 localStorage 获取token
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth-token");
  }

  // 如果令牌存在，则将其添加到请求头中
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default http;
