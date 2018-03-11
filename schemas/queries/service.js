const ServiceItem = require('../types/serviceItem');
const ServiceType = require('../types/serviceType');
const serviceEndpointUtils = require('./serviceEndpointUtils');
const axios = require('axios');

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
		maxResults = 1,
	}) => {
		const { data } = await axios
			.get(`${process.env.GP_DATABASE_SERVICE_URL}/services/${serviceName}`, {
				params: {
					gameName,
					maxResults: String(maxResults),
					sinceDate: date,
				},
			});

		const isFound = data.length > 0;

		return data
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
