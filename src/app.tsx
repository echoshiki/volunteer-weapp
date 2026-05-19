import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { useLogin } from './hooks/useLogin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
	const { onSilentLogin, isLoggedIn } = useLogin();

	useLaunch(() => {
		if (!isLoggedIn) onSilentLogin();
	});

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default App;
