import { v4 as uuid } from "uuid";
import { db } from ".";
import { getRandomWhiteCards } from "../../utils/getRandomCard";

const handleJoinRoom = async (req, res) => {
	try {
		const { roomCode, username } = req.body;

		const roomExists = (await db.ref(`rooms/${roomCode}`).once("value")).exists();
		if (roomExists) {
			const userID = uuid();
			await db.ref(`rooms/${roomCode}/players/${userID}`).set({
				name: username,
				cards: getRandomWhiteCards(10),
				points: 0,
			});
			res.json({ userID, roomCode });
		} else {
			res.status(400).send("Invalid Room Code");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send(error?.message);
	}
};

export default handleJoinRoom;
