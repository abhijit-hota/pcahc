import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

import { Box, Button, Container, HStack, Input, VStack, Divider } from "@chakra-ui/react";
import { generateRoomCode } from "../utils/generateRoomCode";
import { db } from "../utils/_firebase";
import { getRandomWhiteCards, getRandomBlackCard } from "../utils/getRandomCard";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../utils/tokenNames";

export default function Home() {
	const [name, setName] = useState("");
	const [roomCode, setRoomCode] = useState("");

	const router = useRouter();

	const handleSuccess = (id, code = roomCode) => {
		sessionStorage.setItem(CAH_ROOM_CODE, code);
		sessionStorage.setItem(CAH_PLAYER_ID, id);
		router.push(`/game/${code}`);
	};
	const handleRoomCreate = async () => {
		const { letters } = generateRoomCode();
		const code = letters.join("");
		const roomExists = (await db.ref(`rooms/${code}`).once("value")).exists();

		if (!roomExists) {
			try {
				const userID = uuid();

				await db.ref(`rooms/${code}`).set({
					round: {
						whiteCards: [],
						czar: userID,
						blackCard: getRandomBlackCard(),
					},
					players: { [userID]: { name, points: 0, cards: getRandomWhiteCards(10) } },
					creator: userID,
				});
				handleSuccess(userID, code);
			} catch (error) {
				console.log(error);
			}
		} else {
			await handleRoomCreate();
		}
	};

	const handleRoomJoin = async () => {
		const roomExists = (await db.ref(`rooms/${roomCode}`).once("value")).exists();

		if (roomExists) {
			try {
				const userID = uuid();

				await db.ref(`rooms/${roomCode}/players/${userID}`).set({
					name,
					cards: getRandomWhiteCards(),
					points: 0,
				});
				handleSuccess(userID);
			} catch (err) {
				console.log(err);
			}
		} else {
			alert("This room doesn't exist");
		}
	};

	return (
		<Container centerContent>
			<Box shadow="2xl" p="4" rounded="lg" bg="teal.900" w="md">
				<VStack>
					<Input placeholder="Enter name" value={name} onChange={({ target: { value } }) => setName(value)} />
					<HStack h="50px">
						<VStack>
							<Button
								disabled={name === "" || name.length > 12}
								variant="solid"
								onClick={handleRoomCreate}>
								Create Room
							</Button>
						</VStack>
						<Divider orientation="vertical" />
						<Input
							placeholder="Room code"
							value={roomCode}
							onChange={({ target: { value } }) => setRoomCode(value)}></Input>
						<Button
							disabled={name === "" || name.length > 12 || roomCode.length !== 6}
							variant="outline"
							onClick={handleRoomJoin}>
							Join
						</Button>
					</HStack>
				</VStack>
			</Box>
		</Container>
	);
}
