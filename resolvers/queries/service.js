const logger = require('../../services/logger');
const gamePopDatabaseService = require('../../services/gamePopDatabase');
const constants = require('../../constants');
const serviceDataItemTransformer = require('../../transformers/serviceDataItem');

const Service = async (root, {
	serviceName,
	gameName,
	date,
	endDate,
	maxResults,
}) => {
	try {
		const service = constants.SERVICE_ENDPOINTS[serviceName];

		const gameData = await gamePopDatabaseService.getGameDataForService({
			gameName,
			maxResults,
			serviceName: service,
			sinceDate: date,
		});

		return gameData.length > 0
			? gameData
				.filter(result => !endDate || (Number(result.posted) <= Number(endDate)))
				.map(result => serviceDataItemTransformer.fromGamePopDatabaseGameItem(result, service))
			: {
				date: null,
				service,
				game: { name: gameName },
				hits: '0',
			};
	} catch (err) {
		logger.error('Could not fetch game service data from database ', err);
		return err;
	}
};

module.exports = Service;
