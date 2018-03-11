const Constants = require('../../constants');

module.exports = {
	getHitsForServiceData(service, data) {
		switch (service) {
		case Constants.SERVICE_ENDPOINTS.TWITCH:
			return String(data.viewers);
		default:
			return null;
		}
	},
};
