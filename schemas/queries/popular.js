const dynamodb = require('../../services/dynamodb');
const redisService = require('../../services/redis');
const ServiceItem = require('../types/serviceItem');
const ServiceType = require('../types/serviceType');
const serviceEndpointUtils = require('./serviceEndpointUtils');
const {
	GraphQLNonNull,
	GraphQLList,
} = require('graphql');

const resultsToServiceItem = (results, serviceName) => results
	.map(result => ({
		date: result.posted,
		service: serviceName,
		game: { name: result.gamename },
		hits: serviceEndpointUtils.getHitsForServiceData(serviceName, result),
	}));

const Popular = {
	type: new GraphQLList(ServiceItem),
	args: {
		serviceName: {
			name: 'service',
			type: new GraphQLNonNull(ServiceType),
		},
	},
	resolve: async (root, {
		serviceName,
	}) => {
		const cachedResults = await redisService.getTopForService(serviceName);

		if (cachedResults && cachedResults.length > 0) {
			return resultsToServiceItem(cachedResults, serviceName);
		}

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const results = await dynamodb.getMostPopularInRange({ serviceName, startTime: oneWeekAgo.getTime(), endTime: Date.now() });

		redisService.setTopForService(serviceName, results);

		return resultsToServiceItem(results, serviceName);
	},
};

module.exports = Popular;
