import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { useLogin } from './hooks/useLogin';
import './app.css';

function App({ children }: PropsWithChildren<any>) {
	const { onSilentLogin, isLoggedIn } = useLogin();

	useLaunch(() => {
		if (!isLoggedIn) onSilentLogin();
	});

	return children;
}

export default App;
