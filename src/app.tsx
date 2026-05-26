import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { useLogin } from './hooks/useLogin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { guardUnselectedTenant } from './utils/tenant';
import { useConfigStore } from '@/store/config';
import './app.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			networkMode: 'always',
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
		},
	},
});

function App({ children }: PropsWithChildren<any>) {
	// const { onSilentLogin, isLoggedIn } = useLogin();
	const fetchConfig = useConfigStore((state) => state.fetchConfig);

	useLaunch((options) => {
		// 数据：获取全局配置数据
		fetchConfig();
		// 检测：是否登录，执行静默登录
		// if (!isLoggedIn) onSilentLogin();
		// 检测：是否选择地区，执行跳转到引导页逻辑
		guardUnselectedTenant(options);
	});

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default App;
