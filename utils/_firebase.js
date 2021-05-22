import firebase from "firebase";
import "firebase/firestore";

if (firebase.apps.length === 0) {
	const firebaseConfig = {
		apiKey: "AIzaSyCLQW1G3Qob1wHSDfv-K72aFC6HlWk4yIs",
		authDomain: "pcahc-9e856.firebaseapp.com",
		projectId: "pcahc-9e856",
		storageBucket: "pcahc-9e856.appspot.com",
		messagingSenderId: "480285519283",
		appId: "1:480285519283:web:ecf97ba64de8d76c37afc6",
	};
	firebase.initializeApp(firebaseConfig);
}
const rooms = firebase.firestore().collection("rooms");

export default rooms;
