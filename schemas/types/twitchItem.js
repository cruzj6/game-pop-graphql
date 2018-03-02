const GameType = require('../types/gameItem');
const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
} = require('graphql');

const TwitchDataItem = new GraphQLObjectType({
	name: 'TwitchDataItem',
	description: 'describes twitch data for a game at a given time',
	fields: () => ({
		game: { type: GameType },
		date: { type: new GraphQLNonNull(GraphQLString) },
		viewers: { type: new GraphQLNonNull(GraphQLString) },
	}),
});

module.exports = TwitchDataItem;
