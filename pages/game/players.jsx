import { Box, Heading, VStack, Spacer } from "@chakra-ui/layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";
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
						maxW={["100%", "64"]}
						h="12"
						d="flex"
						pl="2"
						pr="2"
						alignItems="center"
						bg={czar === key ? "whiteAlpha.500" : "whiteAlpha.100"}
						boxShadow={czar === key ? "xl" : "none"}
						key={key}>
						<Image
							className="cah-avatar"
							loader={({ src }) =>
								`https://avatar.tobi.sh/${src}.svg?size=32${
									sessionStorage[CAH_PLAYER_ID] === key ? "&text=You" : ""
								}`
							}
							src={name}
							width="32"
							height="32"
						/>
						<Heading size="sm" ml="2">
							{name}
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
