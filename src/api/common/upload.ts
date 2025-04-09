import { http } from "@/utils/http";

export interface UploadResponse {
	url: string;
	path: string;
}

/**
 * 上传文件
 * @param file 文件对象
 * @param folderPath 文件夹路径，默认为 '/blog'
 */
export const uploadFile = (file: File, folderPath = "/blog") => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("folderPath", folderPath);

	return http.post<UploadResponse>("/oss/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		isNotUseSuffixUrl: true,
	});
};
