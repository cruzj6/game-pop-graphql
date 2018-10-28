const _ = require('lodash');

const SERVICE_ENDPOINTS = {
	TWITCH: 'twitch',
};

const SERVICE_TABLES = {
	[_.toUpper(SERVICE_ENDPOINTS.TWITCH)]: 'twitch',
};

module.exports = {
	SERVICE_ENDPOINTS,
	SERVICE_TABLES,
};
