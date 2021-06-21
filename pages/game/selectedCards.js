import { Box, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import whites from "../../public/white-cards.json";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/db";
import { motion } from "framer-motion";
import { useToast } from "@chakra-ui/toast";
import api from "../../utils/api";

const MotionBox = motion(Box);

const PlayedCards = ({ czar, setIsTurnLeft }) => {
	const [cards, setCards] = useState([]);
	const cardsRowRef = useRef(null);
	const toast = useToast();

	useEffect(() => {
		const roomCode = sessionStorage[CAH_ROOM_CODE];
		const playerID = sessionStorage[CAH_PLAYER_ID];
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
		db.ref(`rooms/${roomCode}/round/chosen`).on("value", (snap) => {
			const chosen = snap.val();
			if (chosen && snap.exists() && czar !== playerID) {
				try {
					const title = `${chosen}'s card was selected by the Czar!`;
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
		return () => {
			db.ref(`rooms/${roomCode}/round/chosen`).off("value");
			db.ref(path).off("value");
		};
	}, []);

	const handleCzarSelect = async (playerID) => {
		try {
			await api.post("/select-card", { playerID });
		} catch (error) {
			console.log(await error?.response.json());
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
			}}
		>
			{cards.map(([userID, index]) => {
				const isTurn = czar === sessionStorage[CAH_PLAYER_ID];
				return (
					<MotionBox
						bg="white"
						minW={["40", "56"]}
						maxW={["40", "56"]}
						h={["32", "56"]}
						rounded="lg"
						p="4"
						key={`${userID}-${index}`}
						tabIndex="0"
						role="button"
						cursor={isTurn ? "pointer" : "not-allowed"}
						onKeyDown={(e) => {
							if (e.key === "Enter" && isTurn) {
								e.preventDefault();
								handleCzarSelect(userID);
							}
						}}
						onClick={() => {
							if (isTurn) {
								handleCzarSelect(userID);
							}
						}}
					>
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
