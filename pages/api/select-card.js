import { db } from ".";
import { getRandomBlackCard } from "../../utils/getRandomCard";
import * as admin from "firebase-admin";
import { auth } from "firebase-admin";
import getNextCzar from "./getNextCzar";

const handleCzarSelect = async (req, res) => {
	try {
		const { playerID } = req.body;

		const { roomCode, uid: userID } = await auth().verifyIdToken(req.headers.idtoken, true);
		const roomPath = `rooms/${roomCode}`;

		const { czar, blackCard } = (await db.ref(`${roomPath}/round`).get()).val();

		if (czar !== userID) {
			return res.status(400).send("Non-Czar cannot select card");
		}
		await db.ref(roomPath).update({
			[`players/${playerID}/points`]: admin.database.ServerValue.increment(10),
			round: {
				chosen: playerID,
			},
		});
		
		setTimeout(async () => {
			await db.ref(`${roomPath}/playedBlackCards`).once("value", async (snap) => {
				const playedBlackCards = [...snap.val(), blackCard];
				await snap.ref.set(playedBlackCards);
				await db.ref(`${roomPath}/round`).set({
					blackCard: getRandomBlackCard(playedBlackCards),
					whiteCards: {},
					czar: await getNextCzar(roomCode, czar),
				});
			});
		}, 3500);
		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send(error?.message);
	}
};

export default handleCzarSelect;
