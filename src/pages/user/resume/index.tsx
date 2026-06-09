import { useState, useEffect } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import {
	Page,
	Cell,
	Heading,
	Button,
	Loading,
	FormItem,
	FileUploader,
	Alert,
} from '@/components/ui';
import { useResumeActions, useResumeDetail } from '@/hooks/useJob';
import { useUpload } from '@/hooks/useUpload';
import { ResumeFileItem } from '@/types/job';

type ResumePageMode = 'create' | 'view' | 'edit';

export default function MyResumePage() {
	const { params } = useRouter();
	const [mode, setMode] = useState<ResumePageMode>((params.mode as ResumePageMode) || 'view');

	const { data: detail, isLoading: isDetailLoading, error } = useResumeDetail();
	const { createResume, updateResume, isActionPending } = useResumeActions();
	const { triggerUpload, isUploading } = useUpload();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [attachedFile, setAttachedFile] = useState<ResumeFileItem | null>(null);

	// 如果后端返回错误直接切换成创建模式
	useEffect(() => {
		if (error || (!isDetailLoading && !detail)) setMode('create');
	}, [error, detail, isDetailLoading]);

	// 表单数据回显
	useEffect(() => {
		if ((mode === 'view' || mode === 'edit') && detail) {
			setName(detail.applicantName);
			setPhone(detail.applicantPhone);
			setEmail(detail.applicantEmail);
			if (detail.volunteerFile && detail.volunteerFile.length > 0)
				setAttachedFile(detail.volunteerFile[0]);
		}
	}, [detail, mode]);

	// 表单提交核心拦截器
	const handleSubmit = () => {
		if (!name.trim()) return Taro.showToast({ title: '请输入姓名', icon: 'none' });
		if (!/^1[3-9]\d{9}$/.test(phone))
			return Taro.showToast({ title: '手机号不正确', icon: 'none' });
		if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))
			return Taro.showToast({ title: '邮箱格式不正确', icon: 'none' });
		if (!attachedFile) return Taro.showToast({ title: '请上传简历附件', icon: 'none' });

		if (mode === 'create') {
			createResume.mutate({
				applicantName: name,
				applicantPhone: phone,
				applicantEmail: email,
				volunteerFile: [attachedFile],
			});
		} else if (mode === 'edit') {
			updateResume.mutate({
				resumeId: detail?.resumeId || 0,
				applicantName: name,
				applicantPhone: phone,
				applicantEmail: email,
				volunteerFile: [
					{
						...attachedFile,
						fileId: attachedFile.fileId || detail?.volunteerFile?.[0]?.fileId,
					},
				],
			});
		}
	};

	if (isDetailLoading && !error) return <Loading title="正在加载求职名片..." />;

	const isReadonly = mode === 'view';

	return (
		<Page className="pb-10">
			<View className="container-x py-4 flex flex-col gap-4">
				{/* 审核状态提示条（仅在查看状态下，且后端返回了状态时显示） */}
				{isReadonly && detail?.reviewStatus && (
					<View
						className={`p-4 rounded-xl flex items-center gap-3 ${
							detail.reviewStatus === 'approved'
								? 'bg-green-50 text-green-600'
								: detail.reviewStatus === 'rejected'
									? 'bg-red-50 text-red-600'
									: 'bg-orange-50 text-orange-600'
						}`}
					>
						<View
							className={`size-5 ${
								detail.reviewStatus === 'approved'
									? 'icon-[ph--check-circle-fill]'
									: detail.reviewStatus === 'rejected'
										? 'icon-[ph--x-circle-fill]'
										: 'icon-[ph--clock-fill]'
							}`}
						/>
						<View className="flex-1">
							<Text className="text-sm font-bold block">
								简历当前状态：
								{detail.reviewStatus === 'approved'
									? '审批通过'
									: detail.reviewStatus === 'rejected'
										? '审批未通过'
										: '资质审核中'}
							</Text>
							<Text className="text-xs opacity-80 block mt-0.5">
								{detail.reviewStatus === 'pending' &&
									'您的简历正在提交社区人才库审核，不影响您直接投递岗位。'}
								{detail.reviewStatus === 'approved' &&
									'您的双端资质已通过平台认证，将获得优先推荐。'}
								{detail.reviewStatus === 'rejected' &&
									'简历部分信息有误，您可以点击下方修改后重新提交。'}
							</Text>
						</View>
					</View>
				)}

				{/* 基本名片表单卡片 */}
				<Cell>
					<Heading
						title={
							isReadonly
								? '我的求职名片'
								: mode === 'create'
									? '新建求职名片'
									: '编辑求职名片'
						}
						subtitle="完善以下基础信息，以便企业HR与您取得联系"
						size="md"
					/>

					<FormItem label="求职姓名">
						<Input
							value={name}
							disabled={isReadonly}
							onInput={(e) => setName(e.detail.value)}
							placeholder="请输入真实姓名"
							className={`flex-1 text-sm ${isReadonly ? 'text-text-muted' : 'text-text-body'}`}
						/>
					</FormItem>

					<FormItem label="联系电话">
						<Input
							type="number"
							maxlength={11}
							value={phone}
							disabled={isReadonly}
							onInput={(e) => setPhone(e.detail.value)}
							placeholder="请输入手机号码"
							className={`flex-1 text-sm ${isReadonly ? 'text-text-muted' : 'text-text-body'}`}
						/>
					</FormItem>

					<FormItem label="电子邮箱">
						<Input
							value={email}
							disabled={isReadonly}
							onInput={(e) => setEmail(e.detail.value)}
							placeholder="请输入常用邮箱"
							className={`flex-1 text-sm ${isReadonly ? 'text-text-muted' : 'text-text-body'}`}
						/>
					</FormItem>
				</Cell>

				{/* 简历附件卡片舱 */}
				<Cell>
					<Heading title="附件简历文档" size="sm" className="mb-3" />
					<View className="flex flex-col gap-3">
						<FileUploader
							value={attachedFile}
							onChange={(file) => setAttachedFile(file)}
							onUpload={(files) => triggerUpload(files)}
							isUploading={isUploading}
							readonly={isReadonly}
							label="选择聊天记录中的简历文件"
							subLabel="支持 .pdf / .doc / .docx 格式文档"
						/>
						<Alert variant="info">
							求职附件一经上传，平台将自动解析录入社区人才大盘进行精准岗位撮合。
						</Alert>
					</View>
				</Cell>

				{/* 吸底动作控制按钮区 */}
				<View className="pt-4">
					{mode === 'view' ? (
						<Button
							variant="primary"
							size="md"
							block
							className="h-12 rounded-full font-bold shadow-md shadow-blue-100"
							onClick={() => setMode('edit')}
						>
							编辑修改名片
						</Button>
					) : (
						<View className="flex flex-col gap-3">
							<Button
								variant="primary"
								size="md"
								block
								loading={isActionPending}
								disabled={isUploading}
								className="h-12 rounded-full font-bold shadow-md shadow-blue-200"
								onClick={handleSubmit}
							>
								{mode === 'create' ? '生成并存入人才库' : '保存修改'}
							</Button>

							{mode === 'edit' && (
								<Button
									variant="ghost"
									size="md"
									block
									className="text-text-muted text-sm font-medium"
									onClick={() => setMode('view')}
								>
									取消编辑
								</Button>
							)}
						</View>
					)}
				</View>
			</View>
		</Page>
	);
}
