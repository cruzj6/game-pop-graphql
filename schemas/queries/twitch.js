const TwitchItem = require('../types/twitchItem');
const axios = require('axios');
const {
	GraphQLNonNull,
	GraphQLString,
} = require('graphql');

const Twitch = {
	type: TwitchItem,
	args: {
		gameName: {
			name: 'gameName',
			type: new GraphQLNonNull(GraphQLString),
		},
		date: {
			name: 'date',
			type: new GraphQLNonNull(GraphQLString),
		},
		viewers: {
			name: 'viewers',
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	resolve: async (root, args) => {
		// TODO: this API isn't there yet
		const { data } = await axios.get('TODO_URL_FOR_DB_SERVICE/services/twitch/viewers/', { params: { gamename: args.gameName } });

		return {
			game: { name: data.name },
			date: root.date,
			viewers: data.viewers,
		};
	},
};

module.exports = Twitch;
