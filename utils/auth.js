import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";

function getFirebaseApp() {
	if (firebase.apps.length > 0) return firebase.app();

	return firebase.initializeApp(firebaseConfig);
}

const _firebase = getFirebaseApp();
export const auth = _firebase.auth();
