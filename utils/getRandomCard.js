import whites from "../public/white-cards.json";
import blacks from "../public/black-cards.json";

const NUM_WHITES = whites.length;
const NUM_BLACKS = blacks.length;

const getRandomBlackCard = () => Math.floor(Math.random() * NUM_BLACKS);

const getRandomWhiteCards = (n = 6) => {
	const _n = Math.min(10, n);

	const result = [];
	for (let i = 0; i < _n; i++) {
		const getUniqueRandomNumber = () => {
			const rand = Math.floor(Math.random() * NUM_WHITES);
			if (result.includes(rand)) {
				return getUniqueRandomNumber();
			}
			return rand;
		};
		result.push(getUniqueRandomNumber());
	}
	return result;
};

export { getRandomBlackCard, getRandomWhiteCards };
