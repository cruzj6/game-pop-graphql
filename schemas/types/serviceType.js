const _ = require('lodash/fp');
const Constants = require('../../constants');

module.exports = `
	enum ServiceType {
		${_.join('\n', _.keys(Constants.SERVICE_ENDPOINTS))}
	}
`;
