require('dotenv').config();

const express = require('express');
const schema = require('./schemas');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const server = express();

const PORT = process.env.PORT || 5000;

server.use(cors());

server.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	tracing: true,
	cacheControl: true,
}));
server.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.listen(PORT, (err) => {
	if (err) process.exit(1);

	console.log('game-pop-graphql ready on port: ', PORT); // eslint-disable-line
});
