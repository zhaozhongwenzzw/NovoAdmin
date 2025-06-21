import { http } from "@/utils/http";
export interface BaseEnumResponse {
	label: string;
	value: string;
}
export const getRoleEnumList = () => {
	return http.post<BaseEnumResponse[]>("/roles/roleEnum", {}, { isShowNProgress: false, isShowMessage: false });
};

//获取model-tags枚举
export const getModelTag = () => {
	return http.get<BaseEnumResponse[]>(
		"/enum/model-tag",
		{},
		{ isShowNProgress: false, isShowMessage: false, isNotUseSuffixUrl: true },
	);
};
