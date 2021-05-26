import { Box, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import whites from "../../public/white-cards.json";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/_firebase";
import { getRandomBlackCard } from "../../utils/getRandomCard";

import firebase from "firebase/app";
import { motion } from "framer-motion";
import { useToast } from "@chakra-ui/toast";
const MotionBox = motion(Box);

const PlayedCards = ({ czar, playerIDs, setIsTurnLeft }) => {
	const [cards, setCards] = useState([]);
	const cardsRowRef = useRef(null);
	const toast = useToast();

	const getNextCzar = () => {
		const currentCzar = playerIDs.findIndex(({ key }) => key === czar);
		const nextCzarIndex = currentCzar + 1 >= playerIDs.length ? 0 : currentCzar + 1;
		return playerIDs[nextCzarIndex].key;
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
		if (playerIDs.length > 0) {
			db.ref(`rooms/${roomCode}/round/chosen`).on("value", (snap) => {
				const chosen = snap.val();
				if (chosen && snap.exists() && czar !== playerID) {
					try {
						const title = `${
							playerIDs.find(({ key }) => key === chosen)?.name
						}'s card was selected by the Czar!`;
						toast({
							duration: 2500,
							position: "top",
							title,
							status: "info",
							isClosable: false,
						});
					} catch (error) {
						console.log(error);
					}
				}
			});
		}
		return () => {
			db.ref(`rooms/${roomCode}/round/chosen`).off("value");
			db.ref(path).off("value");
		};
	}, [playerIDs]);

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
				await db.ref(`${basePath}/round`).set({
					blackCard: getRandomBlackCard(),
					whiteCards: {},
					czar: getNextCzar(),
				});
			}, 3000);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<HStack
			alignSelf="flex-start"
			maxW={["95vw", "60vw"]}
			overflowX="auto"
			ref={cardsRowRef}
			onWheel={(e) => {
				const direction = e.deltaY > 0 ? 1 : -1;
				cardsRowRef.current.scrollLeft += 100 * direction;
			}}>
			{cards.map(([player, index]) => {
				const isTurn = czar === sessionStorage.getItem(CAH_PLAYER_ID);
				return (
					<MotionBox
						bg="white"
						minW={["40", "56"]}
						maxW={["40", "56"]}
						h={["32", "56"]}
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
