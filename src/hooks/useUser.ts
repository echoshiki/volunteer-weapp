import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
	getUserInfoAPI,
	updateUserInfoAPI,
	submitApplyReviewAPI,
	type UpdatesUserInfoRequest,
	type ApplyVolunteerRequest,
	type ApplyInstitutionRequest,
	getApplyHistoryListAPI,
	ApplyHistoryRequest,
} from '@/services/user';
import { useAuthStore } from '@/store/auth';
import Taro from '@tarojs/taro';
import { useState, useEffect, useMemo } from 'react';
import { uploadImageAPI } from '@/services/upload';
import { formatUserInfo, getInstitutionFormFields, getUserProfileFields, getVolunteerFormFields } from '@/utils/user';
import { useUpload } from './useUpload';
import { delayBack } from '@/utils/common';

/**
 * ============================================================================
 * 获取用户信息 Hook
 * ============================================================================
 */
export const useUser = () => {
	const { updateUserInfo, authStage } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN';

	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const raw = await getUserInfoAPI();
			const data = formatUserInfo(raw);
			updateUserInfo(data);
			return data;
		},
		enabled: isLoggedIn,
		staleTime: 30 * 1000,
	});
};

/**
 * ============================================================================
 * 更新用户信息 Hook
 * ============================================================================
 */
export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	const { userInfo, updateUserInfo } = useAuthStore();

	// 状态：表单数据，从全量用户资料里提取出表单字段数据
	const [form, setForm] = useState<UpdatesUserInfoRequest>(() => getUserProfileFields(userInfo));

	// 执行：统一更新表单字段状态
	const updateField = <K extends keyof UpdatesUserInfoRequest>(field: K, value: UpdatesUserInfoRequest[K]) => {
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
			if (userInfo) updateUserInfo({ ...userInfo, ...form });
			queryClient.invalidateQueries(['user', 'profile']);
			delayBack();
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

/**
 * ============================================================================
 * 志愿者申请认证 Hook
 * ============================================================================
 */
export const useVolunteerApply = (initialData: any = null) => {
	const queryClient = useQueryClient();

	const { triggerUpload, isUploading } = useUpload();

	// 状态：表单数据
	const [form, setForm] = useState<ApplyVolunteerRequest>(() => getVolunteerFormFields(initialData));

	// 执行：统一更新表单普通字段
	const updateField = <K extends keyof ApplyVolunteerRequest>(field: K, value: ApplyVolunteerRequest[K]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	// Mutation：提交请求
	const mutation = useMutation({
		mutationFn: submitApplyReviewAPI,
		onSuccess: () => {
			Taro.showToast({ title: '申请提交成功', icon: 'success' });
			// 使认证状态及明细接口缓存失效
			queryClient.invalidateQueries({ queryKey: ['apply', 'detail'] });
			queryClient.invalidateQueries({ queryKey: ['apply', 'history'] });
			delayBack();
		},
	});

	// 执行：提交前表单校验
	const handleSave = () => {
		if (!form.realName?.trim()) return Taro.showToast({ title: '请输入真实姓名', icon: 'none' });
		if (!form.idCard?.trim()) return Taro.showToast({ title: '请输入身份证号', icon: 'none' });
		if (!form.phone?.trim()) return Taro.showToast({ title: '请输入联系电话', icon: 'none' });
		if (!form.provinceCode) return Taro.showToast({ title: '请选择常住地区', icon: 'none' });
		if (!form.idCardFront) return Taro.showToast({ title: '请上传身份证人像面', icon: 'none' });
		if (!form.idCardBack) return Taro.showToast({ title: '请上传身份证国徽面', icon: 'none' });

		// 严格类型保护，最终提交
		mutation.mutate(form);
	};

	return {
		form,
		updateField,
		handleSave,
		isSubmitting: mutation.isLoading,
	};
};

/**
 * ============================================================================
 * 服务机构入驻认证 Hook
 * ============================================================================
 */
export const useInstitutionApply = (initialData: any = null) => {
	const queryClient = useQueryClient();

	// 状态：表单数据
	const [form, setForm] = useState<ApplyInstitutionRequest>(() => getInstitutionFormFields(initialData));

	const updateField = <K extends keyof ApplyInstitutionRequest>(field: K, value: ApplyInstitutionRequest[K]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const mutation = useMutation({
		mutationFn: submitApplyReviewAPI,
		onSuccess: () => {
			Taro.showToast({ title: '申请提交成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['apply', 'detail'] });
			queryClient.invalidateQueries({ queryKey: ['apply', 'history'] });
			delayBack();
		},
	});

	const handleSave = () => {
		if (!form.institutionName?.trim()) return Taro.showToast({ title: '请输入机构名称', icon: 'none' });
		if (!form.orgCode?.trim()) return Taro.showToast({ title: '请输入信用代码或注册号', icon: 'none' });
		if (!form.legalPerson?.trim()) return Taro.showToast({ title: '请输入法人姓名', icon: 'none' });
		if (!form.phone?.trim()) return Taro.showToast({ title: '请输入机构联系电话', icon: 'none' });
		if (!form.provinceCode) return Taro.showToast({ title: '请选择机构所在地', icon: 'none' });
		if (!form.orgCodeCertUrl) return Taro.showToast({ title: '请上传机构营业执照', icon: 'none' });
		if (!form.realName) return Taro.showToast({ title: '请输入负责人姓名', icon: 'none' });
		if (!form.idCard) return Taro.showToast({ title: '请输入负责人身份证号码', icon: 'none' });
		if (!form.idCardFront) return Taro.showToast({ title: '请上传负责人身份证正面', icon: 'none' });
		if (!form.idCardBack) return Taro.showToast({ title: '请上传负责人身份证反面', icon: 'none' });
		mutation.mutate(form);
	};

	return {
		form,
		updateField,
		handleSave,
		isSubmitting: mutation.isLoading,
	};
};

export const useApplyHistory = (params: Omit<ApplyHistoryRequest, 'pageNum' | 'pageSize'>) => {
	return useInfiniteQuery({
		queryKey: ['apply', 'history', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getApplyHistoryListAPI({
				...params,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
	});
};
