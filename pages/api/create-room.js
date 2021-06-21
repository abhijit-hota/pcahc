import { auth } from "firebase-admin";
import { db } from ".";
import { generateRoomCode } from "../../utils/generateRoomCode";
import { getRandomBlackCard, getRandomWhiteCards } from "../../utils/getRandomCard";
import { addLeaveListener } from "./addLeaveListener";

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
		players: { [userID]: { name, points: 0 } },
		playerCards: { [userID]: getRandomWhiteCards(10) },
	});
};

const handleCreateRoom = async (req, res) => {
	try {
		const { username, userID } = req.body;
		const roomCode = await createRoomCode();
		await createRoom(roomCode, { id: userID, name: username });
		await auth().setCustomUserClaims(userID, { roomCode });
		await addLeaveListener(roomCode);
		res.json({ roomCode });
	} catch (error) {
		console.error(error);
		res.status(500).send(error?.message);
	}
};

export default handleCreateRoom;
