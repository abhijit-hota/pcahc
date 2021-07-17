import { auth } from "firebase-admin";
import { db } from "backend-utils/db";
import { getRandomBlackCard } from "backend-utils/getRandomCard";

export const getNextCzar = async (roomCode, passedCzarID) => {
	const roomPath = `rooms/${roomCode}`;
	const currentCzarID = passedCzarID ?? (await db.ref(`${roomPath}/round/czar`).get()).val();
	const playerIDs = Object.keys(
		(await db.ref(`${roomPath}/players`).get()).val() ?? { [currentCzarID]: 0 }
	);
	const currentCzarIndex = playerIDs.indexOf(currentCzarID);
	const nextCzarIndex = (currentCzarIndex + 1) % playerIDs.length;
	return playerIDs[nextCzarIndex];
};

export default async function handleChangeCzar(req, res) {
	const { roomCode } = await auth().verifyIdToken(req.headers.idtoken, true);
	const roomPath = `rooms/${roomCode}`;
	const { blackCard, czar } = req.body;

	try {
		const snap = await db.ref(`${roomPath}/playedBlackCards`).once("value");
		const playedBlackCards = [...snap.val(), blackCard];
		await snap.ref.set(playedBlackCards);
		await db.ref(`${roomPath}/round`).set({
			blackCard: getRandomBlackCard(playedBlackCards),
			whiteCards: {},
			czar: await getNextCzar(roomCode, czar),
		});
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false });
	}
}
