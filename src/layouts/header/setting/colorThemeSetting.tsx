import { memo } from "react";

import { presetsColors } from "@/configs/theme/token/color";
import type { ThemeColorPresets } from "@/types/enum/setting";
import { Card, Row, Col, Tooltip } from "antd";
import { useSettings, useSettingActions } from "@/store/settingStore";
import { cn } from "@/utils/cn";

const ColorThemeSetting: React.FC = () => {
	// 使用类型安全的方式获取颜色键
	const colorKeys = Object.keys(presetsColors) as ThemeColorPresets[];
	const settings = useSettings();
	const { setSettings } = useSettingActions();

	// 处理点击事件，更新主题颜色
	const handleColorSelect = (colorKey: ThemeColorPresets) => {
		setSettings({ ...settings, themeColorPresets: colorKey });
	};

	return (
		<Row gutter={[16, 16]}>
			{colorKeys.map((colorKey) => (
				<Col span={8} key={colorKey}>
					<Tooltip title={colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} placement="top">
						<Card
							onClick={() => handleColorSelect(colorKey)}
							className={cn(
								"cursor-pointer transition-all duration-300",
								settings.themeColorPresets === colorKey
									? "shadow-[0_0_10px_1px_var(--colors-palette-primary-default)]"
									: "hover:shadow-[0_0_12px_rgba(0,0,0,0.1)]",
							)}
							styles={{
								body: {
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									padding: "16px 0",
								},
							}}
						>
							<div className="w-4 h-4 rounded-full" style={{ backgroundColor: presetsColors[colorKey].default }} />
						</Card>
					</Tooltip>
				</Col>
			))}
		</Row>
	);
};

export default memo(ColorThemeSetting);
