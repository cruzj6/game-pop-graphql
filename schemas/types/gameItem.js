const {
	GraphQLNonNull,
	GraphQLString,
	GraphQLObjectType,
} = require('graphql');

module.exports = new GraphQLObjectType({
	name: 'GameItem',
	fields: () => ({
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
	}),
});
