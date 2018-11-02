const serviceEndpointUtils = require('../../services/serviceEndpointUtils');
const athena = require('../../services/athena');
const redisService = require('../../services/redis');
const constants = require('../../constants');

const resultsToServiceItem = (results, serviceName) => results
	.map(result => ({
		date: result.posted,
		service: serviceName,
		game: { name: result.gamename },
		hits: serviceEndpointUtils.getHitsForServiceData(serviceName, result),
	}));

const Popular = async (root, {
	serviceName,
}) => {
	const service = constants.SERVICE_ENDPOINTS[serviceName];
	const cachedResults = await redisService.getTopForService(service);

	if (cachedResults && cachedResults.length > 0) {
		return resultsToServiceItem(cachedResults, service);
	}

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	const results = await athena.getPopular();

	redisService.setTopForService(service, results);

	return resultsToServiceItem(results, service);
};

module.exports = Popular;
