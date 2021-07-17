import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import {
	Box,
	Container,
	Divider,
	Spacer,
	Stack,
	useBreakpointValue,
	VStack,
} from "@chakra-ui/react";

import { BlackCard, Players, MyCards, PlayedCards } from "components/game";
import { db } from "frontend-utils/firebase";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "frontend-utils/tokenNames";
import { useRealTimeData } from "frontend-utils/hooks";

function Game() {
	const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
	const userID = sessionStorage.getItem(CAH_PLAYER_ID);

	const czar = useRealTimeData("/round/czar");
	const [isTurnLeft, setIsTurnLeft] = useState(true);

	const dividerProps = useBreakpointValue([
		{ orientation: "horizontal", mt: "4", mb: "4" },
		{ orientation: "vertical", ml: "4", mr: "4" },
	]);

	useEffect(() => {
		const roomPath = `rooms/${roomCode}`;
		db.ref(roomPath)
			.onDisconnect()
			.update({
				[`players/${userID}`]: null,
				[`playerCards/${userID}`]: null,
				[`round/whiteCards/${userID}`]: null,
			});

		return () => {};
	}, [roomCode, userID]);

	return (
		<Container centerContent w="full" h="100%">
			<Head>
				<title>CAH Online: Room {roomCode} </title>
			</Head>
			{czar && czar === "" ? (
				"Loading"
			) : (
				<Box
					rounded="lg"
					d="flex"
					alignItems="flex-start"
					flexDirection={["column", "row"]}
					h={["82vh", "87vh"]}
					p="4"
					w={["100vw", "85vw"]}
				>
					<Stack direction={["row", "column"]} w={["100%", "unset"]}>
						<BlackCard />
						<Spacer />
						<Players czar={czar} />
					</Stack>
					<Divider {...dividerProps} />
					<VStack h="100%">
						<PlayedCards czar={czar} setIsTurnLeft={setIsTurnLeft} />
						<Spacer />
						<MyCards isTurn={isTurnLeft && czar !== userID} />
					</VStack>
				</Box>
			)}
		</Container>
	);
}

export default dynamic(() => Promise.resolve(Game), { ssr: false });
