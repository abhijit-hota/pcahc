import { Box, Divider, Heading, Flex, VStack, HStack, Spacer } from "@chakra-ui/layout";
import { TagLeftIcon } from "@chakra-ui/tag";

const Players = ({ players, czar }) => {
	return (
		<VStack overflowY="auto" w="100%" align="flex-start">
			<Heading size="md">Leader Board</Heading>

			{Object.entries(players)
				.sort(([, a], [, b]) => b.points - a.points)
				.map(([name, { points }], i) => (
					<Box w="100%" h="12" p="4" bg={czar === name ? "whiteAlpha.200" : "whiteAlpha.100"} key={i}>
						<HStack>
							<Heading size="sm">
								{name}
								{czar === name ? " (Czar)" : ""}
							</Heading>
							<Spacer />
							<Heading size="sm">{points}</Heading>
						</HStack>
					</Box>
				))}
		</VStack>
	);
};

export default Players;
