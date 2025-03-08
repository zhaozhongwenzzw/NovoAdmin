import { Menu, Layout } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserInfo } from "@/store/userStore";
import { useMemo, useState, useEffect } from "react";
import type { MenuProps } from "antd";
import type { Permission } from "@/types/user";
import NavLogo from "./nav-logo";
import { NAV_FIRST_WIDTH, NAV_WIDTH } from "../config";
import { useSettingActions, useSettings } from "@/store/settingStore";
import { Iconify } from "@/components/icon";
import styled from "styled-components";
import { ThemeLayout, ThemeMode } from "@/types/enum/setting";
import { cn } from "@/utils/cn";

const { Sider } = Layout;

const NavVertical = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const userInfo = useUserInfo();
	const settings = useSettings();
	const { setSettings } = useSettingActions();
	const [collapsed, setCollapsed] = useState(true);
	const { themeLayout } = settings;

	// 获取默认展开的菜单keys
	const defaultOpenKeys = useMemo(() => {
		const pathSegments = location.pathname.split("/").filter(Boolean);
		const openKeys: string[] = [];

		// 构建每一级的路径
		let currentPath = "";
		for (const segment of pathSegments) {
			currentPath += `/${segment}`;
			openKeys.push(currentPath);
		}

		return openKeys;
	}, [location.pathname]);
	console.log(defaultOpenKeys);

	// 监听 themeLayout 变化，自动设置 collapsed 状态
	useEffect(() => {
		setCollapsed(themeLayout === ThemeLayout.Mini);
	}, [themeLayout]);

	// 处理折叠状态变化
	const handleCollapse = () => {
		const newCollapsed = !collapsed;
		setCollapsed(newCollapsed);
		setSettings({
			...settings,
			themeLayout: newCollapsed ? ThemeLayout.Mini : ThemeLayout.Vertical,
		});
	};

	const menuItems = useMemo(() => {
		const generateMenuItems = (permissions: Permission[] = []): MenuProps["items"] => {
			return permissions.map((permission) => ({
				key: permission.path,
				label: permission.name,
				icon: permission.icon ? <Iconify className="text-xl ml-[-5px]" icon={permission.icon} /> : null,
				children: permission.children?.length ? generateMenuItems(permission.children) : undefined,
				hidden: permission.hide,
			}));
		};
		return generateMenuItems(userInfo.permissions);
	}, [userInfo.permissions]);

	const darkSidebar = useMemo(() => {
		if (settings.themeMode === ThemeMode.Dark) {
			return settings.darkSidebar ? "light" : "dark";
		}
		return settings.darkSidebar ? "dark" : "light";
	}, [settings.themeMode, settings.darkSidebar]);

	return (
		<div className={cn("!fixed left-[0px] top-0 flex h-full")}>
			<NavFirst $themeMode={settings.themeMode} $isDarkSidebar={settings.darkSidebar}>
				<NavLogo collapsed={true} />
				{menuItems?.map((item) => (
					<NavFirstItem key={item?.key} $isActive={defaultOpenKeys.includes(item?.key)}>
						{item?.icon}
						<span>{item?.label}</span>
					</NavFirstItem>
				))}
			</NavFirst>
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				theme={darkSidebar}
				width={NAV_WIDTH}
				className=" h-screen border-r border-dashed border-border"
			>
				<div className="flex h-full flex-col relative">
					<div className="text-primary text-2xl font-bold text-center mt-4 mb-2">Novo Admin</div>
					<Menu
						mode="inline"
						theme={darkSidebar}
						selectedKeys={[location.pathname]}
						defaultOpenKeys={defaultOpenKeys}
						items={menuItems}
						onClick={({ key }: { key: string }) => navigate(key)}
						className="!border-none"
					/>
					<CollapseButton onClick={handleCollapse} $collapsed={collapsed}>
						<Iconify icon="ep:arrow-left-bold" className="collapse-icon" />
					</CollapseButton>
				</div>
			</Sider>
		</div>
	);
};

export default NavVertical;

const NavFirst = styled.div<{ $themeMode: ThemeMode; $isDarkSidebar: boolean }>`
	width: ${NAV_FIRST_WIDTH}px;
	height: 100%;
	background-color: ${(props) => (props.$isDarkSidebar ? (props.$themeMode === "light" ? "#161c24" : "var(--colors-background-paper)") : "var(--colors-background-default)")};
	border-right: 1px dashed rgba(var(--colors-palette-gray-500Channel), 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const NavFirstItem = styled.div<{ $isActive: boolean }>`
	width: 95%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10px;
	border-bottom: 1px dashed rgba(var(--colors-palette-gray-500Channel), 0.1);
	box-sizing: border-box;
	border-radius: 4px;
	color:${(props) => (props.$isActive ? "var(--colors-palette-primary-default)" : "var(--colors-text-secondary)")};
	background-color: ${(props) => (props.$isActive ? "var(--colors-antd-primary-color0)" : "transparent")};
	&:hover {
		background-color: rgba(var(--colors-palette-gray-500Channel), 0.1);
		cursor: pointer;
	}
`;

const CollapseButton = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  color: var(--colors-text-secondary);
  transition: all 0.2s ease;
  background-color: var(--colors-background-paper);
  border-left: none;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  opacity: 0.6;

  &:hover {
    color: var(--colors-palette-primary-default);
    background-color: var(--colors-background-default);
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
    opacity: 1;

    .collapse-icon {
      transform: ${(props) => (props.$collapsed ? "rotate(180deg) translateX(-2px)" : "rotate(0deg) translateX(-2px)")};
    }
  }

  .collapse-icon {
    font-size: 14px;
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$collapsed ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;
