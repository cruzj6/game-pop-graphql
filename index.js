const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
	buildSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString
} = require('graphql');

const port = 3000;

const GameType = new GraphQLObjectType({
	name: 'Game',
	description: 'describes a single game',
	fields: () => ({
		name: { type: new GraphQLNonNull(GraphQLString) }
	})
});

const TwitchDataItemType = new GraphQLObjectType({
	name: 'TwitchDataItem',
	description: 'describes twitch data at a given time',
	fields: () => ({
		game: { type: Game },
		date: { type: new GraphQLNonNull(GraphQLString) },
		viewers: { type: new GraphQLNonNull(GraphQLString) }
	})
});

const schema = buildSchema();
