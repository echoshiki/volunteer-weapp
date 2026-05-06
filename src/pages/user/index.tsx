import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';

export default function User() {
	useLoad(() => {
		console.log('Page loaded.');
	});

	return (
		<View className="index">
			<Text>Hello world!</Text>
		</View>
	);
}
