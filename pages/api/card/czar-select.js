import { db } from "backend-utils/db";
import * as admin from "firebase-admin";
import { auth } from "firebase-admin";

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
			["round/chosen"]: playerID,
		});

		res.json({ success: true, blackCard, czar });
	} catch (error) {
		console.error(error);
		res.status(500).send(error?.message);
	}
};

export default handleCzarSelect;
