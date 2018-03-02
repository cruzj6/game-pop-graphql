const {
	buildSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
} = require('graphql');

const GameType = new GraphQLObjectType({
	name: 'Game',
	description: 'describes a single game',
	fields: () => ({
		name: { type: new GraphQLNonNull(GraphQLString) },
	}),
});
