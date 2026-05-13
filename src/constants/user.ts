import { UserIdentity } from '@/types/user';

/** 兼容 Badge 组件 variant 属性 */
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'gray';

/** 用户身份状态 UI 配置字典 */
export const USER_IDENTITY_MAP: Record<UserIdentity, { label: string; variant: BadgeVariant }> = {
	user: { label: '普通用户', variant: 'primary' },
	volunteer: { label: '志愿者', variant: 'success' },
	institution: { label: '机构人员', variant: 'warning' },
};
