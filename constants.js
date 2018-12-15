const _ = require('lodash');

const SERVICE_ENDPOINTS = {
	TWITCH: 'twitch',
};

const SERVICE_TABLES = {
	[_.toUpper(SERVICE_ENDPOINTS.TWITCH)]: 'twitch',
};

const AWS_ATHENA = {
	S3_RESULTS_URL: 's3://athena-twitch-results',
	DATABASE_NAME: 'twitchgames',
};

const ATHENA_QUERY_STATES = {
	SUCCEEDED: 'SUCCEEDED',
	FAILED: 'FAILED',
	RUNNING: 'RUNNING',
	CANCELLED: 'CANCELLED',
	QUEUED: 'QUEUED',
};

const TWITCH_API_URL_V5 = 'https://api.twitch.tv/kraken/';
const TWITCH_DATA_TYPES = {
	STREAMS: 'streams',
	GAMES: 'games',
};

module.exports = {
	SERVICE_ENDPOINTS,
	SERVICE_TABLES,
	AWS_ATHENA,
	ATHENA_QUERY_STATES,
	TWITCH_API_URL_V5,
	TWITCH_DATA_TYPES,
};
