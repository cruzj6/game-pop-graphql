const { mergeTypes } = require('merge-graphql-schemas');
const { makeExecutableSchema } = require('graphql-tools');
const Types = require('./types');
const Queries = require('./queries');
const resolvers = require('../resolvers');

const RootSchemaDefinition = `
	schema {
		query: Query
	}
`;

module.exports = makeExecutableSchema({
	typeDefs: mergeTypes([
		RootSchemaDefinition,
		Types,
		Queries,
	], { all: true }),
	resolvers,
});
