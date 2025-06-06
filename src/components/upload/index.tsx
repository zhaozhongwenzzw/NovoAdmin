import type React from "react";
import { useState, useEffect, useRef } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload, type UploadFile, type UploadProps as AntdUploadProps } from "antd";
import { uploadFile } from "@/api/common/upload";
import { getToken } from "@/utils/auth";

interface UploadProps {
	beforeUpload?: (file: File) => boolean;
	onChange?: (info: any) => void;
	maxCount?: number;
	type?: "image" | "file";
	maxSize?: number;
	disabled?: boolean;
	folderPath?: string;
	value?: string | string[];
}

const App: React.FC<UploadProps> = (props) => {
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current && props.value) {
			const initialValues = Array.isArray(props.value) ? props.value : [props.value];
			const initialFileList = initialValues.map(
				(url, index) =>
					({
						uid: `-${index + 1}`,
						name: `file-${index + 1}`,
						status: "done",
						url: url,
					}) as UploadFile,
			);
			setFileList(initialFileList);
			isFirstRender.current = false;
		}
	}, [props.value]);

	const beforeUpload = (file: File) => {
		if (props.beforeUpload) {
			return props.beforeUpload(file);
		}
		if (props.maxSize) {
			if (!isLt5M(file)) {
				message.error(`文件大小不能超过 ${props.maxSize}MB!`);
				return false;
			}
		}
		if (props.type === "image") {
			if (!isImage(file)) {
				message.error("只能上传图片文件!");
				return false;
			}
		}
		return true;
	};

	const isLt5M = (file: File) => {
		return file.size / 1024 / 1024 < (props.maxSize || 5);
	};

	const isImage = (file: File) => {
		return file.type.startsWith("image/");
	};

	const handleChange: AntdUploadProps["onChange"] = (info) => {
		for (const item of info.fileList) {
			if (item.status === "done") {
				if (item.response.code === 200) {
					item.url = item.response.data.url;
				} else {
					item.status = "error";
					item.url = "";
				}
			}
		}
		setFileList(info.fileList);
		if (props.onChange) {
			props.onChange(info);
		}
	};

	const action = `${import.meta.env.VITE_API_BASE_URL as string}/oss/upload`;
	const uploadButton = (
		<button style={{ border: 0, background: "none" }} type="button">
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>{loading ? "上传中" : "上传"}</div>
		</button>
	);
	const headers = {
		Authorization: `Bearer ${getToken()}`,
	};

	const customRequest = async (options: any) => {
		const { file, onSuccess, onError } = options;
		setLoading(true);
		try {
			const folderPath = props.folderPath || "/blog";
			const response = await uploadFile(file, folderPath);
			if (response.code === 200) {
				onSuccess(response, file);
			} else {
				onError(new Error(response.message || "上传失败"));
			}
		} catch (error) {
			onError(error as Error);
			console.error("上传失败:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Upload
			name="file"
			listType="picture-circle"
			className="avatar-uploader"
			showUploadList={true}
			maxCount={props.maxCount || 1}
			action={action}
			headers={headers}
			fileList={fileList}
			beforeUpload={beforeUpload}
			onChange={handleChange}
			disabled={props.disabled || loading}
			data={{ folder: props.folderPath || "/blog/image" }}
			customRequest={customRequest}
		>
			{fileList.length >= (props.maxCount || 1) ? null : uploadButton}
		</Upload>
	);
};

export default App;
