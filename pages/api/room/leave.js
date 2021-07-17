import { auth } from "firebase-admin";
import { db } from "backend-utils/db";
import { getNextCzar } from "../change-czar";

const cleanUpGame = async (roomCode, removedPlayerID) => {
	const roomPath = `rooms/${roomCode}`;

	const czar = (await db.ref(`${roomPath}/round/czar`).get()).val();
	if (czar === removedPlayerID) {
		const nextCzarID = await getNextCzar(roomCode, czar);
		if (nextCzarID === czar) {
			db.ref(roomPath).remove();
			console.debug("No one found. Deleting Room.");
		} else {
			db.ref(`${roomPath}/round/czar`).set(nextCzarID);
			console.debug("User was Czar. Czar changed.");
		}
	}
	try {
		await auth().deleteUser(removedPlayerID);
		console.debug("User deleted");
	} catch (error) {
		console.debug("User already deleted");
	}
};

export default async function leaveRoom(req, res) {
	const { roomCode, uid: removedPlayerID } = req.body;
	await cleanUpGame(roomCode, removedPlayerID);
	return res.json({ success: true });
}
