const AWS = require('aws-sdk');
const { uniqBy, sortBy, reverse } = require('lodash');
const { SERVICE_TABLES } = require('../constants');
const logger = require('../services/logger');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	endpoint: process.env.AWS_DYNAMO_URL,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const MAX_POPULAR_RANGE = 60 * 1000 * 60 * 24 * 30; // 30 days

const getMostPopularInRange = async ({ startTime, endTime, serviceName }) => {
	if ((endTime - startTime) > MAX_POPULAR_RANGE) throw new TypeError('startTime and endTime must be within one month');

	try {
		const { Items } = await docClient.scan({
			TableName: SERVICE_TABLES[serviceName],
			FilterExpression: 'posted between :start and :end',
			ExpressionAttributeValues: {
				':start': Number(startTime),
				':end': Number(endTime),
			},
		}).promise();

		return uniqBy(reverse(sortBy(Items, 'viewers')), 'gamename');
	} catch (error) {
		logger.error(`Could not retrieve most popular for ${startTime} to ${endTime}`, error);
		return [];
	}
};

const getServiceItemsForGame = async ({
	gameName,
	startTime,
	endTime,
	serviceName,
}) => {
	try {
		const { Items } = await docClient.query({
			TableName: SERVICE_TABLES[serviceName],
			KeyConditionExpression: 'gamename = :name and posted between :start and :end',
			ExpressionAttributeValues: {
				':name': gameName,
				':start': Number(startTime),
				':end': Number(endTime),
			},
		}).promise();

		return Items;
	} catch (error) {
		logger.error(`Could not retrieve ${serviceName} data for ${gameName} from ${startTime} to ${endTime}`, error);
		return [];
	}
};

module.exports = {
	getMostPopularInRange,
	getServiceItemsForGame,
};
