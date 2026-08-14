import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { BaseResponse } from '@/types/common';
import { getCurrentPageUrl, showToastOnce } from './common';
import { getTenantId } from './tenant';

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
 * 上传配置项
 */
type UploadConfig = Omit<RequestConfig, 'url' | 'data' | 'method'> & {
	/** 文件对应的 key，默认 'file' */
	name?: string;
	/** 额外的表单数据 */
	formData?: Record<string, any>;
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

	// 获取通用请求头
	private getBaseHeader(header: any = {}) {
		const authStore = useAuthStore.getState();
		const tenantId = getTenantId();

		return {
			'Content-Type': 'application/json',
			[this.TOKEN_NAME]: authStore.token ? `Bearer ${authStore.token}` : '',
			...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
			...header,
		};
	}

	// ==========================================
	// 通用接口请求函数
	// ==========================================
	public async request<T = any>(config: RequestConfig): Promise<T> {
		// 拼装请求配置
		let options: RequestConfig = {
			timeout: 15000,
			...config,
			header: this.getBaseHeader(config.header),
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
					if (options.showLoading) this.hideLoading();
					this.handleSuccess<T>(res.statusCode, res.data, options, resolve, reject);
				},
				fail: (err) => {
					if (options.showLoading) this.hideLoading();
					this.handleNetworkFail(err, reject);
				},
			});
		});
	}

	// ==========================================
	// 上传接口请求函数
	// ==========================================
	public async upload<T = any>(url: string, filePath: string, config?: UploadConfig): Promise<T> {
		// 构建请求参数
		const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
		const header = this.getBaseHeader(config?.header);
		// 上传请求不能用 application/json
		delete header['Content-Type'];

		if (config?.showLoading) this.showLoading();

		return new Promise((resolve, reject) => {
			Taro.uploadFile({
				url: fullUrl,
				filePath: filePath,
				name: config?.name || 'file',
				formData: config?.formData,
				header,
				success: (res) => {
					if (config?.showLoading) this.hideLoading();
					let parsedData;
					try {
						parsedData = JSON.parse(res.data);
					} catch (e) {
						Taro.showToast({ title: '返回数据解析失败', icon: 'none' });
						reject(new Error('JSON parse error'));
						return;
					}

					this.handleSuccess<T>(res.statusCode, parsedData, config || {}, resolve, reject);
				},
				fail: (err) => {
					if (config?.showLoading) this.hideLoading();
					this.handleNetworkFail(err, reject);
				},
			});
		});
	}

	// 处理请求成功
	private handleSuccess<T>(
		statusCode: number,
		responseData: any,
		options: RequestConfig | UploadConfig,
		resolve: Function,
		reject: Function,
	) {
		if (statusCode === 200) {
			const { code, msg, data } = responseData as BaseResponse<T>;

			if (code === 200) {
				const finalData = options.interceptors?.response ? options.interceptors.response(data) : data;
				resolve(finalData as T);
			} else if ([410000, 410001, 410002, 401, 402].includes(code)) {
				this.handleAuthError();
				reject(responseData);
			} else {
				showToastOnce(msg || '服务器繁忙');
				reject(responseData);
			}
		} else {
			const msg = responseData?.msg || responseData?.message || `网络请求错误(${statusCode})`;
			showToastOnce(msg);
			reject({ code: statusCode, msg, data: responseData });
		}
	}

	// 处理请求失败
	private handleNetworkFail(err: any, reject: Function) {
		Taro.showToast({ title: '网络异常，请检查网络', icon: 'none' });
		reject(err);
	}

	// 处理鉴权失败
	private handleAuthError() {
		// 防止并发情况下的重复跳转
		if (HttpRequest.isRedirecting) return;
		HttpRequest.isRedirecting = true;

		const authStore = useAuthStore.getState();
		const hasTokenBefore = !!authStore.token;
		authStore.setLogout();

		// 获取当前页面路径
		const backUrl = getCurrentPageUrl();
		const modalContent = hasTokenBefore ? '您的登录已过期，请重新登录' : '当前操作需要您登录账户';

		Taro.showModal({
			title: '提示',
			content: modalContent,
			showCancel: !hasTokenBefore,
			success: (res) => {
				if (res.confirm) {
					Taro.navigateTo({
						url: `/pages/login/index?back_url=${encodeURIComponent(backUrl)}`,
						complete: () => {
							HttpRequest.isRedirecting = false;
						},
					});
				} else {
					HttpRequest.isRedirecting = false;
				}
			},
		});
	}

	/** 过滤掉参数里所有的 undefined */
	private cleanParams = (params: any) => {
		if (!params) return params;
		return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null));
	};

	private formRequest<T>(method: 'POST' | 'PUT', url: string, data?: any, config?: RequestConfig) {
		return this.request<T>({
			...config,
			url,
			data,
			method,
			header: { ...config?.header, 'Content-Type': 'application/x-www-form-urlencoded' },
		});
	}

	public get<T = any>(url: string, params?: any, config?: RequestConfig) {
		return this.request<T>({ ...config, url, data: this.cleanParams(params), method: 'GET' });
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
		return this.formRequest<T>('POST', url, data, config);
	}

	/**
	 * PUT 请求 (Form Data 格式)
	 */
	public putForm<T = any>(url: string, data?: any, config?: RequestConfig) {
		return this.formRequest<T>('PUT', url, data, config);
	}
}

export const http = new HttpRequest();
