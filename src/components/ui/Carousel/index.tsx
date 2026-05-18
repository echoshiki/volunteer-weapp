import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { SwiperData } from '@/types/common';
import { mapsTo } from '@/utils/common';

interface Props {
	/** 轮播图数据 {@link SwiperData} */
	list: SwiperData[];
	/** 是否为全宽度展示 */
	isFull?: boolean;
}

/**
 * 轮播图组件
 * 用于展示一系列图片，支持自动轮播和点击跳转
 */
export const Carousel = ({ list = [], isFull = false }: Props) => {
	if (!list.length) return <View className="swiper-placeholder" />;

	return (
		<View className={`${isFull ? 'p-0' : 'px-2 pt-3'}`}>
			<Swiper
				className="h-64"
				indicatorDots
				autoplay
				circular
				indicatorColor="rgba(212, 175, 55, 0.3)"
				indicatorActiveColor="#D4AF37"
			>
				{list.map((item, index) => (
					<SwiperItem key={item.id || index} onClick={() => item.url && mapsTo(item.url)}>
						<View
							className={`w-full h-full shadow-lg bg-card overflow-hidden ${isFull ? 'rounded-none' : 'rounded-card'}`}
						>
							<Image className="w-full h-full" src={item.pic} mode="aspectFill" />
						</View>
					</SwiperItem>
				))}
			</Swiper>
		</View>
	);
};
