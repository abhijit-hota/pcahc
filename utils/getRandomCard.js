import whites from "../public/white-cards.json";
import blacks from "../public/black-cards.json";

const NUM_WHITES = whites.length;
const NUM_BLACKS = blacks.length;

const getRandomBlackCard = () => Math.floor(Math.random() * NUM_BLACKS);
const getRandomWhiteCards = (n = 6) =>
	Array(n)
		.fill(0)
        .map(() => Math.floor(Math.random() * NUM_WHITES));
        
export { getRandomBlackCard, getRandomWhiteCards };
