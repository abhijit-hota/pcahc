import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

/* eslint-disable no-undef */
const firebaseConfig = {
	apiKey: "AIzaSyDV5sFB7xIDX-8zh4U1DKzMivaMac3HQlI",
	authDomain: "pcahc-a5b39.firebaseapp.com",
	databaseURL: "https://pcahc-a5b39-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "pcahc-a5b39",
	storageBucket: "pcahc-a5b39.appspot.com",
	messagingSenderId: "729555121194",
	appId: "1:729555121194:web:a27ddcd666f89e8c5abf53",
};

function getFirebaseApp() {
	if (firebase.apps.length > 0) return firebase.app();

	return firebase.initializeApp(firebaseConfig);
}

const _firebase = getFirebaseApp();
export const db = _firebase.database();
export const auth = _firebase.auth();
