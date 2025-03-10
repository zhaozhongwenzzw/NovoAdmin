import type { MenuType } from "@/types/enum/router";
import type { AnimationType } from "@/components/animate/types";

export interface UserInfo {
	id: string;
	email: string;
	username: string;
	password?: string;
	avatar?: string;
	role?: Role;
	permissions: Permission[];
}

export interface Permission {
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: MenuType;
	path: string;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	hideTab?: boolean;
	frameSrc?: URL;
	newFeature?: boolean;
	children?: Permission[];
	inAnimation?: AnimationType;
	outAnimation?: AnimationType;
}

export interface Role {
	id: string;
	name: string;
	label: string;
	order?: number;
	desc?: string;
	permission?: Permission[];
}

export enum UserStatus {
	Enabled = 1,
	Disabled = 0,
}
