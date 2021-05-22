import { Box, HStack, Heading } from "@chakra-ui/layout";
import whites from "../../public/white-cards.json";

const WhiteCards = ({ cards, onSelect, isTurn }) => {
	const _cards = typeof cards[0] === "object" ? cards.map(({ index }) => index) : cards;

	return (
		<HStack w="100%" overflowX="auto">
			{_cards.map((cardIndex, i) => (
				<Box
					bg="white"
					minW="56"
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
							onSelect(cards[i]);
						}
					}}
					onClick={() => {
						if (isTurn) {
							onSelect(cards[i]);
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

export default WhiteCards;
