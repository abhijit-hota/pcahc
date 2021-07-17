import { useEffect } from "react";
import whites from "../../public/white-cards.json";
import { CAH_PLAYER_ID } from "frontend-utils/tokenNames";
import api from "frontend-utils/api";
import { useRealTimeData } from "frontend-utils/hooks";
import { Card, CardStack } from "components/common";

const PlayedCards = ({ czar, setIsTurnLeft }) => {
	const cards = useRealTimeData("/round/whiteCards", {
		initialValue: [],
		transformer: Object.entries,
	});

	useEffect(() => {
		const thisID = sessionStorage.getItem(CAH_PLAYER_ID);
		setIsTurnLeft(cards.every(([playerID]) => playerID !== thisID));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cards]);

	const handleCzarSelect = async (playerID) => {
		try {
			const { blackCard, czar } = await api.post("/card/czar-select", { playerID });
			setTimeout(async () => {
				await api.post("/change-czar", { blackCard, czar });
			}, 3000);
		} catch (error) {
			console.log(await error?.response.json());
		}
	};
	return (
		<CardStack>
			{cards.map(([userID, index]) => {
				return (
					<Card
						text={whites[index]}
						key={`${userID}-${index}`}
						isTurn={czar === sessionStorage[CAH_PLAYER_ID]}
						onSelect={() => {
							handleCzarSelect(userID);
						}}
					/>
				);
			})}
		</CardStack>
	);
};

export default PlayedCards;
