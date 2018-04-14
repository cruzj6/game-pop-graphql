const dynamodb = require('../../services/dynamodb');

const ServiceItem = require('../types/serviceItem');
const ServiceType = require('../types/serviceType');
const serviceEndpointUtils = require('./serviceEndpointUtils');
const {
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
} = require('graphql');

const Popular = {
	type: new GraphQLList(ServiceItem),
	args: {
		startDate: {
			name: 'startDate',
			type: new GraphQLNonNull(GraphQLString),
		},
		endDate: {
			name: 'endDate',
			type: GraphQLString,
		},
		serviceName: {
			name: 'service',
			type: new GraphQLNonNull(ServiceType),
		},
		maxResults: {
			name: 'max',
			type: GraphQLInt,
		},
	},
	resolve: async (root, {
		serviceName,
		startDate,
		endDate,
	}) => {
		const results = await dynamodb.getMostPopularInRange({ startTime: startDate, endTime: endDate });

		return results.map(result => ({
			date: result.posted,
			service: serviceName,
			game: { name: result.gamename },
			hits: serviceEndpointUtils.getHitsForServiceData(serviceName, result),
		}));
	},
};

module.exports = Popular;
