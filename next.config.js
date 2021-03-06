/* eslint-disable */

const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require("next/constants");
const withTM = require("next-transpile-modules")(["ky"]);

module.exports = withTM((phase) => ({
	env: {
		DEPLOYMENT_ENV:
			phase === PHASE_DEVELOPMENT_SERVER ? "development" : phase === PHASE_PRODUCTION_BUILD ? "production" : "",
	},
	images: {
		domains: ["source.boringavatars.com"],
	},
}));
