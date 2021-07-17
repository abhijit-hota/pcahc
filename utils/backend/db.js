/* eslint-disable no-undef */
import * as admin from "firebase-admin";

const prodConfig = {
	type: "service_account",
	project_id: process.env.NEXT_PUBLIC_projectId,
	private_key_id: process.env.FB_ADMIN_PRIVATE_KEY_ID,
	// private_key: JSON.parse(process.env.FB_ADMIN_PRIVATE_KEY).key,
	private_key: process.env.FB_ADMIN_PRIVATE_KEY,
	client_email: process.env.FB_ADMIN_CLIENT_EMAIL,
	client_id: process.env.FB_ADMIN_CLIENT_ID,
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url: process.env.FB_ADMIN_CLIENT_X509_CERT_URL,
};
if (admin.apps.length === 0) {
	admin.initializeApp({
		credential: admin.credential.cert(prodConfig),
		databaseURL: "https://pcahc-a5b39-default-rtdb.asia-southeast1.firebasedatabase.app",
	});
}

const db = admin.database();

export { db };
