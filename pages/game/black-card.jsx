import { Box, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { CAH_ROOM_CODE } from "../../utils/tokenNames";
import { db } from "../../utils/_firebase";
import blacks from "../../public/black-cards.json";

const BlackCard = () => {
	const [text, setText] = useState("");

	useEffect(() => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		db.ref(`rooms/${roomCode}/round/blackCard`).on("value", (snap) => {
			if (snap.exists()) {
				setText(blacks[snap.val()].text);
			}
		});
	}, []);
	return (
		<Box bg="black" minW={["44", "64"]} maxW={["44", "64"]} minH={["30", "80"]} rounded="lg" p="4" shadow="dark-lg">
			<Heading color="white" size="lg">
				{text}
			</Heading>
		</Box>
	);
};

export default BlackCard;
