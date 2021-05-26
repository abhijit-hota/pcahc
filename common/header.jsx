import { useRouter } from "next/router";
import {
	Heading,
	Flex,
	Box,
	Spacer,
	useColorMode,
	useColorModeValue,
	IconButton,
	useClipboard,
	useToast,
	useDisclosure,
	HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, InfoIcon, CloseIcon, CopyIcon } from "@chakra-ui/icons";
import InfoModal from "./info-modal";

const Header = () => {
	const { toggleColorMode } = useColorMode();
	const text = useColorModeValue("dark", "light");
	const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
	const router = useRouter();
	const { onCopy } = useClipboard(router.query.code || "");
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isHomeRoute = router.pathname === "/";

	return (
		<Flex p="4" mb="4" align="center">
			{isHomeRoute && (
				<Box>
					<Heading size="lg">Cards Against Humanity</Heading>
				</Box>
			)}
			{!isHomeRoute && (
				<HStack>
					<Heading size="sm">Room Code {router.query.code}</Heading>
					<IconButton
						size="md"
						fontSize="lg"
						aria-label="Leave Game"
						variant="ghost"
						color="current"
						marginLeft="2"
						onClick={() => {
							onCopy();
							toast({
								title: "Room Code copied",
								status: "success",
								isClosable: true,
							});
						}}
						icon={<CopyIcon />}>
						Copy Room Code
					</IconButton>
					<IconButton
						size="md"
						fontSize="lg"
						aria-label="Leave Game"
						variant="ghost"
						color="current"
						marginLeft="2"
						onClick={() => {
							window.location.pathname = "/";
						}}
						icon={<CloseIcon />}>
						Leave
					</IconButton>
				</HStack>
			)}
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
					icon={<InfoIcon />}>
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
					icon={<SwitchIcon />}>
					Color
				</IconButton>
			</Box>
		</Flex>
	);
};

export default Header;
