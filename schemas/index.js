const queries = require('./queries');
const {
	GraphQLObjectType,
	buildSchema,
} = require('graphql');

module.exports = buildSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: queries,
	}),
});
