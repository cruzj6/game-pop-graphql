const dynamodb = require('../../services/dynamodb');
const serviceEndpointUtils = require('../../services/serviceEndpointUtils');

const GameForService = async (root, {
	gameName,
	serviceName,
	startDate,
	endDate,
}) => {
	const results = await dynamodb.getServiceItemsForGame({
		gameName,
		startDate,
		endTime: endDate,
		serviceName,
	});

	return results.map(result => ({
		date: result.posted,
		service: serviceName,
		game: { name: result.gamename },
		hits: serviceEndpointUtils.getHitsForServiceData(serviceName, result),
	}));
};

module.exports = GameForService;
