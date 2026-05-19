import { Badge } from '@/components/ui/Badge';
import { UserIdentity } from '@/types/user';
import { USER_IDENTITY_MAP } from '@/constants/user';

interface Props {
	/** 用户身份 */
	identity?: UserIdentity | string;
	/** 自定义类名 */
	className?: string;
}

export function UserIdentityBadge({ identity, className = '' }: Props) {
	const safeIdentity = (identity || 'user') as UserIdentity;
	const config = USER_IDENTITY_MAP[safeIdentity] || USER_IDENTITY_MAP['user'];

	return (
		<Badge variant={config.variant} className={className}>
			{config.label}
		</Badge>
	);
}
