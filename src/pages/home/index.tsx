import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';

export default function HomePage() {
	useLoad(() => {
		console.log('Page loaded.');
	});

	return (
		<View className="index">
			<Text>Hello world!</Text>
			<View className="icon-[ph--align-top-simple-light] w-5 h-5" />
		</View>
	);
}
