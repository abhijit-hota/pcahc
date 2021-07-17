import { Heading, IconButton, useClipboard, HStack } from "@chakra-ui/react";
import { CloseIcon, CopyIcon } from "@chakra-ui/icons";
import api from "frontend-utils/api";
import { auth } from "frontend-utils/firebase";
import { CAH_ROOM_CODE } from "frontend-utils/tokenNames";
import { useState } from "react";
import { toast } from "frontend-utils/ui";

export default function GameOpts({ code }) {
	const { onCopy } = useClipboard(`${window.location.origin}?join=${code}` || "");
	const [isLeaving, setIsLeaving] = useState(false);

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
				isLoading={isLeaving}
				onClick={async () => {
					setIsLeaving(true);
					const { uid } = auth.currentUser;
					await auth.signOut();
					await api.post("/room/leave", { uid, roomCode: sessionStorage[CAH_ROOM_CODE] });
					window.location.pathname = "/";
				}}
				icon={<CloseIcon />}
			>
				Leave
			</IconButton>
		</HStack>
	);
}
