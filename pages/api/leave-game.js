import { auth } from "firebase-admin";
import { cleanUpGame } from "./addLeaveListener";

export default async function leaveGamer(req, res) {
	const { roomCode, uid: removedPlayerID } = await auth().verifyIdToken(
		req.headers.idtoken,
		true
	);
	await cleanUpGame(roomCode, removedPlayerID);
	res.json({ success: true });
}
