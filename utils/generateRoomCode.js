const codeMap = {
	A: "lpha",
	B: "ravo",
	C: "harlie",
	D: "elta",
	E: "cho",
	F: "oxtrot",
	G: "olf",
	H: "otel",
	I: "ndia",
	J: "uliet",
	K: "ilo",
	L: "ima",
	M: "ike",
	N: "ovember",
	O: "scar",
	P: "apa",
	Q: "uebec",
	R: "omeo",
	S: "ierra",
	T: "ango",
	U: "niform",
	V: "ictor",
	W: "hiskey",
	X: "-Ray",
	Y: "ankee",
	Z: "ulu",
};

const letters = Object.keys(codeMap);
const emptyArr = [0, 0, 0, 0, 0, 0];

const generateRoomCode = () => {
	const letterArr = emptyArr.map(() => letters[Math.floor(Math.random() * 26)]);
	const words = letterArr.map((letter) => codeMap[letter]);
	return { letters: letterArr, words };
};

export { generateRoomCode };
