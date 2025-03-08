import { ThemeLayout } from "@/types/enum/setting";
import NavHorizontal from "./nav-horizontal";
import NavVertical from "./nav-vertical";
import NavVerticalSplit from "./nav-vertical-split";

export default function Nav({ themeLayout }: { themeLayout: ThemeLayout }) {
	if (themeLayout === ThemeLayout.Horizontal) return <NavHorizontal />;
	if (themeLayout === ThemeLayout.Vertical || themeLayout === ThemeLayout.Mini) return <NavVertical />;
	if (themeLayout === ThemeLayout.VerticalSplit) return <NavVerticalSplit />;
	return null;
}
