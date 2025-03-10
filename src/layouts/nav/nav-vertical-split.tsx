import { Menu, Layout } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserInfo } from "@/store/userStore";
import { useMemo, useState, useEffect } from "react";
import type { MenuProps, GetProp } from "antd";
import type { Permission } from "@/types/user";
import NavLogo from "./nav-logo";
import { NAV_FIRST_WIDTH, NAV_WIDTH } from "../config";
import { darkColorTokens } from "@/configs/theme/token/color";
import { useSettingActions, useSettings } from "@/store/settingStore";
import { Iconify } from "@/components/icon";
import styled from "styled-components";
import { ThemeLayout, ThemeMode } from "@/types/enum/setting";
import { cn } from "@/utils/cn";
import { useOpenRoutePath } from "@/router/hooks/user-open-route";
type MenuItem = GetProp<MenuProps, "items">[number];

const { Sider } = Layout;

const NavVertical = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const userInfo = useUserInfo();
	const settings = useSettings();
	const openRoutePath = useOpenRoutePath();
	const { setSettings } = useSettingActions();
	const [collapsed, setCollapsed] = useState(true);
	const { themeLayout } = settings;

	useEffect(() => {
		setCollapsed(themeLayout === ThemeLayout.VerticalSplitMini);
	}, [themeLayout]);
	const layoutChange = (collapsed: boolean) => {
		setCollapsed(!collapsed);
		setSettings({
			...settings,
			themeLayout: !collapsed ? ThemeLayout.VerticalSplitMini : ThemeLayout.VerticalSplit,
		});
	};
	// 获取默认展开的菜单keys
	const [firstOpenKey, setFirstOpenKey] = useState<string>("");
	const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([]);
	useEffect(() => {
		setFirstOpenKey(openRoutePath?.length > 0 ? openRoutePath[0].path : "");
		setDefaultOpenKeys(openRoutePath?.filter((item) => item.path !== firstOpenKey).map((item) => item.path));
	}, [location.pathname]);

	const menuItems = useMemo(() => {
		const generateMenuItems = (permissions: Permission[] = []): MenuItem[] => {
			return permissions.map((permission) => ({
				key: permission.path,
				label: permission.name,
				icon: <Iconify className="text-xl ml-[-5px]" icon={permission.icon || "solar:file-outline"} />,
				children: permission.children?.length ? generateMenuItems(permission.children) : null,
				hidden: permission.hide,
			}));
		};
		return generateMenuItems(userInfo.permissions);
	}, [userInfo.permissions]);

	const activeMenuItems = useMemo(() => {
		const activeItems = menuItems.find((item) => item?.key === firstOpenKey);
		if (!activeItems || !("children" in activeItems)) return [];
		return activeItems.children;
	}, [menuItems, firstOpenKey]);

	const darkSidebar = useMemo(() => {
		if (settings.themeMode === ThemeMode.Dark) {
			return settings.darkSidebar ? "light" : "dark";
		}
		return settings.darkSidebar ? "dark" : "light";
	}, [settings.themeMode, settings.darkSidebar]);

	const changeMenu = (item: MenuItem) => {
		setFirstOpenKey(item?.key as string);
		// 递归查找最后一级子菜单
		const findLastChild = (menuItem: MenuItem): MenuItem => {
			if ((menuItem && !("children" in menuItem)) || !menuItem?.children?.length) {
				return menuItem;
			}
			// 继续查找第一个子菜单的最后一级
			return findLastChild(menuItem.children[0]);
		};
		// 如果item有children，则导航到第一个子菜单的最后一级
		const targetItem = findLastChild(item);
		navigate(targetItem?.key as string);
	};

	return (
		<div className={cn("!fixed left-[0px] top-0 flex h-full")}>
			<NavFirst $themeMode={settings.themeMode} $isDarkSidebar={settings.darkSidebar}>
				<NavLogo collapsed={true} />
				{menuItems?.map((item: MenuItem) => {
					return (
						<NavFirstItem
							onClick={() => changeMenu(item)}
							key={item?.key}
							$isActive={firstOpenKey === item?.key}
							$isDarkTheme={settings.themeMode === ThemeMode.Dark || settings.darkSidebar}
						>
							{item && "icon" in item && item.icon}
							<span>{item && "label" in item && item.label}</span>
						</NavFirstItem>
					);
				})}
			</NavFirst>
			<Sider
				trigger={null}
				key={collapsed ? "collapsed" : "expanded"}
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
						items={activeMenuItems}
						onClick={({ key }: { key: string }) => navigate(key)}
						className="!border-none"
					/>
					<CollapseButton $collapsed={collapsed} onClick={() => layoutChange(collapsed)}>
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
	background-color: ${(props) => (props.$isDarkSidebar ? (props.$themeMode === "light" ? darkColorTokens.background.default : "var(--colors-background-paper)") : "var(--colors-background-default)")};
	border-right: 1px dashed rgba(var(--colors-palette-gray-500Channel), 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const NavFirstItem = styled.div<{ $isActive: boolean; $isDarkTheme?: boolean }>`
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10px;
	border-bottom: 1px dashed rgba(var(--colors-palette-gray-500Channel), 0.1);
	box-sizing: border-box;
	border-radius: 4px;
	transition: all 0.3s ease;

	/* 文字颜色 - 根据激活状态和主题设置 */
	color: ${(props) => {
		if (props.$isActive) {
			return "var(--colors-palette-primary-default)"; // 激活状态总是使用主题色
		}
		return props.$isDarkTheme
			? "rgba(255, 255, 255, 0.65)" // 暗色主题下的次要文本
			: "var(--colors-text-secondary)"; // 亮色主题下的次要文本
	}};

	/* 背景颜色 - 根据激活状态和主题设置 */
	background-color: ${(props) => {
		if (props.$isActive) {
			return props.$isDarkTheme
				? "rgba(var(--colors-palette-primary-defaultChannel), 0.15)" // 暗色主题下的激活背景
				: "var(--colors-antd-primary-color0)"; // 亮色主题下的激活背景
		}
		return "transparent"; // 未激活状态下透明背景
	}};

	/* 悬停效果 - 根据主题调整 */
	&:hover {
		background-color: ${(props) => {
			if (props.$isActive) {
				return props.$isDarkTheme
					? "rgba(255, 255, 255, 0.08)" // 暗色主题下的悬停背景
					: "rgba(var(--colors-palette-gray-500Channel), 0.1)"; // 亮色主题下的悬停背景
			}
			return props.$isDarkTheme
				? "rgba(255, 255, 255, 0.08)" // 暗色主题下的悬停背景
				: "rgba(var(--colors-palette-gray-500Channel), 0.1)"; // 亮色主题下的悬停背景
		}};
		cursor: pointer;
		transform: translateY(-1px);
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
