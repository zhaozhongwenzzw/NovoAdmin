import Logo from "@/components/logo";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum/setting";
import { HEADER_HEIGHT } from "../config";
import styled from "styled-components";

const LogoWrapper = styled.div<{ $collapsed: boolean }>`
  height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  .logo-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      white-space: nowrap;
      display: ${(props) => (props.$collapsed ? "none" : "block")};
      opacity: ${(props) => (props.$collapsed ? 0 : 1)};
      transition: opacity 0.2s ease;
      transform: ${(props) => (props.$collapsed ? "translateX(-10px)" : "translateX(0)")};
    }
  }
`;

type Props = {
	collapsed?: boolean;
	onToggle?: () => void;
};

export default function NavLogo({ collapsed = false }: Props) {
	const { themeLayout } = useSettings();

	if (themeLayout === ThemeLayout.Mini) {
		return (
			<LogoWrapper $collapsed={true}>
				<div className="logo-content">
					<Logo />
				</div>
			</LogoWrapper>
		);
	}

	return (
		<LogoWrapper $collapsed={collapsed} className="mt-2 mb-2">
			<div className="logo-content">
				<Logo />
				<span className="logo-text text-primary">Novo Admin</span>
			</div>
		</LogoWrapper>
	);
}
