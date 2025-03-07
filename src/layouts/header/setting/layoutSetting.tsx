import { Card } from 'antd';
import { ThemeLayout } from '@/types/enum/setting';
import { themeVars } from '@/configs/theme/hooks/theme.css';
import { useSettingActions } from '@/store/settingStore';
import { useSettings } from '@/store/settingStore';

const LayoutSetting: React.FC = () => {
  const settings = useSettings();
  console.log(settings);

  const { setSettings } = useSettingActions();
  const setThemeLayout = (layout: ThemeLayout) => {
    setSettings({
      ...settings,
      themeLayout: layout,
    });
  };
  const layoutBackground = (layout: ThemeLayout) =>
    settings.themeLayout === layout ? `linear-gradient(135deg, ${themeVars.colors.background.neutral} 0%, ${themeVars.colors.palette.primary.default} 100%)` : themeVars.colors.palette.gray[500];
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <Card
          onClick={() => setThemeLayout(ThemeLayout.Vertical)}
          className="h-16 cursor-pointer"
          style={{ flexGrow: 1, flexShrink: 0 }}
          styles={{
            body: {
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            },
          }}
        >
          <div className="flex h-full w-7 flex-shrink-0 flex-col gap-1 p-1">
            <div
              className="h-2 w-2 flex-shrink-0 rounded"
              style={{
                background: layoutBackground(ThemeLayout.Vertical),
              }}
            />
            <div
              className="h-1 w-full flex-shrink-0 rounded opacity-50"
              style={{
                background: layoutBackground(ThemeLayout.Vertical),
              }}
            />
            <div
              className="h-1 max-w-[12px] flex-shrink-0 rounded opacity-20"
              style={{
                background: layoutBackground(ThemeLayout.Vertical),
              }}
            />
          </div>
          <div className="h-full w-full flex-1 flex-grow p-1">
            <div
              className="h-full w-full rounded opacity-20"
              style={{
                background: layoutBackground(ThemeLayout.Vertical),
              }}
            />
          </div>
        </Card>
        <Card
          onClick={() => setThemeLayout(ThemeLayout.Horizontal)}
          className="h-16 cursor-pointer"
          style={{ flexGrow: 1, flexShrink: 0 }}
          styles={{
            body: {
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            },
          }}
        >
          <div className="flex items-center gap-1 p-1">
            <div
              className="h-2 w-2 flex-shrink-0 rounded"
              style={{
                background: layoutBackground(ThemeLayout.Horizontal),
              }}
            />
            <div
              className="h-1 w-4 flex-shrink-0 rounded opacity-50"
              style={{
                background: layoutBackground(ThemeLayout.Horizontal),
              }}
            />
            <div
              className="h-1 w-3 flex-shrink-0 rounded opacity-20"
              style={{
                background: layoutBackground(ThemeLayout.Horizontal),
              }}
            />
          </div>
          <div className="h-full w-full flex-1 flex-grow p-1">
            <div
              className="h-full w-full rounded opacity-20"
              style={{
                background: layoutBackground(ThemeLayout.Horizontal),
              }}
            />
          </div>
        </Card>
        <Card
          onClick={() => setThemeLayout(ThemeLayout.VerticalSplit)}
          className="h-16 cursor-pointer"
          style={{ flexGrow: 1, flexShrink: 0 }}
          styles={{
            body: {
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            },
          }}
        >
          <div className="flex h-full w-5 flex-shrink-0 flex-col gap-1 p-[5px_2px]">
            <div
              className="h-2 w-2 flex-shrink-0 rounded"
              style={{
                background: layoutBackground(ThemeLayout.VerticalSplit),
              }}
            />
            <div
              className="h-1 w-full flex-shrink-0 rounded opacity-50"
              style={{
                background: layoutBackground(ThemeLayout.VerticalSplit),
              }}
            />
            <div
              className="h-1 w-full flex-shrink-0 rounded opacity-40"
              style={{
                background: layoutBackground(ThemeLayout.VerticalSplit),
              }}
            />
          </div>
          <div className="flex h-full pt-4 w-3 flex-shrink-0 flex-col gap-1">
            <div
              className="h-1 w-full flex-shrink-0 rounded opacity-30"
              style={{
                background: layoutBackground(ThemeLayout.VerticalSplit),
              }}
            />
          </div>
          <div className="h-full w-full flex-1 flex-grow p-1">
            <div
              className="h-full w-full rounded opacity-20"
              style={{
                background: layoutBackground(ThemeLayout.VerticalSplit),
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LayoutSetting;
