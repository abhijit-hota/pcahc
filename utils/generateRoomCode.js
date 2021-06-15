const emptyArr = [0, 0, 0, 0, 0, 0];
const Z = 90;
const A = 65;

const getRandomLetterCode = () => Math.floor(Math.random() * (Z - A + 1)) + A;

const generateRoomCode = () => {
	const charCodes = emptyArr.map(getRandomLetterCode);
	return String.fromCharCode(...charCodes);
};

export { generateRoomCode };
