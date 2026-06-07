import { OrderStatus } from '@/types/order';
import { ThemeVariant } from '@/types/common';

interface StatusConfigItem {
    label: string;
    variant: ThemeVariant;
    /** 通用状态描述 */
    tip?: string;
    /** 需求方专用的状态描述 */
    employerTip?: string;
    /** 服务方专用的状态描述 */
    providerTip?: string;
}

/** 需求订单状态 UI 配置字典 */
export const ORDER_STATUS_MAP: Record<OrderStatus, StatusConfigItem> = {
    pending: { 
        label: '待支付', 
        variant: 'primary',
        tip: '等待雇主支付资金' 
    },
    serving: { 
        label: '待服务', 
        variant: 'primary',
        employerTip: '服务方正在火速赶来...',
        providerTip: '您已成功接单，请尽快上门服务'
    },
    confirming: { 
        label: '待验收', 
        variant: 'info',
        employerTip: '服务方已完工，请您验收',
        providerTip: '已提交完工，等待雇主验收'
    },
    reviewing: { 
        label: '待评价', 
        variant: 'warning',
        employerTip: '服务已圆满结束，去评价吧',
        providerTip: '服务已结束，等待雇主评价'
    },
    completed: { 
        label: '已完成', 
        variant: 'success',
        tip: '订单已圆满完成' 
    },
    refunding: { 
        label: '待退款', 
        variant: 'danger',
        tip: '退款审核中' 
    },
    cancelled: { 
        label: '已取消', 
        variant: 'secondary',
        tip: '订单已取消关闭' 
    },
};

/** 动态获取状态描述 */
export const getOrderDetailTip = (status: OrderStatus, isEmployer: boolean): string => {
    const config = ORDER_STATUS_MAP[status];
    if (!config) return '未知状态';
    
    // 如果有分端提示，根据角色返回；否则返回通用提示
    if (isEmployer && config.employerTip) return config.employerTip;
    if (!isEmployer && config.providerTip) return config.providerTip;
    
    return config.tip || config.label;
};
