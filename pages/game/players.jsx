import { Box, Heading, VStack, HStack, Spacer } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/_firebase";

const Players = ({ czar, setPlayerIDs }) => {
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const path = `rooms/${roomCode}/players`;
		db.ref(path).on("value", (snap) => {
			if (snap.exists()) {
				const _players = Object.entries(snap.val());
				setPlayers(_players);
				setPlayerIDs(_players.map(([key]) => key));
			}
		});

		return () => {
			db.ref(path).off("value");
		};
	}, []);
	return (
		<VStack overflowY="auto" w="100%" h="64" align="flex-start">
			<Heading size="md">Leader Board</Heading>

			{players
				.sort(([, a], [, b]) => b.points - a.points)
				.map(([key, { name, points }]) => (
					<Box
						w="100%"
						h="12"
						p="4"
						bg={czar === key ? "whiteAlpha.500" : "whiteAlpha.100"}
						boxShadow={czar === key ? "xl" : "none"}
						key={key}>
						<HStack>
							<Heading size="sm">
								{name}
								{czar === key ? " (Czar)" : ""}
							</Heading>
							<Spacer />
							<Heading size="sm">{points}</Heading>
						</HStack>
					</Box>
				))}
		</VStack>
	);
};

export default Players;
