import { Box, Heading } from "@chakra-ui/layout";

const Card = ({ text, isTurn, onSelect }) => {
	return (
		<Box
			bg="white"
			minW={["40", "56"]}
			maxW={["40", "56"]}
			h={["32", "56"]}
			rounded="lg"
			p="4"
			tabIndex="0"
			role="button"
			cursor={isTurn ? "pointer" : "not-allowed"}
			onKeyDown={(e) => {
				if (e.key === "Enter" && isTurn) {
					e.preventDefault();
					onSelect();
				}
			}}
			onClick={() => {
				if (isTurn) {
					onSelect();
				}
			}}
		>
			<Heading size="md" color="black">
				{text}
			</Heading>
		</Box>
	);
};

export default Card;
