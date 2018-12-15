const serviceEndpointUtils = require('../services/serviceEndpointUtils');

const fromGamePopDatabaseGameItem = (gameItem, serviceName) => ({
	date: gameItem.posted,
	serviceName,
	game: { name: gameItem.gameName },
	hits: serviceEndpointUtils.getHitsForServiceData(serviceName, gameItem),
});

module.exports = {
	fromGamePopDatabaseGameItem,
};
