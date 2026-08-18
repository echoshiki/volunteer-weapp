import { View, Text } from '@tarojs/components';
import { JobItem } from '@/types/job';
import { mapsTo } from '@/utils/common';

export interface JobCardProps {
	/** 岗位数据对象 */
	job: JobItem;
	/** 自定义类名（比如控制下边距） */
	className?: string;
}

/**
 * 岗位列表项卡片
 */
export const JobCard = ({ job, className }: JobCardProps) => {
	return (
		<View className={className} onClick={() => mapsTo(`/pages/job/detail/index?id=${job.id}`)}>
			{/* 头部：标题与薪资 */}
			<View className="flex justify-between items-start mb-2">
				<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-2">{job.title}</Text>
				<Text className="text-primary font-bold text-base whitespace-nowrap">{job.salaryBudget}k</Text>
			</View>

			{/* 标签区 */}
			<View className="flex items-center gap-2 mb-4">
				<Text className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">招 {job.hireCount} 人</Text>
				{job.jobTitle && (
					<Text className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">{job.jobTitle}</Text>
				)}
			</View>

			{/* 企业信息底栏 */}
			<View className="flex items-center gap-2 border-t border-gray-50 pt-3 text-xs text-text-muted">
				<View className="icon-[ph--buildings] w-4 h-4 shrink-0" />
				<Text className="truncate flex-1">{job.enterprisesName}</Text>
				<Text className="text-primary shrink-0">查看详情 &gt;</Text>
			</View>
		</View>
	);
};
