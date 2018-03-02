const GameItem = require('../types/gameItem');
const axios = require('axios');
const {
	GraphQLNonNull,
	GraphQLString,
} = require('graphql');

const Game = {
	type: GameItem,
	args: {
		name: {
			name: 'name',
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	resolve: async (root, args) => {
		// TODO: this API isn't there yet
		const { data } = await axios.get('TODO_URL_FOR_DB_SERVICE/game', { params: { name: args.name } });

		return {
			name: data.name,
		};
	},
};

module.exports = Game;
