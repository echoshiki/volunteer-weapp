export default defineAppConfig({
	pages: [
		'pages/home/index',
		'pages/activity/index',
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
				iconPath: 'assets/tabbar/home.png',
				selectedIconPath: 'assets/tabbar/home_fill.png',
				pagePath: 'pages/home/index',
				text: '首页',
			},
			{
				iconPath: 'assets/tabbar/activity.png',
				selectedIconPath: 'assets/tabbar/activity_fill.png',
				pagePath: 'pages/activity/index',
				text: '志愿活动',
			},
			{
				iconPath: 'assets/tabbar/demand.png',
				selectedIconPath: 'assets/tabbar/demand_fill.png',
				pagePath: 'pages/demand/index',
				text: '服务大厅',
			},
			{
				iconPath: 'assets/tabbar/job.png',
				selectedIconPath: 'assets/tabbar/job_fill.png',
				pagePath: 'pages/job/index',
				text: '求职',
			},
			{
				iconPath: 'assets/tabbar/user.png',
				selectedIconPath: 'assets/tabbar/user_fill.png',
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
