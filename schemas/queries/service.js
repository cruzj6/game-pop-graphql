const ServiceItem = require('../types/serviceItem');
const ServiceType = require('../types/serviceType');
const serviceEndpointUtils = require('./serviceEndpointUtils');
const databaseService = require('../../services/databaseService');
const {
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
} = require('graphql');

const Service = {
	type: new GraphQLList(ServiceItem),
	args: {
		gameName: {
			name: 'gameName',
			type: new GraphQLNonNull(GraphQLString),
		},
		date: {
			name: 'date',
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
		gameName,
		date,
		endDate,
		maxResults,
	}) => {
		const results = databaseService.getGameStatsForServiceSinceDate({
			serviceName,
			gameName,
			maxResults,
			sinceDate: date,
		});

		const isFound = results.length > 0;

		return results
			.filter(result => !endDate || (Number(result.posted) <= Number(endDate)))
			.map(result => ({
				date: result.posted,
				service: serviceName,
				game: { name: gameName },
				hits: isFound ? serviceEndpointUtils.getHitsForServiceData(serviceName, result) : '0',
			}));
	},
};

module.exports = Service;
