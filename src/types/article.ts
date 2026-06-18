/** 文章类型 */
export interface ArticleItem {
	articleId: number;
	title: string;
	imgPath: string;
	content: string;
	author: string;
	createTime: string;
	summary?: string;
}
