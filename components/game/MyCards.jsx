import api from "frontend-utils/api";
import whites from "public/white-cards.json";
import { useRealTimeData } from "frontend-utils/hooks";
import { Card, CardStack } from "components/common";

const MyCards = ({ isTurn }) => {
	const cards = useRealTimeData("/playerCards/{userID}", { initialValue: [] });

	const onSelect = async (index) => {
		try {
			await api.post("/card/select", { index });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<CardStack>
			{cards.map((cardIndex) => (
				<Card
					key={cardIndex}
					text={whites[cardIndex]}
					isTurn={isTurn}
					onSelect={() => {
						onSelect(cardIndex);
					}}
				/>
			))}
		</CardStack>
	);
};

export default MyCards;
