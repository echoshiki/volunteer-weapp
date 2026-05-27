import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUserInfoAPI, updateUserInfoAPI, type UpdatesUserInfoRequest } from '@/services/user';
import { useAuthStore } from '@/store/auth';
import Taro from '@tarojs/taro';
import { useState, useEffect, useMemo } from 'react';
import { uploadImageAPI } from '@/services/upload';
import { formatUserInfo, getUserProfileFields } from '@/utils/user';

/**
 * 用户信息状态同步 Hook
 * @description 利用 React Query 的 staleTime 机制进行数据保鲜，并在后台默默同步给 Zustand
 */
export const useUser = () => {
	const { updateUserInfo, authStage } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN';

	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const raw = await getUserInfoAPI();
			// 格式化数据
			const data = formatUserInfo(raw);
			updateUserInfo(data);
			return data;
		},
		enabled: isLoggedIn,
		staleTime: 1000 * 60 * 5,
	});
};

/**
 * 更新用户信息
 */
export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	const { userInfo, updateUserInfo } = useAuthStore();

	// 状态：表单数据，从全量用户资料里提取出表单字段数据
	const [form, setForm] = useState<UpdatesUserInfoRequest>(() => getUserProfileFields(userInfo));

	// 执行：统一更新表单字段状态
	const updateField = <K extends keyof UpdatesUserInfoRequest>(
		field: K,
		value: UpdatesUserInfoRequest[K],
	) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	// 执行：获取微信头像并上传
	const onChooseAvatar = async (e: any) => {
		const { avatarUrl } = e.detail;
		if (!avatarUrl) return;

		Taro.showLoading({ title: '上传中...', mask: true });
		try {
			// 将微信临时路径转为远端 URL
			const data = await uploadImageAPI(avatarUrl);
			if (data.list && data.list.length > 0) {
				setForm((prev) => ({ ...prev, avatar: data.list[0].filePath }));
				Taro.showToast({ title: '头像获取成功', icon: 'success' });
			}
		} catch (error) {
			console.error('头像上传失败', error);
		} finally {
			Taro.hideLoading();
		}
	};

	const mutation = useMutation({
		mutationFn: (data: UpdatesUserInfoRequest) => updateUserInfoAPI(data),
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			// 更新本地存储和全局状态
			if (userInfo) updateUserInfo({ ...userInfo, ...form });
			// 使个人中心缓存失效，触发刷新
			queryClient.invalidateQueries(['user', 'profile']);
			setTimeout(() => Taro.navigateBack(), 1500);
		},
	});

	const handleSave = () => {
		if (!form.avatar) return Taro.showToast({ title: '请设置头像', icon: 'none' });
		if (!form.nickName) return Taro.showToast({ title: '请输入昵称', icon: 'none' });
		if (!form.provinceCode) return Taro.showToast({ title: '请选择常住地区', icon: 'none' });
		mutation.mutate(form);
	};

	return {
		form,
		userInfo,
		updateField,
		onChooseAvatar,
		handleSave,
		isSaving: mutation.isLoading,
	};
};
