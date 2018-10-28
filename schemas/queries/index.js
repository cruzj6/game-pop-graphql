const { mergeTypes } = require('merge-graphql-schemas');
const GameForService = require('./gameForService');
const Service = require('./service');
const Popular = require('./popular');

module.exports = mergeTypes([
	GameForService,
	Service,
	Popular,
], { all: true });
