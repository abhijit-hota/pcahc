import { AspectRatio, Box, Divider, Flex, Grid, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import rooms from "../../utils/_firebase";

const BlackCard = ({ text }) => {
	return (
		<Box bg="black" w="64" minH="80" rounded="lg" p="4" shadow="dark-lg">
			<Heading color="white" size="lg">
				{text}
			</Heading>
		</Box>
	);
};

export default BlackCard;
