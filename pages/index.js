import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Box, Button, Container, HStack, Input, Spacer, VStack, Divider } from "@chakra-ui/react";
import { generateRoomCode } from "../utils/generateRoomCode";
import rooms from "../utils/_firebase";
import { getRandomWhiteCards, getRandomBlackCard } from "../utils/getRandomCard";

export default function Home() {
	const [name, setName] = useState("");
	const [roomCode, setRoomCode] = useState("");

	const router = useRouter();

	const handleRoomCreate = async () => {
		const { letters, words } = generateRoomCode();
		const code = letters.join("");
		const doc = await rooms.doc(code).get();

		if (!doc.exists) {
			try {
				await rooms.doc(code).set({
					round: {
						chosen: { nickname: "", index: -1 },
						whiteCards: [],
						czar: name,
						blackCard: getRandomBlackCard(),
					},
					players: { [name]: { points: 0, cards: getRandomWhiteCards(10) } },
					creator: name,
				});
				localStorage.setItem("CAHroomCode", code);
				localStorage.setItem("CAHName", name);
				router.push(`/game/${code}`);
			} catch (error) {
				console.log(error);
			}
		} else {
			await handleRoomCreate();
		}
	};

	const handleRoomJoin = async () => {
		const room = await rooms.doc(roomCode).get();
		if (room.exists) {
			console.log(room.data());
			try {
				await rooms.doc(roomCode).update({
					[`players.${name}`]: {
						cards: getRandomWhiteCards(),
						points: 0,
					},
				});
				localStorage.setItem("CAHroomCode", roomCode);
				localStorage.setItem("CAHName", name);
				router.push(`/game/${roomCode}`);
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log(room.data());
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
