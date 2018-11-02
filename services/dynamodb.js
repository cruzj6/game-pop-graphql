const AWS = require('aws-sdk');
const { SERVICE_TABLES } = require('../constants');
const logger = require('../services/logger');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	endpoint: process.env.AWS_DYNAMO_URL,
});

const docClient = new AWS.DynamoDB.DocumentClient();

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
	getServiceItemsForGame,
};
