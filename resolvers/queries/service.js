const axios = require('axios');
const serviceEndpointUtils = require('../../services/serviceEndpointUtils');
const logger = require('../../services/logger');
const constants = require('../../constants');

const Service = async (root, {
	serviceName,
	gameName,
	date,
	endDate,
	maxResults,
}) => {
	try {
		const service = constants.SERVICE_ENDPOINTS[serviceName];

		const { data } = await axios
			.get(`${process.env.GP_DATABASE_SERVICE_URL}/services/${service}`, {
				params: {
					gameName,
					maxResults: maxResults ? String(maxResults) : null,
					sinceDate: date,
				},
			});

		const isFound = data.length > 0;

		return data
			.filter(result => !endDate || (Number(result.posted) <= Number(endDate)))
			.map(result => ({
				date: result.posted,
				service,
				game: { name: gameName },
				hits: isFound ? serviceEndpointUtils.getHitsForServiceData(service, result) : '0',
			}));
	} catch (err) {
		logger.error('Could not fetch game service data from database ', err);
		return err;
	}
};

module.exports = Service;
