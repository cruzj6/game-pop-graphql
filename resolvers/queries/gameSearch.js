const twitchService = require('../../services/twitch');
const gamePopDatabaseService = require('../../services/gamePopDatabase');
const serviceDataItemTransformers = require('../../transformers/serviceDataItem');
const constants = require('../../constants');

const GameSearch = async (root, {
	searchTerms,
	serviceName,
}) => {
	const foundNames = await twitchService.searchForGameName({ queryString: searchTerms });
	const service = constants.SERVICE_ENDPOINTS[serviceName];

	const serviceItems = await foundNames.reduce(async (serviceItemsPromise, gameName) => {
		const accServiceItems = await serviceItemsPromise;

		try {
			const [gameItem] = await gamePopDatabaseService.getGameDataForService({
				gameName,
				serviceName: service,
				maxResults: 1,
				sinceDate: '0',
			});

			return gameItem
				? [
					...accServiceItems,
					serviceDataItemTransformers.fromGamePopDatabaseGameItem(gameItem, service),
				]
				: accServiceItems;
		} catch (e) {
			// If we simply couldn't find in our records, return this is expected
			if (e.response && e.response.status === 404) {
				return accServiceItems;
			}

			throw e;
		}
	}, Promise.resolve([]));

	return serviceItems;
};

module.exports = GameSearch;
