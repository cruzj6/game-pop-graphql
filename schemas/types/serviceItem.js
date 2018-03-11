const GameType = require('../types/gameItem');
const ServiceType = require('./serviceType');
const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
} = require('graphql');

const ServiceDataItem = new GraphQLObjectType({
	name: 'ServiceDataItem',
	description: 'describes service data for a game on a given service at a given time',
	fields: () => ({
		game: { type: GameType },
		service: { type: ServiceType },
		date: { type: new GraphQLNonNull(GraphQLString) },
		hits: { type: new GraphQLNonNull(GraphQLString) },
	}),
});

module.exports = ServiceDataItem;
