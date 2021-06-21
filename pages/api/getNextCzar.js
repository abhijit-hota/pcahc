import { db } from ".";

export default async function getNextCzar(roomCode, passedCzarID) {
	const currentCzarID = passedCzarID ?? (await db.ref(`${roomPath}/round/czar`).get()).val();
	const roomPath = `rooms/${roomCode}`;
	const playerIDs = Object.keys(
		(await db.ref(`${roomPath}/players`).get()).val() ?? { [currentCzarID]: 0 }
	);
	const currentCzarIndex = playerIDs.indexOf(currentCzarID);
	const nextCzarIndex = (currentCzarIndex + 1) % playerIDs.length;
	return playerIDs[nextCzarIndex];
}
