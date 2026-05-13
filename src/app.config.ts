export default defineAppConfig({
	pages: [
		'pages/home/index',
		'pages/activity/list/index',
		'pages/activity/detail/index',
		'pages/demand/index',
		'pages/demand/detail/index',
		'pages/job/index',
		'pages/job/detail/index',
		'pages/job/enterprise/index',
		'pages/user/index',
		'pages/login/index',
	],
	window: {
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
		navigationBarTitleText: 'WeChat',
		navigationBarTextStyle: 'black',
	},
	tabBar: {
		list: [
			{
				iconPath: 'assets/icons/home.png',
				selectedIconPath: 'assets/icons/home_fill.png',
				pagePath: 'pages/home/index',
				text: '首页',
			},
			{
				iconPath: 'assets/icons/activity.png',
				selectedIconPath: 'assets/icons/activity_fill.png',
				pagePath: 'pages/activity/list/index',
				text: '志愿活动',
			},
			{
				iconPath: 'assets/icons/demand.png',
				selectedIconPath: 'assets/icons/demand_fill.png',
				pagePath: 'pages/demand/index',
				text: '服务大厅',
			},
			{
				iconPath: 'assets/icons/job.png',
				selectedIconPath: 'assets/icons/job_fill.png',
				pagePath: 'pages/job/index',
				text: '求职',
			},
			{
				iconPath: 'assets/icons/user.png',
				selectedIconPath: 'assets/icons/user_fill.png',
				pagePath: 'pages/user/index',
				text: '我的',
			},
		],
		color: '#3a3a3a',
		selectedColor: '#EA3323',
		backgroundColor: '#fff',
		borderStyle: 'white',
	},
});
