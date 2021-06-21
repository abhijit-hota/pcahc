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
	useToast,
	VStack,
} from "@chakra-ui/react";
import BlackCard from "./black-card";
import Players from "./players";

import { db } from "../../utils/db";
import MyCards from "./my-cards";
import PlayedCards from "./selectedCards";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";


function Game() {
	const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
	const userID = sessionStorage.getItem(CAH_PLAYER_ID);
	
	const [czar, setCzar] = useState("");
	const [isTurnLeft, setIsTurnLeft] = useState(true);

	const dividerProps = useBreakpointValue([
		{ orientation: "horizontal", mt: "4", mb: "4" },
		{ orientation: "vertical", ml: "4", mr: "4" },
	]);
	const toast = useToast();
	useEffect(() => {
		(async () => {
			try {
				setCzar((await db.ref(`rooms/${roomCode}/round/czar`).get()).val());
			} catch (error) {
				console.log(2);
				console.log(error);
			}
		})();
	}, []);

	useEffect(() => {
		const path = `rooms/${roomCode}/round/czar`;
		db.ref(path).on("value", (snap) => {
			if (snap.exists()) {
				const newCzar = snap.val();
				toast({
					duration: 2000,
					position: "top",
					title: `${newCzar} is now the Czar`,
					status: "info",
					isClosable: false,
				});
				setCzar(newCzar);
			}
		});
		return () => {
			db.ref(path).off("value");
		};
	}, []);

	useEffect(() => {
		const roomPath = `rooms/${roomCode}`;
		db.ref(`${roomPath}/players/${userID}`).onDisconnect().remove();
	}, []);

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
