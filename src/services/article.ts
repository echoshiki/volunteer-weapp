import { http } from '@/utils/http';
import { ArticleItem } from '@/types/article';
import { PageRes } from '@/types/common';

/** 文章列表查询入参 */
export interface ArticleQueryParams {
	pageNum?: number;
	pageSize?: number;
}

/**
 * 获取提审专用的文章公告列表
 */
export const getArticleListAPI = (params: ArticleQueryParams) =>
	http.get<PageRes<ArticleItem>>('/volunteer/article/web/list', params);
