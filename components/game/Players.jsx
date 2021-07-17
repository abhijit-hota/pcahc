import { Box, Heading, VStack, Spacer } from "@chakra-ui/layout";
import Image from "next/image";
import { useEffect } from "react";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "frontend-utils/tokenNames";
import { db } from "frontend-utils/firebase";
import { toast } from "frontend-utils/ui";
import { useRealTimeData } from "frontend-utils/hooks";

const Players = ({ czar }) => {
	const players = useRealTimeData("/players", { initialValue: {} });
	
	useEffect(() => {
		if (czar && players[czar]) {
			const title = `${players[czar].name} is now the Czar`;
			toast({ title });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [czar]);
	
	useEffect(() => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const chosenPath = `rooms/${roomCode}/round/chosen`;
		db.ref(chosenPath).on("value", (snap) => {
			const chosen = snap.val();
			if (chosen && snap.exists()) {
				const title = `${players[chosen]?.name}'s card was selected by the Czar!`;
				toast({ title });
			}
		});
		return () => {
			db.ref(chosenPath).off("value");
		};
	}, [players]);
	return (
		<VStack overflowY="auto" w="100%" h="64" align="flex-start">
			<Heading size="md">Leader Board</Heading>

			{players &&
				Object.entries(players)
					.sort(([, a], [, b]) => b.points - a.points)
					.map(([key, { name, points }]) => (
						<Box
							w="100%"
							maxW={["100%", "64"]}
							h="12"
							d="flex"
							pl="2"
							pr="2"
							alignItems="center"
							bg={czar === key ? "whiteAlpha.500" : "whiteAlpha.100"}
							boxShadow={czar === key ? "xl" : "none"}
							key={key}
						>
							<Image
								alt={`${name} Avatar`}
								className="cah-avatar"
								loader={({ src }) => {
									const name = encodeURIComponent(src);
									return `https://source.boringavatars.com/bauhaus/32/${name}?colors=ecd078,d95b43,c02942,542437,53777a`;
								}}
								src={name}
								width="32"
								height="32"
							/>
							<Heading size="sm" ml="2">
								{name}
								{sessionStorage[CAH_PLAYER_ID] === key ? " (You)" : ""}
								{czar === key ? " (Czar)" : ""}
							</Heading>
							<Spacer />
							<Heading size="sm">{points}</Heading>
						</Box>
					))}
		</VStack>
	);
};

export default Players;
