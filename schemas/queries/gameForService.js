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

const GameForService = {
	type: new GraphQLList(ServiceItem),
	args: {
		gameName: {
			name: 'gameName',
			type: new GraphQLNonNull(GraphQLString),
		},
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
		gameName,
		serviceName,
		startDate,
		endDate,
	}) => {
		const results = await dynamodb.getServiceItemsForGame({
			gameName,
			startTime:
			startDate,
			endTime: endDate,
			serviceName,
		});

		return results.map(result => ({
			date: result.posted,
			service: serviceName,
			game: { name: result.gamename },
			hits: serviceEndpointUtils.getHitsForServiceData(serviceName, result),
		}));
	},
};

module.exports = GameForService;
