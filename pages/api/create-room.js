import { v4 as uuid } from "uuid";
import { db } from ".";
import { generateRoomCode } from "../../utils/generateRoomCode";
import { getRandomBlackCard, getRandomWhiteCards } from "../../utils/getRandomCard";

const createRoomCode = async () => {
	const code = generateRoomCode();
	const roomExists = (await db.ref(`rooms/${code}`).once("value")).exists();

	if (roomExists) {
		return await createRoomCode();
	}
	return code;
};

const createRoom = async (code, user) => {
	const newBlackCard = getRandomBlackCard();
	const { id: userID, name } = user;

	await db.ref(`rooms/${code}`).set({
		round: {
			whiteCards: [],
			czar: userID,
			blackCard: getRandomBlackCard(),
		},
		playedBlackCards: [newBlackCard],
		players: { [userID]: { name, points: 0, cards: getRandomWhiteCards(10) } },
		creator: userID,
	});
};

const handleCreateRoom = async (req, res) => {
	try {
		const id = uuid();
		const code = await createRoomCode();
		await createRoom(code, { id, name: req.body.username });
		res.json({ userID: id, roomCode: code });
    } catch (error) {
        console.error(error)
		res.status(500).send(error?.message);
	}
};

export default handleCreateRoom;
