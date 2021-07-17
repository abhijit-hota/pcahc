import { useEffect, useState } from "react";
import { db } from "./firebase";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "./tokenNames";

export const useRealTimeData = (
	path,
	{ event = "value", initialValue = undefined, transformer = (val) => val } = {}
) => {
	const [data, setData] = useState(initialValue);

	useEffect(() => {
		const roomCode = sessionStorage.getItem(CAH_ROOM_CODE);
		const userID = sessionStorage.getItem(CAH_PLAYER_ID);

		const normalizedPath = path.replace(/^(\/+)/, "").replace("{userID}", userID);
		const fullPath = `rooms/${roomCode}/${normalizedPath}`;

		db.ref(fullPath).on(event, (snap) => {
			if (snap.exists()) {
				setData(snap.val());
			} else {
				setData(initialValue)
			}
		});
		return () => {
			db.ref(fullPath).off(event);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return transformer(data);
};
