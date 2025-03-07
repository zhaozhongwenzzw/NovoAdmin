import { NavLink } from 'react-router-dom';

// import { useTheme } from "@/theme/hooks";

import { Iconify } from '../icon';

interface Props {
  size?: number | string;
}
function Logo({ size = 50 }: Props) {
  // const { themeTokens } = useTheme();

  return (
    <NavLink to="/">
      <Iconify icon="mingcute:ai-fill" className="text-primary" size={size} />
    </NavLink>
  );
}

export default Logo;
