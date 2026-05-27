import { UserIdentity, UserSex } from '@/types/user';
import { ThemeVariant } from '@/types/common';

/** 用户身份状态 UI 配置字典 */
export const USER_IDENTITY_MAP: Record<UserIdentity, { label: string; variant: ThemeVariant }> = {
	user: { label: '普通用户', variant: 'primary' },
	volunteer: { label: '志愿者', variant: 'success' },
	institution: { label: '机构人员', variant: 'warning' },
};

/** 性别选项 */
export const SEX_OPTIONS: { label: '男' | '女' | '未知'; value: UserSex }[] = [
	{ label: '男', value: '0' },
	{ label: '女', value: '1' },
	{ label: '未知', value: '2' },
];
