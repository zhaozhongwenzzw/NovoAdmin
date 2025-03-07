import { useSettings } from '@/store/settingStore';
import { ThemeMode } from '@/types/enum/setting';
import { darkColorTokens, lightColorTokens, presetsColors } from '../token/color';
import { darkShadowTokens, lightShadowTokens } from '../token/shadowTokens';
import { baseThemeTokens } from '../token/baseThemeTokens';
import { removePx } from '@/utils/theme';
import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const useTokens = () => {
  const settings = useSettings();
  const { themeColorPresets, themeMode } = settings;

  // 获取主题相关的 tokens
  const primaryColorToken = presetsColors[themeColorPresets];
  const colorTokens = themeMode === ThemeMode.Light ? lightColorTokens : darkColorTokens;
  const algorithm = themeMode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm;
  const shadowTokens = themeMode === ThemeMode.Light ? lightShadowTokens : darkShadowTokens;

  // antd token 配置
  const token: ThemeConfig['token'] = {
    colorPrimary: primaryColorToken.default,
    colorSuccess: colorTokens.palette.success.default,
    colorWarning: colorTokens.palette.warning.default,
    colorError: colorTokens.palette.error.default,
    colorInfo: colorTokens.palette.info.default,
    colorBgContainer: colorTokens.background.paper,
    colorBgElevated: colorTokens.background.default,

    wireframe: false,

    borderRadiusSM: removePx(baseThemeTokens.borderRadius.sm),
    borderRadius: removePx(baseThemeTokens.borderRadius.default),
    borderRadiusLG: removePx(baseThemeTokens.borderRadius.lg),

    colorLink: primaryColorToken.default,
    colorInfoBorderHover: primaryColorToken.default,
    colorInfoHover: primaryColorToken.default,
    colorLinkHover: primaryColorToken.default,
    colorPrimaryBorderHover: primaryColorToken.default,
  };

  // antd 组件配置
  const components: ThemeConfig['components'] = {
    Breadcrumb: {
      separatorMargin: removePx(baseThemeTokens.spacing[1]),
    },
    Menu: {
      colorFillAlter: 'transparent',
      itemColor: colorTokens.text.secondary,
      motionDurationMid: '0.125s',
      motionDurationSlow: '0.125s',
      darkItemBg: darkColorTokens.background.default,
    },
    Layout: {
      siderBg: darkColorTokens.background.default,
    },
    Card: {
      boxShadow: shadowTokens.card,
      bodyPadding: removePx(baseThemeTokens.spacing[4]),
    },
  };

  return {
    token,
    components,
    algorithm,
    themeMode,
  };
};
