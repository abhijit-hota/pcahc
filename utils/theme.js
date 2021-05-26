import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

const theme = extendTheme({
	config,
	styles: {
		global: (props) => ({
			body: {
				bg: mode("gray.200", "blackAlpha.800")(props),
			},
		}),
	},
	components: {
		Modal: {
			baseStyle: (props) => ({
				dialog: { bg: props.colorMode === "dark" ? "#222222" : "gray.200" },
			}),
		},
	},
});

export default theme;
