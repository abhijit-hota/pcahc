import * as admin from "firebase-admin";

import serviceAccount from "./private-key.json";

if (admin.apps.length === 0) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://pcahc-a5b39-default-rtdb.asia-southeast1.firebasedatabase.app",
	});
}

const db = admin.database();

export { db };
