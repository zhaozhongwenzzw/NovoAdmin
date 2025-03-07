import { defineConfig } from "vitepress";
import postcss from "../.postcssrc.cjs";

export default defineConfig({
	// 网站标题
	title: "React Admin 文档",
	// 网站描述
	description: "基于 React 18 的现代化管理系统",
	// 部署的基本路径
	base: "/NovoAdmin/",
	// 头部配置
	head: [["link", { rel: "icon", href: "/favicon.ico" }]],

	// 简化 Vite 配置，仅禁用 PostCSS
	vite: {
		css: {
			postcss: postcss,
		},
	},

	// 添加死链接检查配置
	ignoreDeadLinks: true, // 或者使用更精确的配置：
	/*
	ignoreDeadLinks: [
		// 忽略特定的模式
		/^http:\/\/localhost/
	],
	*/

	// 主题配置
	themeConfig: {
		// 导航栏
		nav: [
			{ text: "首页", link: "/" },
			{ text: "指南", link: "/guide/" },
			{ text: "组件", link: "/components/animate" },
			{ text: "GitHub", link: "https://github.com/zhaozhongwenzzw/NovoAdmin.git" },
		],
		// 侧边栏
		sidebar: {
			"/guide/": [
				{
					text: "指南",
					items: [
						{ text: "项目概述", link: "/guide/" },
						{ text: "快速开始", link: "/guide/getting-started" },
						{ text: "项目结构", link: "/guide/project-structure" },
						{ text: "最佳实践", link: "/guide/best-practices" },
					],
				},
			],
			"/components/": [
				{
					text: "组件",
					items: [
						{ text: "动画组件", link: "/components/animate" },
						{ text: "多标签页", link: "/components/multi-tabs" },
						{ text: "表格容器", link: "/components/table-container" },
						{ text: "通知系统", link: "/components/toast" },
					],
				},
			],
		},
		// 社交链接
		socialLinks: [{ icon: "github", link: "https://github.com/zhaozhongwenzzw/NovoAdmin.git" }],
		// 页脚
		footer: {
			message: "使用 VitePress 构建",
			copyright: "© 2024 React Admin Team",
		},
	},
});
