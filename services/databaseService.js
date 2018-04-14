const axios = require('axios');

const DatabaseService = {
	async getGameStatsForServiceSinceDate({
		serviceName,
		gameName,
		maxResults,
		sinceDate,
	}) {
		const { data } = axios
			.get(`${process.env.GP_DATABASE_SERVICE_URL}/services/${serviceName}`, {
				params: {
					gameName,
					maxResults: maxResults ? String(maxResults) : null,
					sinceDate,
				},
			});

		return data;
	},
};

export default DatabaseService;
