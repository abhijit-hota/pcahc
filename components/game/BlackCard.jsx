import { Box, Heading } from "@chakra-ui/layout";
import blacks from "public/data/black-cards.json";
import { useRealTimeData } from "frontend-utils/hooks";

const BlackCard = () => {
	const index = useRealTimeData("/round/blackCard");
	return (
		<Box
			bg="black"
			minW={["44", "64"]}
			maxW={["44", "64"]}
			minH={["30", "80"]}
			rounded="lg"
			p="4"
			shadow="dark-lg"
		>
			<Heading color="white" size="lg">
				{blacks[index]}
			</Heading>
		</Box>
	);
};

export default BlackCard;
