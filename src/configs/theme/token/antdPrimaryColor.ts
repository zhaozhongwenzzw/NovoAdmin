import { generate } from "@ant-design/colors";

// Generate dark color palettes by a given color
const setAntdPrimaryColor = (color: string, theme: "dark" | "light") => {
	const antdPrimaryColors = generate(color, {
		theme: theme === "dark" ? "dark" : "default",
	});
	return antdPrimaryColors;
};

export { setAntdPrimaryColor };
