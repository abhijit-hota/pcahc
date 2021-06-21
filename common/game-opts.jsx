import { Heading, IconButton, useClipboard, useToast, HStack } from "@chakra-ui/react";
import { CloseIcon, CopyIcon } from "@chakra-ui/icons";
import api from "../utils/api";

export default function GameOpts({ code }) {
	const { onCopy } = useClipboard(`${window.location.origin}?join=${code}` || "");
	const toast = useToast();

	return (
		<HStack>
			<Heading size="sm">Room Code {code}</Heading>
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
						duration: 2000,
						position: "top",
						title: "Room Code copied",
						status: "success",
						isClosable: true,
					});
				}}
				icon={<CopyIcon />}
			>
				Copy Room Code
			</IconButton>
			<IconButton
				size="md"
				fontSize="lg"
				aria-label="Leave Game"
				variant="ghost"
				color="current"
				marginLeft="2"
				onClick={async () => {
					await api.post("/leave-game");
					window.location.pathname = "/";
				}}
				icon={<CloseIcon />}
			>
				Leave
			</IconButton>
		</HStack>
	);
}
