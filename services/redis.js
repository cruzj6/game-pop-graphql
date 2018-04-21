const redis = require('redis');
const { promisify } = require('util');
const logger = require('./logger');

const client = redis.createClient({
	url: process.env.REDIS_URL,
	password: process.env.REDIS_PASS,
});

const set = promisify(client.set).bind(client);
const get = promisify(client.get).bind(client);

const TOP_GAMES_CACHE_TIME_SEC = 60 * 60; // cache 1 hour

const getCacheKey = serviceName => `top-hits-${serviceName}`;

const redisService = {
	setTopForService: (serviceName, topGameData) => set(getCacheKey(serviceName), JSON.stringify(topGameData), 'EX', TOP_GAMES_CACHE_TIME_SEC),
	getTopForService: async (serviceName) => {
		const cachedJSON = await get(getCacheKey(serviceName));

		if (!cachedJSON) return null;

		try {
			return JSON.parse(cachedJSON);
		} catch (e) {
			logger.error('Could not parse cached top games data', e);
			return null;
		}
	},
};

module.exports = redisService;
