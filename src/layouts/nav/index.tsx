import { ThemeLayout } from '@/types/enum/setting';
import NavHorizontal from './nav-horizontal';
import NavVertical from './nav-vertical';

export default function Nav({ themeLayout }: { themeLayout: ThemeLayout }) {
  if (themeLayout === ThemeLayout.Horizontal) return <NavHorizontal />;
  if (themeLayout === ThemeLayout.Vertical || themeLayout === ThemeLayout.Mini) return <NavVertical />;

  return null;
}
