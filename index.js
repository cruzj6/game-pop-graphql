require('dotenv').config();

const express = require('express');
const schema = require('./schemas');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { ApolloEngine } = require('apollo-engine');

const server = express();

const PORT = process.env.PORT || 5000;

server.use(cors());

server.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	context: {},
	tracing: true,
	cacheControl: true,
}));
server.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

const engine = new ApolloEngine({
	apiKey: process.env.APOLLO_ENGINE_API_KEY,
});

engine.listen({
	port: PORT,
	expressApp: server,
});
