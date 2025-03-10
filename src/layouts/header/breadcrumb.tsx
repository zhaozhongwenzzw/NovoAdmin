import type React from "react";
import { useMemo } from "react";
import { Breadcrumb, Dropdown, type MenuProps } from "antd";
import type { ItemType as BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Iconify } from "@/components/icon";
import { useRouter, useOpenRoutePath } from "@/router/hooks";

const BreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
`;

const ActiveBreadcrumbItem = styled.span`
  color: var(--primary-color); /* 使用主题的主色调 */
  font-size: 0.8rem;
`;

const BreadcrumbItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  height: 100%;
`;

const HomeIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-right: 4px;
  color: var(--primary-color);

  &:hover {
    opacity: 0.8;
  }
`;

const Breadcrumbs: React.FC = () => {
	const location = useLocation();
	const openRoutePath = useOpenRoutePath();
	const router = useRouter();
	const homepagePath = import.meta.env.VITE_APP_HOMEPAGE || "/";

	const handleHomeClick = () => {
		router.push(homepagePath);
	};

	const items: BreadcrumbItemType[] = useMemo(() => {
		const homeItem: BreadcrumbItemType = {
			key: "home",
			title: (
				<HomeIcon onClick={handleHomeClick} className="h-full">
					<Iconify className="text-xl" icon="mdi:home" />
				</HomeIcon>
			),
		};

		const breadcrumbItems = [homeItem];

		const pathItems = openRoutePath.map((item) => {
			const isActive = item.path === location.pathname;
			const title = isActive ? (
				<ActiveBreadcrumbItem key={item.path}>{item.name}</ActiveBreadcrumbItem>
			) : (
				<BreadcrumbItem key={item.path}>{item.name}</BreadcrumbItem>
			);

			const menu: MenuProps["items"] =
				item.children?.map((child) => ({
					key: child.path,
					label: <BreadcrumbItem onClick={() => router.push(child.path)}>{child.name}</BreadcrumbItem>,
				})) || [];

			return {
				key: item.path,
				title: item.children ? (
					<Dropdown menu={{ items: menu }} placement="bottom" arrow>
						<BreadcrumbItem>{title}</BreadcrumbItem>
					</Dropdown>
				) : (
					title
				),
			};
		});

		return [...breadcrumbItems, ...pathItems];
	}, [location.pathname]);

	return (
		<BreadcrumbWrapper>
			<Breadcrumb
				items={items}
				separator={
					<div className="h-full flex items-center">
						<Iconify icon="gis:point" />
					</div>
				}
			/>
		</BreadcrumbWrapper>
	);
};

export default Breadcrumbs;
