const logger = {
	error(...args) {
		console.error('ERROR: ', ...args); // eslint-disable-line
	},
	info(...args) {
		console.log('INFO: ', ...args); // eslint-disable-line
	},
};

module.exports = logger;
