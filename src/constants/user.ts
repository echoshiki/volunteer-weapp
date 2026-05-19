import { UserIdentity } from '@/types/user';
import { ThemeVariant } from '@/types/common';

/** 用户身份状态 UI 配置字典 */
export const USER_IDENTITY_MAP: Record<UserIdentity, { label: string; variant: ThemeVariant }> = {
	user: { label: '普通用户', variant: 'primary' },
	volunteer: { label: '志愿者', variant: 'success' },
	institution: { label: '机构人员', variant: 'warning' },
};
