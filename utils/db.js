import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "./firebaseConfig";

function getFirebaseApp() {
	if (firebase.apps.length > 0) return firebase.app();

	return firebase.initializeApp(firebaseConfig);
}

const _firebase = getFirebaseApp();
export const db = _firebase.database();
