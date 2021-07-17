import ky from "ky";
import { auth } from "./firebase";

const kyInstance = ky.create({
	prefixUrl: "/api",
	hooks: {
		beforeRequest: [
			async (req) => {
				if (!req.url.endsWith("leave")) {
					req.headers.append("idToken", await auth.currentUser.getIdToken());
				}
			},
		],
	},
	credentials: "include",
});

const api = {
	...kyInstance,
	/**
	 * @param path {String}
	 */
	post: (path, body) => {
		const input = path[0] === "/" ? path.slice(1) : path;
		return kyInstance.post(input, { json: body }).json();
	},
};

export default api;
