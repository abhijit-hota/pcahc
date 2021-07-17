import { auth } from "firebase-admin";
import { db } from "backend-utils/db";
import { getRandomWhiteCards } from "backend-utils/getRandomCard";

const handleJoinRoom = async (req, res) => {
	try {
		const { roomCode, username, userID } = req.body;

		const roomExists = (await db.ref(`rooms/${roomCode}`).once("value")).exists();

		if (roomExists) {
			await db.ref(`rooms/${roomCode}/players/${userID}`).set({
				name: username,
				points: 0,
			});
			await db.ref(`rooms/${roomCode}/playerCards/${userID}`).set(getRandomWhiteCards(10));
			await auth().setCustomUserClaims(userID, { roomCode });
			res.json({ success: true });
		} else {
			res.status(400).send("Invalid Room Code");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send(error?.message);
	}
};

export default handleJoinRoom;
