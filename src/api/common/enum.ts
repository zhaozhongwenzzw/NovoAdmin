import { http } from "@/utils/http";
export interface BaseEnumResponse {
	label: string;
	value: string;
}
export const getRoleEnumList = () => {
	return http.post<BaseEnumResponse[]>("/roles/roleEnum", {}, { isShowNProgress: false, isShowMessage: false });
};
