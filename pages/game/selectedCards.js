import { Box, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import whites from "../../public/white-cards.json";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/_firebase";
import { getRandomBlackCard } from "../../utils/getRandomCard";

import firebase from "firebase/app";
import { motion } from "framer-motion";
const MotionBox = motion(Box);

const PlayedCards = ({ czar, playerIDs, setIsTurnLeft }) => {
	const [cards, setCards] = useState([]);
	const getNextCzar = () => {
		const currentCzar = playerIDs.indexOf(czar);
		const nextCzarIndex = currentCzar + 1 >= playerIDs.length ? 0 : currentCzar + 1;
		return playerIDs[nextCzarIndex];
	};

	useEffect(() => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const playerID = sessionStorage.getItem(CAH_PLAYER_ID);
		const path = `rooms/${roomCode}/round/whiteCards`;

		db.ref(path).on("value", (snap) => {
			if (snap.exists()) {
				const playedCards = Object.entries(snap.val());
				setCards(playedCards);
				setIsTurnLeft(playedCards.every(([player]) => player !== playerID));
			} else {
				setCards([]);
			}
		});

		return () => {
			db.ref(path).off("value");
		};
	}, []);

	const handleCzarSelect = async (player) => {
		const basePath = `rooms/${sessionStorage.getItem(CAH_ROOM_CODE)}`;

		try {
			await db.ref(basePath).update({
				[`players/${player}/points`]: firebase.database.ServerValue.increment(10),
				round: {
					chosen: player,
				},
			});
			setTimeout(async () => {
				await db.ref(`${basePath}/round`).update({
					blackCard: getRandomBlackCard(),
					whiteCards: {},
					czar: getNextCzar(),
					chosen: "",
				});
			}, 3000);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<HStack w="100%" overflowX="auto">
			{cards.map(([player, index]) => {
				const isTurn = czar === sessionStorage.getItem(CAH_PLAYER_ID);
				return (
					<MotionBox
						whileHover={{ scale: 1.2 }}
						bg="white"
						minW="56"
						maxW="56"
						h="56"
						rounded="lg"
						p="4"
						key={`${player}-${index}`}
						tabIndex="0"
						role="button"
						cursor={isTurn ? "pointer" : "not-allowed"}
						onKeyDown={(e) => {
							if (e.key === "Enter" && isTurn) {
								e.preventDefault();
								handleCzarSelect(player);
							}
						}}
						onClick={() => {
							if (isTurn) {
								handleCzarSelect(player);
							}
						}}>
						<Heading size="md" color="black">
							{whites[index].text}
						</Heading>
					</MotionBox>
				);
			})}
		</HStack>
	);
};

export default PlayedCards;
