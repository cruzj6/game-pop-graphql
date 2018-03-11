const {
	GraphQLEnumType,
} = require('graphql');
const Constants = require('../../constants');

const ServiceType = new GraphQLEnumType({
	name: 'ServiceType',
	values: Object.keys(Constants.SERVICE_ENDPOINTS)
		.reduce((enums, key) => ({
			...enums,
			[key]: {
				value: Constants.SERVICE_ENDPOINTS[key],
			},
		}), {}),
});

module.exports = ServiceType;
