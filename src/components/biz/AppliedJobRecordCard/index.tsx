import { View, Text, Image } from '@tarojs/components';
import { AppliedJobItem } from '@/types/job';
import { JobApplyStatusBadge } from '../BizBadge';

export interface AppliedJobRecordCardProps {
	/** 岗位投递记录 */
	record: AppliedJobItem;
	onClick?: (jobId: number) => void;
	className?: string;
}

export const AppliedJobRecordCard = ({
	record,
	onClick,
	className = '',
}: AppliedJobRecordCardProps) => {
	return (
		<View
			className={`w-full bg-white p-4 rounded-xl flex items-center justify-between active:bg-gray-50/60 transition-colors ${className}`}
			onClick={() => onClick?.(record.id)}
		>
			<View className="flex items-center gap-3 min-w-0 flex-1 pr-4">
				<Image
					src={record.logo}
					className="size-12 rounded-card bg-gray-50 shrink-0 border border-gray-100/60"
					mode="aspectFit"
				/>

				{/* 岗位与企业文本垂直排列 */}
				<View className="flex flex-col gap-1 min-w-0">
					<Text className="text-base font-bold text-text-title truncate">
						{record.title}
					</Text>
					<Text className="text-xs text-text-muted truncate">
						{record.enterprisesName}
					</Text>
				</View>
			</View>

			{/* 右侧：求职审核状态回执 */}
			<View className="shrink-0 flex items-center gap-1.5">
				<JobApplyStatusBadge value={record.jobStatus} />
				<View className="icon-[ph--caret-right] size-4 text-gray-300" />
			</View>
		</View>
	);
};
