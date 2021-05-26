import { useEffect, useState } from "react";
import Head from "next/head";

import { Box, Container, Divider, Spacer, Stack, useBreakpointValue, VStack } from "@chakra-ui/react";
import BlackCard from "./black-card";
import Players from "./players";

import { db } from "../../utils/_firebase";
import MyCards from "./my-cards";
import PlayedCards from "./selectedCards";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";

export default function Game() {
	const [czar, setCzar] = useState("");
	const [playerIDs, setPlayerIDs] = useState([1, 2, 3]);
	const [currentUserID, setCurrentUserID] = useState("");
	const [isTurnLeft, setIsTurnLeft] = useState(true);

	const dividerProps = useBreakpointValue([
		{ orientation: "horizontal", mt: "4", mb: "4" },
		{ orientation: "vertical", ml: "4", mr: "4" },
	]);

	const [roomCode, setRoomCode] = useState("");
	const getNextCzar = () => {
		const currentCzar = playerIDs.indexOf(czar);
		const nextCzarIndex = currentCzar + 1 >= playerIDs.length ? 0 : currentCzar + 1;
		return playerIDs[nextCzarIndex];
	};
	useEffect(() => {
		setRoomCode(sessionStorage.getItem(CAH_ROOM_CODE));
		setCurrentUserID(sessionStorage.getItem(CAH_PLAYER_ID));
	}, []);

	useEffect(() => {
		if (roomCode && currentUserID) {
			const path = `rooms/${roomCode}/round/czar`;
			db.ref(path).on("value", (snap) => {
				if (snap.exists()) {
					setCzar(snap.val());
				}
			});
			return () => {
				db.ref(path).off("value");
			};
		}
	}, [currentUserID, roomCode]);

	useEffect(() => {
		const _roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const userId = sessionStorage.getItem(CAH_PLAYER_ID);
		const roomPath = `rooms/${_roomCode}`;
		if (playerIDs.length > 1) {
			db.ref(roomPath).onDisconnect().cancel();

			db.ref(`${roomPath}/players/${sessionStorage.getItem(CAH_PLAYER_ID)}`)
				.onDisconnect()
				.remove();
			db.ref(`${roomPath}/round/czar`)
				.onDisconnect()
				.set(czar === userId ? getNextCzar() : czar);
			db.ref(`${roomPath}/round/whiteCards/${userId}`).onDisconnect().remove();
		} else if (playerIDs.length !== 0) {
			db.ref(roomPath).onDisconnect().remove();
		}
	}, [playerIDs]);

	return (
		<Container centerContent w="full" h="100%">
			<Head>
				<title>CAH Online: Room {roomCode} </title>
			</Head>
			{czar === "" ? (
				"Loading"
			) : (
				<Box
					rounded="lg"
					d="flex"
					alignItems="flex-start"
					flexDirection={["column", "row"]}
					h={["82vh", "87vh"]}
					p="4"
					w={["100vw", "85vw"]}>
					<Stack direction={["row", "column"]} w={["100%", "unset"]}>
						<BlackCard />
						<Spacer />
						<Players czar={czar} setPlayerIDs={setPlayerIDs} />
					</Stack>
					<Divider {...dividerProps} />
					<VStack h="100%">
						<PlayedCards czar={czar} playerIDs={playerIDs} setIsTurnLeft={setIsTurnLeft} />
						<Spacer />
						<MyCards isTurn={isTurnLeft && czar !== currentUserID} />
					</VStack>
				</Box>
			)}
		</Container>
	);
}
