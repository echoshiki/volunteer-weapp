import { UserInfo } from '@/types/user';
import { type UpdatesUserInfoRequest } from '@/services/user';

/**
 * 用户资料数据转换器
 */
export const formatUserInfo = (data: UserInfo): UserInfo => ({
	...data,
	nickName: data.nickName || '微信用户',
	avatar: data.avatar || '',
	sex: data.sex || '1',
	birthday: data.birthday?.split(' ')[0] || '',
	provinceCode: data.provinceCode ?? 0,
	cityCode: data.cityCode ?? 0,
	districtCode: data.districtCode ?? 0,
	address: data.address || '',
});

/**
 * 用户资料表单默认信息
 */
const EMPTY_PROFILE: UpdatesUserInfoRequest = {
	nickName: '微信用户',
	avatar: '',
	sex: '1',
	birthday: '',
	provinceCode: 0,
	cityCode: 0,
	districtCode: 0,
	address: '',
};

/**
 * 用户资料修改参数提取器
 * 从用户全量资料数据中提取出修改页面所需的字段
 */
export const getUserProfileFields = (data: UserInfo | null): UpdatesUserInfoRequest => {
	if (!data) return EMPTY_PROFILE;
	const f = formatUserInfo(data);
	return {
		nickName: f.nickName!,
		avatar: f.avatar!,
		sex: f.sex!,
		birthday: f.birthday!,
		provinceCode: f.provinceCode!,
		cityCode: f.cityCode!,
		districtCode: f.districtCode!,
		address: f.address!,
	};
};
