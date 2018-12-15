const axios = require('axios');
const _ = require('lodash/fp');
const logger = require('../services/logger');
const { TWITCH_API_URL_V5, TWITCH_DATA_TYPES } = require('../constants');

const searchForGameName = async ({ queryString }) => {
	try {
		const { data = {} } = await axios.get(`${TWITCH_API_URL_V5}search/${TWITCH_DATA_TYPES.GAMES}`, {
			params: {
				query: queryString,
				type: 'suggest',
			},
			headers: {
				'Client-ID': process.env.TWITCH_CLIENT_ID,
			},
		});

		return _.map(game => game.name, data.games);
	} catch (e) {
		logger.error(e);
	}


	return [];
};

module.exports = {
	searchForGameName,
};
