const AWS = require('aws-sdk');
const _ = require('lodash/fp');
const logger = require('../services/logger');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const athena = new AWS.Athena({
	endpoint: process.env.AWS_ATHENA_URL,
});

const getPopular = async () => {
	try {
		const { QueryExecutionId } = await athena.startQueryExecution({
			QueryString: `
				SELECT gamename, greatest(viewers) as viewers, posted FROM twitcheverything
				WHERE posted BETWEEN 1540514479275 AND 1541119279275
				ORDER BY viewers DESC
			`,
			ResultConfiguration: {
				OutputLocation: 's3://athena-twitch-results',
			},
			QueryExecutionContext: {
				Database: 'twitchgames',
			},
		}).promise();

		const getExecutionStatus = async () => {
			const result = await athena.getQueryExecution({
				QueryExecutionId,
			}).promise();

			return result.QueryExecution;
		};

		const waitForExecution = () => new Promise(async (resolve, reject) => {
			const result = await getExecutionStatus();
			const { Status: { State, StateChangeReason } } = result;

			if (State !== 'SUCCEEDED') {
				await new Promise(res => setTimeout(res, 1000));
				await waitForExecution();
				resolve();
			} else if (State === 'FAILED') {
				reject(StateChangeReason);
			} else {
				resolve();
			}
		});

		await waitForExecution();

		const results = await athena.getQueryResults({ QueryExecutionId }).promise();
		const getColumnIndex = name => _.findIndex(({ Name }) => Name === name, results.ResultSet.ResultSetMetadata.ColumnInfo);

		const viewersIndex = getColumnIndex('viewers');
		const postedIndex = getColumnIndex('posted');
		const gameNameIndex = getColumnIndex('gamename');

		const normalizedResults = results.ResultSet.Rows.splice(1).map(({ Data }) => {
			const viewers = Data[viewersIndex].VarCharValue;
			const posted = Data[postedIndex].VarCharValue;
			const gamename = Data[gameNameIndex].VarCharValue;

			return {
				viewers: _.toString(viewers),
				posted: _.toString(posted),
				gamename,
			};
		});

		console.log({ normalizedResults });

		return normalizedResults;
	} catch (e) {
		logger.error(e);
		return [];
	}
};

module.exports = {
	getPopular,
};
