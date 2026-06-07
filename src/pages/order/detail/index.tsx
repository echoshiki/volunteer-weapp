import { View, Image, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Page, Cell, Heading, Divider, Button, Loading, Empty, Description } from '@/components/ui';
import { useOrderDetail, useOrderActions } from '@/hooks/useOrder';
import { UserIdentityBadge, OrderStatusBadge } from '@/components/biz';
import { getOrderDetailTip } from '@/constants/order';

export default function OrderDetailPage() {
    const { params } = useRouter();
    const orderId = params.id || '';
    
    // 针对从列表快捷动作（如点击列表“立即付款”）直接跳入并触发行为的场景
    const initialAction = params.action || '';

    const { data: order, isLoading } = useOrderDetail(orderId);

    // 动态获取到订单的按钮组
    const actions = useOrderActions(orderId);

    // 页面就绪后，如果是快捷支付导流，自动代触发预支付逻辑
    Taro.useReady(() => {
        if (initialAction === 'pay') actions.runWechatPay.mutate();
    });

    if (isLoading) return <Loading />;
    if (!order) return <Empty title="未找到相关服务订单" />;

    // 视角双端判定：如果当前登录用户的 id 等于订单里抢单人的 userId，则是服务方视角
    const currentUserId = Taro.getStorageSync('user_info')?.userId; 
    const isEmployer = order.userId !== currentUserId; 

    // 动态提取对方的联系资料名片串
    const targetName = isEmployer ? order.name : order.employerName;
    const targetPhone = isEmployer ? order.phone : order.employerPhone;
    const targetAvatar = isEmployer ? order.avatar : '';

    return (
        <Page className="bg-main-bg pb-28">
            
            {/* 一、 顶部高亮身份状态横幅 */}
            <View className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                <View className="flex flex-col gap-1 flex-1 pr-4">
                    <Text className="text-xl font-bold font-num">
                        {getOrderDetailTip(order.status, isEmployer)}
                    </Text>
                    <Text className="text-xs text-blue-100 font-num">服务订单号：{order.orderId}</Text>
                </View>
                <OrderStatusBadge value={order.status} />
            </View>

            <View className="container-x py-4 space-y-4">
                <Cell className="p-4">
                    <Heading title={isEmployer ? '接单服务方资料' : '发单雇主资料'} size="md" className="mb-3" />
                    <View className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <View className="flex items-center gap-3">
                            <Image src={targetAvatar || 'https://placeholder.com/50'} className="size-11 rounded-full bg-gray-200 shrink-0" />
                            <View className="flex flex-col gap-0.5">
                                <View className="flex items-center gap-1.5">
                                    <Text className="text-sm font-bold text-text-title">{targetName}</Text>
                                    {isEmployer && <UserIdentityBadge value={order.identity} />}
                                </View>
                                <Text className="text-xs text-text-muted font-num">{targetPhone}</Text>
                            </View>
                        </View>
                        
                        {/* 原生呼叫核心组件 */}
                        <Button 
                            variant="outline" 
                            size="xs" 
                            icon="icon-[ph--phone-call]" 
                            className="px-3" 
                            onClick={() => Taro.makePhoneCall({ phoneNumber: targetPhone })}
                        >
                            联系对方
                        </Button>
                    </View>
                </Cell>

                {/* 服务履约详细诉求摘要 */}
                <Cell className="p-4 flex flex-col gap-2.5">
                    <Heading title="服务内容明细" size="md" className="mb-1" />
                    <Description label="服务名称" value={order.orderName} />
                    <Description label="服务大类" value={order.categoryName} />
                    <Description label="服务驻地" value={order.address} className="items-start" />
                    <Description 
                        label="服务性质" 
                        value={order.charge ? '平台认证公益单' : '标准商业服务单'} 
                        className={order.charge ? 'text-green-600 font-medium' : ''} 
                    />
                </Cell>

                {/* 交易存证流水与时间审计节点 */}
                <Cell className="p-4 flex flex-col gap-2.5 font-num text-xs">
                    <Heading title="订单审计存证" size="md" className="mb-1" />
                    <Description label="支付模式" value={order.payType === 'online' ? '线上资金担保交易' : '线下当面结算'} />
                    <Description label="应结金额" value={`¥ ${order.orderTotal}`} className="text-orange-500 font-bold text-sm" />
                    <Divider className="my-1.5" />
                    <Description label="创建时间" value={order.createTime || '无'} />
                    <Description label="支付时间" value={order.payTime || '未支付'} />
                    <Description label="完工时间" value={order.completeTime || '未完工'} />
                </Cell>

            </View>

            {/* 吸底多状态多端联动的动作按钮控制中枢 */}
            <View className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe z-50 flex gap-3 justify-end items-center">
                
                {/* 视角一：发单需求方（雇主）履约动作树 */}
                {isEmployer && (
                    <>
                        {order.status === 'pending' && (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => actions.cancelOrder.mutate()}>
                                    取消订单
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="md" 
                                    className="px-6 shadow-sm shadow-red-200" 
                                    loading={actions.isAnyActionPending} 
                                    onClick={() => actions.runWechatPay.mutate()}
                                >
                                    立即微信支付
                                </Button>
                            </>
                        )}
                        {order.status === 'confirming' && (
                            <Button 
                                variant="success" 
                                size="md" 
                                className="w-full shadow-sm shadow-emerald-200" 
                                loading={actions.isAnyActionPending} 
                                onClick={() => actions.confirmComplete.mutate()}
                            >
                                确认完工验收（正式放款）
                            </Button>
                        )}
                        {order.status === 'reviewing' && (
                            <Button 
                                variant="primary" 
                                size="md" 
                                className="w-full shadow-sm shadow-blue-200" 
                                onClick={() => Taro.navigateTo({ url: `/pages/order/comment/index?id=${orderId}` })}
                            >
                                评价此次服务
                            </Button>
                        )}
                    </>
                )}

                {/* 视角二：接单服务方（志愿者/机构）履约动作树 */}
                {!isEmployer && (
                    <>
                        {order.status === 'serving' && (
                            <Button 
                                variant="warning" 
                                size="md" 
                                className="w-full shadow-sm shadow-amber-200" 
                                loading={actions.isAnyActionPending} 
                                onClick={() => actions.startService.mutate()}
                            >
                                已到达现场（开始服务打卡）
                            </Button>
                        )}
                        {order.status === 'serving' && order.payType === 'offline' && (
                            // 针对线下不需要资金代管的订单，在服务状态下，允许服务方直接提交完工申请
                            <Button 
                                variant="primary" 
                                size="md" 
                                className="w-full shadow-sm shadow-blue-200" 
                                loading={actions.isAnyActionPending} 
                                onClick={() => actions.finishService.mutate()}
                            >
                                完成服务（提交雇主确认）
                            </Button>
                        )}
                        {order.status === 'confirming' && (
                            <View className="text-sm text-center w-full text-text-muted italic py-2">
                                已向雇主发起完工申请，等待对方验收中...
                            </View>
                        )}
                    </>
                )}

                {/* 统一种类终结态的纯文本视觉回执 */}
                {order.status === 'completed' && (
                    <View className="text-sm text-center w-full text-green-600 font-medium flex items-center justify-center gap-1 py-2">
                        <View className="icon-[ph--check-circle-fill] size-4" />
                        此单服务已全部圆满结束
                    </View>
                )}
                {order.status === 'cancelled' && (
                    <View className="text-sm text-center w-full text-text-muted py-2">
                        该订单已被取消关闭
                    </View>
                )}
            </View>
        </Page>
    );
}