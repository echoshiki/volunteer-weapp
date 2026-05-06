/**
 * 登陆阶段状态机
 * @param UNLOGIN 未登录
 * @param NEED_BIND_PHONE 需要绑定手机号
 * @param LOGGED_IN 已登录
 */
export type AuthStage = 'UNLOGIN' | 'NEED_BIND_PHONE' | 'LOGGED_IN';

/**
 * 用户信息
 * @param userId 用户ID
 * @param nickName 用户昵称
 * @param sex 性别，0代表男，1代表女，2代表未知
 * @param phonenumber 联系电话
 * @param birthday 生日
 * @param email 邮箱
 * @param identity 身份标识，user表示普通用户，volunteer表示志愿者，institution表示机构
 * @param points 用户总积分
 * @param duration 志愿活动总时长
 * @param reviewId 审核信息id
 * @param provinceCode 省行政编码
 * @param provinceName 省名称
 * @param cityCode 市行政编码
 * @param cityName 市名称
 * @param districtCode 区行政编码
 * @param districtName 区名称
 * @param parentId 区域坐标父级id（大区id）
 * @param parentName 区域坐标父级名称
 * @param regionId 区域坐标id
 * @param regionName 小区名称
 */
export interface UserInfo {
	userId?: number;
	nickName?: string;
	sex?: string;
	phonenumber?: string;
	birthday?: string;
	email?: string;
	identity?: string;
	points: number;
	duration: number;
	reviewId: number;
	provinceCode?: number;
	provinceName?: string;
	cityCode?: number;
	cityName?: string;
	districtCode?: number;
	districtName?: string;
	parentId?: number;
	parentName?: string;
	regionId?: number;
	regionName?: string;
}
