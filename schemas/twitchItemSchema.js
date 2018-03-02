const axios = require('axios');
const GameType = require('./gameItemSchema');
const {
	buildSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
} = require('graphql');

const TwitchDataItemType = new GraphQLObjectType({
	name: 'TwitchDataItem',
	description: 'describes twitch data at a given time',
	fields: () => ({
		game: { type: GameType },
		date: { type: new GraphQLNonNull(GraphQLString) },
		viewers: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: async () => {
				// const result = axios('');
			},
		},
	}),
});

const RootSchema = new GraphQLObjectType({

});

const schema = buildSchema({
	query: RootSchema,
});

module.exports = schema;
