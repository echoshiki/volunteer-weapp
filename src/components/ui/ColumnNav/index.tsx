import { View, Text, Button } from '@tarojs/components';

export interface ColumnNavProps {
	icon: string;
	label: string;
	border?: boolean;
	type?: 'contact' | 'phone';
	onClick?: () => void;
}

/**
 * 条目类型的导航组件，适用于设置页、个人中心等场景的功能列表
 */
export const ColumnNav = ({ icon, label, border = true, type, onClick }: ColumnNavProps) => (
	<Button
		className={`flex text-left bg-white items-center gap-3 px-3 py-4 transition-colors after:border-0 leading-1 text-base ${border ? 'border-b border-gray-100' : ''}`}
		onClick={onClick}
		openType={type === 'contact' ? 'contact' : undefined}
	>
		<View className={`${icon} size-6 text-text-body`} />
		<Text className="flex-1 text-text-body text-sm">{label}</Text>
		<View className="icon-[ph--caret-right-thin] w-5 h-5 text-text-muted" />
	</Button>
);
