import { Card, Col, Row } from 'antd';
import { Iconify } from '@/components/icon';
import { useSettings, useSettingActions } from '@/store/settingStore';
import { ThemeMode } from '@/types/enum/setting';
import { useMemo } from 'react';
import { cn } from '@/utils/cn';

const ThemeSwitch: React.FC = () => {
  const settings = useSettings();
  const { setSettings } = useSettingActions();

  const isDarkMode = useMemo(() => settings.themeMode === ThemeMode.Dark, [settings.themeMode]);

  const themeOptions = [
    {
      mode: ThemeMode.Light,
      icon: 'stash:sun-duotone',
      active: !isDarkMode,
    },
    {
      mode: ThemeMode.Dark,
      icon: 'ph:cloud-moon-fill',
      active: isDarkMode,
    },
  ];

  const handleThemeChange = (checked: boolean) => {
    setSettings({
      ...settings,
      themeMode: checked ? ThemeMode.Dark : ThemeMode.Light,
    });
  };
  return (
    <Row className="flex items-center" justify="space-between" gutter={10}>
      {themeOptions.map(({ mode, icon, active }) => (
        <Col key={mode} span={12}>
          <Card className={cn('cursor-pointer text-center', active && 'text-primary')} onClick={() => handleThemeChange(mode === ThemeMode.Dark)}>
            <Iconify size={25} icon={icon} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ThemeSwitch;
