const { mergeTypes } = require('merge-graphql-schemas');
const GameItem = require('./gameItem');
const ServiceItem = require('./serviceDataItem');
const ServiceType = require('./serviceType');

module.exports = mergeTypes([
	GameItem,
	ServiceType,
	ServiceItem,
], { all: true });
