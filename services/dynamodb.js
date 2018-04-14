const AWS = require('aws-sdk');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	endpoint: process.env.AWS_DYNAMO_URL,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getMostPopularInRange = async ({ startTime, endTime }) => {
	try {
		const { Items } = await docClient.scan({
			TableName: 'twitch',
			FilterExpression: 'posted between :start and :end',
			ExpressionAttributeValues: {
				':start': Number(startTime),
				':end': Number(endTime),
			},
		}).promise();

		return Items;
	} catch (error) {
		console.error(`Could not retrieve most popular for ${startTime} to ${endTime}`, error);
		return [];
	}
};

module.exports = {
	getMostPopularInRange,
};
