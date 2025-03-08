import type React from "react";
import { useEffect } from "react";
import { ConfigProvider as AntConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useTokens } from "../theme/hooks/useTokens";
import { hexToRgbChannel, removePx, rgbAlpha } from "@/utils/theme";
import { presetsColors } from "../theme/token/color";
import { useSettings } from "@/store/settingStore";
import { baseThemeTokens } from "../theme/token/baseThemeTokens";
import { setAntdPrimaryColor } from "../theme/token/antdPrimaryColor";
interface ThemeProviderProps {
	children: React.ReactNode;
	adapters?: any[];
}

export const ConfigProvider = ({ children }: ThemeProviderProps) => {
	const { token, components, algorithm, themeMode } = useTokens();
	const { themeColorPresets } = useSettings();
	// Update HTML class to support Tailwind dark mode
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(themeMode);
		const antdPrimaryColors = setAntdPrimaryColor(presetsColors[themeColorPresets].default, themeMode);
		antdPrimaryColors.forEach((color, index) => {
			root.style.setProperty(`--colors-antd-primary-color${index}`, color);
		});
	}, [themeMode]);

	useEffect(() => {
		const root = window.document.documentElement;
		const primaryColors = presetsColors[themeColorPresets];
		for (const [key, value] of Object.entries(primaryColors)) {
			root.style.setProperty(`--colors-palette-primary-${key}`, value);
			root.style.setProperty(`--colors-palette-primary-${key}Channel`, hexToRgbChannel(value));
		}
		root.style.setProperty("--shadows-primary", `box-shadow: 0 8px 16px 0 ${rgbAlpha(primaryColors.default, 0.24)}`);
		const antdPrimaryColors = setAntdPrimaryColor(primaryColors.default, themeMode);
		antdPrimaryColors.forEach((color, index) => {
			root.style.setProperty(`--colors-antd-primary-color${index}`, color);
		});
	}, [themeColorPresets]);

	return (
		<AntConfigProvider
			locale={zhCN}
			theme={{ algorithm, token, components }}
			tag={{
				style: {
					borderRadius: removePx(baseThemeTokens.borderRadius.md),
					fontWeight: 700,
					padding: `0 ${baseThemeTokens.spacing[1]}`,
					margin: `0 ${baseThemeTokens.spacing[1]}`,
					borderWidth: 0,
				},
			}}
		>
			{children}
		</AntConfigProvider>
	);
};
