import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
	Heading,
	Flex,
	Box,
	Spacer,
	useColorMode,
	useColorModeValue,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, InfoIcon } from "@chakra-ui/icons";
import InfoModal from "./InfoModal";

const GameOpts = dynamic(() => import("./GameOpts"), { ssr: false });

const Header = () => {
	const { toggleColorMode } = useColorMode();
	const text = useColorModeValue("dark", "light");
	const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isHomeRoute = router.pathname === "/";

	return (
		<Flex p="4" mb="4" align="center">
			{isHomeRoute && (
				<Box>
					<Heading size="lg">Cards Against Humanity</Heading>
				</Box>
			)}
			{!isHomeRoute && <GameOpts code={router.query.code} />}
			<Spacer />
			<Box>
				<IconButton
					size="md"
					fontSize="lg"
					aria-label={`Switch to ${text} mode`}
					variant="ghost"
					color="current"
					marginLeft="2"
					onClick={onOpen}
					icon={<InfoIcon />}
				>
					Info
				</IconButton>
				<InfoModal isOpen={isOpen} onClose={onClose} />
			</Box>
			<Box>
				<IconButton
					size="md"
					fontSize="lg"
					aria-label={`Switch to ${text} mode`}
					variant="ghost"
					color="current"
					marginLeft="2"
					onClick={toggleColorMode}
					icon={<SwitchIcon />}
				>
					Color
				</IconButton>
			</Box>
		</Flex>
	);
};

export default Header;
