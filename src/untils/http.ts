import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { BaseResponse } from '@/types/common';
import { getCurrentPageUrl } from './common';

/**
 * 扩展请求配置
 */
type RequestConfig = Taro.request.Option & {
	showLoading?: boolean; // 是否全屏加载
	isPublic?: boolean;
	// 请求拦截器
	interceptors?: {
		request?: (config: RequestConfig) => RequestConfig; // 请求发出前拦截，对当前配置进行处理
		response?: (response: any) => any; // 收到相应后拦截，对返回响应进行处理
	};
};

/**
 * 请求类
 */
class HttpRequest {
	private baseUrl: string = process.env.TARO_APP_API || '';
	private static loadingCount = 0; // 全局计数器，解决多个请求导致 loading 闪烁
	private static isRedirecting = false; // 锁，防止 401 时重复弹出多个提示或跳转
	private readonly TOKEN_NAME = 'Authorization';

	private showLoading() {
		if (HttpRequest.loadingCount === 0) Taro.showLoading({ title: '加载中...', mask: true });
		HttpRequest.loadingCount++;
	}

	private hideLoading() {
		if (HttpRequest.loadingCount > 0) HttpRequest.loadingCount--;
		if (HttpRequest.loadingCount === 0) Taro.hideLoading();
	}

	public async request<T = any>(config: RequestConfig): Promise<T> {
		const authStore = useAuthStore.getState();

		// 处理请求路径前缀
		let options: RequestConfig = {
			timeout: 15000,
			...config,
			header: {
				'Content-Type': 'application/json',
				[this.TOKEN_NAME]: authStore.token ? `Bearer ${authStore.token}` : '',
				...config.header,
			},
		};

		// 拼接路径
		if (options.url && !options.url.startsWith('http')) {
			options.url = `${this.baseUrl}${options.url}`;
		}

		// 执行拦截器在请求前的处理逻辑
		if (options.interceptors?.request) options = options.interceptors.request(options);
		if (options.showLoading) this.showLoading();

		// 发出请求
		return new Promise((resolve, reject) => {
			Taro.request({
				...options,
				success: (res) => {
					if (res.statusCode === 200) {
						const { code, msg, data } = res.data as BaseResponse<T>;

						if (code === 200) {
							const finalData = options.interceptors?.response
								? options.interceptors.response(data)
								: data;
							resolve(finalData as T);
						} else if ([410000, 410001, 410002, 401, 402].includes(code)) {
							// 登录失效
							this.handleAuthError();
							reject(res.data);
						} else {
							Taro.showToast({ title: msg || '服务器繁忙', icon: 'none' });
							reject(res.data);
						}
					} else {
						const error = this.handleError(res);
						Taro.showToast({ title: error.msg, icon: 'none' });
						reject(error);
					}
				},
				fail: (err) => {
					Taro.showToast({ title: '网络异常，请检查网络', icon: 'none' });
					reject(err);
				},
				complete: () => {
					if (options.showLoading) this.hideLoading();
				},
			});
		});
	}

	// 统一错误处理
	private handleError(res: Taro.request.SuccessCallbackResult<any>) {
		return {
			code: res.statusCode,
			msg: res.data?.msg || res.data?.message || `网络请求错误(${res.statusCode})`,
			data: res.data,
		};
	}

	// 鉴权失败处理
	private handleAuthError() {
		// 防止并发情况下的重复跳转
		if (HttpRequest.isRedirecting) return;
		HttpRequest.isRedirecting = true;

		useAuthStore.getState().setLogout();

		// 获取当前页面路径
		const backUrl = getCurrentPageUrl();

		Taro.showModal({
			title: '提示',
			content: '登录已过期，请重新登录',
			showCancel: false,
			success: () => {
				Taro.redirectTo({
					url: `/pages/login/index?back_url=${encodeURIComponent(backUrl)}`,
					complete: () => {
						HttpRequest.isRedirecting = false;
					},
				});
			},
		});
	}

	public get<T = any>(url: string, params?: any, config?: RequestConfig) {
		return this.request<T>({ ...config, url, data: params, method: 'GET' });
	}

	public post<T = any>(url: string, data?: any, config?: RequestConfig) {
		return this.request<T>({ ...config, url, data, method: 'POST' });
	}

	public put<T = any>(url: string, data?: any, config?: RequestConfig) {
		return this.request<T>({ ...config, url, data, method: 'PUT' });
	}

	public delete<T = any>(url: string, data?: any, config?: RequestConfig) {
		return this.request<T>({ ...config, url, data, method: 'DELETE' });
	}

	/**
	 * POST 请求 (Form Data 格式)
	 * 用于后端要求 application/x-www-form-urlencoded 的场景
	 */
	public postForm<T = any>(url: string, data?: any, config?: RequestConfig) {
		return this.request<T>({
			...config,
			url,
			data,
			method: 'POST',
			header: {
				...config?.header,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
	}

	/**
	 * PUT 请求 (Form Data 格式)
	 */
	public putForm<T = any>(url: string, data?: any, config?: RequestConfig) {
		return this.request<T>({
			...config,
			url,
			data,
			method: 'PUT',
			header: {
				...config?.header,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
	}
}

export const http = new HttpRequest();
