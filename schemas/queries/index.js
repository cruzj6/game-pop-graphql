const { mergeTypes } = require('merge-graphql-schemas');
const GameForService = require('./gameForService');
const Service = require('./service');
const Popular = require('./popular');
const GameSearch = require('./gameSearch');

module.exports = mergeTypes([
	GameForService,
	Service,
	Popular,
	GameSearch,
], { all: true });
