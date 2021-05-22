import { useRouter } from "next/router";
import { Heading, Flex, Box, Spacer, useColorMode, useColorModeValue, Button, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Header = () => {
	const { toggleColorMode } = useColorMode();
	const text = useColorModeValue("dark", "light");
	const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
	const router = useRouter();

	return (
		<Flex p="2" mb="4">
			<Box>
				<Heading size="lg">Cards Against Humanity</Heading>
			</Box>
			<Spacer />
			{router.pathname !== "/" && (
				<Box>
					<Button>Leave Game</Button>
				</Box>
			)}
			<Box>
				<IconButton
					size="md"
					fontSize="lg"
					aria-label={`Switch to ${text} mode`}
					variant="ghost"
					color="current"
					marginLeft="2"
					onClick={toggleColorMode}
					icon={<SwitchIcon />}>
					Color
				</IconButton>
			</Box>
		</Flex>
	);
};

export default Header;
