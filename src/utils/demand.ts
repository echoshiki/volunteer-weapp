import { PublishDemandRequest } from '@/services/demand';
import { DemandItem } from '@/types/demand';

/** 将需求单详情数据转换为可提交表单数据 */
export const demandItemToFormData = (
	item: DemandItem,
): Partial<PublishDemandRequest> & { tenantName: string } => ({
	demandName: item.demandName,
	categoryId: item.categoryId,
	tagIds: item.tags.map((t) => t.tagId),
	content: item.content,
	provinceCode: item.provinceCode,
	cityCode: item.cityCode,
	districtCode: item.districtCode,
	tenantId: item.tenantId,
	tenantName: item.tenantName,
	address: item.address,
	name: item.name,
	phone: item.phone,
	emergencyCall: item.emergencyCall,
	charge: item.charge,
	minMoney: item.minMoney,
	maxMoney: item.maxMoney,
	isRecommend: item.isRecommend,
});
