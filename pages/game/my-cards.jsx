import { Box, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import whites from "../../public/white-cards.json";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/_firebase";

const MyCards = ({ isTurn }) => {
	const [cards, setCards] = useState([]);

	useEffect(() => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const userID = sessionStorage.getItem(CAH_PLAYER_ID);

		const _path = `rooms/${roomCode}/players/${userID}/cards`;

		db.ref(_path).on("value", (snap) => {
			setCards(snap.val());
		});

		return () => {
			db.ref(_path).off("value");
		};
	}, []);

	const onSelect = async (index) => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const userID = sessionStorage.getItem(CAH_PLAYER_ID);

		await db.ref(`rooms/${roomCode}/round/whiteCards/${userID}`).set(index);

		const _path = `rooms/${roomCode}/players/${userID}/cards`;
		const newCards = cards.filter((val) => val !== index);
		await db.ref(_path).set(newCards);
	};

	return (
		<HStack w="100%" overflowX="auto">
			{cards.map((cardIndex) => (
				<Box
					bg="white"
					minW="56"
					maxW="56"
					h="56"
					rounded="lg"
					p="4"
					key={cardIndex}
					tabIndex="0"
					role="button"
					cursor={isTurn ? "pointer" : "not-allowed"}
					onKeyDown={(e) => {
						if (e.key === "Enter" && isTurn) {
							e.preventDefault();
							onSelect(cardIndex);
						}
					}}
					onClick={() => {
						if (isTurn) {
							onSelect(cardIndex);
						}
					}}>
					<Heading size="md" color="black">
						{whites[cardIndex].text}
					</Heading>
				</Box>
			))}
		</HStack>
	);
};

export default MyCards;
