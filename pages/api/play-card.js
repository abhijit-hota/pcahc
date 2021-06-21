import { auth } from "firebase-admin";
import { db } from ".";
import { getRandomWhiteCards } from "../../utils/getRandomCard";

const handlePlayCard = async (req, res) => {
	try {
		const { index } = req.body;
		const { roomCode, uid: userID } = await auth().verifyIdToken(req.headers.idtoken, true);

		const roomPath = `rooms/${roomCode}`;

		const czar = await (await db.ref(`${roomPath}/czar`).get()).val();

		if (czar === userID) {
			return res.status(400).send("Czar cannot play card");
		}

		await db.ref(`${roomPath}/round/whiteCards/${userID}`).set(index);

		await db.ref(`${roomPath}/playerCards/${userID}`).once("value", (snap) => {
			if (snap.exists()) {
				const cards = snap.val();
				const updatedCards = cards.filter((val) => val !== index);
				const newCards =
					updatedCards.length > 3
						? updatedCards
						: [...updatedCards, getRandomWhiteCards(3, updatedCards)];
				snap.ref.set(newCards);
			}
		});

		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send(error?.message);
	}
};

export default handlePlayCard;
