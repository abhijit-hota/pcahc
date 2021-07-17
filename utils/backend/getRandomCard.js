import whites from "public/white-cards.json";
import blacks from "public/black-cards.json";

const NUM_WHITES = whites.length;
const NUM_BLACKS = blacks.length;

const getUniqueRandomNumber = (limit, compareAgainst) => {
	const rand = Math.floor(Math.random() * limit);
	if (compareAgainst.flat().includes(rand)) {
		return getUniqueRandomNumber(limit, compareAgainst);
	}
	return rand;
};

const getRandomBlackCard = (playedBlackCards = []) => {
	return getUniqueRandomNumber(NUM_BLACKS, playedBlackCards);
};

const getRandomWhiteCards = (n = 6, checkArray = []) => {
	const _n = Math.min(10, n);

	const result = [];
	for (let i = 0; i < _n; i++) {
		const uniqueRand = getUniqueRandomNumber(NUM_WHITES, [result, checkArray]);
		result.push(uniqueRand);
	}
	return result;
};

export { getRandomBlackCard, getRandomWhiteCards };
