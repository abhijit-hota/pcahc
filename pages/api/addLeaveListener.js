import { auth } from "firebase-admin";
import { db } from ".";
import getNextCzar from "./getNextCzar";

export const cleanUpGame = async (roomCode, removedPlayerID) => {
	const roomPath = `rooms/${roomCode}`;

	await db.ref(`${roomPath}/playerCards/${removedPlayerID}`).remove();
	db.ref(`${roomPath}/round/whiteCards/${removedPlayerID}`).remove();

	const czar = (await db.ref(`${roomPath}/round/czar`).get()).val();
	if (czar === removedPlayerID) {
		const nextCzarID = await getNextCzar(roomCode, czar);

		if (nextCzarID === czar) {
			db.ref(roomPath).remove();
			console.log("No one found. Deleting Room.");
		} else {
			db.ref(`${roomPath}/round/czar`).set(nextCzarID);
			console.log("User was Czar. Czar changed.");
		}
		try {
			await auth().deleteUser(removedPlayerID);
			console.log("User deleted");
		} catch (error) {
			console.log("User already deleted");
		}
	}
};

export const addLeaveListener = async (roomCode) => {
	const roomPath = `rooms/${roomCode}`;
	console.log("Listener Added.");
	db.ref(`${roomPath}/players`).on("child_removed", async (snap) => {
		if (snap.exists()) {
			const removedPlayerID = snap.key;
			cleanUpGame(roomCode, removedPlayerID);
		}
	});
};
