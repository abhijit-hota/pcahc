import { Box, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import whites from "../../public/white-cards.json";
import api from "../../utils/api";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/db";

const MyCards = ({ isTurn }) => {
	const [cards, setCards] = useState([]);
	const cardsRowRef = useRef(null);
	useEffect(() => {
		const roomCode = sessionStorage[CAH_ROOM_CODE];
		const userID = sessionStorage[CAH_PLAYER_ID];

		const _path = `rooms/${roomCode}/playerCards/${userID}`;
		try {
			db.ref(_path).on("value", (snap) => {
				setCards(snap.val());
			});
		} catch (error) {
			console.log(1);
			console.log(error);
		}
		return () => {
			db.ref(_path).off("value");
		};
	}, []);

	const onSelect = async (index) => {
		try {
			await api.post("/play-card", { index });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<HStack
			maxW={["95vw", "60vw"]}
			overflowX="auto"
			ref={cardsRowRef}
			onWheel={(e) => {
				if (e.deltaY) {
					const direction = e.deltaY > 0 ? 1 : -1;
					cardsRowRef.current.scrollLeft += 100 * direction;
				}
			}}
		>
			{cards.map((cardIndex) => (
				<Box
					bg="white"
					minW={["40", "56"]}
					maxW={["40", "56"]}
					h={["32", "56"]}
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
					}}
				>
					<Heading size="md" color="black">
						{whites[cardIndex].text}
					</Heading>
				</Box>
			))}
		</HStack>
	);
};

export default MyCards;
