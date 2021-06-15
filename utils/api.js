import ky from "ky";

const kyInstance = ky.create({ prefixUrl: "/api" });

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
