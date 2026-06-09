/** 志愿者协会核心实体模型 */
export interface AssociationItem {
	associationId: number;
	associationName: string;
	leader: string;
	phone: string;
	email: string;
	logo: string;
	introduction: string;
	associationStory: string;
	associationCreateTime: string;
	provinceCode: number;
	cityCode: number;
	districtCode: number;
	tenantId: number;
	provinceName: string;
	cityName: string;
	districtName: string;
	tenantName: string;
	address?: string;
}
