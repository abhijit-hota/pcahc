import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "./firebaseConfig";

if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig);
}
export const db = firebase.database();
