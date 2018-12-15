const axios = require('axios');

const getGameDataForService = async ({
	gameName,
	sinceDate,
	serviceName,
	maxResults,
}) => {
	const { data } = await axios
		.get(`${process.env.GP_DATABASE_SERVICE_URL}/services/${serviceName}`, {
			params: {
				gameName,
				maxResults: maxResults ? String(maxResults) : null,
				sinceDate,
			},
		});

	return data;
};

module.exports = {
	getGameDataForService,
};
