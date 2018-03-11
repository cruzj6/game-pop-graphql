const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schemas');
require('dotenv').config();

const server = express();

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

server.use(
	'/graphql',
	graphqlHTTP(() => ({
		schema,
		graphiql: true,
		pretty: isDev,
	})),
);

server.listen(PORT, (err) => {
	if (err) process.exit(1);

	console.log('game-pop-graphql ready on port: ', PORT); // eslint-disable-line
});
