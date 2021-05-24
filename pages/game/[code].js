import { useEffect, useState } from "react";
import Head from "next/head";

import { Box, Container, Divider, Spacer, VStack } from "@chakra-ui/react";
import BlackCard from "./black-card";
import Players from "./players";

import { db } from "../../utils/_firebase";
import MyCards from "./my-cards";
import PlayedCards from "./selectedCards";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";

export default function Game() {
	const [czar, setCzar] = useState("");
	const [playerIDs, setPlayerIDs] = useState([]);
	const [isTurnLeft, setIsTurnLeft] = useState(true);

	const [roomCode, setRoomCode] = useState("");
	const getNextCzar = () => {
		const currentCzar = playerIDs.indexOf(czar);
		const nextCzarIndex = currentCzar + 1 >= playerIDs.length ? 0 : currentCzar + 1;
		return playerIDs[nextCzarIndex];
	};
	useEffect(() => {
		setRoomCode(sessionStorage.getItem(CAH_ROOM_CODE));
		const playerID = sessionStorage.getItem(CAH_PLAYER_ID);
		const path = `rooms/${sessionStorage.getItem(CAH_ROOM_CODE)}/round/czar`;
		db.ref(path).on("value", (snap) => {
			if (snap.exists()) {
				setCzar(snap.val());
			}
		});
		db.ref(path)
			.onDisconnect()
			.set(czar === playerID ? getNextCzar() : czar);
		return () => {
			db.ref(path).off("value");
		};
	}, []);

	return (
		<Container centerContent w="full" h="100%">
			<Head>
				<title>Game {roomCode} </title>
			</Head>
			{czar === "" ? (
				"Loading"
			) : (
				<Box rounded="lg" d="flex" h="87vh" p="4" w="85vw">
					<VStack w="20vw">
						<BlackCard />
						<Spacer />
						<Players czar={czar} setPlayerIDs={setPlayerIDs} />
					</VStack>
					<Divider orientation="vertical" ml="4" mr="4" />
					<VStack w="60vw" h="100%">
						<PlayedCards czar={czar} playerIDs={playerIDs} setIsTurnLeft={setIsTurnLeft} />
						<Spacer />
						<MyCards isTurn={isTurnLeft && czar !== sessionStorage.getItem(CAH_PLAYER_ID)} />
					</VStack>
				</Box>
			)}
		</Container>
	);
}
