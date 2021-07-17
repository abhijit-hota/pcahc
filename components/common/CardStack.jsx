import { useRef } from "react";
import { HStack } from "@chakra-ui/layout";

const CardStack = ({ children }) => {
	const cardsRowRef = useRef(null);

	return (
		<HStack
			alignSelf="flex-start"			
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
			{children}
		</HStack>
	);
};

export default CardStack;
