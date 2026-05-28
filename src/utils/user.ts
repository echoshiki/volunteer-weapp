import { ApplyReview, UserInfo } from '@/types/user';
import {
	UpdatesUserInfoRequest,
	ApplyVolunteerRequest,
	ApplyInstitutionRequest,
} from '@/services/user';

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
 * 用户资料数据转换器
 */
export const formatUserInfo = (data: UserInfo): UserInfo => ({
	...data,
	nickName: data.nickName || EMPTY_PROFILE.nickName,
	avatar: data.avatar || EMPTY_PROFILE.avatar,
	sex: data.sex || EMPTY_PROFILE.sex,
	birthday: data.birthday?.split(' ')[0] || EMPTY_PROFILE.birthday,
	provinceCode: data.provinceCode ?? EMPTY_PROFILE.provinceCode,
	cityCode: data.cityCode ?? EMPTY_PROFILE.cityCode,
	districtCode: data.districtCode ?? EMPTY_PROFILE.districtCode,
	address: data.address || EMPTY_PROFILE.address,
});

/**
 * 用户资料表单字段提取器
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

/**
 * 志愿者申请表单初始数据
 */
export const EMPTY_VOLUNTEER_FORM: ApplyVolunteerRequest = {
	reviewType: 1,
	realName: '',
	idCard: '',
	phone: '',
	provinceCode: 0,
	cityCode: 0,
	districtCode: 0,
	address: '',
	idCardFront: '',
	idCardBack: '',
};

/**
 * 志愿者表单字段提取器
 */
export const getVolunteerFormFields = (data: ApplyReview | null): ApplyVolunteerRequest => {
	if (!data) return EMPTY_VOLUNTEER_FORM;
	return {
		...EMPTY_VOLUNTEER_FORM,
		realName: data.realName ?? EMPTY_VOLUNTEER_FORM.realName,
		idCard: data.idCard ?? EMPTY_VOLUNTEER_FORM.idCard,
		phone: data.phone ?? EMPTY_VOLUNTEER_FORM.phone,
		provinceCode: data.provinceCode ?? EMPTY_VOLUNTEER_FORM.provinceCode,
		cityCode: data.cityCode ?? EMPTY_VOLUNTEER_FORM.cityCode,
		districtCode: data.districtCode ?? EMPTY_VOLUNTEER_FORM.districtCode,
		address: data.address ?? EMPTY_VOLUNTEER_FORM.address,
		idCardFront: data.idCardFront ?? EMPTY_VOLUNTEER_FORM.idCardFront,
		idCardBack: data.idCardBack ?? EMPTY_VOLUNTEER_FORM.idCardBack,
	};
};

/**
 * 机构表单初始默认信息
 */
export const EMPTY_INSTITUTION_FORM: ApplyInstitutionRequest = {
	reviewType: 2,
	institutionName: '',
	legalPerson: '',
	legalPersonPhone: '',
	realName: '',
	idCard: '',
	idCardFront: '',
	idCardBack: '',
	orgCode: '',
	orgCodeCertUrl: '',
	phone: '',
	provinceCode: 0,
	cityCode: 0,
	districtCode: 0,
	address: '',
};

/**
 * 机构表单字段提取器
 */
export const getInstitutionFormFields = (data: ApplyReview | null): ApplyInstitutionRequest => {
	if (!data) return EMPTY_INSTITUTION_FORM;
	return {
		...EMPTY_INSTITUTION_FORM,
		institutionName: data.institutionName ?? EMPTY_INSTITUTION_FORM.institutionName,
		legalPerson: data.legalPerson ?? EMPTY_INSTITUTION_FORM.legalPerson,
		legalPersonPhone: data.legalPersonPhone ?? EMPTY_INSTITUTION_FORM.legalPersonPhone,
		realName: data.realName ?? EMPTY_INSTITUTION_FORM.realName,
		idCard: data.idCard ?? EMPTY_INSTITUTION_FORM.idCard,
		idCardFront: data.idCardFront ?? EMPTY_INSTITUTION_FORM.idCardFront,
		idCardBack: data.idCardBack ?? EMPTY_INSTITUTION_FORM.idCardBack,
		orgCode: data.orgCode ?? EMPTY_INSTITUTION_FORM.orgCode,
		orgCodeCertUrl: data.orgCodeCertUrl ?? EMPTY_INSTITUTION_FORM.orgCodeCertUrl,
		phone: data.phone ?? EMPTY_INSTITUTION_FORM.phone,
		provinceCode: data.provinceCode ?? EMPTY_INSTITUTION_FORM.provinceCode,
		cityCode: data.cityCode ?? EMPTY_INSTITUTION_FORM.cityCode,
		districtCode: data.districtCode ?? EMPTY_INSTITUTION_FORM.districtCode,
		address: data.address ?? EMPTY_INSTITUTION_FORM.address,
	};
};
