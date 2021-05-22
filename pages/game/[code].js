import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { Box, Button, Container, Divider, Input, Spacer, VStack } from "@chakra-ui/react";
import BlackCard from "./black-card";
import Players from "./players";
import WhiteCards from "./white-cards";

import rooms from "../../utils/_firebase";
import blacks from "../../public/black-cards.json";
import firebase from "firebase";
import { getRandomBlackCard } from "../../utils/getRandomCard";

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export const getStaticProps = (ctx) => ({
	props: { code: ctx.params.code },
});

export default function Game({ code }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	const [roomCode, setRoomCode] = useState(code);
	const [name, setName] = useState("");

	const [gameData, setGameData] = useState({});
	const [isTurnLeft, setIsTurnLeft] = useState(true);

	useEffect(() => {
		setName(localStorage.getItem("CAHName"));
		if (!roomCode) {
			setRoomCode(localStorage.getItem("CAHroomCode"));
		}
		const unsubscribe = rooms.doc(roomCode).onSnapshot((doc) => {
			if (doc.exists) {
				setGameData(doc.data());
			}
			setIsLoading(false);
		});
		return unsubscribe;
	}, []);

	const getNextCzar = () => {
		const players = Object.keys(gameData.players);
		const currentCzar = players.indexOf(gameData.round.czar);
		const nextCzarIndex = currentCzar + 1 >= players.length ? 0 : currentCzar + 1;
		return players[nextCzarIndex];
	};

	const handleTurn = async (index) => {
		try {
			await rooms.doc(roomCode).update({
				[`players.${name}.cards`]: firebase.firestore.FieldValue.arrayRemove(index),
				"round.whiteCards": firebase.firestore.FieldValue.arrayUnion({
					name,
					index,
				}),
			});
			setIsTurnLeft(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCzarSelect = async ({ name, index }) => {
		try {
			await rooms.doc(roomCode).update({
				[`players.${name}.points`]: firebase.firestore.FieldValue.increment(10),
				"round": {
					// chosen: { name, index },
					blackCard: getRandomBlackCard(),
					whiteCards: [],
					czar: getNextCzar(),
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container centerContent w="full" h="100%">
			<Head>
				<title>Game {roomCode} </title>
			</Head>
			{isLoading ? (
				"Loading"
			) : (
				<Box rounded="lg" d="flex" h="87vh" p="4" w="85vw">
					<VStack w="20vw">
						<BlackCard text={blacks[gameData.round.blackCard].text} />
						<Spacer />
						<Players players={gameData.players} czar={gameData.round.czar} />
					</VStack>
					<Divider orientation="vertical" ml="4" mr="4" />
					<VStack w="60vw" h="100%">
						<WhiteCards
							cards={gameData.round.whiteCards}
							onSelect={handleCzarSelect}
							isTurn={gameData.round.czar === name}
						/>
						<Spacer />
						<WhiteCards
							cards={gameData.players[name].cards}
							onSelect={handleTurn}
							isTurn={
								!gameData.round.whiteCards.some(({ name: _name }) => name === _name) &&
								gameData.round.czar !== name
							}
						/>
					</VStack>
				</Box>
			)}
		</Container>
	);
}
