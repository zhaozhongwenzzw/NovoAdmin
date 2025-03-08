import { login, type loginReqType } from "@/api/login";
import { getPermissions } from "@/api/permissions";
import { StorageEnum } from "@/types/enum/enum";
import type { UserInfo } from "@/types/user";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
	userInfo: Partial<UserInfo>;
	userToken: string;
	actions: {
		setUserInfo: (userInfo: Partial<UserInfo>) => void;
		setUserToken: (token: string) => void;
		clearUserInfoAndToken: () => void;
	};
}

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: "",
			permissions: [],
			actions: {
				setUserInfo: (userInfo) => set({ userInfo }),
				setUserToken: (token) => set({ userToken: token }),
				clearUserInfoAndToken: () => set({ userInfo: {}, userToken: "" }),
			},
		}),
		{
			name: "userStore",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserPermissions = () => useUserStore((state) => state.userInfo.permissions);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const navigatge = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();
	const getPermissionsVo = async () => {
		const res = await getPermissions();
		if (res.code !== 200) {
			message.error(res.message);
			return;
		}
		setUserInfo(res.data);

		// 始终跳转到根路由，让根路由的SmartRedirect组件负责后续导航
		navigatge("/", { replace: true });
	};
	const signIn = async (data: loginReqType) => {
		const res = await login(data);
		if (res.code !== 200) {
			message.error(res.message);
			return;
		}
		const { access_token } = res.data;
		setUserToken(access_token);
		getPermissionsVo();
		message.success("登陆成功!请稍后...");
	};

	return signIn;
};
export default useUserStore;
