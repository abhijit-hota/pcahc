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
				// color: mode("gray.800", "whiteAlpha.900")(props),
				bg: mode("gray.200", "#121212")(props),
			},
		}),
	},
});

export default theme;
